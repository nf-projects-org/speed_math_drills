from django.views.generic import TemplateView
from django.views.generic.edit import FormView


class HomePageView(TemplateView):
    template_name = 'index.html'


class PrivacyPolicyView(TemplateView):
    template_name = 'privacy-policy.html'


class TermsServiceView(TemplateView):
    template_name = 'terms-service.html'


class FeedbackView(TemplateView):
    template_name = 'feedback.html'

class PricingView(TemplateView):
    template_name = 'pricing.html'

class PricingMonthView(TemplateView):
    template_name = 'pricing_message.html'

class PricingYearView(TemplateView):
    template_name = 'pricing_message.html'