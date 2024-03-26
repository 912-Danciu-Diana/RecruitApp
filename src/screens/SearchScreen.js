import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'

const SearchScreen = () => {
    const [companySearchTerm, setCompanySearchTerm] = useState('');
    const [jobSearchTerm, setJobSearchTerm] = useState('');
    const { jobs, companies, searchForCompanies, searchForJobs } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSearchJobs = async () => {
        await searchForJobs(jobSearchTerm);
        setJobSearchTerm('');
    };

    const handleSearchCompanies = async () => {
        await searchForCompanies(companySearchTerm);
        setCompanySearchTerm('');
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
        <div style={itemStyles.all}>
            <input
                type="text"
                placeholder="Search for jobs..."
                value={jobSearchTerm}
                onChange={(e) => setJobSearchTerm(e.target.value)}
                style={itemStyles.input}
            />
            <button onClick={handleSearchJobs} style={itemStyles.button}>Search jobs</button>
            <input
                type="text"
                placeholder="Search for companies..."
                value={companySearchTerm}
                onChange={(e) => setCompanySearchTerm(e.target.value)}
                style={itemStyles.input}
            />
            <button onClick={handleSearchCompanies} style={itemStyles.button}>Search companies</button>

            <div>
                {companies.map((company, index) => (
                    <div key={index} style={itemStyles.container} onClick={() =>  navigate(`/companyprofile`, {state: { company } })}>
                        <img src={company.profile_pic} alt={company.name} style={itemStyles.profilePic} />
                        <div style={itemStyles.textContainer}>
                            <span style={itemStyles.name}>{company.name}</span>
                            <span style={itemStyles.location}>Location: {company.location.city}, {company.location.country}</span>
                        </div>
                    </div>
                ))}

                {jobs.map((job, index) => (
                    <div key={index} style={itemStyles.container} onClick={() => navigate(`/jobprofile`, { state: { job } })}>
                        <img src={job.profile_pic} alt={job.name} style={itemStyles.profilePic} />
                        <div style={itemStyles.textContainer}>
                            <span style={itemStyles.name}>{job.name}</span>
                            <span style={itemStyles.location}>Location: {job.location.city}, {job.location.country}</span>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => navigate(`/userprofile`)} style={itemStyles.button}>Back to my profile</button>
        </div>
    );
};

export default SearchScreen;
