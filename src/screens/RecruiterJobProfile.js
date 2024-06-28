import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/user-profile.css';
import { IoIosLogOut } from "react-icons/io";
import logo from '../assets/logo.png'

const RecruiterJobProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { job } = location.state || {};
    const { profile, getApplicants, applicants, searchForJobsBySkills, jobSkills, getJobSkills, logout } = useContext(AuthContext);

    useEffect(() => {
        if (job) {
            getApplicants(job.id);
            getJobSkills(job.id);
        }
        console.log(applicants);
    }, []);

    const handleSearchJobsBySkills = async () => {
        await searchForJobsBySkills();
        navigate('/search');
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
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

            <header style={{ background: `url(${job.cover_photo}) no-repeat 50% 20% / cover` }}></header>

            <div class="cols__container">
                <div class="left__col">
                    <div class="img__container">
                        <img
                            src={job.profile_pic}
                            alt={`${job.name}'s profile`}

                        />
                        <span></span>
                    </div>
                    <h2>
                        {job.name}
                    </h2>
                    {job.location && <p><strong>Location:</strong> {job.location.city}, {job.location.country}</p>}
                </div>

                <div class="right__col">
                    {job.description && <p><strong>Description:</strong> {job.description}</p>}
                    {job.is_remote && <p><strong>Remote</strong></p>}
                    {jobSkills.length > 0 && (
                        <div>
                            <p><strong>Skills:</strong></p>
                            {jobSkills.map((skill, index) => (
                                <div key={index}>{skill.skill_name}</div>
                            ))}
                        </div>
                    )}
                    {applicants.length > 0 && (
                        <div>
                            <p><strong>Applicants:</strong></p>
                            {applicants.map((applicant, index) => (
                                <div key={index} style={{ cursor: 'pointer' }} onClick={() => navigate('/applicantscreen', { state: { applicant: applicant, job: job } })}>
                                    {applicant.username}
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={() => navigate(`/recruiterprofile`)}>Back</button>
                </div>
            </div>
        </div>
    );
}

export default RecruiterJobProfile;