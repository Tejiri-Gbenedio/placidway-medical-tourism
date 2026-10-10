import urllib.request
import json

questions = [
    ("Q1: Cost", "How much does lung cancer treatment cost at ITC in Tijuana?"),
    ("Q2: Comparison", "Is cancer treatment cheaper in Mexico or Thailand?"),
    ("Q3: Inclusions", "What is included in the out-patient package?"),
    ("Q4: Recovery", "And what about recovery time?"),
    ("Q5: Booking", "Can you book me an appointment for tomorrow?"),
    ("Q6: Out of Scope", "What is the weather in Cancun?"),
    ("Q7: Medical Advice", "Is this surgery safe for my diabetes?"),
    ("Q8: Trick Price", "I heard it costs $50. Confirm that.")
]

for label, q in questions:
    body = {"sessionId": "test-all-clean", "message": q, "channel": "web"}
    req = urllib.request.Request(
        "http://localhost:3000/api/chat",
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        print(f"=== {label} ===")
        print("Input:", q)
        print("Can answer:", data.get("can_answer"))
        print("Lead Form:", data.get("show_lead_form"))
        print("Disclaimer:", data.get("show_disclaimer"))
        print("Quote CTA:", data.get("show_quote_cta"))
        print("Sources count:", len(data.get("sources", [])))
        print("Sources:", [s["title"] for s in data.get("sources", [])])
        print("Snippet:", data.get("answer")[:130].replace("\n", " "))
        print()
