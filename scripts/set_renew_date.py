from django.utils import timezone
import datetime

from HARS.models import HARSDates

## Set Renew Date

# Naive datetime
naive_dt = datetime.datetime(2024, 6, 15)

# Make it timezone-aware
aware_dt = timezone.make_aware(naive_dt, timezone.get_current_timezone())

# Save it in database
renew_date = HARSDates.objects.get(parameter='renew_date')
renew_date.value = str(aware_dt)
renew_date.save()



## Set Renew Date QA

# Naive datetime
naive_dt = datetime.datetime(2024, 6, 15)

# Make it timezone-aware
aware_dt = timezone.make_aware(naive_dt, timezone.get_current_timezone())

# Save it in database
renew_date = HARSDates.objects.get(parameter='renew_date_QA')
renew_date.value = str(aware_dt)
renew_date.save()

## Set Default User Account Expiry Date
# Naive datetime
naive_dt = datetime.datetime(2025, 6, 30)

# Make it timezone-aware
aware_dt = timezone.make_aware(naive_dt, timezone.get_current_timezone())

# Save it in database
default_user_account_expiry = HARSDates.objects.get(parameter='default_user_account_expiry')
default_user_account_expiry.value = str(aware_dt)
default_user_account_expiry.save()
