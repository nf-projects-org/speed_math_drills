from django.views.generic import TemplateView


class UserSettingsView(TemplateView):
    template_name = 'account/user_settings.html'
