# 📁 WebSocket File Transfer App

A full-stack file transfer application using **Rust (Axum)** for the backend and **Next.js (React)** for the frontend. It supports real-time peer-to-peer file transfer over WebSockets — smooth, fast, and secure.

---

## 🔗 Live Demo

🌐 [Try it on vercel](https://fullstack-websocket-file-transfer-front.vercel.app/)

---

## 💠 Tech Stack

### 🔧 Backend (Rust)
- [`Axum`](https://crates.io/crates/axum) – Web server framework
- [`Tokio`](https://crates.io/crates/tokio) – Async runtime
- [`Serde`](https://serde.rs/) – JSON serialization
- [`UUID`](https://crates.io/crates/uuid) – Connection identification
- [`Futures`](https://crates.io/crates/futures) – Stream & sink utilities

### 💻 Frontend (Next.js + React)
- `Next.js 15` with `App Router`
- `React 19` & `TypeScript`
- `Tailwind CSS` for styling
- `React-Toastify` for elegant notifications
- `Lucide` icons, `clsx`, `cva`, and dark/light theme toggling via `next-themes`

---

## 📦 File Structure

```
01-WEBSOCKET-FILE-TRANSFARE
│
├── backend
│   ├── src/main.rs              # Axum WebSocket server
│   └── Cargo.toml               # Rust dependencies
│
├── frontend
│   ├── app
│   │   ├── send/                # Sender UI
│   │   └── receive/             # Receiver UI
│   ├── components/             # Shared UI components
│   ├── public/                 # Static assets
│   ├── lib/                    # Helper utilities
│   ├── styles/global.css       # Global styles
│   ├── next.config.js          # Next.js config
│   └── tailwind.config.ts      # Tailwind config
```

---

## 🚀 Getting Started

### 🧪 Backend (Rust)

> Ensure you have [Rust & Cargo](https://www.rust-lang.org/tools/install) installed.

```bash
cd backend
cargo run
```

Runs on: `http://localhost:8000/ws`

---

### 💻 Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Runs on: `http://localhost:3000`

Make sure `.env.local` includes:
```
SOCKET_URL=ws://localhost:8000/ws
```

---

## 📁 Features

- ✅ Real-time file transfer via WebSockets
- ✅ Sender/Receiver UI
- ✅ Toast notifications on error & success
- ✅ Auto-ping to keep connections alive
- ✅ Drag-and-drop or browse-to-select files
- ✅ Per-connection UUIDs

---

## ⚠️ File Size Limit

The backend supports **any file size**, but for this **demo**, transfers are limited to **10MB** due to free hosting limitations (e.g., Render). You can remove or increase this limit in the Rust backend (`MAX_FILE_SIZE`).

---


## 👌 Contributing

Got ideas or want to improve the app? Feel free to fork the repo and create a pull request. PRs are welcome!


---

> Built with ❤️ by Youssef Mohammed

