from django.contrib.auth.models import User

USERNAME="taraknath"
ACCOUNT_TYPE="PS-RA"
APPLICATION_ID=691

user = User.objects.get(username=USERNAME)

from HARS.models import InstituteProfile
ip = InstituteProfile.objects.get(user=user)

from HARS.models import AccountType
at = AccountType.objects.get(type_id=ACCOUNT_TYPE)

from HARS.models import Application
application = Application.objects.get(pk=APPLICATION_ID)

from HARS.models import UserAccount
print("Creating User Account for Topup of")
print("User:", user)
print("Profile:", ip)
print("Type:", at)
print("Application:", application)

ua = UserAccount(application=application, institute_profile=ip, account_type=at, is_active=True)
ua.save()
