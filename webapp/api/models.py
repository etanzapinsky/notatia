from django.db import models
from django.contrib.auth.models import User

class Tag(models.Model):
    name = models.CharField(max_length=100)

class Capsule(models.Model):
    authors = models.ManyToManyField(User)
    tags = models.ManyToManyField(Tag, blank=True)
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

