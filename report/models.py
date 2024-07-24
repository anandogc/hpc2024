from django.db import models

from HARS.models import HPCProfile

# Create your models here.
class Report(models.Model):
    hpc_profile = models.ForeignKey(HPCProfile, on_delete=models.CASCADE)
    name = models.CharField(null=True, max_length=48)

    def __str__(self):
        return f"{self.name}"

class Section(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    parent = models.ForeignKey(Section, on_delete=models.CASCADE, null=True)
    title = models.CharField(null=True, max_length=48)
    order = models.IntegerField(default=0)
    content = models.TextField(null=True)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title}"
