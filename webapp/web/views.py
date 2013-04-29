import json

from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.conf import settings
from django.core import serializers

from web.forms import UserCreateForm
from api.models import Capsule
from utils import MyEncoder, serialize

def index(request):
    if request.user.is_authenticated():
        return render(request, 'main_page.html', {'user': request.user.username})
    else:
        return render(request, 'landing_page.html')
        
def about(request):
   return render(request, 'about.html')
   
def contact(request):
    return render(request, 'contact.html')
    
def faq(request):
    return render(request, 'faq.html')

def team(request):
    return render(request, 'team.html')

def image_test(request):
    return render(request, 'image_test.html')

def capsule_view(request, cap_id):
    cap = Capsule.objects.get(pk=cap_id)
    return render(request, 'capsule_view.html',
                  {'capsule': serialize(cap)})

def create_account(request):
    form = UserCreateForm()
    if request.method == 'POST':
        form = UserCreateForm(request.POST)
        if form.is_valid():
            username = form.clean_username()
            password = form.clean_password2()
            form.save()
            user = authenticate(username=username,
                                password=password)
            login(request, user)
            return redirect(settings.LOGIN_REDIRECT_URL)
    return render(request,
                  'create_account.html',
                  {'form' : form,
                   'next' : settings.LOGIN_REDIRECT_URL})

