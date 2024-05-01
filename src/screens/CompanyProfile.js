import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const CompanyProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { company } = location.state || {};
    const { jobs, searchForJobs, profile } = useContext(AuthContext);

    useEffect(() => {
        async function getJobs() {
            await searchForJobs(company.name);
        }
        getJobs();
    });

    const handleJobNavigation = (job) => {
        if ('university' in profile) {
            navigate(`/jobprofile`, { state: { job } });
        } else {
            navigate('/recruiterjobprofile', { state: { job } })
        }
    }

    const handleBackNavigation = () => {
        if ('university' in profile) {
            navigate(`/search`);
        } else {
            navigate(`/recruiterprofile`)
        }
    }

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
            marginBottom: '20px',
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

    const itemStyles = {
        all: {
            background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
            height: '100vh',
            padding: '20px',
        },
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
    };

    return (
        <div style={profileStyles.container}>
            <img
                src={company.cover_photo}
                alt={`${company.name}'s cover`}
                style={profileStyles.coverPhoto}
            />
            <div style={profileStyles.profileInfo}>
                <img
                    src={company.profile_pic}
                    alt={`${company.name}'s profile`}
                    style={profileStyles.profilePic}
                />
                <h1 style={profileStyles.profileName}>
                    {company.name}
                </h1>
            </div>

            <div style={profileStyles.searchContainer}>
                <div style={profileStyles.section}>
                    {company.location && <p><strong>Location:</strong> {company.location.city}, {company.location.country}</p>}
                </div>
                <div style={profileStyles.section}>
                    <p><strong>Jobs:</strong></p>
                    {jobs.map((job, index) => (
                        <div key={index} style={itemStyles.container} onClick={() => handleJobNavigation(job)}>
                            <img src={job.profile_pic} alt={job.name} style={itemStyles.profilePic} />
                            <div style={itemStyles.textContainer}>
                                <span style={itemStyles.name}>{job.name}</span>
                                <span style={itemStyles.location}>Location: {job.location.city}, {job.location.country}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => handleBackNavigation()} style={profileStyles.button}>Back</button>
            </div>
        </div>
    );
}

export default CompanyProfile;