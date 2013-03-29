from django.conf.urls import patterns, url

from api import views

urlpattens = patterns('',
    url(r'^$', views.index, name='api_home'),
)
