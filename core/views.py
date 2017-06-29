from django.shortcuts import render
from django.template.context import RequestContext

# Create your views here.

def home(request):
	context = {'request' : request,
			   'user' : request.user,
			   }
			   
	return render(request, 'home.html', context)