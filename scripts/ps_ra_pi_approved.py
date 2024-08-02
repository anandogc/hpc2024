from HARS.models import Application
from HARS.models import InstituteProfile
from HARS.models import HPCProfile
from HARS.models import AccountType


regular_access = AccountType.objects.get(type_id='PS-RA')

applications = Application.objects.filter(account_type=regular_access)

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

print("pk | pi_time | username | name |  id_no | designation | department | pi_username | pi_name | pi_id_no | pi_department | cpu_core_hours | gpu_node_hours | amount | domain | sub_domain | software | contact | gender")

for a in applications:
    if a.hpc_profile.pi_profile and a.pi_time is not None:  # Student
        print(f"{a.pk} | {a.pi_time} | {a.hpc_profile.institute_profile.user.username} | {a.hpc_profile.institute_profile.name} | {a.hpc_profile.institute_profile.id_no} | {designation[a.hpc_profile.institute_profile.designation]} |{a.hpc_profile.institute_profile.department} | {a.hpc_profile.pi_profile.user.username} | {a.hpc_profile.pi_profile.name} | {a.hpc_profile.pi_profile.id_no} | {a.hpc_profile.pi_profile.department} | {a.cpu_core_hours} | {a.gpu_node_hours} | {a.amount} | {a.hpc_profile.domain} | {a.hpc_profile.sub_domain} | {a.hpc_profile.software} | {a.hpc_profile.contact} | {gender[a.hpc_profile.gender]}")

    elif not a.hpc_profile.pi_profile and a.pi_time is not None: # PIs
        print(f"{a.pk} | {a.pi_time} | {a.hpc_profile.institute_profile.user.username} | {a.hpc_profile.institute_profile.name} | {a.hpc_profile.institute_profile.id_no} | {designation[a.hpc_profile.institute_profile.designation]} | {a.hpc_profile.institute_profile.department} | {a.hpc_profile.institute_profile.user.username} | {a.hpc_profile.institute_profile.name} | {a.hpc_profile.institute_profile.id_no} | {a.hpc_profile.institute_profile.department} | {a.cpu_core_hours} | {a.gpu_node_hours} | {a.amount} | {a.hpc_profile.domain} | {a.hpc_profile.sub_domain} | {a.hpc_profile.software} | {a.hpc_profile.contact} | {gender[a.hpc_profile.gender]}")
