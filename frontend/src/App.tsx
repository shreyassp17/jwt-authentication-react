import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = async(e) => {
      e.preventDefault()

        try {
          const response = await fetch('http://localhost:8000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
        // Handle HTTP errors (e.g., 401 Unauthorized, 404 Not Found)
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
        setIsLoggedIn(true)

      }
  
        console.log(response)
        setIsLoggedIn(true)
      }
      catch(err) {
        console.log(err)
        setIsLoggedIn(false)
        }
  }

  return (
    <div>
      {!isLoggedIn && <form onSubmit={handleLogin}>
        <label htmlFor="username">Username </label>
        <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} name="username" id="username" autoComplete='username'/>
        <br />
        <br />
        <label htmlFor="password">Password </label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} name="password" id="password" autoComplete='new-password'/>
        <br />
        <br />
        <button type="submit">Login</button>
        </form>}

      {isLoggedIn && <div>
        <button>Show details</button>
      </div>}
    </div>
  )
}

export default App
