# ⛪ Church Management System – Frontend

This is the **frontend** of the Church Management System, built with **React (Vite)**.  
It communicates with a **Django REST Framework backend** to manage members, events, attendance, and church administration workflows.

The goal of this frontend is to be:
- ⚡ Fast and responsive
- 🧠 Easy to maintain and scale
- 🔐 Secure with role-based access
- 🎯 Focused on real church workflows

---

## 🧩 Tech Stack

- **React** (with Vite)
- **Axios** – API communication
- **React Router** – Routing
- **CSS / Tailwind (optional later)** – Styling
- **Django REST Framework** – Backend API

---

## 📁 Project Structure

```text
src/
├── app/            # App bootstrap, routing, providers
├── assets/         # Images, icons, global styles
├── components/     # Reusable UI components
├── core/           # Axios instance, constants, helpers
├── features/       # Feature-based modules (auth, members, events, attendance)
├── hooks/          # Custom React hooks
├── pages/          # Top-level pages (Dashboard, Errors)
├── store/          # Global state (if needed later)
└── main.jsx        # Entry point
