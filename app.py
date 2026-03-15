from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

# Configure your API key
genai.configure(api_key="YOUR_API_KEY")

# Use the supported Gemini model
model = genai.GenerativeModel("gemini-2.5-flash")

# Allowed domain keywords for programming
ALLOWED_KEYWORDS = [
    "python", "flask", "java", "c++", "javascript", "html", "css", "sql",
    "programming", "algorithm", "data structure", "function", "class"
]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "").lower()

    # Check if the message belongs to programming domain
    if not any(keyword in user_message for keyword in ALLOWED_KEYWORDS):
        return jsonify({"reply": "Sorry, I can only answer programming-related questions."})

    try:
        response = model.generate_content(user_message)
        return jsonify({"reply": response.text})
    except Exception as e:
        app.logger.exception("Error generating response")
        return jsonify({"error": "Failed to generate response", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)