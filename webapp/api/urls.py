from django.conf.urls import patterns, url

from api import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='api_home'),
    url(r'^create/capsule/$', views.create_capsule, name='create_capsule'),
    url(r'^create/tag/$', views.create_tag, name='create_tag'),
    url(r'^recent_capsules/$', views.recent_capsules, name='recent_capsules'),
    url(r'^capsule/(?P<capsule_id>\d+)$', views.get_capsule, name='capsule'),
    url(r'^filter/capsules/$', views.filter_capsules, name='filter_capsules'),
    url(r'^author/(?P<author_id>\d+)$', views.get_author, name='author'),
)
