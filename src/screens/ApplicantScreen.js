import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/UserProfile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

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

        if (currentApplication.accepted) {
            return <p><strong>Application status:</strong> Accepted for job.</p>;
        }

        if (currentApplication.acceptedForQuiz === true && quizExists) {
            if (quizTaken) {
                return <div>
                    <p><strong>Quiz status:</strong> Completed. Score: {quizScore}%</p>
                    <button onClick={() => navigate('/viewtakenquiz', { state: { quiz_id: quiz.id, score: quizScore } })}>View quiz</button>
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

    return (
        (applicant && (
            <div className='body'>
                <header style={{ background: `url(${`http://127.0.0.1:8080${applicant.cover_photo}`}) no-repeat 50% 20% / cover` }}></header>

                <div class="cols__container">
                    <div class="left__col">
                        <div class="img_container">
                            <img
                                src={`http://127.0.0.1:8080${applicant.profile_pic}`}
                                alt={`${applicant.username}'s profile`}
                            />
                            <span></span>
                        </div>
                        <h2>{applicant.first_name} {applicant.last_name}</h2>
                        {applicant.email && <p>{applicant.email}</p>}

                        <div class="content">
                            {applicant.profile_description && <p><strong>About Me:</strong> {applicant.profile_description}</p>}
                        </div>
                    </div>

                    <div class="right__col">
                        {applicant.cv && (
                            <div><strong>CV:</strong> <a href={`http://127.0.0.1:8080${applicant.cv}`} target="_blank" rel="noopener noreferrer">View CV</a></div>
                        )}
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
                        <button onClick={() => navigate('/recruiterjobprofile', { state: { job: job } })}>Back</button>
                    </div>
                </div>                
            </div>
        ))
    );
};

export default ApplicantScreen;
