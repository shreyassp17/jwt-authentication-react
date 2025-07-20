import { useState } from "react";
import "./App.css";
import { useAuth } from "./hooks/useAuth";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, login, user, isAuthenticated, error } = useAuth();
  console.log(useAuth());
  const handleLogin = async (e: unknown) => {
    e.preventDefault();
    login(username, password);
  };

  if (isLoading) {
    return <p>Loading..</p>;
  }

  if (error) {
    return (
      <p
        style={{
          fontWeight: "bold",
          color: "red",
        }}
      >
        {error + ""}
      </p>
    );
  }

  return (
    <div>
      {!isAuthenticated && (
        <form onSubmit={handleLogin}>
          <label htmlFor="username">Username </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            id="username"
            autoComplete="username"
          />
          <br />
          <br />
          <label htmlFor="password">Password </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            id="password"
            autoComplete="new-password"
          />
          <br />
          <br />
          <button type="submit">Login</button>
        </form>
      )}

      {isAuthenticated && (
        <div>
          <button>You are logged in</button>
          <p>
            <span style={{ fontWeight: "bold" }}>Username: </span>
            {user?.username}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
