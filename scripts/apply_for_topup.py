from django.contrib.auth.models import User

USERNAME="gokulrajs23"
ACCOUNT_TYPE="PS-RA"
APPLICATION_ID=804

user = User.objects.get(username=USERNAME)

from HARS.models import InstituteProfile
ip = InstituteProfile.objects.get(user=user)

from HARS.models import AccountType
at = AccountType.objects.get(type_id=ACCOUNT_TYPE)

from HARS.models import Application
application = Application.objects.get(pk=APPLICATION_ID)

from HARS.models import UserAccount
print("Applying Topup for")
print("User:", user)
print("Profile:", ip)
print("Type:", at)
print("Application:", application)
ua = UserAccount.objects.get(application=application, institute_profile=ip, account_type=at)


from HARS.models import Topup
t = Topup(user_account=ua)
t.save()
