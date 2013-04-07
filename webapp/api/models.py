from django.db import models
from django.contrib.auth.models import User

class Tag(models.Model):
    name = models.CharField(max_length=100)

class Capsule(models.Model):
    authors = models.ManyToManyField(User)
    tags = models.ManyToManyField(Tag, blank=True)
    title = models.CharField(max_length=100)
    text = models.TextField()
    path = models.CharField(max_length=1024)
    last_modified = models.DateField(auto_now=True)
    first_created = models.DateField(auto_now_add=True)
