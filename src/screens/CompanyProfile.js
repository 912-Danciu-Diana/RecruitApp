import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/user-profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { IoIosLogOut } from "react-icons/io";
import logo from '../assets/logo.png'

const CompanyProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { company } = location.state || {};
    const { jobs, searchForJobs, profile, searchForCompanies, searchForJobsBySkills, logout } = useContext(AuthContext);
    const [companySearchTerm, setCompanySearchTerm] = useState('');
    const [jobSearchTerm, setJobSearchTerm] = useState('');

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

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
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

            <header style={{ background: `url(${company.cover_photo}) no-repeat 50% 20% / cover` }}></header>

            <div class="cols__container">
                <div class="left__col">
                    <div class="img__container">
                        <img
                            src={company.profile_pic}
                            alt={`${company.name}'s profile`}

                        />
                        <span></span>
                    </div>
                    <h2>
                        {company.name}
                    </h2>
                    {company.location && <p><strong>Location:</strong> {company.location.city}, {company.location.country}</p>}
                </div>

                <div class="right__col">
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
                    <button onClick={() => navigate(-1)}>Go back</button>
                </div>
            </div>

        </div>
    );
}

export default CompanyProfile;