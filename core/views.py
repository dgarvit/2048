from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.template.context import RequestContext
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.urlresolvers import reverse
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from core.models import HighScore
from core.serializers import HighScoreSerializer
from django.contrib.auth.models import User

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

@login_required(login_url="/")
@csrf_exempt
def highScore(request):
	obj, highScore = HighScore.objects.get_or_create(user = request.user,
	defaults = {'highScore':0})
	serializer = HighScoreSerializer(obj)
	return JsonResponse(serializer.data, safe=False)
	