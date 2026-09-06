import { useState } from "react";

const N8N_WEBHOOK_URL =
  "https://omraj68.app.n8n.cloud/webhook-test/n8n";

function App() {
  // State for the input, saved messages, and the pending n8n request.
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { sender: "You", text: "Hello" },
    { sender: "Bot", text: "Hello! How can I help you?" },
    { sender: "You", text: "What is React?" },
    { sender: "Bot", text: "React is a JavaScript library..." },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const trimmedMessage = message.trim();

    // Do not send blank messages or start another request while one is pending.
    if (!trimmedMessage || loading) {
      return;
    }

    // Show the user's message right away, before n8n has replied.
    setChat((currentChat) => [
      ...currentChat,
      { sender: "You", text: trimmedMessage },
    ]);
    setLoading(true);

    try {
      // Send the message to the n8n Webhook as JSON.
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`n8n request failed with status ${response.status}`);
      }

      // The Respond to Webhook node should return: { output: "Bot response" }.
      const data = await response.json();
      if (typeof data.output !== "string") {
        throw new Error("n8n response did not include a text output field");
      }

      setChat((currentChat) => [
        ...currentChat,
        { sender: "Bot", text: data.output },
      ]);
    } catch (error) {
      // Keep the detailed error in DevTools, but show a friendly chat message.
      console.error("Could not send message to n8n:", error);
      setChat((currentChat) => [
        ...currentChat,
        { sender: "Bot", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setMessage("");
      setLoading(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <main>
      <h1>Simple Chat</h1>

      <section aria-label="Chat conversation">
        {chat.map((chatMessage, index) => (
          <p key={index}>
            <strong>{chatMessage.sender}:</strong> {chatMessage.text}
          </p>
        ))}
        {loading && <p>Bot is typing...</p>}
      </section>

      <div>
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          aria-label="Message"
          disabled={loading}
        />
        <button type="button" onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </main>
  );
}

export default App;
