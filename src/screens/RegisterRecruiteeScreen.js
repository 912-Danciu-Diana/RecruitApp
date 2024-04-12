import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import loginImg from '../assets/login-img.webp'
import Textarea from '@mui/joy/Textarea';

const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#000',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#000',
    }
});

const RegisterRecruiteeScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [profileDescription, setProfileDescription] = useState('');
    const [school, setSchool] = useState('');
    const [university, setUniversity] = useState('');
    const [workExperience, setWorkExperience] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [cv, setCv] = useState(null);
    const hiddenProfilePicInput = useRef(null);
    const hiddenCoverPhotoInput = useRef(null);
    const hiddenCvInput = useRef(null);

    const { registerRecruiteeUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleFileChange = (e, setFile) => {
        setFile(e.target.files[0]);
    };

    const handleRegister = async () => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('password', password);
        if (profileDescription) formData.append('profile_description', profileDescription);
        if (school) formData.append('school', school);
        if (university) formData.append('university', university);
        if (workExperience) formData.append('work_experience', workExperience);
        if (profilePic) formData.append('profile_pic', profilePic);
        if (coverPhoto) formData.append('cover_photo', coverPhoto);
        if (cv) formData.append('cv', cv);
        try {
            await registerRecruiteeUser(formData, username, password);
            navigate('/userprofile');
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const handleProfilePicClick = (event) => {
        hiddenProfilePicInput.current.click();
    };

    const handleCoverPhotoClick = (event) => {
        hiddenCoverPhotoInput.current.click();
    };

    const handleCvClick = (event) => {
        hiddenCvInput.current.click();
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
            padding: '0 12%',
            overflowY: 'auto',
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
        },
    };

    return (
        <div style={styles.loginContainer}>
            <div style={styles.formContainer}>
                <div style={styles.inputContainer}><CustomTextField
                    style={styles.input}
                    variant='standard'
                    label="Username "
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                /></div>
                <div style={styles.inputContainer}><CustomTextField
                    style={styles.input}
                    variant='standard'
                    placeholder="Email *"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    type="email"
                    required
                /></div>
                <div style={styles.inputContainer}><CustomTextField
                    style={styles.input}
                    variant='standard'
                    placeholder="First Name *"
                    onChange={e => setFirstName(e.target.value)}
                    value={firstName}
                    required
                /></div>
                <div style={styles.inputContainer}><CustomTextField
                    style={styles.input}
                    variant='standard'
                    placeholder="Last Name *"
                    onChange={e => setLastName(e.target.value)}
                    value={lastName}
                    required
                /></div>
                <div style={styles.inputContainer}><CustomTextField
                    style={styles.input}
                    variant='standard'
                    placeholder="Password *"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    required
                /></div>
                <div style={styles.inputContainer}><Textarea
                    style={styles.input}
                    placeholder="Profile Description"
                    onChange={e => setProfileDescription(e.target.value)}
                    value={profileDescription}
                /></div>
                <div style={styles.inputContainer}><CustomTextField
                    style={styles.input}
                    variant='standard'
                    placeholder="School"
                    onChange={e => setSchool(e.target.value)}
                    value={school}
                /></div>
                <div style={styles.inputContainer}><CustomTextField
                    style={styles.input}
                    variant='standard'
                    placeholder="University"
                    onChange={e => setUniversity(e.target.value)}
                    value={university}
                /></div>
                <div style={styles.inputContainer}><Textarea
                    style={styles.input}
                    placeholder="Work Experience"
                    onChange={e => setWorkExperience(e.target.value)}
                    value={workExperience}
                /></div>
                <>
                    <Button style={styles.button} variant="contained" onClick={handleProfilePicClick} >
                        Upload a profile pic
                    </Button>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        onChange={e => handleFileChange(e, setProfilePic)}
                        ref={hiddenProfilePicInput}
                    />
                    {profilePic && <p>Uploaded file: {profilePic.name}</p>}
                </>
                <>
                    <Button style={styles.button} variant="contained" onClick={handleCoverPhotoClick} >
                        Upload a cover photo
                    </Button>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        onChange={e => handleFileChange(e, setCoverPhoto)}
                        ref={hiddenCoverPhotoInput}
                    />
                    {coverPhoto && <p>Uploaded file: {coverPhoto.name}</p>}
                </>
                <>
                    <Button style={styles.button} variant="contained" onClick={handleCvClick} >
                        Upload your cv
                    </Button>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        onChange={e => handleFileChange(e, setCv)}
                        ref={hiddenCvInput}
                    />
                    {cv && <p>Uploaded file: {cv.name}</p>}
                </>
                <Button style={styles.button} variant="contained" onClick={handleRegister}>Register</Button>
                <div style={styles.registerContainer}>
                    Already have an account? <Link to="/" style={styles.link}>Login here</Link>
                </div>
            </div>
            <div style={styles.imageContainer}>
                <img src={loginImg} alt="loginImg" />
                <div style={styles.imageOverlay}></div>
            </div>
        </div>
    );
};

export default RegisterRecruiteeScreen;