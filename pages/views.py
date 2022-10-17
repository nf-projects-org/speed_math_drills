from django.views.generic import TemplateView

class HomePageView(TemplateView):
    template_name = 'index.html'


class PrivacyPolicyView(TemplateView):
    template_name = 'privacy-policy.html'


class TermsServiceView(TemplateView):
    template_name = 'terms-service.html'