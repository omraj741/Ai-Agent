# Simple n8n Chat

## Install dependencies

Run this from the project folder:

```bash
npm install
```

## Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`) in a browser.

## How it communicates with n8n

`src/App.jsx` sends a `POST` request to the configured n8n **test** Webhook URL whenever the user sends a non-empty message. The JSON request body is:

```json
{
  "message": "Hello"
}
```

The workflow can follow this shape:

```text
Webhook → AI Agent / processing → Respond to Webhook
```

The **Respond to Webhook** node must return JSON with an `output` property:

```json
{
  "output": "Hello! How can I help you?"
}
```

## Test the chatbot

1. In n8n, put the Webhook workflow into test/listening mode so its test URL accepts requests.
2. Start the Vite server and open its browser URL.
3. Type a message and click **Send**, or press **Enter**.
4. The user message appears immediately, followed by `Bot is typing...` until n8n returns its `output`.

## CORS troubleshooting

The browser must be allowed to make a cross-origin request from the Vite site to n8n. In the n8n Webhook/workflow configuration, enable CORS and allow the React application's origin, for example `http://localhost:5173` during development. Allow the `POST` method and the `Content-Type` request header. If n8n offers a response-header setting, return an `Access-Control-Allow-Origin` header for that origin (or a suitably restricted list of allowed origins), plus the required methods and headers. Save the workflow and start listening for the test Webhook again.
