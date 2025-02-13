from HARS.models import Application
from HARS.models import HPCProfile
from HARS.models import InstituteProfile
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

user = get_user_model().objects.get(username = 'bishakh')

ip = get_object_or_404(InstituteProfile, user=user)

print("User")

hpcprofiles = HPCProfile.objects.filter(institute_profile=ip)

for p in hpcprofiles:
    a = Application.objects.filter(hpc_profile=p)
    print(a)

print("Group Members")

hpcprofiles = HPCProfile.objects.filter(pi_profile=ip)

for p in hpcprofiles:
    a = Application.objects.filter(hpc_profile=p)
    print(a)

