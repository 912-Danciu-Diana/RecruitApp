import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import AuthContextProvider from './contexts/AuthContext';
import RegisterRecruiteeScreen from './screens/RegisterRecruiteeScreen';
import SearchScreen from './screens/SearchScreen';
import JobProfile from './screens/JobProfile';
import CompanyProfile from './screens/CompanyProfile';
import RecruiterProfileScreen from './screens/RecruiterProfileScreen';
import RecruiterJobProfile from './screens/RecruiterJobProfile';
import ApplicantScreen from './screens/ApplicantScreen';
import MakeQuizScreen from './screens/MakeQuizScreen';
import ViewQuiz from './screens/ViewQuiz';
import TakeQuiz from './screens/TakeQuiz';
import ViewTakenQuiz from './screens/ViewTakenQuiz';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/userprofile" element={<UserProfileScreen />} />
          <Route path="/register-recruitee" element={<RegisterRecruiteeScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/jobprofile" element={<JobProfile />} />
          <Route path="/companyprofile" element={<CompanyProfile />} />
          <Route path="/recruiterprofile" element={<RecruiterProfileScreen />} />
          <Route path="/recruiterjobprofile" element={<RecruiterJobProfile />} />
          <Route path="/applicantscreen" element={<ApplicantScreen />} />
          <Route path="/makequizscreen" element={<MakeQuizScreen />} />
          <Route path="/viewquiz" element={<ViewQuiz />} />
          <Route path="/takequiz" element={<TakeQuiz />} />
          <Route path="/viewtakenquiz" element={<ViewTakenQuiz />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;