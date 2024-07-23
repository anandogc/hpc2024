from HARS.models import Application
from HARS.models import InstituteProfile
from HARS.models import HPCProfile
from HARS.models import AccountType


regular_access = AccountType.objects.get(type_id='PS-RA')

applications = Application.objects.filter(account_type=regular_access)

print("pk | pi_time | pi_name | pi_id_no | name | id_no | username | cpu_core_hours | gpu_node_hours | amount | domain | sub_domain | software | contact | gender")

for a in applications:
    if a.hpc_profile.pi_profile and a.pi_time is not None:
    	print(f"{a.pk} | {a.pi_time} | {a.hpc_profile.pi_profile.name} | {a.hpc_profile.pi_profile.id_no} | {a.hpc_profile.institute_profile.name} | {a.hpc_profile.institute_profile.id_no} | {a.hpc_profile.institute_profile.user.username} | {a.cpu_core_hours} | {a.gpu_node_hours} | {a.amount} | {a.hpc_profile.domain} | {a.hpc_profile.sub_domain} | {a.hpc_profile.software} | {a.hpc_profile.contact} | {a.hpc_profile.gender}")
