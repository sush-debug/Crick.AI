
import json
from pathlib import Path
from functools import lru_cache

from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST

from companion.services.groq_service import get_ai_response


@ensure_csrf_cookie
def home(request):
    return render(request, "companion/index.html")


# Find and cache the IPL 2017 Final
@lru_cache(maxsize=1)
def find_ipl_final():
    data_dir = Path(settings.BASE_DIR) / "companion" / "data"

    target_teams = {
        "mumbai indians",
        "rising pune supergiant"
    }

    if not data_dir.exists():
        return None

    for file_path in data_dir.rglob("*.json"):
        try:
            with file_path.open("r", encoding="utf-8") as file:
                data = json.load(file)

            info = data.get("info", {})

            teams = {
                team.lower() for team in info.get("teams", [])
            }

            dates = info.get("dates", [])

            if (
                target_teams.issubset(teams)
                and any(str(d).startswith("2017-05-21") for d in dates)
            ):
                return data

        except (json.JSONDecodeError, OSError, TypeError):
            continue

    return None


# Build complete ball-by-ball match context
def get_json_match_context():
    data = find_ipl_final()

    if not data:
        return None

    info = data.get("info", {})

    context = [
        "MATCH: Mumbai Indians vs Rising Pune Supergiant",
        "Tournament: IPL 2017 Final",
        f"Date: {info.get('dates', [])}",
        f"Venue: {info.get('venue', 'Unknown')}",
        f"Outcome: {info.get('outcome', {})}",
    ]

    for innings_number, innings in enumerate(
        data.get("innings", []), start=1
    ):
        context.append(
            f"\nINNINGS {innings_number}: {innings.get('team')}"
        )

        innings_runs = 0
        innings_wickets = 0

        for over_data in innings.get("overs", []):
            over_number = over_data.get("over", 0) + 1
            over_runs = 0

            for ball_number, delivery in enumerate(
                over_data.get("deliveries", []), start=1
            ):
                runs = delivery.get("runs", {})
                wickets = delivery.get("wickets", [])
                extras = delivery.get("extras", {})

                total_runs = runs.get("total", 0)

                innings_runs += total_runs
                innings_wickets += len(wickets)
                over_runs += total_runs

                ball_info = (
                    f"Over {over_number}.{ball_number}: "
                    f"{delivery.get('batter', 'Unknown')} faced "
                    f"{delivery.get('bowler', 'Unknown')}; "
                    f"batter runs: {runs.get('batter', 0)}; "
                    f"total runs: {total_runs}"
                )

                if extras:
                    ball_info += f"; extras: {extras}"

                if wickets:
                    for wicket in wickets:
                        ball_info += (
                            f"; WICKET: {wicket.get('player_out', 'Unknown')} "
                            f"({wicket.get('kind', 'dismissal')})"
                        )

                context.append(ball_info)

            context.append(
                f"End of over {over_number}: {over_runs} runs"
            )

        context.append(
            f"Innings total: {innings_runs}/{innings_wickets}"
        )

    return "\n".join(context)


# Mumbai Indians batting scorecard
def get_batting_scorecard():
    data = find_ipl_final()

    if not data:
        return "Batting scorecard unavailable."

    scorecard = []

    for innings in data.get("innings", []):
        if innings.get("team", "").lower() != "mumbai indians":
            continue

        batting = {}

        for over in innings.get("overs", []):
            for delivery in over.get("deliveries", []):
                batter = delivery.get("batter", "Unknown")
                runs = delivery.get("runs", {})
                extras = delivery.get("extras", {})

                stats = batting.setdefault(
                    batter,
                    {
                        "runs": 0,
                        "balls": 0,
                        "fours": 0,
                        "sixes": 0
                    }
                )

                stats["runs"] += runs.get("batter", 0)

                if "wides" not in extras:
                    stats["balls"] += 1

                if runs.get("batter") == 4:
                    stats["fours"] += 1
                elif runs.get("batter") == 6:
                    stats["sixes"] += 1

        for player, stats in sorted(
            batting.items(),
            key=lambda item: item[1]["runs"],
            reverse=True
        ):
            scorecard.append(
                f"{player}: {stats['runs']} runs, "
                f"{stats['balls']} balls, "
                f"{stats['fours']} fours, "
                f"{stats['sixes']} sixes"
            )

    return "\n".join(scorecard) or "No batting records found."


# Final over details of Rising Pune Supergiant's innings
def get_final_over_context():
    data = find_ipl_final()

    if not data:
        return "Final-over data unavailable."

    innings_list = data.get("innings", [])

    if len(innings_list) < 2:
        return "Second innings unavailable."

    second_innings = innings_list[1]
    overs = second_innings.get("overs", [])

    if not overs:
        return "Final over unavailable."

    final_over = overs[-1]
    over_number = final_over.get("over", 0) + 1

    details = [
        f"Final over: Over {over_number}",
        f"Batting team: {second_innings.get('team')}"
    ]

    for ball_number, delivery in enumerate(
        final_over.get("deliveries", []), start=1
    ):
        runs = delivery.get("runs", {})
        wickets = delivery.get("wickets", [])

        details.append(
            f"Ball {ball_number}: "
            f"{delivery.get('batter')} faced "
            f"{delivery.get('bowler')}, "
            f"batter runs: {runs.get('batter', 0)}, "
            f"total runs: {runs.get('total', 0)}, "
            f"extras: {delivery.get('extras', {})}, "
            f"wickets: {wickets}"
        )

    return "\n".join(details)


# Dataset diagnostic endpoint
def test_match_data(request):
    context = get_json_match_context()

    if context:
        return JsonResponse({
            "data_found": True,
            "preview": context[:3000],
            "total_context_characters": len(context)
        })

    return JsonResponse({
        "data_found": False,
        "message": "2017 IPL Final not found."
    })


# Identify question type
def get_question_type(message):
    message = message.lower()

    final_over_keywords = [
        "final over",
        "last over",
        "last six balls",
        "final six balls",
        "last ball",
        "defend the final"
    ]

    scorecard_keywords = [
        "top scorer",
        "scorecard",
        "how many runs",
        "how many balls",
        "who scored",
        "batting performance",
        "strike rate",
        "fours",
        "sixes"
    ]

    if any(word in message for word in final_over_keywords):
        return "final_over"

    if any(word in message for word in scorecard_keywords):
        return "scorecard"

    return "general"


# Build context for every chatbot question
def build_match_context(message, dashboard_context, previous_recap=""):
    question_type = get_question_type(message)

    base_context = """
You are Crick AI, an AI cricket match companion.

MATCH: Mumbai Indians vs Rising Pune Supergiant
TOURNAMENT: IPL 2017 Final
DATE: 21 May 2017

VERIFIED MATCH RESULT:
Mumbai Indians: 129/8
Rising Pune Supergiant: 128/6
Winner: Mumbai Indians
Winning margin: 1 run.

Krunal Pandya scored 47 runs off 38 balls.

INSTRUCTIONS:
- Answer using the supplied match data.
- Explain cricket events, performances and tactics clearly.
- Use actual deliveries and match events as evidence.
- Never invent statistics, wickets or performances.
- If the dataset does not contain the requested information, say so.
- Keep answers clear and conversational.
"""

    match_data = get_json_match_context()

    if not match_data:
        match_data = "Complete ball-by-ball match data unavailable."

    scorecard = get_batting_scorecard()
    final_over = get_final_over_context()

    return f"""
{base_context}

QUESTION CATEGORY: {question_type}

COMPLETE MATCH BALL-BY-BALL DATA:
{match_data}

MUMBAI INDIANS BATTING SCORECARD:
{scorecard}

FINAL OVER DETAILS:
{final_over}

CURRENT DASHBOARD:
{dashboard_context}

PREVIOUS SMART MATCH RECAP:
{previous_recap or "No recap generated yet."}

Use the previous recap when the user's question refers to it.
"""


# AI Chat API
@csrf_exempt
@require_POST
def chat_api(request):
    try:
        data = json.loads(request.body or "{}")

        message = data.get("message", "").strip()

        if not message:
            return JsonResponse(
                {"error": "Please enter a question."},
                status=400
            )

        dashboard_context = f"""
Score: {data.get("score", "N/A")}
Overs: {data.get("overs", "N/A")}
Batters: {data.get("batter1", "N/A")},
          {data.get("batter2", "N/A")}
Bowler: {data.get("bowler", "N/A")}
"""

        previous_recap = data.get("previous_recap", "")

        match_context = build_match_context(
            message,
            dashboard_context,
            previous_recap
        )

        reply = get_ai_response(
            message,
            match_context
        )

        return JsonResponse({
            "reply": reply
        })

    except json.JSONDecodeError:
        return JsonResponse(
            {"error": "Invalid request data."},
            status=400
        )

    except Exception as e:
        print("Chat API Error:", str(e))

        return JsonResponse(
            {"error": "Something went wrong. Please try again."},
            status=500
        )


# Smart Match Recap API
@csrf_exempt
@require_POST
def match_recap_api(request):
    try:
        data = json.loads(request.body or "{}")

        overs_requested = int(data.get("overs", 0))

        if overs_requested not in [5, 10, 15, 20]:
            return JsonResponse(
                {"error": "Choose 5, 10, 15 or 20 overs."},
                status=400
            )

        match_data = find_ipl_final()

        if not match_data:
            return JsonResponse(
                {"error": "Match dataset not found."},
                status=404
            )

        innings_list = match_data.get("innings", [])

        if not innings_list:
            return JsonResponse(
                {"error": "Innings data unavailable."},
                status=404
            )

        # First innings: Mumbai Indians batting
        innings = innings_list[0]
        over_details = []

        for over_data in innings.get("overs", []):
            over_number = over_data.get("over", 0) + 1

            if over_number > overs_requested:
                break

            runs = 0
            wickets = 0
            events = []

            for delivery in over_data.get("deliveries", []):
                delivery_runs = delivery.get("runs", {})
                total = delivery_runs.get("total", 0)

                runs += total
                wickets += len(delivery.get("wickets", []))

                if delivery_runs.get("batter", 0) == 4:
                    events.append(
                        f"{delivery.get('batter')} hit a four"
                    )

                elif delivery_runs.get("batter", 0) == 6:
                    events.append(
                        f"{delivery.get('batter')} hit a six"
                    )

                for wicket in delivery.get("wickets", []):
                    events.append(
                        f"Wicket: {wicket.get('kind', 'dismissal')} "
                        f"of {wicket.get('player_out', 'unknown')}"
                    )

            over_details.append(
                f"Over {over_number}: {runs} runs, "
                f"{wickets} wickets. "
                + "; ".join(events)
            )

        if not over_details:
            return JsonResponse(
                {"error": "No over data available."},
                status=404
            )

        context = f"""
You are Crick AI.

Create a concise, engaging cricket match recap.

Match: Mumbai Indians vs Rising Pune Supergiant
Tournament: IPL 2017 Final
Team batting: Mumbai Indians
Requested recap: First {overs_requested} overs.

Verified over-by-over data:
{chr(10).join(over_details)}

Rules:
- Explain the match progression.
- Mention important boundaries and wickets.
- Explain batting momentum.
- Do not invent events or statistics.
- Keep the response between 100 and 150 words.
"""

        recap = get_ai_response(
            f"Generate a recap of the first {overs_requested} overs.",
            context
        )

        return JsonResponse({
            "overs": overs_requested,
            "recap": recap
        })

    except (ValueError, TypeError, json.JSONDecodeError):
        return JsonResponse(
            {"error": "Invalid recap request."},
            status=400
        )

    except Exception as e:
        print("Recap API Error:", str(e))

        return JsonResponse(
            {"error": "Unable to generate match recap."},
            status=500
        )
