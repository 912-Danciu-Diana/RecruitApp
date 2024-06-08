import React, { useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import '../styles/user-profile.css';
import { IoIosLogOut } from "react-icons/io";
import logo from '../assets/logo.png'

const RecruiterProfileScreen = () => {
    const { profile, jobs, searchForJobs, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function getJobs() {
            if(profile) {
                await searchForJobs(profile.company.name);
            }
        }
        getJobs();
        console.log(profile);
    });

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const itemStyles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            background: '#fff',
            padding: '15px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
        },
        profilePic: {
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            marginRight: '15px',
            objectFit: 'cover',
        },
        textContainer: {
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
        },
        name: {
            fontSize: '1.2em',
            fontWeight: 'bold',
            marginBottom: '5px',
        },
        location: {
            fontSize: '0.9em',
            color: '#666',
        },


    };

    if (!profile) {
        return <div>Loading...</div>; 
    }

    return (
        <div className='body'>
            <div class="search__nav">
                <div class="left__container">
                    <img className='logo' src={logo} alt="logo" />
                    <img
                        src={`http://127.0.0.1:8080${profile.profile_pic_url}`}
                        alt={`${profile.username}'s profile`}
                        className='me'
                        onClick={() => navigate('/recruiterprofile')}
                    />
                </div>
                <div class="right__container">
                    <IoIosLogOut onClick={handleLogout} className="logout" />
                </div>
            </div>
            <header style={{ background: `url(http://127.0.0.1:8080${profile.cover_photo_url}) no-repeat 50% 20% / cover` }}></header>

            <div className="cols__container">
                <div className="left__col">
                    <div class="img__container">
                        <img
                            src={`http://127.0.0.1:8080${profile.profile_pic_url}`}
                            alt={`${profile.name}'s profile`}

                        />
                        <span></span>
                    </div>
                    <h2>
                        {profile.first_name} {profile.last_name}
                    </h2>
                    <p><strong>{profile.company.name}</strong></p>
                    {profile.company.location && <p><strong>Location:</strong> {profile.company.location.city}, {profile.company.location.country}</p>}
                </div>

                <div className="right__col">
                    <p><strong>Jobs:</strong></p>
                    {jobs.map((job, index) => (
                        <div key={index} style={itemStyles.container} onClick={() => navigate('/recruiterjobprofile', { state: { job } })}>
                            <img src={job.profile_pic} alt={job.name} style={itemStyles.profilePic} />
                            <div style={itemStyles.textContainer}>
                                <span style={itemStyles.name}>{job.name}</span>
                                <span style={itemStyles.location}>Location: {job.location.city}, {job.location.country}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default RecruiterProfileScreen;