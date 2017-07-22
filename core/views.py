from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.template.context import RequestContext
from django.contrib.auth.decorators import login_required
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
def highScore(request):
	if request.method == 'GET':
		obj, highScore = HighScore.objects.get_or_create(user = request.user,
		defaults = {'highScore':0})
		serializer = HighScoreSerializer(obj)
		return JsonResponse(serializer.data, safe=False)

@login_required(login_url="/")
def highScoreUpdate(request):
	if request.method == 'POST':
		HighScore.objects.get(user = request.user).delete()
		data = JSONParser().parse(request)
		serializer = HighScoreSerializer(data=data)
		if serializer.is_valid():
			serializer.save()
        	return JsonResponse(serializer.data, status=201)
		return JsonResponse(serializer.errors, safe = False)