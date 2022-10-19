from django.urls import path
from .views import HomePageView, PrivacyPolicyView, TermsServiceView

app_name = 'pages'
urlpatterns = [
    path("", HomePageView.as_view(), name='home'),
    path("privacy-policy", PrivacyPolicyView.as_view(), name='privacy-policy' ),
    path("terms-service",  TermsServiceView.as_view(), name='terms-service'),
]