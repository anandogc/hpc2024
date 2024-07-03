from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("user/name", views.name, name="name"),
    # path("guide", views.guide, name="guide"),
    path("signin", views.signin, name="signin"),
    path("signout", views.signout, name="signout"),
    path("register", views.register, name="register"),
    path("user/institute_profile", views.institute_profile, name="institute_profile"),
    path("user/statistics", views.statistics, name="statistics"),
    path("user/hpc_profile", views.hpc_profile, name="hpc_profile"),
    path("user/report", views.report, name="report"),
    path("user/view_report", views.view_report, name="view_report"),
    path("user/charges/<str:account_type_id>", views.charges, name="charges"),
    path("user/application/<str:account_type_id>", views.application, name="application"),
    path("user/topup/<str:resource>/<str:account_type_id>", views.topup, name="topup"),

    path("user/group_members", views.group_members, name="group_members"),
    path("group/<str:username>/application/<str:account_type_id>", views.group_member_application, name="group_member_application"),
    path("group/<str:username>/topup/<str:resource>/<str:account_type_id>", views.group_member_topup, name="group_member_topup"),

]