from django.db import models
from django.contrib.auth.models import User

# class Tag(models.Model):
#     name = models.CharField(max_length=100)

class Capsule(models.Model):
    authors = models.ManyToManyField(User)
    tags = models.TextField(blank=True)
    title = models.CharField(max_length=100, blank=True)
    text = models.TextField(blank=True)
    path = models.CharField(max_length=1024, blank=True) # the 1024 max length may cause issues later
    last_modified = models.DateTimeField(auto_now=True)
    first_created = models.DateTimeField(auto_now_add=True)

    def to_dict(self):
        cap = self.__dict__
        authors = [user['username'] for user in self.authors.all().values('username')]
        cap.update({'authors': authors})
        cap.pop('_state')
        return cap

# need this to be down here bc of problem with circular imports #HACK
from api.search_indexes import CapsuleIndex
# in general this is not suggested since really slow and can have undue load,
# but for demo is fine
# (see: http://django-haystack.readthedocs.org/en/latest/searchindex_api.html#realtimesearchindex) 
def reindex_capsule(sender, **kwargs):
    CapsuleIndex().update_object(kwargs['instance'])
models.signals.post_save.connect(reindex_capsule, sender=Capsule)

