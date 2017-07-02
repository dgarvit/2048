from django.shortcuts import render, HttpResponse
from django.template.context import RequestContext
from django.contrib.auth.decorators import login_required

# Create your views here.

def home(request):
	context = {'request' : request,
			   'user' : request.user,
			   }
			   
	return render(request, 'home.html', context)

@login_required(login_url="/")
def game( request ):
   return HttpResponse("boo ya",)

