import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import AuthContextProvider from './contexts/AuthContext';
import RegisterRecruiteeScreen from './screens/RegisterRecruiteeScreen';
import SearchScreen from './screens/SearchScreen';
import JobProfile from './screens/JobProfile';
import CompanyProfile from './screens/CompanyProfile';

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
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
