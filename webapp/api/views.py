import json
import datetime

from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.core import serializers
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.utils.timezone import utc
from django.db.models import Q
from django.views.decorators.http import require_http_methods
from haystack.inputs import Clean
from haystack.query import SearchQuerySet

from api.models import Capsule, Link
from utils import MyEncoder, int_or_none, api_login_required, serialize

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
        return HttpResponse(serialize(cap), content_type="application/json")
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
    # tags are just a string of comma separated values
    query_dict = json.loads(request.body)
    try:
        cap = Capsule(**query_dict)
        cap.full_clean()
        cap.save()
        cap.authors.add(request.user)
        return HttpResponse(serialize(cap), content_type="application/json")
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
        query_dict.pop('links')
        authors = User.objects.filter(username__in=query_dict.pop('authors'))
        # will only be one iteration
        for ca in cap:
            ca.update_nosave(**query_dict)
            ca.save()
        cap = cap[0] # can do this since cap is filtered on pk
        cap.authors.add(*authors)
        return HttpResponse(serialize(cap), content_type="application/json")
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
        return HttpResponse(json.dumps({'data': 'success'}))
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
    to_time = int_or_none(query_dict.get('to_time'))
    to_time = datetime.datetime.fromtimestamp(to_time) if to_time else datetime.datetime.utcnow()
    to_time = to_time.replace(tzinfo=utc)
    capsules = Capsule.objects \
        .filter(authors=request.user, last_modified__lt=to_time) \
        .order_by('-last_modified')[:limit]
    caps = sanitize_capsule_list(capsules)
    return HttpResponse(json.dumps(caps, cls=MyEncoder),
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
    # tags = query_dict.get('tags', '')
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
    # if tags:
    #     tags = tags.split(',')
    #     capsules = capsules.filter(tags__name__in=tags)
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
    return HttpResponse(json.dumps(sanitize_capsule_list(capsules[:limit]),
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

@api_login_required
@require_http_methods(["POST", "DELETE"])
def create_link(request, from_id, to_id):
    from_cap = Capsule.objects.get(pk=from_id)
    to_cap = Capsule.objects.get(pk=to_id)
    if request.method == "POST":
        link = Link(capsule=to_cap, **{k:v for k,v in request.POST.iteritems()})
        if not Capsule.objects.filter(pk=from_cap.pk, links__capsule=to_cap):
            link.save()
            from_cap.links.add(link)
            return HttpResponse(json.dumps({'data': 'success'}),
                                content_type="application/json")
        return HttpResponse(json.dumps({'data': 'link already exists'}),
                            content_type='application/json')
    elif request.method == "DELETE":
        link = from_cap.links.get(capsule=to_cap)
        if link:
            from_cap.links.remove(link)
            link.delete()
            return HttpResponse(json.dumps({'data': 'success'}),
                                content_type="application/json")
        return HttpResponse(json.dumps({'data': 'link does not exist'}),
                            content_type='application/json')

@api_login_required
@require_http_methods(["GET"])
def get_link(request, pk):
    link = Link.objects.get(pk=pk)
    return HttpResponse(serialize(link), content_type="application/json")

def search(request):
    sqs = SearchQuerySet().filter(content=Fuzzy(request.GET['q']))
    if request.GET['id'] != '':
        sqs = sqs.exclude(django_id=int(request.GET['id']))
    res_list = sorted([x for x in sqs], key=lambda x: x.score, reverse=True)
    ser = serializers.serialize('json', [x.object for x in res_list])
    return HttpResponse(ser, content_type="application/json")

# Fuzzifies only for one word
class Fuzzy(Clean):

    def __init__(self, query_string, **kwargs):
        super(Fuzzy, self).__init__(query_string, **kwargs)

    def prepare(self, query_obj):
        # We need a reference to the current ``SearchQuery`` object this
        # will run against, in case we need backend-specific code.
        query_string = super(Fuzzy, self).prepare(query_obj)

        return "%s~" % query_string if query_string else ""
