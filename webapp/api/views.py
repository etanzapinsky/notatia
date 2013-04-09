import json

from django.core.exceptions import ValidationError
from django.http import HttpResponse
from api.models import Capsule

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
    pass

def get_capsule(request, capsule_id):
    pass

def filter_capsules(request):
    pass

def get_author(request, author_id):
    pass
