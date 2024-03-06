const baseURL = 'http://127.0.0.1:8080';

export const registerRecruitee = async (userData) => {
    try {
        const response = await fetch(`${baseURL}/usersApp/api/register/recruitee/`, {
            method: 'POST',
            body: userData
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Registering user failed: ", error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        console.log("service loging, see credentials: ", credentials);
        const response = await fetch(`${baseURL}/api/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Login failed: ", error);
        throw error;
    }
};

export const fetchUserProfile = async (token) => {
    try {
        const response = await fetch(`${baseURL}/usersApp/api/user/profile/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}` 
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetching user profile failed: ", error);
        throw error;
    }
};

export const searchCompanies = async (searchTerm) => {
    try {
        const response = await fetch(`${baseURL}/companiesApp/api/companies/?search=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Searching companies failed: ", error);
        throw error;
    }
};

export const searchJobs = async (searchTerm) => {
    try {
        const response = await fetch(`${baseURL}/jobsApp/api/jobs/?search=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Searching jobs failed: ", error);
        throw error;
    }
};

export const fetchAuthenticatedUserSkills = async (token) => {
    try {
        const response = await fetch(`${baseURL}/cv/userskills/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}` 
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetching authenticated user's skills failed: ", error);
        throw error;
    }
};

export const addSkillToUser = async (token, skill) => {
    try {
        const response = await fetch(`${baseURL}/cv/add_user_skill/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
            body: JSON.stringify({ skill_name: skill })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Adding skill to user failed: ", error);
        throw error;
    }
}

export const searchSkills = async (searchTerm) => {
    try {
        const response = await fetch(`${baseURL}/jobsApp/api/search-skills/?search=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Searching skills failed: ", error);
        throw error;
    }
};

export const generateUserCV = async (token) => {
    try {
        const response = await fetch(`${baseURL}/cv/generate_cv/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}` 
            },
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.blob();
    } catch (error) {
        console.error("Generating CV failed: ", error);
        throw error;
    }
}

export const updateUserCV = async (token, blob) => {
    try {

        const file = new File([blob], "cv.pdf", { type: blob.type });

        let formData = new FormData();
        formData.append('cv', file);

        const response = await fetch(`${baseURL}/usersApp/api/user/update_cv/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`
            },
            body: formData  
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Uploading user CV failed: ", error);
        throw error;
    }
};
