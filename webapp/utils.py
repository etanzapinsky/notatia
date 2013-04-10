import json
import time
import datetime
from django.http import HttpResponse

class MyEncoder(json.JSONEncoder):

    def default(self, obj):
        """
        if obj is of type datetime, return int representing that time
        """
        if isinstance(obj, datetime.datetime):
            return int(time.mktime(obj.timetuple()))
        if isinstance(obj, datetime.date):
            return int(time.mktime(obj.timetuple()))

        return json.JSONEncoder.default(self, obj)

def int_or_none(i):
    try:
        return int(i)
    except (ValueError, TypeError):
        return None

def api_login_required(fn):
    def wrapped(*args, **kwargs):
        request = args[0]
        if not request.user.is_authenticated():
            return HttpResponse(json.dumps({'error': {'message': 'Access Denied',
                                                      'code': 401}}),
                                content_type="application/json")
        return fn(*args, **kwargs)
    return wrapped
