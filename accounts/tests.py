from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse, resolve
from .views import SignUpView
from .forms import SmdUserCreationForm

class SmdUserTests(TestCase):
    def test_create_user(self):
        user_model = get_user_model()
        user = user_model.objects.create_user(username="testUser", email="testuser@gmail.com", password="testpass123")
        self.assertEqual(user.username, "testUser")
        self.assertEqual(user.email, "testuser@gmail.com")
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
    
    def test_create_superuser(self):
        user_model = get_user_model()
        user = user_model.objects.create_superuser(username="adminUser", email="adminuser@gmail.com", password="testpass123")
        self.assertEqual(user.username, "adminUser")
        self.assertEqual(user.email, "adminuser@gmail.com")
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_active)
        self.assertTrue(user.is_staff)


class SignUpTests(TestCase):
    def setUp(self):
        url = reverse("signup")
        self.response = self.client.get(url)
    
    def test_signup_template(self):
        self.assertEqual(self.response.status_code, 200)
        self.assertTemplateUsed(self.response, "registration/signup.html")
        self.assertContains(self.response, "Sign Up")
    
    def test_signup_form(self):
        form = self.response.context.get("form")
        self.assertIsInstance(form, SmdUserCreationForm)
        self.assertContains(self.response, "csrfmiddlewaretoken")

    def test_signup_view(self):
        view = resolve("/accounts/signup/")
        self.assertEqual(view.func.__name__, SignUpView.as_view().__name__)
