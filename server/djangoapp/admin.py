from django.contrib import admin
from . import models

class CarModelInline(admin.TabularInline):
    model = models.CarModel
    extra = 1

class CarModelAdmin(admin.ModelAdmin):
    list_display = ('Name', 'DealerId', 'Type', 'Year', 'CarMake')
    list_filter = ('Year', 'CarMake')
    search_fields = ('Name', 'DealerId', 'Type', 'CarMake__Name')  # Search by CarMake name

class CarMakeAdmin(admin.ModelAdmin):
    list_display = ('Name', 'Description')
    inlines = [CarModelInline]

admin.site.register(models.CarMake, CarMakeAdmin)
admin.site.register(models.CarModel, CarModelAdmin)
