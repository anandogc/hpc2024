from HARS.models import InstituteProfile
ip = InstituteProfile.objects.get(pk=230)
#ip = InstituteProfile.objects.get(pk=132)

from HARS.models import AccountType
at = AccountType.objects.get(pk=1)
#at = AccountType.objects.get(pk=2)


from HARS.models import UserAccount
ua = UserAccount.objects.get(institute_profile=ip, account_type=at)
ua.delete()
