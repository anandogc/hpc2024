from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class InstituteProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(null=True, max_length=48)
    department = models.CharField(null=True, max_length=48)
    id_no = models.CharField(null=True, max_length=16)  # Pf No./Roll No.

    class Designation(models.TextChoices):
        S = 'S', 'Student'
        PD = 'PD', 'Post Doc'
        F = 'F', 'Faculty'
        PE = 'PE', 'Project Employee'
        SURGE = 'SURGE', 'SURGE Student'

    designation = models.CharField(null=True, max_length=16, choices=Designation.choices, default=Designation.S)

    def __str__(self):
        return f"{self.name}"


class HPCProfile(models.Model):
    research_title = models.CharField(null=True, max_length=128)
    domain = models.CharField(null=True, max_length=128)
    sub_domain = models.CharField(null=True, max_length=128)
    software = models.CharField(null=True, max_length=128)
    contact = models.CharField(blank=True, null=True, max_length=16)

    class Gender(models.TextChoices):
        UNSPECIFIED = '-', '-------'
        MALE = 'M', 'Male'
        FEMALE = 'F', 'Female'
        TRANSGENDER = 'T', 'Transgender'

    gender = models.CharField(null=True, max_length=16, choices=Gender.choices, default=Gender.MALE)

    institute_profile = models.OneToOneField(InstituteProfile, related_name='work_profile', on_delete=models.CASCADE)
    pi_profile = models.ForeignKey(InstituteProfile, related_name='pi', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"{self.institute_profile.name}: {self.research_title}, {self.domain}, {self.contact}"

    def user(self):
        return self.institute_profile.name

    def pi(self):
        if self.pi_profile:
            return self.pi_profile.name
        else:
            return None

class Report(models.Model):
    submitted_at = models.DateTimeField(auto_now_add=True)
    report_file = models.CharField(null=True, max_length=128)
    hpc_profile = models.ForeignKey(HPCProfile, on_delete=models.CASCADE)

    def get_name(self):
        return self.hpc_profile.institute_profile.name


class AccountType(models.Model):
    name = models.CharField(max_length=128)
    type_id = models.CharField(max_length=16)
    admin = models.CharField(null=True, max_length=128)
    project_no = models.CharField(null=True, max_length=32)
    budget_head = models.CharField(null=True, max_length=16)
    default_cpu_core_hours = models.IntegerField(default=0)
    default_gpu_node_hours = models.IntegerField(default=0)
    

    def __str__(self):
        return self.name

class Rate(models.Model):
    cpu_per_core_hour = models.FloatField(default=0.0)
    gpu_per_node_hour = models.FloatField(default=0.0)
    cpu_unit_recharge = models.IntegerField(default=0)
    gpu_unit_recharge = models.IntegerField(default=0)

    account_type = models.OneToOneField(AccountType, on_delete=models.CASCADE)

    def cluster(self):
        return self.account_type.name

class QuarterlyRate(models.Model):
    designation = models.CharField(max_length=32)
    rate = models.FloatField(default=0.0)

    def __str__(self):
        return self.designation


class Application(models.Model):
    request_at = models.DateTimeField(auto_now_add=True)
    pi_time = models.DateTimeField(null=True, blank=True)
    rnd_time = models.DateTimeField(null=True, blank=True)
    admin_time = models.DateTimeField(null=True, blank=True)

    cpu_core_hours = models.IntegerField(default=20000)
    gpu_node_hours = models.IntegerField(default=0)
    duration = models.IntegerField(default=0)

    amount = models.IntegerField(default=600)

    class PaymentMode(models.TextChoices):
        BANK = 'Bank', 'Bank'
        PROJECT = 'Project', 'Project' 

    payment_mode = models.CharField(max_length=16, choices=PaymentMode.choices, default=PaymentMode.PROJECT)
    project_no = models.CharField(max_length=16, null=True, blank=True)
    budget_head = models.CharField(max_length=16, null=True, blank=True)
    screenshot = models.DateTimeField(null=True, blank=True)

    hpc_profile = models.ForeignKey(HPCProfile, on_delete=models.CASCADE)
    account_type = models.ForeignKey(AccountType, on_delete=models.CASCADE)

    def user(self):
        return self.hpc_profile.institute_profile.name

    def type_name(self):
        return self.account_type.name

    # def To_json(self):
    #     return {
    #         'application_id': self.application_id,
    #         'name': self.name,
    #         'username': self.username,
    #         'uid': self.uid,
    #         'applied_for': self.applied_for,
    #         'status': self.status,
    #         'contact': self.contact,
    #         'rec_title': self.rec_title,
    #         'rec_name': self.rec_name,
    #         'rec_email': self.rec_email,
    #         'rec_contact': self.rec_contact,
    #         'application_status': self.application_status,
    #         'submitted_at': self.submitted_at,
    #         'project': self.project,
    #         'duration': self.duration,
    #         'unit': self.unit,
    #         'charge': self.charge,
    #     }


class UserAccount(models.Model):
    # request_at = models.DateTimeField()
    create_time = models.DateTimeField(auto_now_add=True)
    expiry_time = models.DateTimeField(null=True, blank=True)
    statistics_updated_time = models.DateTimeField(null=True, blank=True)
    application = models.OneToOneField(Application, on_delete=models.CASCADE, null=True, blank=True)
    institute_profile = models.ForeignKey(InstituteProfile, on_delete=models.CASCADE)
    account_type = models.ForeignKey(AccountType, on_delete=models.CASCADE)
    is_active = models.BooleanField()

    def __str__(self):
        return self.account_type.name

    class Meta:
        unique_together = ('institute_profile', 'account_type',)


class Statistics(models.Model):
    user_account = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    parameter = models.CharField(max_length=32)
    used = models.IntegerField(default=0)
    remaining = models.IntegerField(default=0)
    total = models.IntegerField(default=0)

class Topup(models.Model):
    user_account = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    request_at = models.DateTimeField(auto_now_add=True)
    pi_time = models.DateTimeField(null=True, blank=True)
    rnd_time = models.DateTimeField(null=True, blank=True)
    admin_time = models.DateTimeField(null=True, blank=True)

    class Resource(models.TextChoices):
        CPU = 'CPU', 'CPU'
        GPU = 'GPU', 'GPU'

    resource = models.CharField(null=True, max_length=16, choices=Resource.choices, default=Resource.CPU)
    hours = models.IntegerField(default=0)
    units = models.IntegerField(default=0)
    amount = models.IntegerField(default=0)
  
    class PaymentMode(models.TextChoices):
        BANK = 'Bank', 'Bank'
        PROJECT = 'Project', 'Project'  
    
    payment_mode = models.CharField(null=True, max_length=16, choices=PaymentMode.choices, default=PaymentMode.PROJECT)

    project_no = models.CharField(max_length=32, null=True, blank=True)
    budget_head = models.CharField(max_length=32, null=True, blank=True)

    def name(self):
        return self.user_account.institute_profile.name

class HARSDates(models.Model):
    parameter = models.CharField(max_length=32, unique=True)
    value = models.CharField(max_length=32, null=True, blank=True)

class MailSetting(models.Model):
    profile_name = models.CharField(max_length=32, unique=True)
    smtp_server = models.CharField(max_length=32)
    smtp_port = models.PositiveIntegerField()
    imap_server = models.CharField(null=True, max_length=32)
    imap_port = models.PositiveIntegerField(null=True)

    from_header = models.CharField(max_length=64)
    username = models.CharField(max_length=64)
    password = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.profile_name} - {self.from_header}"

class Mail(models.Model):
    profile_name = models.CharField(max_length=32, unique=True)
    setting = models.ForeignKey(MailSetting, on_delete=models.DO_NOTHING)

    to = models.CharField(max_length=256, blank=True)
    subject = models.CharField(max_length=128, blank=True)
    body = models.TextField(blank=True)

    def __str__(self):
        return f"{self.profile_name}"

    def To_json(self):
        return {
            'To': self.to,
            'Subject': self.subject,
            'Body': self.body,
        }


# class Invoice(models.Model):
#     date = models.DateTimeField(auto_now_add=True)
#     applications = JSONField()
#     total = models.DecimalField(default=0, max_digits=8, decimal_places=2)

#     def __str__(self):
#         return f"Invoice #{self.pk} - {self.date}"


#     def To_json(self):
#         return {
#             'pk': self.pk,
#             'date': self.date.strftime("%d/%m/%Y"),
#             'applications': self.applications,
#             'total': self.total
#         }


# class Log(models.Model):
#     timestamp = models.DateTimeField()
#     identifier = models.CharField(max_length=16)
#     action = models.CharField(max_length=48)
#     remarks = models.CharField(max_length=2048)

