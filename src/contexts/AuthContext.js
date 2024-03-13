import React, { createContext, useState, useEffect } from "react";
import { registerRecruitee, loginUser, fetchUserProfile, searchCompanies, searchJobs, fetchAuthenticatedUserSkills, searchSkills, addSkillToUser, generateUserCV, updateUserCV } from "../services/apiService";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [authenticatedUserSkills, setAuthenticatedUserSkills] = useState([]);
  const [searchedSkills, setSearchedSkills] = useState([]);
  const [downloadCvURL, setDownloadCvUrl] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchProfile = async () => {
        try {
          const profileData = await fetchUserProfile(token);
          setProfile(profileData);
          console.log(profileData);
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      };

      const getAuthenticatedUserSkills = async () => {
        try {
          const skills = await fetchAuthenticatedUserSkills(token);
          console.log("fetched skills: ", skills);
          setAuthenticatedUserSkills(skills);
        } catch (error) {
          console.error("Get authenticated user's skills failed:", error);
        }
      }

      fetchProfile();
      getAuthenticatedUserSkills();
    }
  }, [userToken,searchedSkills]);

  const registerRecruiteeUser = async (userData, username, password) => {
    try {
      await registerRecruitee(userData);
      const loginData = { username, password };
      await login(loginData);
    } catch (error) {
      console.error("Error registering user:", error);
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
      // Handle login error, for example by showing an alert to the user
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUserToken(null);
    setProfile(null);
    setAuthenticatedUserSkills([]);
    setDownloadCvUrl('');
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

  return (
    <AuthContext.Provider value={{ userToken, profile, companies, jobs, authenticatedUserSkills, searchedSkills, downloadCvURL, addCV, generateCV, addUserSkill, searchForSkills, registerRecruiteeUser, login, logout, searchForCompanies, searchForJobs, setJobs }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
