from django.http import Http404
from .models import UniversalDrill
from django.template.response import TemplateResponse
from django.core import serializers

def DrillSession_view(request):
    return TemplateResponse(request, 'drills/snippets/drill.html')

def PracticeSession_view(request):
    return TemplateResponse(request, 'drills/snippets/practice.html')