from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'web.views.index', name='index'),
    url(r'^login/', 'django.contrib.auth.views.login',
        {'template_name': 'login.html'}),
    url(r'^create_account/', 'web.views.create_account', name='create_account'),
    url(r'^api/', include('api.urls', namespace='api')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
