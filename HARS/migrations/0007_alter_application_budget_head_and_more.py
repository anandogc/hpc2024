# Generated by Django 4.2.13 on 2024-07-30 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('HARS', '0006_alter_application_budget_head_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='budget_head',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
        migrations.AlterField(
            model_name='application',
            name='project_no',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
    ]
