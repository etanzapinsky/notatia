import json
import datetime

from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.utils.timezone import utc
from django.db.models import Q
from django.views.decorators.http import require_http_methods

from api.models import Capsule, Tag
from utils import MyEncoder, int_or_none, api_login_required

# figure out what the proper error code should be -> look it up in the google
# RESTful api docs
not_yet_implemented = json.dumps({'error': {'message': 'Not yet implemented.'}})

def sanitize_capsule_list(capsules):
    caps = [capsule.__dict__ for capsule in capsules]
    # need to do this to get rid of data we don't want to return to the user
    for cap in caps:
        cap.pop('_state')
    return caps

# all the api functions should have an @login_required, but they shouldn't
# redirect to the default 404 page since that would suck for someone using the
# api, they should go to a custom 404 which returns a JSON "endpoint does not
# exist"
def index(request):
    return HttpResponse(not_yet_implemented, content_type="application/json")

def get_capsule(request, capsule_id):
    try:
        cap = Capsule.objects.get(pk=capsule_id)
        return HttpResponse(json.dumps(cap.to_dict(), cls=MyEncoder),
                            content_type="application/json")
    except ObjectDoesNotExist:
        return HttpResponse(json.dumps({'error':
                                           {'message': 'Capsule Does Not Exist',
                                            'code': 404}
                                       }),
                           content_type="application/json",
                           status=404)

def create_capsule(request):
    # shouldnt have to deal with authors since capsule creation can only be from
    # the user that's logged in
    query_dict = json.loads(request.body)
    # have to pop tags so that we can create the capsule using query_dict, but
    # then we have to be able to add them to the capsule later
    tags = Tag.objects.filter(name__in=query_dict.pop('tags'))
    try:
        cap = Capsule(**query_dict)
        cap.full_clean()
        cap.save()
        cap.authors.add(request.user)
        cap.tags.add(*tags)
        return HttpResponse(json.dumps(cap.to_dict(), cls=MyEncoder),
                            content_type="application/json")
    except ValidationError:
        response_data['code'] = 500
        return HttpResponse(json.dumps({'data': response_data}),
                            content_type="application/json",
                            status=500)

def update_capsule(request, capsule_id):
    query_dict = json.loads(request.body)
    try:
        cap = Capsule.objects.filter(pk=capsule_id)
        query_dict.pop('first_created')
        query_dict.pop('last_modified')
        query_dict.pop('id')
        tags = Tag.objects.filter(name__in=query_dict.pop('tags'))
        authors = User.objects.filter(username__in=query_dict.pop('authors'))
        cap.update(**query_dict)
        cap = cap[0] # can do this since cap is filtered on pk
        cap.authors.add(*authors)
        cap.tags.add(*tags)
        return HttpResponse(json.dumps(cap.to_dict(), cls=MyEncoder),
                            content_type="application/json")        
    except ObjectDoesNotExist:
        return HttpResponse(json.dumps({'error':
                                           {'message': 'Capsule Does Not Exist',
                                            'code': 404}
                                       }),
                           content_type="application/json",
                           status=404)

def delete_capsule(request, capsule_id):
    try:
        cap = Capsule.objects.get(pk=capsule_id)
        cap.delete()
    except ObjectDoesNotExist:
        return HttpResponse(json.dumps({'error':
                                           {'message': 'Capsule Does Not Exist',
                                            'code': 404}
                                       }),
                           content_type="application/json",
                           status=404)

@api_login_required
@require_http_methods(["GET", "POST", "PUT", "DELETE"])
def process_capsule(request, capsule_id):
    if request.method == 'GET':
        return get_capsule(request, capsule_id)
    if request.method == 'POST':
        return create_capsule(request)
    if request.method == 'PUT':
        return update_capsule(request, capsule_id)
    if request.method == 'DELETE':
        return delete_capsule(request, capsule_id)
    # return HttpResponse(not_yet_implemented, content_type="application/json")

@api_login_required
def create_tag(request):
    return not_yet_implemented

@api_login_required
def recent_capsules(request):
    query_dict = request.GET
    limit = query_dict.get('limit', 10)
    capsules = Capsule.objects.filter(authors=request.user).order_by('-last_modified')[:limit]
    caps = sanitize_capsule_list(capsules)
    return HttpResponse(json.dumps({'data': caps}, cls=MyEncoder),
                        content_type="application/json")

@api_login_required
def filter_capsules(request):
    query_dict = request.GET
    limit = query_dict.get('limit', 10)
    author_ids = query_dict.get('author_ids', '').split(',')
    author_usernames = query_dict.get('author_usernames')
    author_usernames = author_username.split(',') if author_usernames else []
    author_ids = [int_or_none(aid) for aid in author_ids if int_or_none(aid) != None]
    authors = User.objects.filter(Q(pk__in=author_ids) | Q(username__in=author_usernames))
    tags = query_dict.get('tags', '')
    title = query_dict.get('title')
    text = query_dict.get('text') # for now this sucks since it has to match exactly
    path = query_dict.get('path')
    created_before = int_or_none(query_dict.get('created_before'))
    created_after = int_or_none(query_dict.get('created_after'))
    modified_before = int_or_none(query_dict.get('modified_before'))
    modified_after = int_or_none(query_dict.get('modified_after'))
    # can have this crazy structure of capsule = capsule.filter(...) without
    # submitting many queries to the db because the django ORM is smart and only
    # actually performs a query when the variable's information is used.
    capsules = Capsule.objects.all()
    if authors:
        capsules = capsules.filter(authors__in=authors)
    if tags:
        tags = tags.split(',')
        capsules = capsules.filter(tags__name__in=tags)
    if title:
        capsules = capsules.filter(title=title)
    if text:
        capsules = capsules.filter(text=text)
    if path:
        capsules = capsules.filter(path=path)
    if created_before:
        capsules = capsules.filter(first_created__lt=
                                   datetime.datetime.utcfromtimestamp(created_before) \
                                       .replace(tzinfo=utc))
    if created_after:
        capsules = capsules.filter(first_created__gt=
                                   datetime.datetime.utcfromtimestamp(created_after) \
                                       .replace(tzinfo=utc))
    if modified_before:
        capsules = capsules.filter(last_modified__lt=
                                   datetime.datetime.utcfromtimestamp(modified_before) \
                                       .Replace(tzinfo=utc))
    if modified_after:
        capsules = capsules.filter(last_modified__gt=
                                   datetime.datetime.utcfromtimestamp(modified_after) \
                                       .replace(tzinfo=utc))
    return HttpResponse(json.dumps({'data': sanitize_capsule_list(capsules[:limit])},
                                   cls=MyEncoder),
                        content_type="application/json")

@api_login_required
def get_author(request, username):
    user = User.objects.get(username=username)
    user_dict = user.__dict__
    user_dict.pop('_state')
    user_dict.pop('is_superuser')
    user_dict.pop('is_staff')
    user_dict.pop('password')
    return HttpResponse(json.dumps({'data': {'author': user_dict}}, cls=MyEncoder),
                        content_type="application/json")
