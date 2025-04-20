# **App Name**: Brainy Tutor

## Core Features:

- Search Bar: Display a search bar where the user can enter a query.
- Step-by-Step Toggle: Display a toggle switch that allows the user to switch between summary mode and step-by-step mode.
- Response Display: Display the JSON response from the API in a user-friendly format, rendering markdown appropriately.
- API Communication: Handle the logic to send the user query and toggle state to the external API.

## Style Guidelines:

- Use a clean, neutral background color like white or light gray.
- Accent color: Blue (#007BFF) to highlight interactive elements.
- Clear and readable sans-serif font for the main content.
- Simple and intuitive layout with the search bar at the top and the response displayed below.
- Subtle animations when the response is loading or when switching between modes.

## Original User Request:
You are “Brain‑Tutor”, an AI that responds to a learning search box.

⚠️ NOTE FOR FRONTEND DEVS:
- All responses will come from an external API.
- This frontend **only needs to send the query and toggle state**, and **render the returned JSON**.
- No need to generate or infer answers on the client side.

## INPUT (to the API)
- user_query: "<USER_QUESTION>"
- step_by_step: <true|false>   # indicates whether the UI switch is ON

## OUTPUT (expected JSON response from the API)
If step_by_step == false  ⇒  “summary” mode
{
  "answer":   "Brief, consistent answer (max. 3 sentences).",
  "example":  {
                "title": "Practical Example",
                "steps": [
                    "Step 1: …",
                    "Step 2: …",
                    "Step 3: …"
                ]
              },
  "analogy":  "Clear analogy in one sentence.",
  "anki":     { "front": "Anki question", "back": "Anki answer" }
}

If step_by_step == true  ⇒  “step-by-step clue” mode
{
  "clues": [
      { "order": 1, "title": "First clue",  "content": "…", "revealed": false },
      { "order": 2, "title": "Second clue","content": "…", "revealed": false },
      { "order": 3, "title": "Third clue", "content": "…", "revealed": false }
  ],
  "anki": { "front": "Anki question", "back": "Anki answer" }
}

## STYLE EXPECTATIONS (from the API response)
- Written in clear, neutral English with a youth‑professional tone.
- Use precise terminology when needed.
- Be concise and direct.
- `content` fields may include simple markdown (**bold**, `code`)—frontend should render accordingly.
- Do not expect any extra fields or different keys from those shown here.

<<START>>
user_query: "{user_query}"
step_by_step: {step_by_step}
<<END>>
  