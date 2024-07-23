from HARS.models import Application
applications = Application.objects.all().order_by('-pk')

for application in applications:
    if application.hpc_profile.pi_profile:
        print(f"{application.pk} {application.hpc_profile.pi_profile.name} <{application.hpc_profile.pi_profile.user.username}@iitk.ac.in>")
#    else:
#        print(f"PI {application.pk} {application.hpc_profile.institute_profile.name} <{application.hpc_profile.institute_profile.user.username}@iitk.ac.in>")


# Email sent upto pk=55
