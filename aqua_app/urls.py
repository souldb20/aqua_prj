from django.urls import path

from aqua_app import views

urlpatterns = [
    path('', views.aqua),
    path('ph/', views.PHView.as_view())
]