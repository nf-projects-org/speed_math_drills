from django.urls import path
from .views import HomePageView, PrivacyPolicyView, TermsServiceView, FeedbackView, PricingView, PricingMonthView, PricingYearView
from django.contrib.auth.decorators import login_required

app_name = 'pages'
urlpatterns = [
    path("", HomePageView.as_view(), name='home'),
    path("privacy-policy", PrivacyPolicyView.as_view(), name='privacy-policy' ),
    path("terms-service",  TermsServiceView.as_view(), name='terms-service'),
    path("feedback", FeedbackView.as_view(), name='feedback'),
    path("pricing", PricingView.as_view(), name='pricing'),
    path("pricing-year",login_required(PricingYearView.as_view()), name='pricing-year'),
    path("pricing-month",login_required(PricingMonthView.as_view()), name='pricing-month'),

]