from django.contrib import admin
from .models import Page, BilingualPage

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('name', 'site', 'category')


@admin.register(BilingualPage)
class PageAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
