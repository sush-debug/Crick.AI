
from django.db import models


class Match(models.Model):
    match_id = models.CharField(max_length=100, unique=True)
    tournament = models.CharField(max_length=100)
    season = models.CharField(max_length=20)
    date = models.DateField()
    venue = models.CharField(max_length=200)

    team1 = models.CharField(max_length=100)
    team2 = models.CharField(max_length=100)

    winner = models.CharField(max_length=100, blank=True)
    result = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.team1} vs {self.team2} ({self.season})"


class MatchInnings(models.Model):
    match = models.ForeignKey(
        Match,
        on_delete=models.CASCADE,
        related_name="innings"
    )

    innings_number = models.PositiveSmallIntegerField()
    batting_team = models.CharField(max_length=100)
    bowling_team = models.CharField(max_length=100)

    runs = models.PositiveIntegerField(default=0)
    wickets = models.PositiveSmallIntegerField(default=0)
    overs = models.CharField(max_length=10)

    def __str__(self):
        return f"{self.batting_team} - {self.runs}/{self.wickets}"


class MatchEvent(models.Model):
    innings = models.ForeignKey(
        MatchInnings,
        on_delete=models.CASCADE,
        related_name="events"
    )

    over = models.DecimalField(max_digits=4, decimal_places=1)
    event_type = models.CharField(max_length=30)
    description = models.TextField()
    player = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.innings.match} - {self.over}"
