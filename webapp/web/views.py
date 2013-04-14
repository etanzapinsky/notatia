from django.http import HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.conf import settings

from web.forms import UserCreateForm

def index(request):
    if request.user.is_authenticated():
        return render(request, 'home_page.html', {'user': request.user.username})
    else:
        return render(request, 'landing_page.html')
        
def about(request):
   return render(request, 'about.html')
   
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
