from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.template.context import RequestContext
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse

# Create your views here.

def home(request):
	context = {'request' : request,
			   'user' : request.user,
			   }
	if request.user.is_authenticated():
		return HttpResponseRedirect(reverse('game',))		   
	else:
		return render(request, 'home.html', context)

@login_required(login_url="/")
def game(request):
	context = {'request' : request,
			   'user' : request.user,
			   }
	return render(request, 'game.html', context)

