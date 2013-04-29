from django.conf.urls import patterns, url, include

from api import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='api_home'),
    url(r'^create/tag/$', views.create_tag, name='create_tag'),
    url(r'^recent_capsules/$', views.recent_capsules, name='recent_capsules'),
    url(r'^capsule/(?P<capsule_id>\d*)$', views.process_capsule, name='capsule'),
    url(r'^filter/capsules/$', views.filter_capsules, name='filter_capsules'),
    url(r'^author/(?P<username>[\w.@+-]+)$', views.get_author, name='author'),
    url(r'^search/', views.search, name='search'),
    url(r'link/(?P<from_id>\d+)/(?P<to_id>\d+)$', views.create_link, name='create_link'),
    url(r'link/(?P<pk>\d+)$', views.get_link, name='get_link'),
)
