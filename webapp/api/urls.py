from django.conf.urls import patterns, url, include

urlpatterns = patterns('',
    url(r'^$', 'api.views.index', name='api_home'),
    url(r'^create/tag/$', 'api.views.create_tag', name='create_tag'),
    url(r'^recent_capsules/$', 'api.views.recent_capsules', name='recent_capsules'),
    url(r'^capsule/(?P<capsule_id>\d*)$', 'api.views.process_capsule', name='capsule'),
    url(r'^filter/capsules/$', 'api.views.filter_capsules', name='filter_capsules'),
    url(r'^author/(?P<username>[\w.@+-]+)$', 'api.views.get_author', name='author'),
    url(r'^search/', 'api.views.search', name='search'),
    url(r'link/(?P<from_id>\d+)/(?P<to_id>\d+)$', 'api.views.create_link', name='create_link'),
    url(r'link/(?P<pk>\d+)$', 'api.views.get_link', name='get_link'),
)
