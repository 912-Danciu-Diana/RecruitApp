const baseURL = 'http://127.0.0.1:8080';

export const registerRecruitee = async (userData) => {
    try {
        const response = await fetch(`${baseURL}/usersApp/api/register/recruitee/`, {
            method: 'POST',
            body: userData
        });
        if (!response.ok) {
            const errorBody = await response.json();
            if(errorBody.username == "A user with that username already exists." || errorBody.email == "user with this email already exists.") {
                throw new Error("User with the same email or username already exists!");
            }
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

export const getJobsBySkills = async (token) => {
    try {
        const response = await fetch(`${baseURL}/jobsApp/api/search_jobs/`, {
            method: 'GET',
            headers: {
                'Authorization': `Token ${token}`
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Getting jobs by skills failed: ", error);
        throw error;
    }
}

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
        console.log(response);
        return await response.blob();
    } catch (error) {
        console.error("Generating CV failed: ", error);
        throw error;
    }
}

export const updateUserCV = async (token, formData) => {
    try {
        const response = await fetch(`${baseURL}/usersApp/api/user/update_cv/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`
            },
            body: formData,  
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

export const applyForJob = async(token, jobId) => {
    try {
        const response = await fetch(`${baseURL}/jobsApp/api/add_application/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({job: jobId}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Applying to job failed: ", error);
        throw error;
    }
}

export const findApplication = async(jobId, userId) => {
    try {
        const response = await fetch(`${baseURL}/jobsApp/api/find_application/?job=${jobId}&user=${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Finding application failed: ", error);
        throw error;
    }
}

export const getApplicationForJob = async(jobId, userId) => {
    try {
        const response = await fetch(`${baseURL}/jobsApp/api/get_application/?job=${jobId}&user=${userId}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Data received:', data);
        return data;
    } catch (error) {
        console.error("Getting application failed: ", error);
        throw error;
    }
}

export const getApplicantsForJob = async(jobId) => {
    try {
        const response = await fetch(`${baseURL}/jobsApp/api/get_job_applicants/?job=${jobId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Getting applicants for job failed: ", error);
        throw error;
    }
}

export const fetchUserSkills = async (userId) => {
    try {
        const response = await fetch(`${baseURL}/cv/userskillsunauthenticated/?recruitee=${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetching user's skills failed: ", error);
        throw error;
    }
}

export const acceptOrRejectApplicantForQuiz = async (token, jobId, applicantId, flag) => {
    try {
        const response = await fetch(`${baseURL}/jobsApp/api/update_application/?job=${jobId}&user=${applicantId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({acceptedForQuiz: flag}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error("Accept candidate for quiz failed:", error);
        throw error;
    }
}

export const acceptOrRejectApplicant = async (token, jobId, applicantId, flag) => {
    try {
        const response = await fetch(`${baseURL}/jobsApp/api/update_application/?job=${jobId}&user=${applicantId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({accepted: flag}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error("Accept candidate failed:", error);
        throw error;
    }
}

export const postQuiz = async(token, jobId, applicantId) => {
    try {
        const response = await fetch(`${baseURL}/jobsApp/api/make_quiz/?job=${jobId}&recruitee=${applicantId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error("Posting quiz failed:", error);
        throw error;
    }
}

export const postAIGeneratedQuiz = async(token, jobId, applicantId, topic) => {
    try {
        const response = await fetch(`${baseURL}/interviewsApp/api/generate_quiz/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({job: jobId, recruitee: applicantId, topic: topic}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error("Generating ai quiz failed:", error);
        throw error;
    }
}

export const postQuestion = async(question) => {
    try {
        const response = await fetch(`${baseURL}/interviewsApp/api/questions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({question: question}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error("Posting question failed:", error);
        throw error;
    }
}

export const postQuizQuestion = async(quizInterview, question) => {
    try {
        const response = await fetch(`${baseURL}/interviewsApp/api/quizquestions/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({quiz_interview: quizInterview, question_id: question}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error("Posting quiz question failed:", error);
        throw error;
    }
}

export const postAnswer = async(answer, flag, question) => {
    try {
        const response = await fetch(`${baseURL}/interviewsApp/api/answers/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({answer: answer, is_correct: flag, question: question}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error("Posting answer failed:", error);
        throw error;
    }
}

export const checkInterviewExists = async(job, recruitee) => {
    try {
        const response = await fetch(`${baseURL}/interviewsApp/api/check_interview_exists/?job=${job}&recruitee=${recruitee}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error("Check interview exists failed:", error);
        throw error;
    }
}

export const getInterview = async(interview) => {
    try {
        const response = await fetch(`${baseURL}/interviewsApp/api/interviews/${interview}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error("Get interview failed:", error);
        throw error;
    }
}

export const postUsersAnswer = async(quizquestion, answer, flag) => {
    try {
        const response = await fetch(`${baseURL}/interviewsApp/api/users_answer/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({quiz_question: quizquestion, answer: answer, is_correct: flag}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Post users answer failed: ", error);
        throw error;
    }
}

export const checkIfQuizTaken = async (interviewId) => {
    try {
        const response = await fetch(`${baseURL}/interviewsApp/api/check_quiz_taken/${interviewId}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Checking if quiz was taken failed: ", error);
        throw error;
    }
};

export const calculateScore = async (quiz_id) => {
    try {
        const response = await fetch(`${baseURL}/interviewsApp/api/calculate_quiz_score/${quiz_id}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Calculating the quiz score failed: ", error);
        throw error;
    }
}

export const getQuizDetails = async (quiz_id) => {
    try {
        const response = await fetch(`${baseURL}/interviewsApp/api/quiz_details/${quiz_id}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Getting quiz details failed: ", error);
        throw error;
    }
}

export const generateProfileFromCV = async (file) => {
    try {
        const response = await fetch(`${baseURL}/usersApp/api/user/generate_profile/`, {
            method: 'POST',
            body: file,  
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Generating profile from CV failed: ", error);
        throw error;
    }
}

export const getSkillsForJob = async (jobId) => {
    try {
        const response = await fetch(`${baseURL}/jobsApp/api/jobskills`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const filteredSkills = data.filter(item => item.job === jobId);
        
        return filteredSkills; 
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

export const chat_with_ai = async(message) => {
    try {
        const response = await fetch(`http://localhost:5000/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: message}),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error("Chatbot failed:", error);
        throw error;
    }
}