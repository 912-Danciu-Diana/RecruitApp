import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ApplicantScreen = () => {
    const location = useLocation();
    const { applicant, job } = location.state || {};
    const { applicantSkills, getApplicantSkills, getApplication, acceptOrRejectForQuiz, application, makeQuiz, quiz, quizExists, interviewExists, quizTaken, checkQuizTaken, setQuizTaken, calculateQuizScore, quizScore, acceptOrRejectCandidate } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            getApplicantSkills(applicant.id);
            await getApplication(job.id, applicant.id);
            await interviewExists(job.id, applicant.id);
        }
        fetchData();
    }, [applicant, job]);

    useEffect(() => {
        console.log("application:", application);
    }, [application]);

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

    useEffect(() => {
        if (quiz && quizTaken) {
            calculateQuizScore(quiz.id);
        }
    }, [quiz, quizTaken]);

    const handleAcceptForQuiz = async () => {
        await acceptOrRejectForQuiz(job.id, applicant.id, true);
        window.location.reload();
    }

    const handleRejectForQuiz = async () => {
        await acceptOrRejectForQuiz(job.id, applicant.id, false);
        window.location.reload();
    }

    const handleAcceptCandidate = async () => {
        await acceptOrRejectCandidate(job.id, applicant.id, true);
        window.location.reload();
    }

    const handleRejectCandidate = async () => {
        await acceptOrRejectCandidate(job.id, applicant.id, false);
        window.location.reload();
    }

    const handleMakeQuiz = async () => {
        await makeQuiz(job.id, applicant.id);
        navigate('/makequizscreen')
    }

    const renderApplicationStatus = () => {
        if (!application || application.length === 0) {
            return null;
        }

        const currentApplication = application[0];

        if (currentApplication.acceptedForQuiz === false || currentApplication.accepted === false) {
            return <p><strong>Application status:</strong> Candidate rejected</p>;
        }

        if(currentApplication.accepted) {
            return <p><strong>Application status:</strong> Accepted for job.</p>;
          }

        if (currentApplication.acceptedForQuiz === true && quizExists) {
            if (quizTaken) {
                return <div>
                    <p><strong>Quiz status:</strong> Completed. Score: {quizScore}%</p>
                    <button onClick={() => navigate('/viewtakenquiz', {state: {quiz_id: quiz.id, score: quizScore}})}>View quiz</button>
                    <button onClick={handleAcceptCandidate}>Accept candidate</button>
                    <button onClick={handleRejectCandidate}>Reject candidate</button>
                </div>;
            } else {
                return <button onClick={() => navigate('/viewquiz')}>Quiz sent, view quiz</button>;
            }
        }

        if (currentApplication.acceptedForQuiz === true && !quizExists) {
            return <button onClick={handleMakeQuiz}>Make a quiz</button>;
        }

        return (
            <div>
                <button onClick={handleAcceptForQuiz}>Accept candidate</button>
                <button onClick={handleRejectForQuiz}>Reject candidate</button>
            </div>
        );
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
        (applicant && (
            <div style={profileStyles.container}>
                <img
                    src={`http://127.0.0.1:8080${applicant.cover_photo}`}
                    alt={`${applicant.username}'s cover`}
                    style={profileStyles.coverPhoto}
                />
                <div style={profileStyles.profileInfo}>
                    <img
                        src={`http://127.0.0.1:8080${applicant.profile_pic}`}
                        alt={`${applicant.username}'s profile`}
                        style={profileStyles.profilePic}
                    />
                    <h1 style={profileStyles.profileName}>
                        {applicant.first_name} {applicant.last_name}
                    </h1>
                </div>

                <div style={profileStyles.searchContainer}>

                    <div style={profileStyles.section}>
                        {applicant.cv && (
                            <div><strong>CV:</strong> <a href={`http://127.0.0.1:8080${applicant.cv}`} target="_blank" rel="noopener noreferrer">View CV</a></div>
                        )}
                        {applicant.profile_description && <p><strong>About Me:</strong> {applicant.profile_description}</p>}
                        {applicant.school && <p><strong>School:</strong> {applicant.school}</p>}
                        {applicant.university && <p><strong>University:</strong> {applicant.university}</p>}
                        {applicant.work_experience && <p><strong>Work Experience:</strong> {applicant.work_experience}</p>}
                        {
                            applicantSkills.length > 0 &&
                            <div>
                                <p><strong>Skills:</strong></p>
                                {applicantSkills.map((skill, index) => (
                                    <div key={index}>{skill.skill_name}</div>
                                ))}
                            </div>
                        }

                        <div>
                            {renderApplicationStatus()}
                        </div>

                    </div>
                    <button style={profileStyles.button} onClick={() => navigate('/recruiterjobprofile', { state: { job: job } })}>Back</button>
                </div>
            </div>
        ))
    );
};

export default ApplicantScreen;
