# Generated by Django 4.2.13 on 2024-10-26 07:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HARS', '0013_application_pool_allocation_topup_email_sent_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='payment_mode',
            field=models.CharField(choices=[('Bank', 'Bank'), ('Project', 'Project'), ('Pool', 'Pool')], default='Project', max_length=16),
        ),
    ]
