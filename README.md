# ARCHI.AI - Enterprise-Grade Cybersecurity Analytics Hub 🛡️

A production-ready full-stack **MERN Stack Application** designed to simulate real-time enterprise security threat streams and cryptographic operations. The application features zero-knowledge client architecture telemetry and secure database storage.

🌐 **Live Application:** [archi-ai-alpha.vercel.app](https://archi-ai-alpha.vercel.app)

---

## 🚀 Core Architectural Features

* **Real-Time Telemetry Feed:** Integrated with WebSockets via **Socket.io** to push live network diagnostic logs and attack vector simulations directly to the client dashboard.
* **Secure Authentication Pipeline:** Production-ready authentication architecture using encrypted transmission and standard session persistence via JSON Web Tokens (JWT) and LocalStorage.
* **Adaptive Cryptographic Concepts:** Features a dynamic client-side sandbox environment showcasing localized data encoding simulations (AES standard structural flows).
* **Cloud Architecture Integration:** Built with a decoupled engine connecting a Vite-optimized frontend to a Node/Express backend backed by a managed **MongoDB Atlas cloud database**.

---

## 🛠️ The Production Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js & Vite | High-performance client rendering & rapid hot module reloading. |
| **Styling** | Tailwind CSS | Modern utility-first styling with responsive, dark-mode dashboards. |
| **Backend** | Node.js & Express.js | Robust asynchronous REST API pipeline & routing layer. |
| **Database** | MongoDB Atlas | Cloud-hosted NoSQL data persistence layer for client profiles. |
| **Sockets** | Socket.io | Bi-directional, lower-latency real-time telemetry pipelines. |

---

## 📂 Project Structure Overview

```text
├── server/               # Node.js/Express Backend Core
│   ├── index.js          # Main application setup, database connection & WebSocket hooks
│   ├── package.json      # Server-side environment dependencies
│   └── .env              # Isolated environment configurations (MongoDB Keys, Ports)
├── src/                  # React.js Frontend Application
│   ├── App.jsx           # Monolithic routing dashboard and sandbox framework code
│   └── main.jsx          # Vite initialization node
├── vite.config.js        # Modern client building environment mappings
└── README.md             # Production documentation