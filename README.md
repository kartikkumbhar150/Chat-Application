Random Stranger Chat — Full-Stack (React + Spring Boot + Redis + WebSockets)

A realtime 1-to-1 anonymous chat app — similar to Omegle, but simpler.

Two users join → backend matches them → they chat instantly → either can skip → both get re-matched.

🚀 Tech Stack
🖥️ Frontend

React + TypeScript

STOMP over SockJS (WebSocket client)

Vite

Tailwind UI / Motion animations

🛠 Backend

Spring Boot (WebSocket + STOMP)

Redis (fast matchmaking queue + room tracking)

SimpMessagingTemplate (broadcast messages)

🐳 Deployment

Docker

Render (works well)

Can also use Railway, AWS, etc.

📌 High-Level Flow

1️⃣ User opens app → gets a generated userId
2️⃣ Frontend connects WebSocket → /chat
3️⃣ Sends: /app/queue/{userId}
4️⃣ Backend stores queue in Redis and pairs users
5️⃣ Both users get notified:

ROOM:<roomId>


6️⃣ Messages sent to:

/app/room/{roomId}


7️⃣ Received on:

/topic/room/{roomId}


8️⃣ If someone closes, refreshes, or presses skip:

/app/next/{userId}


Backend re-queues the remaining user and finds a new partner.

🧰 Prerequisites

Install:

Java 17+

Node 18+

Maven

Redis (local or hosted)

🏗 Backend Setup (Spring Boot)
1️⃣ Configure Redis

Local:

redis-server


Or use a cloud provider (Upstash, Render Redis, etc.).

Set env variable:

REDIS_URL=redis://localhost:6379

2️⃣ Run Backend
mvn spring-boot:run


Verify:

GET http://localhost:8080/api/health


Response:

{
  "status": "OK",
  "message": "Backend running"
}

💬 WebSocket API Cheat Sheet
Connect
/chat

Queue

Client → /app/queue/{userId}
Server → /topic/queue/{userId}

Response	Meaning
WAIT	searching
ROOM:<id>	connected
LEFT	partner disconnected
Messaging

Subscribe:

/topic/room/{roomId}


Send:

/app/room/{roomId}


Payload:

{
  "sender": "John",
  "content": "Hello!"
}

Skip
/app/next/{userId}

🌐 Frontend Setup (React)
1️⃣ Install dependencies
npm install

2️⃣ Configure backend URL

Open:

src/components/ChatInterface.tsx


Change WebSocket server if deployed:

const socket = new SockJS("http://localhost:8080/chat");


Example production:

const socket = new SockJS("https://your-backend.onrender.com/chat");

3️⃣ Run app
npm run dev


Open:

http://localhost:5173
);

🐳 Docker (Optional)
Backend build
docker build -t chat-backend .
docker run -p 8080:8080 -e REDIS_URL=redis://host.docker.internal:6379 chat-backend

☁️ Deploy on Render (Recommended)
Backend

1️⃣ Create → Web Service
2️⃣ Choose your repo
3️⃣ Use Dockerfile
4️⃣ Add env vars:

REDIS_URL=<redis connection>


Deploy 🎉

Frontend

1️⃣ Create → Static Site
2️⃣ Build command:

npm run build


3️⃣ Publish /dist

4️⃣ Set backend URL in code before building.

🤝 Contributing

Pull requests welcome — especially:

Better UI

Mobile UI improvements

Typing indicators

Anti-spam features

Multi-language support

🐞 Troubleshooting
❌ “Connecting forever”

Check WebSocket URL
Ensure backend allows origin 5173

❌ Messages not delivered

Check both users share same roomId.

❌ Skip not working

Ensure /app/next/{userId} publishes.

📜 License

MIT — free to use & modify.
