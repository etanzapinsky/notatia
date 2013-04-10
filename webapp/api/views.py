import json

from django.core.exceptions import ValidationError
from django.http import HttpResponse
from api.models import Capsule
from lib import MyEncoder

# figure out what the proper error code should be -> look it up in the google
# RESTful api docs
not_yet_implemented = json.dumps({'error': 'Not yet implemented.'})

# all the api functions should have an @login_required, but they shouldn't
# redirect to the default 404 page since that would suck for someone using the
# api, they should go to a custom 404 which returns a JSON "endpoint does not
# exist"
def index(request):
    return HttpResponse(not_yet_implemented, content_type="application/json")

def create_capsule(request):
    query_dict = request.GET
    response_data = {}
    try:
        c = Capsule(title=query_dict.get('title'), path=query_dict.get('path'))
        c.full_clean()
        c.save()
        c.authors.add(request.user)
        response_data['success'] = 'true'
    except ValidationError:
        response_data['error'] = 'There was a Capsule Validation Error.'

    return HttpResponse(json.dumps({'data': response_data}),
                            content_type="application/json")


def create_tag(request):
    return not_yet_implemented

def recent_capsules(request):
    query_dict = request.GET
    limit = query_dict.get('limit', 10)
    capsules = Capsule.objects.filter(authors=request.user)[:limit]
    caps = [capsule.__dict__ for capsule in capsules]
    # need to do this to get rid of data we don't want to return to the user
    for cap in caps:
        cap.pop('_state')
    return HttpResponse(json.dumps({'data': caps}, cls=MyEncoder),
                        content_type="application/json")

def get_capsule(request, capsule_id):
    return HttpResponse(not_yet_implemented, content_type="application/json")

def filter_capsules(request):
    return HttpResponse(not_yet_implemented, content_type="application/json")

def get_author(request, author_id):
    return HttpResponse(not_yet_implemented, content_type="application/json")
