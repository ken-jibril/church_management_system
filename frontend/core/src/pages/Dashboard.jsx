import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MOCK data
    setMembers([
      { id: 1, first_name: "Ken", last_name: "Jibril", status: "active" },
      { id: 2, first_name: "Zen", last_name: "Assistant", status: "active" },
    ]);
    setEvents([
      { id: 1, name: "Sunday Service", date: "2026-02-08" },
      { id: 2, name: "Choir Practice", date: "2026-02-09" },
    ]);
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {user?.first_name} 👋</h2>
      <button onClick={logout}>Logout</button>

      <h3>Members</h3>
      <ul>
        {members.map((m) => (
          <li key={m.id}>{m.first_name} {m.last_name} ({m.status})</li>
        ))}
      </ul>

      <h3>Events</h3>
      <ul>
        {events.map((e) => (
          <li key={e.id}>{e.name} - {e.date}</li>
        ))}
      </ul>
    </div>
  );
}
