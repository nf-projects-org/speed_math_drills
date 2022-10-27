from django.db import models
from accounts.models import SmdUser

OPERATION_CHOICES = ( 
    (1,'+'),(2,'-'),(3,'x'),(4,'÷'),(5,'^'), (6,'√a')
)
OPERATION_CHOICES_DICT = dict(OPERATION_CHOICES)

CATEGORY_CHOICES = (
    (1,'Competitive Exam'),(2,'Student'), (3, 'Neurobics'), (4, 'Just Playing'), (5, 'Consultant')
)
CATEGORY_CHOICES_DICT = dict(CATEGORY_CHOICES)

class UniversalDrill(models.Model):
    first_param_start = models.PositiveIntegerField(verbose_name='Start1', default=1,)
    first_param_end = models.PositiveIntegerField(verbose_name='End1', default=30, )
    second_param_start = models.PositiveIntegerField(verbose_name='Start2', default=1,)
    second_param_end = models.PositiveIntegerField(verbose_name='End2', default=30, )
    operation = models.PositiveSmallIntegerField(choices=OPERATION_CHOICES, default=3)
    name = models.CharField(max_length=50, default='')
    category = models.PositiveSmallIntegerField(choices=CATEGORY_CHOICES,default=1)

    class Meta:
        verbose_name = 'Universal Drill'
        verbose_name_plural = 'Universal Drills'
    
    def __str__(self):
        return self.name + " | " + str( CATEGORY_CHOICES_DICT[self.category]) + " [" + str(self.first_param_start) +", "+ str(self.first_param_end) +"] "  + str(OPERATION_CHOICES_DICT[self.operation]) \
        + " [" + str(self.second_param_start) +", "+ str(self.second_param_end) +"]" 

class UserDrill(models.Model):
    user = models.ForeignKey(SmdUser, models.CASCADE, related_name='Owner', )
    first_param_start = models.PositiveIntegerField(verbose_name='Start1', default=1,)
    first_param_end = models.PositiveIntegerField(verbose_name='End1', default=30, )
    second_param_start = models.PositiveIntegerField(verbose_name='Start2', default=1,)
    second_param_end = models.PositiveIntegerField(verbose_name='End2', default=30, )
    operation = models.PositiveSmallIntegerField(choices=OPERATION_CHOICES, default=3)
    name = models.CharField(max_length=50, default='')
    category = models.CharField(max_length=50, default='')

    class Meta:
        verbose_name = 'User Drill'
        verbose_name_plural = 'User Drills'
    
    def __str__(self):
        return self.name + " | " + self.category + " [" + str(self.first_param_start) +", "+ str(self.first_param_end) +"] "  + str(OPERATION_CHOICES_DICT[self.operation]) \
        + " [" + str(self.second_param_start) +", "+ str(self.second_param_end) +"]" 