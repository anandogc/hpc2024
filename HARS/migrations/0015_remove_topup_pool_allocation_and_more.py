# Generated by Django 4.2 on 2024-10-28 10:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HARS', '0014_topup_pool_allocation'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='topup',
            name='pool_allocation',
        ),
        migrations.AlterField(
            model_name='application',
            name='payment_mode',
            field=models.CharField(choices=[('Bank', 'Bank'), ('Project', 'Project'), ('Pool', 'Pool')], default='Project', max_length=16),
        ),
    ]