import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'
import '../styles/search-screen.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { IoIosLogOut } from "react-icons/io";
import logo from '../assets/logo.png'

const SearchScreen = () => {
    const [companySearchTerm, setCompanySearchTerm] = useState('');
    const [jobSearchTerm, setJobSearchTerm] = useState('');
    const { profile, jobs, companies, searchForCompanies, searchForJobs, logout, searchForJobsBySkills } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSearchJobs = async () => {
        await searchForJobs(jobSearchTerm);
        setJobSearchTerm('');
    };

    const handleSearchCompanies = async () => {
        await searchForCompanies(companySearchTerm);
        setCompanySearchTerm('');
    };

    const handleSearchJobsBySkills = async () => {
        await searchForJobsBySkills();
        navigate('/search');
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className='body'>
            <div className='search__nav'>
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
                        <IoIosLogOut onClick={handleLogout} className="logout"/>
                    </div>
                </div>

            <div className='searchContainer'>
                {companies.map((company, index) => (
                    <div className='container' key={index} onClick={() => navigate(`/companyprofile`, { state: { company } })}>
                        <img src={company.profile_pic} alt={company.name} />
                        <div className='text'>
                            <span className='name'>{company.name}</span>
                            <span className='location'>Location: {company.location.city}, {company.location.country}</span>
                        </div>
                    </div>
                ))}

                {jobs.map((job, index) => (
                    <div className='container' key={index} onClick={() => navigate(`/jobprofile`, { state: { job } })}>
                        <img src={job.profile_pic} alt={job.name} />
                        <div className='text'>
                            <span className='name'>{job.name}</span>
                            <span className='location'>Location: {job.location.city}, {job.location.country}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchScreen;
