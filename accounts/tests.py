from django.test import TestCase
from django.contrib.auth import get_user_model

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
