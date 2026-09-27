from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # ইমেইলকে ইউনিক (Unique) করে দিচ্ছি যাতে এটি দিয়ে লগইন করা যায়
    email = models.EmailField(unique=True)
    # ফোন নম্বর যোগ করছি (ভবিষ্যতের জন্য)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    # ইমেইলকে ইউজারনেমের বদলে ব্যবহার করার জন্য নিচের লাইন দুটি জরুরি
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email