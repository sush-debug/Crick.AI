from django.contrib import admin
from .models import Match, MatchInnings, MatchEvent

admin.site.register(Match)
admin.site.register(MatchInnings)
admin.site.register(MatchEvent)