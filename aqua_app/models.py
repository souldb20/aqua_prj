from django.db import models


class PH(models.Model):
    density = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.pk} :: {self.density} - {self.created_at}'