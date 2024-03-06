import React, { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

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
            // You might want to handle this error by displaying an error message to the user
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
            borderBottom: '2px solid #333',
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
        },
        fileInput: {
            cursor: 'pointer',
            padding: '10px 20px',
            border: '2px solid #333',
            borderRadius: '5px',
            background: 'transparent',
            fontWeight: 'bold',
            textAlign: 'center',
            transition: 'background-color 0.3s',
            marginTop: '5px',
        },
    };

    return (
        <div style={styles.container}>
            <input
                style={styles.input}
                placeholder="Username *"
                onChange={e => setUsername(e.target.value)}
                value={username}
                required
            />
            <input
                style={styles.input}
                placeholder="Email *"
                onChange={e => setEmail(e.target.value)}
                value={email}
                type="email"
                required
            />
            <input
                style={styles.input}
                placeholder="First Name *"
                onChange={e => setFirstName(e.target.value)}
                value={firstName}
                required
            />
            <input
                style={styles.input}
                placeholder="Last Name *"
                onChange={e => setLastName(e.target.value)}
                value={lastName}
                required
            />
            <input
                style={styles.input}
                placeholder="Password *"
                onChange={e => setPassword(e.target.value)}
                value={password}
                type="password"
                required
            />
            <textarea
                style={styles.input}
                placeholder="Profile Description"
                onChange={e => setProfileDescription(e.target.value)}
                value={profileDescription}
            />
            <input
                style={styles.input}
                placeholder="School"
                onChange={e => setSchool(e.target.value)}
                value={school}
            />
            <input
                style={styles.input}
                placeholder="University"
                onChange={e => setUniversity(e.target.value)}
                value={university}
            />
            <textarea
                style={styles.input}
                placeholder="Work Experience"
                onChange={e => setWorkExperience(e.target.value)}
                value={workExperience}
            />
            <>
                <button className="button-upload" onClick={handleProfilePicClick} style={styles.fileInput}>
                    Upload a profile pic
                </button>
                <input
                    style={{ display: "none" }}
                    type="file"
                    onChange={e => handleFileChange(e, setProfilePic)}
                    ref={hiddenProfilePicInput}
                />
                {profilePic && <p>Uploaded file: {profilePic.name}</p>}
            </>
            <>
                <button className="button-upload" onClick={handleCoverPhotoClick} style={styles.fileInput}>
                    Upload a cover photo
                </button>
                <input
                    style={{ display: "none" }}
                    type="file"
                    onChange={e => handleFileChange(e, setCoverPhoto)}
                    ref={hiddenCoverPhotoInput}
                />
                {coverPhoto && <p>Uploaded file: {coverPhoto.name}</p>}
            </>
            <>
                <button className="button-upload" onClick={handleCvClick} style={styles.fileInput}>
                    Upload your cv
                </button>
                <input
                    style={{ display: "none" }}
                    type="file"
                    onChange={e => handleFileChange(e, setCv)}
                    ref={hiddenCvInput}
                />
                {cv && <p>Uploaded file: {cv.name}</p>}
            </>
            <button style={styles.button} onClick={handleRegister}>Register</button>
            <div style={styles.link}>
                Already have an account? <Link to="/" style={styles.linktext}>Login here</Link>
            </div>
        </div>
    );
};

export default RegisterRecruiteeScreen;
