from django.conf.urls import include, url
from django.contrib import admin
admin

urlpatterns = [
    # Examples:
    # url(r'^$', 'game2048.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'core.views.home', name='home'),
    url('', include('social.apps.django_app.urls', namespace='social')),
    url('', include('django.contrib.auth.urls', namespace='auth')),
    url(r'^game/', 'core.views.game', name='game'),
    url(r'^serial/', 'core.views.highScore')
]
