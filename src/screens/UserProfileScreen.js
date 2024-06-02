import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import SkillSearchComponent from './SkillSearchComponent';
import '../styles/user-profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { IoIosLogOut } from "react-icons/io";
import logo from '../assets/logo.png'


const UserProfileScreen = () => {
    const { profile, logout, searchForCompanies, searchForJobs, searchForJobsBySkills, authenticatedUserSkills, generateCV, downloadCvURL, addCV } = useContext(AuthContext);
    const navigate = useNavigate();
    const [companySearchTerm, setCompanySearchTerm] = useState('');
    const [jobSearchTerm, setJobSearchTerm] = useState('');
    const [isAddingSkill, setIsAddingSkill] = useState(false);

    const handleAddSkillClick = () => {
        setIsAddingSkill(true);
    };

    const handleCloseSkillSearch = () => {
        setIsAddingSkill(false);
    };

    const handleSearchJobsBySkills = async () => {
        await searchForJobsBySkills();
        navigate('/search');
    }

    const handleSearchJobs = async () => {
        await searchForJobs(jobSearchTerm);
        navigate('/search');
    };

    const handleSearchCompanies = async () => {
        await searchForCompanies(companySearchTerm);
        navigate('/search');
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleGenerateAndDownloadCV = async () => {
        await generateCV();
    }

    const handleAddCV = async (event) => {
        event.preventDefault();
        const fileInput = document.getElementById("cvFile");
        const formData = new FormData();
        if (fileInput.files.length > 0) {
            formData.append('cv', fileInput.files[0]);
            await addCV(formData);
            console.log("CV uploaded successfully");
            window.location.reload()
        } else {
            console.error("No file selected");
        }
    }

    return (
        (profile && (
            <div className='body'>
                <div class="search__nav">
                    <div class="left__container">
                        <img className='logo' onClick={handleSearchJobsBySkills} src={logo} alt="logo" />
                        <img
                            src={`http://127.0.0.1:8080${profile.profile_pic_url}`}
                            alt={`${profile.username}'s profile`}
                            className='me'
                            onClick={() => navigate('/userprofile')}
                        />
                    </div>
                    <div class="right__container">
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={jobSearchTerm}
                            onChange={(e) => setJobSearchTerm(e.target.value)}
                        />
                        <button onClick={handleSearchJobs} type="submit"><FontAwesomeIcon icon={faSearch} /></button>
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={companySearchTerm}
                            onChange={(e) => setCompanySearchTerm(e.target.value)}
                        />
                        <button onClick={handleSearchCompanies} type="submit"><FontAwesomeIcon icon={faSearch} /></button>
                        <IoIosLogOut onClick={handleLogout} className="logout" />
                    </div>
                </div>

                <header style={{ background: `url(${`http://127.0.0.1:8080${profile.cover_photo_url}`}) no-repeat 50% 20% / cover` }}></header>

                <div class="cols__container">
                    <div class="left__col">
                        <div class="img__container">
                            <img
                                src={`http://127.0.0.1:8080${profile.profile_pic_url}`}
                                alt={`${profile.username}'s profile`}
                            />
                            <span></span>
                        </div>
                        <h2>{profile.first_name} {profile.last_name}</h2>
                        {profile.email && <p>{profile.email}</p>}

                        <div class="content">
                            {profile.profile_description && <p><strong>About Me:</strong> {profile.profile_description}</p>}
                        </div>
                    </div>

                    <div class="right__col">
                        {profile.cv_url && (
                            <div><strong>CV:</strong> <a href={`http://127.0.0.1:8080${profile.cv_url}`} target="_blank" rel="noopener noreferrer">View CV</a></div>
                        )}
                        {!profile.cv_url && (
                            <button onClick={handleGenerateAndDownloadCV} >
                                Generate CV
                            </button>
                        )}
                        {downloadCvURL && (
                            <div>
                                <div><strong>Generated CV: </strong><a href={downloadCvURL} download="Your_CV.pdf">Download CV</a></div>
                                <form id="cvForm" onSubmit={handleAddCV}>
                                    <input type="file" id="cvFile" name="cv" accept=".pdf" required />
                                    <input type="submit" value="Upload" />
                                </form>
                            </div>
                        )}
                        {profile.school && <p><strong>School:</strong> {profile.school}</p>}
                        {profile.university && <p><strong>University:</strong> {profile.university}</p>}
                        {profile.work_experience && <p><strong>Work Experience:</strong> {profile.work_experience}</p>}
                        {
                            authenticatedUserSkills.length > 0 &&
                            <div >
                                <p><strong>Skills:</strong></p>
                                {authenticatedUserSkills.map((skill, index) => (
                                    <div key={index}>{skill.skill_name}</div>
                                ))}
                            </div>
                        }
                        {isAddingSkill && <SkillSearchComponent onClose={handleCloseSkillSearch} />}
                        <button onClick={handleAddSkillClick} >Add skill</button>
                    </div>
                </div>

            </div>
        ))
    );
};

export default UserProfileScreen;