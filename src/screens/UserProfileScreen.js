import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import SkillSearchComponent from './SkillSearchComponent';

const UserProfileScreen = () => {
    const { profile, userToken, logout, searchForCompanies, searchForJobs, authenticatedUserSkills, generateCV, downloadCvURL, addCV } = useContext(AuthContext);
    const navigate = useNavigate();
    const [companySearchTerm, setCompanySearchTerm] = useState('');
    const [jobSearchTerm, setJobSearchTerm] = useState('');
    const [isAddingSkill, setIsAddingSkill] = useState(false);

    useEffect(() => {
        if (!userToken) {
            navigate("/");
        }
    });

    const handleAddSkillClick = () => {
        setIsAddingSkill(true);
    };

    const handleCloseSkillSearch = () => {
        setIsAddingSkill(false);
    };

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
        if(fileInput.files.length > 0) {
            formData.append('cv', fileInput.files[0]);
            await addCV(formData);
            console.log("CV uploaded successfully");
            window.location.reload()
        } else {
            console.error("No file selected");
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
            width: 'calc(100% - 22px)', // Adjust based on padding + border
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
                <input
                    type="text"
                    placeholder="Search for jobs..."
                    value={jobSearchTerm}
                    onChange={(e) => setJobSearchTerm(e.target.value)}
                    style={profileStyles.input}
                />
                <button onClick={handleSearchJobs} style={profileStyles.button}>Search Jobs</button>
                <input
                    type="text"
                    placeholder="Search for companies..."
                    value={companySearchTerm}
                    onChange={(e) => setCompanySearchTerm(e.target.value)}
                    style={profileStyles.input}
                />
                <button onClick={handleSearchCompanies} style={profileStyles.button}>Search Companies</button>

                <div style={profileStyles.section}>
                    {profile.cv_url && (
                        <div><strong>CV:</strong> <a href={`http://127.0.0.1:8080${profile.cv_url}`} target="_blank" rel="noopener noreferrer">View CV</a></div>
                    )}
                    {!profile.cv_url && (
                        <button onClick={handleGenerateAndDownloadCV} style={profileStyles.button}>
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
                    {profile.profile_description && <p><strong>About Me:</strong> {profile.profile_description}</p>}
                    {profile.school && <p><strong>School:</strong> {profile.school}</p>}
                    {profile.university && <p><strong>University:</strong> {profile.university}</p>}
                    {profile.work_experience && <p><strong>Work Experience:</strong> {profile.work_experience}</p>}
                    {profile.company && <p><strong>Company:</strong> {profile.company}</p>}
                    {
                        authenticatedUserSkills &&
                        <div style={profileStyles.section}>
                            <p><strong>Skills:</strong></p>
                            {authenticatedUserSkills.map((skill, index) => (
                                <div key={index}>{skill.skill_name}</div>
                            ))}
                        </div>
                    }
                    {isAddingSkill && <SkillSearchComponent onClose={handleCloseSkillSearch} />}
                    <button onClick={handleAddSkillClick} style={profileStyles.button}>Add skill</button>
                </div>
                <button onClick={handleLogout} style={profileStyles.button}>Logout</button>
            </div>
        </div>
        ))
    );
};

export default UserProfileScreen;
