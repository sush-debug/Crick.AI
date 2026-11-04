
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),

    # AI Chatbot
    path('api/chat/', views.chat_api, name='chat_api'),

    # Smart Match Recap
    path('api/recap/', views.match_recap_api, name='match_recap_api'),

    # Dataset testing
    path('test-match-data/', views.test_match_data, name='test_match_data'),
]
