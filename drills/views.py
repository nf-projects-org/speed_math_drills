from django.http import Http404
from .models import UniversalDrill
from django.template.response import TemplateResponse
from django.core import serializers

def UniversalDrill_view(request):
    all_drills = UniversalDrill.objects.all()
    all_drills_json = serializers.serialize("json", all_drills )
    return TemplateResponse(request, 'drills/snippets/universal.html', {'all_drills':all_drills, 'all_drills_json':all_drills_json})