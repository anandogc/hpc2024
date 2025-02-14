from HARS.models import Topup
from HARS.models import AccountType
from HARS.mail import Send_mail

def Send_emails():

    # Filter topups in which email has not been sent yet
    topups = Topup.objects.filter(email_sent=False)

    for t in topups:
        if t.user_account.institute_profile.work_profile.pi_profile and t.pi_time is None:  # Group Member
            email = f"{t.user_account.institute_profile.work_profile.pi_profile.user.username}@iitk.ac.in"
            name = t.user_account.institute_profile.work_profile.pi_profile.name

            Send_mail("PI_approval", {'name': name, 'email': email})
            t.email_sent = True
            t.save()

        if t.payment_mode == 'Bank':
            email = f"{t.user_account.institute_profile.user.username}@iitk.ac.in"
            name = t.user_account.institute_profile.name
            id_no = t.user_account.institute_profile.id_no

            amount = t.amount

            Send_mail("Bank_payment", {'name': name, 'email': email, 'amount': amount, 'id_no': id_no})
            t.email_sent = True
            t.save()



Send_emails()
