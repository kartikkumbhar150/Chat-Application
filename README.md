Random Stranger Chat — Full-Stack (React + Spring Boot + Redis + WebSockets)

A realtime 1-to-1 anonymous chat app — similar to Omegle, but simpler.
Two users join → backend matches them → they chat instantly → either one skips → both get re-matched.

🚀 Tech Stack

🖥️ Frontend
React + TypeScript
STOMP over SockJS (WebSocket client)
Vite
Tailwind UI + Motion animations

🛠 Backend
Spring Boot (WebSocket + STOMP)
Redis (fast matchmaking queue + room tracking)
SimpMessagingTemplate (message broadcasting)

🐳 Deployment
Docker
Render (recommended)
Railway / AWS / Others supported

📌 High-Level Flow
1️⃣ User opens the app → gets a generated userId
2️⃣ Frontend connects WebSocket → /chat
3️⃣ Sends matchmaking request:

/app/queue/{userId}


4️⃣ Backend stores queue in Redis and pairs users
5️⃣ Both users receive:

ROOM:<roomId>


6️⃣ Messages are sent:

/app/room/{roomId}


7️⃣ Messages are received:

/topic/room/{roomId}


8️⃣ If someone closes, refreshes, or presses Skip:

/app/next/{userId}


Backend instantly finds a new partner.

🧰 Prerequisites

Install:
Java 17+
Node 18+
Maven
Redis (local or hosted)

🏗 Backend Setup (Spring Boot)

1️⃣ Configure Redis
Run locally
redis-server

Or use hosted Redis (Upstash / Render / etc.).
Set environment variable:

REDIS_URL=redis://localhost:6379

2️⃣ Run Backend
mvn spring-boot:run

Verify backend is running:

GET http://localhost:8080/api/health

Expected:

{
  "status": "OK",
  "message": "Backend running"
}

💬 WebSocket API Cheat Sheet
🔌 Connect
/chat

🎯 Queue

Client →

/app/queue/{userId}


Server →

/topic/queue/{userId}

Response	Meaning
WAIT	Searching for partner
ROOM:<id>	Connected
LEFT	Partner disconnected
💬 Messaging

Subscribe

/topic/room/{roomId}


Send

/app/room/{roomId}


Payload:

{
  "sender": "John",
  "content": "Hello!"
}

⏭ Skip
/app/next/{userId}

🌐 Frontend Setup (React)
1️⃣ Install dependencies
npm install

2️⃣ Configure Backend URL

Edit:

src/components/ChatInterface.tsx


Development:

const socket = new SockJS("http://localhost:8080/chat");


Production example:

const socket = new SockJS("https://your-backend.onrender.com/chat");

3️⃣ Run Frontend
npm run dev


Open in browser:

http://localhost:5173

🐳 Docker (Optional)
Build backend image
docker build -t chat-backend .


Run container:

docker run -p 8080:8080 -e REDIS_URL=redis://host.docker.internal:6379 chat-backend

☁️ Deploy on Render (Recommended)
🔙 Backend

1️⃣ Create → Web Service
2️⃣ Select repository
3️⃣ Select Dockerfile
4️⃣ Add environment variable:

REDIS_URL=<your redis connection string>


Deploy 🎉

🎨 Frontend

1️⃣ Create → Static Site
2️⃣ Build command:

npm run build

3️⃣ Publish folder:
/dist

4️⃣ Ensure backend URL in code points to production backend.

🤝 Contributing
Contributions welcome — ideas include:
UI improvements
Typing indicators
Mobile layout enhancements
Spam / abuse protection
Multi-language support

🐞 Troubleshooting
❌ Stuck on “Connecting…”
✔ Check WebSocket URL
✔ Backend must allow origin 5173
❌ Messages not delivered
✔ Both users must share the same roomId.
❌ Skip not working

✔ Ensure:
/app/next/{userId}

📜 License

MIT — free to use & modify.
