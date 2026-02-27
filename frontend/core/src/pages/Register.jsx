import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService.js";
import { useAuth } from "../context/AuthContext";

/**
 * Registration form.
 * The "role" field is visible to the user but locked to "member".
 * Privileged roles (admin, pastor, elder, etc.) can only be assigned
 * by an administrator via the User Management page after registration.
 */
export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    role: "member", // always "member" on self-registration
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      await login({
        email: formData.email,
        password: formData.password,
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed. Please check your details and try again.");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        {/* Text / email / password fields */}
        {[
          "username",
          "first_name",
          "last_name",
          "email",
          "phone_number",
          "password",
        ].map((key) => (
          <input
            key={key}
            type={
              key === "password"
                ? "password"
                : key === "email"
                  ? "email"
                  : "text"
            }
            name={key}
            placeholder={key.replace(/_/g, " ")}
            value={formData[key]}
            onChange={handleChange}
            required
          />
        ))}

        {/*
          Role selector — visible so the user knows what role they are
          registering as, but disabled so they cannot choose a privileged role.
          The value is always submitted as "member".
        */}
        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            disabled
            title="New members are registered with the 'Member' role. Contact an administrator to request a different role."
          >
            <option value="member">Member</option>
          </select>
          <small>
            All new registrations are assigned the <strong>Member</strong> role.
            An administrator can update your role after registration.
          </small>
        </div>

        <button type="submit">Register</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
