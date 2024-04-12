import React, { createContext, useState, useEffect } from "react";
import { registerRecruitee, loginUser, fetchUserProfile, searchCompanies, searchJobs, fetchAuthenticatedUserSkills, searchSkills, addSkillToUser, generateUserCV, updateUserCV, applyForJob, findApplication, getApplicationForJob, getApplicantsForJob, fetchUserSkills, acceptOrRejectApplicantForQuiz, postQuiz, postQuestion, postQuizQuestion, postAnswer, checkInterviewExists, getInterview, postUsersAnswer, checkIfQuizTaken, calculateScore, getQuizDetails, acceptOrRejectApplicant } from "../services/apiService";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [authenticatedUserSkills, setAuthenticatedUserSkills] = useState([]);
  const [searchedSkills, setSearchedSkills] = useState([]);
  const [downloadCvURL, setDownloadCvUrl] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [applicantSkills, setApplicantSkills] = useState([]);
  const [application, setApplication] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [quizExists, setQuizExists] = useState(false);
  const [quizTaken, setQuizTaken] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDetails, setQuizDetails] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchProfile = async () => {
        try {
          const profileData = await fetchUserProfile(token);
          setProfile(profileData);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      const getAuthenticatedUserSkills = async () => {
        try {
          const skills = await fetchAuthenticatedUserSkills(token);
          setAuthenticatedUserSkills(skills);
        } catch (error) {
          console.error("Get authenticated user's skills failed:", error);
        }
      }

      fetchProfile();
      getAuthenticatedUserSkills();
    }
  }, [userToken, searchedSkills]);

  const registerRecruiteeUser = async (userData, username, password) => {
    try {
      await registerRecruitee(userData);
      const loginData = { username, password };
      await login(loginData);
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      console.log("Login started with credentials:", credentials);
      const response = await loginUser(credentials);
      const token = response.token;
      localStorage.setItem('token', token);
      setUserToken(token);
      console.log("Login successful with token:", token);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserToken(null);
    setProfile(null);
    setAuthenticatedUserSkills([]);
    setDownloadCvUrl('');
    setApplicants([]);
    setQuiz(null);
    setQuizExists(false);
    setQuizTaken(false);
    setQuizScore(0);
    console.log("logged out");
  };

  const searchForCompanies = async (searchTerm) => {
    try {
      const foundCompanies = await searchCompanies(searchTerm);
      setCompanies(foundCompanies);
      setJobs([]);
    } catch (error) {
      console.error("Search for companies failed:", error);
      // Handle the error appropriately
    }
  }

  const searchForJobs = async (searchTerm) => {
    try {
      const foundJobs = await searchJobs(searchTerm);
      setJobs(foundJobs);
      setCompanies([]);
    } catch (error) {
      console.error("Search for jobs failed:", error);
      // Handle the error appropriately
    }
  }

  const searchForSkills = async (searchTerm) => {
    try {
      const skills = await searchSkills(searchTerm);
      console.log("the searched skills are:", skills);
      setSearchedSkills(skills);
    } catch (error) {
      console.error("Search for skills failed:", error);
      // Handle the error appropriately
    }
  }

  const addUserSkill = async (skill) => {
    try {
      const token = localStorage.getItem('token');
      console.log(skill);
      await addSkillToUser(token, skill.name);
      console.log(`added skill ${skill} to logged user`);
      setSearchedSkills([]);
    } catch (error) {
      console.error("Adding skill to user failed:", error);
    }
  }

  const generateCV = async () => {
    try {
      const token = localStorage.getItem('token');
      const blob = await generateUserCV(token);
      const downloadURL = window.URL.createObjectURL(blob);
      setDownloadCvUrl(downloadURL);
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadURL);
      }, 60000);
    } catch (error) {
      console.error("Generating CV failed:", error);
    }
  }

  const addCV = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      await updateUserCV(token, formData);
      console.log("CV added successfully.");
    } catch (error) {
      console.error("Adding CV failed:", error);
    }
  }

  const addApplication = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await applyForJob(token, jobId);
      console.log("Application successfull!");
    } catch (error) {
      console.error("Adding application failed:", error);
    }
  }

  const hasApplied = async (jobId, userId) => {
    try {
      const response = await findApplication(jobId, userId);
      console.log("Check if application exists successfull!");
      return response.exists;
    } catch (error) {
      console.error("Checking if application exists failed:", error);
    }
  }

  const getApplication = async (jobId, userId) => {
    try {
      const response = await getApplicationForJob(jobId, userId);
      console.log("Get application successfull!");
      setApplication(response);
      console.log(response);
    } catch (error) {
      console.error("Getting application failed:", error);
    }
  }

  const getApplicants = async (jobId) => {
    try {
      const applicantsForJob = await getApplicantsForJob(jobId);
      setApplicants(applicantsForJob);
      console.log("Get applicants for job successful!");
    } catch (error) {
      console.error("Getting applicants for job failed:", error);
    }
  }

  const getApplicantSkills = async (applicantId) => {
    try {
      const response = await fetchUserSkills(applicantId);
      setApplicantSkills(response);
    } catch (error) {
      console.error("Getting applicant's skills failed:", error);
    }
  }

  const acceptOrRejectForQuiz = async (jobId, applicantId, flag) => {
    try {
      const token = localStorage.getItem('token');
      const updatedApplication = await acceptOrRejectApplicantForQuiz(token, jobId, applicantId, flag);
      setApplication(updatedApplication); 
      console.log("Accept for quiz successful", updatedApplication);
    } catch (error) {
      console.error("Accept candidate for quiz failed:", error);
    }
  };

  const acceptOrRejectCandidate = async (jobId, applicantId, flag) => {
    try {
      const token = localStorage.getItem('token');
      const updatedApplication = await acceptOrRejectApplicant(token, jobId, applicantId, flag);
      setApplication(updatedApplication); 
      console.log("Accept applicant successful", updatedApplication);
    } catch (error) {
      console.error("Accept applicant failed:", error);
    }
  };

  const makeQuiz = async (jobId, applicantId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await postQuiz(token, jobId, applicantId);
      setQuiz(response);
      console.log("Make quiz successful", quiz);
    } catch (error) {
      console.error("Make quiz failed:", error);
    }
  }

  const addQuestion = async(question) => {
    try {
      const response = await postQuestion(question);
      console.log("Add question successful");
      return response;
    } catch (error) {
      console.error("Add question failed:", error);
    }
  }

  const addQuizQuestion = async(quizInterview, question) => {
    try {
      await postQuizQuestion(quizInterview, question);
      console.log("Add quiz question successful");
    } catch (error) {
      console.error("Add quiz question failed:", error);
    }
  }

  const addAnswer = async(answer, flag, question) => {
    try {
      await postAnswer(answer, flag, question);
      console.log("Add answer successful");
    } catch (error) {
      console.error("Add answer failed:", error);
    }
  }

  const interviewExists = async(job, recruitee) => {
    try {
      const response = await checkInterviewExists(job, recruitee);
      console.log("check if interview exists");
      console.log(response);
      setQuizExists(response.exists);
      if(response.exists) {
        const interview = await getInterview(response.interview_id);
        setQuiz(interview);
      } else {
        setQuiz(null);
      }
    } catch (error) {
      console.error("Check interview exists failed:", error);
    }
  }

  const addUsersAnswer = async(quizquestion, answer, flag) => {
    try {
      const response = await postUsersAnswer(quizquestion, answer, flag);
      console.log(response);
    } catch (error) {
      console.error("Add users answer failed:", error);
    }
  }

  const checkQuizTaken = async() => {
    try {
      console.log("checking if quiz taken");
      console.log(quiz);
      if(quiz) {
        const response = await checkIfQuizTaken(quiz.id);
        setQuizTaken(response.interview_taken);
        console.log(response);
      } else {
        setQuizTaken(false);
      }
    } catch(error) {
      console.error("Checking if quiz was taken failed: ", error);
    }
  }

  const calculateQuizScore = async(quiz_id) => {
    try {
     const response = await calculateScore(quiz_id);
     setQuizScore(response.score_percentage);
    } catch(error) {
      console.error("Calculating the quiz score failed: ", error);
    }
  }

  const quizDetailsFunc = async(quiz_id) => {
    try {
      const response = await getQuizDetails(quiz_id);
      setQuizDetails(response);
     } catch(error) {
       console.error("Getting quiz details failed: ", error);
     }
  }

  return (
    <AuthContext.Provider value={{ userToken, profile, companies, jobs, authenticatedUserSkills, searchedSkills, downloadCvURL, applicants, applicantSkills, application, quiz, quizExists, quizTaken, quizScore, quizDetails, acceptOrRejectCandidate, quizDetailsFunc, calculateQuizScore, setQuizTaken, checkQuizTaken, addUsersAnswer, interviewExists, addQuestion, addQuizQuestion, addAnswer, makeQuiz, acceptOrRejectForQuiz, getApplicantSkills, getApplicants, getApplication, hasApplied, addApplication, addCV, generateCV, addUserSkill, searchForSkills, registerRecruiteeUser, login, logout, searchForCompanies, searchForJobs, setJobs }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
