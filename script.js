const form = document.getElementById("inputForm");
const messageInput = document.getElementById("message");
const chatbox = document.getElementById("chatbox");

// Load history on page load
window.onload = async () => {
    const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "" })
    });
    const data = await res.json();
    displayHistory(data.history);
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (!message) return;

    messageInput.value = "";

    const res = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });
    const data = await res.json();
    displayHistory(data.history);
});

function displayHistory(history) {
    chatbox.innerHTML = "";
    history.forEach(item => {
        if (item.user) {
            const userDiv = document.createElement("div");
            userDiv.className = "message user";
            userDiv.textContent = `${item.time}\nYou: ${item.user}`;
            chatbox.appendChild(userDiv);
        }
        if (item.bot) {
            const botDiv = document.createElement("div");
            botDiv.className = "message bot";
            botDiv.textContent = `${item.time}\nBot: ${item.bot}`;
            chatbox.appendChild(botDiv);
        }
    });
    chatbox.scrollTop = chatbox.scrollHeight;
}