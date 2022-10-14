from django.urls import reverse_lazy
from django.views import generic
from .forms import SmdUserCreationForm

class SignUpView(generic.CreateView):
    form_class = SmdUserCreationForm
    success_url = reverse_lazy("login")
    template_name = "registration/signup.html"

    