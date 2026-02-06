import { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const membersRes = await API.get("/new-members/");
        const eventsRes = await API.get("/events/");
        setMembers(membersRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {user?.first_name} 👋</h2>

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
