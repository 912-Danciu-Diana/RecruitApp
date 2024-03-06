import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const SkillSearchComponent = ({ onClose }) => {
    const { searchedSkills, searchForSkills, addUserSkill } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        await searchForSkills(searchTerm);
    };

    const handleAddSkill = async (skill) => {
        await addUserSkill(skill);
        onClose();
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', background: '#f9f9f9' }}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for skills..."
                style={{ padding: '10px', margin: '10px 0', width: 'calc(100% - 24px)' }}
            />
            <button onClick={handleSearch} style={{ padding: '10px', cursor: 'pointer' }}>Search</button>
            <div>
                {searchedSkills.map((skill, index) => (
                    <div key={index} style={{ margin: '10px 0', cursor: 'pointer' }} onClick={() => handleAddSkill(skill)}>
                        {skill.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillSearchComponent;
