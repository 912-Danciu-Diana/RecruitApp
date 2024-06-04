import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Modal from 'react-modal';
import '../styles/applicant-screen.css';
import { IoIosLogOut } from "react-icons/io";
import logo from '../assets/logo.png'

const ApplicantScreen = () => {
    const location = useLocation();
    const { applicant, job } = location.state || {};
    const { logout, profile, applicantSkills, getApplicantSkills, getApplication, acceptOrRejectForQuiz, application, makeQuiz, generateAiQuiz, quiz, quizExists, interviewExists, quizTaken, checkQuizTaken, setQuizTaken, calculateQuizScore, quizScore, acceptOrRejectCandidate } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            if (applicant) {
                getApplicantSkills(applicant.id);
                await getApplication(job.id, applicant.id);
                await interviewExists(job.id, applicant.id);
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [applicant, job]);

    useEffect(() => {
        console.log("application:", application);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleGenerateAiQuiz = () => {
        setIsModalOpen(true);
    }

    const submitAiQuiz = async () => {
        setLoading(true);
        await generateAiQuiz(job.id, applicant.id, topic);
        setLoading(false);
        setIsModalOpen(false);
        window.location.reload();
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!profile) {
        return <div>Loading...</div>;
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
            return <div>
                <button onClick={handleMakeQuiz}>Make a quiz</button>
                <button onClick={handleGenerateAiQuiz}>Ai generated quiz</button>
            </div>;
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
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Provide Topic for AI Generated Quiz"
                    className="Modal"
                    overlayClassName="Overlay"
                >
                    <h2>Provide Topic for AI Quiz</h2>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter topic"
                    />
                    <button onClick={submitAiQuiz} disabled={loading}>
                        {loading ? 'Generating...' : 'Generate Quiz'}
                    </button>
                    <button onClick={() => setIsModalOpen(false)}>Close</button>
                </Modal>
            </div>
        ))
    );
};

export default ApplicantScreen;