from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'web.views.index', name='index'),
    url(r'^login/$', 'django.contrib.auth.views.login',
        {'template_name': 'login.html'}, name='login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout',
        {'next_page': '/'}, name='logout'),
    url(r'^create_account/$', 'web.views.create_account', name='create_account'),
    url(r'^api/', include('api.urls', namespace='api')),
    url(r'^about/$', 'web.views.about', name = 'about'),
    url(r'^contact/$', 'web.views.contact', name = 'contact'),
    url(r'^team/$', 'web.views.team', name = 'team'),
    url(r'^faq/$', 'web.views.faq', name = 'faq'),
    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
