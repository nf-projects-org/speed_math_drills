from django.urls import path
from django.views.generic import TemplateView
from .views import DrillSession_view, PracticeSession_view

app_name='drills'
urlpatterns =[
    path("drill-session", DrillSession_view , name='drill-session' ),
    path("practice-session", PracticeSession_view , name='practice-session' ),
]