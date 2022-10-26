from django.urls import path
from django.views.generic import TemplateView
from .views import UniversalDrill_view

app_name='drills'
urlpatterns =[
    path("universal-drills", UniversalDrill_view , name='universal-drills' ),
]