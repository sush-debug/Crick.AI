
import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

MODEL = "openai/gpt-oss-120b"


def get_ai_response(message, match_context=""):
    """
    Generate cricket answers using Groq and supplied match context.
    Handles rate limits and temporary API failures.
    """

    if not message or not message.strip():
        return "Please enter a cricket question."

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        return "Crick AI is temporarily unavailable. Please try again shortly."

    system_prompt = """
You are Crick AI, an intelligent, friendly and knowledgeable cricket assistant.

You help users understand cricket matches, players, statistics, rules,
strategies, tournaments and historical cricket events.

IMPORTANT: QUESTION HANDLING

1. CURRENT MATCH:
If the user asks about the match currently displayed, use the
CURRENT MATCH CONTEXT provided below.

2. HISTORICAL MATCHES:
If the user asks about another historical match, answer using reliable
cricket knowledge only when you are confident.
Never pretend that historical match data was retrieved if it was not.

3. GENERAL CRICKET:
For questions about rules, terminology, tactics, formats and cricket
concepts, answer using your cricket knowledge.

4. STATISTICS:
Never invent player statistics, scores, records, wickets or match results.
If a precise statistic cannot be verified, clearly say so.

5. CONTEXT PRIORITY:
When answering questions about the displayed match, the supplied
match context takes priority over general cricket knowledge.

6. RESPONSE STYLE:
- Answer in 1–3 short sentences.
- Prefer direct answers over explanations.
- Use bullet points only when necessary.
- Avoid unnecessary introductions and repetition.
- Give exact statistics when verified.
- Never guess or invent facts.
- If unsure, say so briefly.

7. IDENTITY:
Your name is Crick AI.
Do not describe yourself as a different chatbot.

CURRENT MATCH CONTEXT:
"""

    context = match_context.strip() if match_context else ""
    if not context:
        context = "No verified current match data is available."

    system_prompt += context

    try:
        client = Groq(
            api_key=api_key,
            timeout=30.0,
            max_retries=0
        )

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message.strip()}
            ],
            temperature=0.3,
            max_tokens=500
        )

        reply = response.choices[0].message.content

        if not reply:
            return "I couldn't generate an answer. Please try again."

        return reply.strip()

    except Exception as e:
        status_code = getattr(e, "status_code", None)

        if status_code == 429:
            print("Groq rate limit reached.")
            return (
                "Crick AI is receiving too many requests right now. "
                "Please wait a little and try again."
            )

        if status_code in (500, 502, 503, 504):
            print("Groq server temporarily unavailable:", status_code)
            return (
                "Crick AI is temporarily experiencing a server issue. "
                "Please try again shortly."
            )

        if status_code == 401:
            print("Groq authentication failed. Check GROQ_API_KEY.")
            return "Crick AI is temporarily unavailable. Please try again later."

        print("Groq API Error:", type(e).__name__)

        return (
            "I'm having trouble connecting to Crick AI right now. "
            "Please try again."
        )
