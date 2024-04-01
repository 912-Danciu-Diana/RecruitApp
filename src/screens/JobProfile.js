import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const JobProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { job } = location.state || {};
    const { profile, hasApplied, addApplication, application, getApplication, interviewExists, quiz, checkQuizTaken, quizTaken, setQuizTaken } = useContext(AuthContext);
    const [applicationExists, setApplicationExists] = useState(null);


    useEffect(() => {
        async function fetchData() {
            if (profile && job && job.id && profile.id) {
                const exists = await hasApplied(job.id, profile.id);
                setApplicationExists(exists);
                if (exists) {
                    await getApplication(job.id, profile.id);
                    await interviewExists(job.id, profile.id);
                }
            }
        }
        fetchData();
    }, [job?.id, profile?.id]);

    useEffect(() => {
        async function fetchQuizStatus() {
            if (quiz) {
                await checkQuizTaken(quiz.id);
            } else {
                setQuizTaken(false);
            }
        }
        fetchQuizStatus();
    }, [quiz, quizTaken, checkQuizTaken]);

    const handleAddApplication = async () => {
        try {
            await addApplication(job.id);
            setApplicationExists(true);
        } catch (error) {
            console.error("Error adding application:", error);
        }
    }

    function renderApplicationStatus() {
        if (applicationExists && application && application.length > 0) {
          const currentApplication = application[0];
      
          if (currentApplication.acceptedForQuiz === false) {
            return <p><strong>Application status:</strong> Rejected.</p>;
          }
      
          if (currentApplication.acceptedForQuiz === true && quiz != null && !quizTaken) {
            return <button onClick={() => navigate('/takequiz')}>Take quiz</button>;
          }
      
          if (currentApplication.acceptedForQuiz === true && quiz != null && quizTaken) {
            return <p><strong>Application status: </strong>Quiz taken, score is: .. Waiting for response.</p>;
          }
      
          if (currentApplication.acceptedForQuiz === null || currentApplication.acceptedForQuiz === true) {
            return <p><strong>Application status:</strong> Applied for this job. If accepted, you will receive a quiz to take.</p>;
          }
        }

        if (!applicationExists) {
          return <button onClick={() => handleAddApplication()}>Apply for this job</button>;
        }
    
        return null;
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
            background: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
            color: 'white',
            fontSize: '1em',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        },
        searchContainer: {
            paddingTop: '80px',
        },
    };

    return (
        <div style={profileStyles.container}>
            <img
                src={job.cover_photo}
                alt={`${job.name}'s cover`}
                style={profileStyles.coverPhoto}
            />
            <div style={profileStyles.profileInfo}>
                <img
                    src={job.profile_pic}
                    alt={`${job.name}'s profile`}
                    style={profileStyles.profilePic}
                />
                <h1 style={profileStyles.profileName}>
                    {job.name}
                </h1>
            </div>

            <div style={profileStyles.searchContainer}>
                <div style={profileStyles.section}>
                    {job.company && <p><strong>Company:</strong> {job.company.name}</p>}
                    {job.description && <p><strong>Description:</strong> {job.description}</p>}
                    {job.is_remote && <p><strong>Remote</strong></p>}
                    {job.location && <p><strong>Location:</strong> {job.location.city}, {job.location.country}</p>}
                    {renderApplicationStatus()}
                </div>
                <button style={profileStyles.button} onClick={() => navigate(-1)}>Go back</button>
            </div>
        </div>
    );
}

export default JobProfile;