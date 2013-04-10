import json
import time
import datetime

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
