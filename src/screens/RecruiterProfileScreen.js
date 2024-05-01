import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";


const RecruiterProfileScreen = () => {
    const { profile, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const profileStyles = {
        container: {
            textAlign: 'center',
            position: 'relative',
            background: 'linear-gradient(to bottom, #ffffff 0%,#f0f4f7 100%)',
            padding: '20px',
            minHeight: '100vh',
        },
        coverPhoto: {
            width: '100%',
            height: '150px',
            borderRadius: '15px',
            marginBottom: '50px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
        profileInfo: {
            position: 'absolute',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '20px',
            zIndex: 1,
        },
        profilePic: {
            width: '120px',
            height: '120px',
            borderRadius: '60px',
            border: '5px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        profileName: {
            margin: '10px 0',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#333',
        },
        section: {
            background: '#fff',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            margin: '10px 0',
            textAlign: 'left',
            cursor: 'pointer',
        },
        input: {
            margin: '5px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            width: 'calc(100% - 22px)', 
            marginBottom: '20px',
        },
        button: {
            margin: '10px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            background: '#000',
            color: 'white',
            fontSize: '1em',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        },
        searchContainer: {
            paddingTop: '80px',
        },
    };

    return (
        (profile && (
            <div style={profileStyles.container}>
            <img
                src={`http://127.0.0.1:8080${profile.cover_photo_url}`}
                alt={`${profile.username}'s cover`}
                style={profileStyles.coverPhoto}
            />
            <div style={profileStyles.profileInfo}>
                <img
                    src={`http://127.0.0.1:8080${profile.profile_pic_url}`}
                    alt={`${profile.username}'s profile`}
                    style={profileStyles.profilePic}
                />
                <h1 style={profileStyles.profileName}>
                    {profile.first_name} {profile.last_name}
                </h1>
            </div>

            <div style={profileStyles.searchContainer}>
                <div style={profileStyles.section} onClick={() =>  navigate(`/companyprofile`, {state: { company: profile.company } })}>
                    {profile.company && <p><strong>Company:</strong> {profile.company.name }</p>}
                </div>
                <button onClick={handleLogout} style={profileStyles.button}>Logout</button>
            </div>
        </div>
        ))
    );
}

export default RecruiterProfileScreen;