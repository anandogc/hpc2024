from HARS.models import Topup
from HARS.models import InstituteProfile
from HARS.models import HPCProfile
from HARS.models import AccountType


regular_access = AccountType.objects.get(type_id='PS-RA')

topups = Topup.objects.filter(pi_time__isnull=False, payment_mode="Bank").order_by('pi_time')

designation = {
        'S': 'Student',
        'PD': 'Post Doc',
        'F': 'Faculty',
        'PE': 'Project Employee',
        'SURGE': 'SURGE Student'
    }

gender = {
        'M': 'Male',
        'F': "Female",
        "T": "Transgender"
}

print("ID | Timestamp | Applicant | PI | Project No | Amount")

for t in topups:
    if t.user_account.account_type == regular_access:
        if t.user_account.institute_profile.work_profile.pi_profile is not None:
            print(f"{t.pk} | {t.pi_time.strftime('%d/%m/%Y %H:%M:%S')} | {t.user_account.institute_profile.name} ({t.user_account.institute_profile.id_no}) | {t.user_account.institute_profile.work_profile.pi_profile.name} ({t.user_account.institute_profile.work_profile.pi_profile.id_no})  | {t.project_no} ({t.budget_head}) | {t.amount}")

        else:
            print(f"{t.pk} | {t.pi_time.strftime('%d/%m/%Y %H:%M:%S')} | {t.user_account.institute_profile.name} ({t.user_account.institute_profile.id_no}) | {t.user_account.institute_profile.name} ({t.user_account.institute_profile.id_no})  | {t.project_no} ({t.budget_head}) | {t.amount}")
