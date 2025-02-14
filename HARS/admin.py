from django.contrib import admin
from django.http import HttpResponse
from django.utils import timezone
from datetime import datetime
from django import forms
from base64 import b64encode
import csv


from .models import InstituteProfile
from .models import Project
from .models import HPCProfile
from .models import Report
from .models import AccountType
from .models import Rate
from .models import QuarterlyRate
from .models import Application
from .models import UserAccount
from .models import Topup
from .models import HARSDates
from .models import MailSetting
from .models import Mail
from .models import CoreHour

from .mail import Send_mail

# Register your models here.
# https://books.agiliq.com/projects/django-admin-cookbook/en/latest/export.html
class ExportCsvMixin:
    def export_as_csv(self, request, queryset):
        """
        Generic CSV export admin action.
        """
        field_names = [field.name for field in self.model._meta.fields]
        list_display_fields = self.get_list_display(request)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(self.model._meta)
        writer = csv.writer(response)

        # Write the header row
        writer.writerow(list_display_fields)

        # Write data rows
        for obj in queryset:
            row = []
            for field in list_display_fields:
                if hasattr(obj, field):
                    value = getattr(obj, field)
                    if callable(value):
                        value = value()
                else:
                    # Get the value from the function defined in the admin
                    value = getattr(self, field)(obj)
                row.append(value)
            writer.writerow(row)

        return response

    export_as_csv.short_description = "Export Selected as CSV"

class UserAccountMixin:
    def create_user_acount(self, request, queryset):

        default_user_account_expiry = HARSDates.objects.get(parameter='default_user_account_expiry').value

        for obj in queryset:
            user_account = UserAccount(
                            expiry_time = default_user_account_expiry,
                            application = obj,
                            institute_profile = obj.hpc_profile.institute_profile,
                            account_type = obj.account_type,
                            is_active = True
                )

            # try:
            user_account.save()
            # Naive datetime
            naive_dt = datetime.now()

            # Make it timezone-aware
            aware_dt = timezone.make_aware(naive_dt, timezone.get_current_timezone())

            obj.admin_time = aware_dt
            obj.save()
            # except:
            #     pass

    create_user_acount.short_description = "Create User Account"

@admin.register(InstituteProfile)
class InstituteProfileAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('pk', 'name', 'department', 'id_no', 'designation')
    search_fields = ['name', 'department', 'id_no', 'designation']
    list_filter = ('department', 'designation')
    actions = ["export_as_csv"]

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('pk', 'pf_no', 'pi_name', 'pi_type', 'project_name', 'project_title', 'project_type', 'start_date', 'end_date')
    search_fields = ['pf_no', 'pi_name', 'project_name', 'project_title']
    list_filter = ('project_type', 'pi_type')
    actions = ["export_as_csv"]


@admin.register(HPCProfile)
class HPCProfileAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('user', 'pi', 'research_title', 'domain', 'sub_domain', 'software', 'contact', 'gender')
    search_fields = ['research_title', 'domain', 'sub_domain', 'software', 'contact', 'gender']
    list_filter = ('domain', 'pi_profile')
    actions = ["export_as_csv"]

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('get_name', 'submitted_at', 'report_file')
    actions = ["export_as_csv"]


@admin.register(AccountType)
class AccountTypeAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('pk', 'name', 'admin', 'project_no', 'budget_head', 'default_cpu_core_hours', 'default_gpu_node_hours')
    actions = ["export_as_csv"]


@admin.register(Rate)
class RateAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('cluster', 'cpu_per_core_hour', 'gpu_per_node_hour', 'cpu_unit_recharge', 'gpu_unit_recharge')
    actions = ["export_as_csv"]

@admin.register(QuarterlyRate)
class QuarterlyRateAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('designation', 'rate')
    actions = ["export_as_csv"]

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin, UserAccountMixin, ExportCsvMixin):
    list_display = ('pk', 'user', 'pi_name', 'request_at', 'pi_time', 'type_name', 'pool_allocation', 'cpu_core_hours', 'gpu_node_hours', 'duration', 'amount', 'payment_mode', 'email_sent', 'notes')
    list_filter = ('account_type', 'pool_allocation')
    # search_fields = ['user']
    actions = ["send_email", "export_as_csv"]

    def send_email(self, request, queryset):
        for application in queryset:

            if application.hpc_profile.pi_profile:  # Group Member
                email = f"{application.hpc_profile.pi_profile.user.username}@iitk.ac.in"
                name = application.hpc_profile.pi_profile.name

                Send_mail("PI_approval", {'name': name, 'email': email})

            if application.payment_mode == 'Bank':
                email = f"{application.hpc_profile.institute_profile.user.username}@iitk.ac.in"
                name = application.hpc_profile.institute_profile.name
                id_no = application.hpc_profile.institute_profile.id_no
                ac_type = application.account_type.name
                amount = application.amount

                Send_mail("Bank_payment", {'name': name, 'email': email, 'ac_type': ac_type, 'amount': amount, 'id_no': id_no})


@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('pk', 'institute_profile', 'create_time', 'expiry_time', 'statistics_updated_time', 'application', 'apply_time', 'account_type', 'is_active')
    actions = ["export_as_csv"]

@admin.register(Topup)
class TopupAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('pk', 'name', 'pi_name', 'user_account', 'request_at', 'pi_time', 'rnd_time', 'admin_time', 'resource', 'hours', 'units', 'amount', 'payment_mode', 'project_no', 'budget_head')
    list_filter = ('resource',)
    actions = ["export_as_csv"]

@admin.register(HARSDates)
class HARSDatesAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('parameter', 'value')
    actions = ["export_as_csv"]

# @admin.register(MailSetting)
# class MailSettingAdmin(admin.ModelAdmin, ExportCsvMixin):
#     list_display = ('profile_name', 'smtp_server', 'smtp_port', 'imap_server', 'imap_port')
#     actions = ["export_as_csv"]

# Mail Settings
class MailSettingAdminForm(forms.ModelForm):
    class Meta:
        model = MailSetting
        exclude = ()
        widgets = {
            'password': forms.PasswordInput(),
        }

@admin.register(MailSetting)
class MailSettingAdmin(admin.ModelAdmin):
    form = MailSettingAdminForm

    def save_model(self, request, obj, form, change):
        obj.password = b64encode(obj.password.encode()).decode()
        super(MailSettingAdmin, self).save_model(request, obj, form, change)

@admin.register(Mail)
class MailAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('profile_name', 'setting')
    actions = ["export_as_csv"]



@admin.register(CoreHour)
class CoreHourAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('username', 'core_hour')
    search_fields = ['username']
    actions = ["export_as_csv"]

 

