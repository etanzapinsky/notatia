import json

from django.core.exceptions import ValidationError
from django.http import HttpResponse
from api.models import Capsule
from lib import MyEncoder

# all the api functions should have an @login_required, but they shouldn't
# redirect to the default 404 page since that would suck for someone using the
# api, they should go to a custom 404 which returns a JSON "endpoint does not
# exist"
def index(request):
    pass

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
    pass

def recent_capsules(request):
    query_dict  = request.GET
    capsules = Capsule.objects.filter(authors=request.user)
    caps = [capsule.__dict__ for capsule in capsules]
    # need to do this to get rid of data we don't want to return to the user
    for cap in caps:
        cap.pop('_state')
    return HttpResponse(json.dumps({'data': caps}, cls=MyEncoder),
                        content_type="application/json")

def get_capsule(request, capsule_id):
    pass

def filter_capsules(request):
    pass

def get_author(request, author_id):
    pass
