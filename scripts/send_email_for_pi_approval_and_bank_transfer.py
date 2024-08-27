from HARS.models import Application
from HARS.models import AccountType
from HARS.mail import Send_mail

account_type_name = {
    'PS-RA': 'Param Sanganak - Regular Access',
    'PS-HPA': 'Param Sanganak - High Priority Access',
    'HPC2013-QA': 'HPC2013 - Quarterly Access'
}

def Send_emails_for_account_type(account_type):

    account_type = AccountType.objects.get(type_id=account_type)

    # Filter applications in which email has not been sent yet
    applications = Application.objects.filter(account_type=account_type, email_sent=False)

    for a in applications:
        if a.hpc_profile.pi_profile and a.pi_time is None:  # Group Member
            email = f"{a.hpc_profile.pi_profile.user.username}@iitk.ac.in"
            name = a.hpc_profile.pi_profile.name
            #try:
            Send_mail("PI_approval", {'name': name, 'email': email})
            a.email_sent = True
            a.save()
            #except:
            #    pass

        if a.payment_mode == 'Bank':
            email = f"{a.hpc_profile.institute_profile.user.username}@iitk.ac.in"
            name = a.hpc_profile.institute_profile.name
            id_no = a.hpc_profile.institute_profile.id_no
            ac_type = account_type_name[account_type]
            amount = a.amount

            #try:
            Send_mail("Bank_payment", {'name': name, 'email': email, 'ac_type': ac_type, 'amount': amount, 'id_no': id_no})
            a.email_sent = True
            a.save()

            #except:
            #    pass


Send_emails_for_account_type('PS-RA')
Send_emails_for_account_type('PS-HPA')
Send_emails_for_account_type('HPC2013-QA')
