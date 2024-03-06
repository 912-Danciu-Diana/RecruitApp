import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login({ username, password });
    navigate('/userprofile');
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
    },
    input: {
      margin: '5px',
      padding: '10px',
      border: 'none',
      borderBottom: '2px solid #333', // Assuming a style based on your screenshot
      background: 'transparent',
      outline: 'none',
    },
    button: {
      margin: '10px',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      background: '#333',
      color: 'white',
      fontSize: '1em',
    },
    link: {
      marginTop: '20px',
    },
    linktext: {
      color: 'black',
    }
  };

  return (
    <div style={styles.container}>
      <h2>Welcome</h2>
      <div>
        <input
          style={styles.input}
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
          value={username}
        />
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAO5JREFUSEvVldENwjAMRK+bwCTAJjAJMAlsApsAkwCHEtS6jm0ligSWqvaj9bPPznVA5xg650cUsACwB7B9X3cAVwDH9GzWGAGsAVyULATtEqwIiQBuANiBFoQsrRY8ACU5OXPaWF14gEPS3mJwFnxPDQ9Q0n+cjHM41wKoPQfcbQYszOrC1J8fexLlzvM5IIyRV5T35nPg5fhtANdvleYgK82W8ahZU2rNA1baHg2m2oY25Mjul3SfbZUGsLzHG/jMmyQgYg0eZGIdEkDdaXAtwX8FpfqEBLTIk3NOZJKAZ0vpo2+/eaNWUc39f8ALCDsoGfKFTMgAAAAASUVORK5CYII=" />
      </div>
      <div>
        <input
          style={styles.input}
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          value={password}
          type="password"
        />
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAANNJREFUSEvtld0NwiAUhU830U10EnUSdRLdRDfRTdQvgcTG2x7ANH0pLy0Bznd/odPEo5tYX6WAjaSdJL6Mp6TzZ353BpYA9pIuA0JATmMQB8DiWxJA7Jr+geLRStI6eRRyHABxIJGlWH5M0MOQFw7wSgejfVj/SNbjRZMHYwAE3bqtIifg1ucBkFSSl2velXpepyd+eiNKHokjgS0DyPb7YATIcW0BcKanuQCiMC4hssU1f4j+aTReut7NGvUBVwQvWG03F18VNsg1G9yDU6MV7n0DDfwoGYxA/o8AAAAASUVORK5CYII=" />
      </div>
      <button style={styles.button} onClick={handleLogin}>Login</button>
      <div style={styles.link}>
        Don't have an account as a recruitee already?
        <Link to="/register-recruitee" style={styles.linktext}> Register here</Link>
      </div>
    </div>
  );
};

export default LoginScreen;
