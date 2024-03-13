import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import loginImg from '../assets/login-img.webp'

const CustomTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#000',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#000',
  }
});

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, profile } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if(profile && 'university' in profile) {
      navigate('/userprofile');
    } else if(profile) {
      navigate('/recruiterprofile');
    }
  }, [profile, navigate]);

  const handleLogin = async () => {
    await login({ username, password });
  };

  const styles = {
    loginContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      overflow: 'clip',
      fontFamily: 'Helvetica'
    },
    formContainer: {
      height: '100%',
      width: '50%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1.2em',
      padding: '0 12%'
    },
    imageContainer: {
      height: '100%',
      width: '50%',
      minWidth: '50%',
      display: 'flex',
      position: 'relative'
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '50%',
      background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
      display: 'block'
    },
    inputContainer: {
      width: "100%",
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: '0.5em'
    },

    input: {
      width: '100%'
    },

    button: {
      width: '100%',
      background: '#000',
      textTransform: 'none',
      marginTop: '1em'
    },

    icon: {
      width: '1.2em',
      height: '1.2em',
      marginBottom: '0.2em'
    },

    registerContainer: {
      marginTop: "2em",
      fontSize: '0.8em',
      display: 'flex',
      gap: '0.8em'
    },

    link: {
      textDecoration: 'none',
      fontWeight: 'bold',
      color: '#000'
    }


  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.formContainer}>
        <h2>Welcome</h2>
        <div style={styles.inputContainer}>
          <PersonIcon style={styles.icon}></PersonIcon>
          <CustomTextField style={styles.input} variant='standard' label='Username' value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div style={styles.inputContainer}>
          <LockIcon style={styles.icon}></LockIcon>
          <CustomTextField style={styles.input} variant='standard' label='Password' type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <Button style={styles.button} variant="contained" onClick={handleLogin}>Login</Button>
        <div style={styles.registerContainer}>
          Don't have an account as a recruitee already?
          <Link to="/register-recruitee" style={styles.link}>Register here</Link>
        </div>
      </div>
      <div style={styles.imageContainer}>
        <img src={loginImg} alt="loginImg" />
        <div style={styles.imageOverlay}></div>
      </div>


    </div>
  );
};

export default LoginScreen;
