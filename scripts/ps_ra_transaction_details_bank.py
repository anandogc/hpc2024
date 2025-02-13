from HARS.models import Application
from HARS.models import InstituteProfile
from HARS.models import HPCProfile
from HARS.models import AccountType


regular_access = AccountType.objects.get(type_id='PS-RA')

applications = Application.objects.filter(account_type=regular_access, payment_mode='Bank').order_by('pi_time')


print("Id | Timestamp | Applicant | PI | Project No | Amount")

for a in applications:
    if a.hpc_profile.pi_profile and a.pi_time is not None:  # Student
        print(f"{a.pk} | {a.pi_time.strftime('%d/%m/%Y %H:%M:%S')} | {a.hpc_profile.institute_profile.name} ({a.hpc_profile.institute_profile.id_no}) | {a.hpc_profile.pi_profile.name} ({a.hpc_profile.pi_profile.id_no}) | {a.project_no} ({a.budget_head}) | {a.amount}")

    elif not a.hpc_profile.pi_profile and a.pi_time is not None: # PIs
        print(f"{a.pk} | {a.pi_time.strftime('%d/%m/%Y %H:%M:%S')} | {a.hpc_profile.institute_profile.name} ({a.hpc_profile.institute_profile.id_no}) | {a.hpc_profile.institute_profile.name} ({a.hpc_profile.institute_profile.id_no}) | {a.project_no} ({a.budget_head}) | {a.amount}")
