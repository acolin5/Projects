import React, { createContext, useState } from 'react';
import { Router, Route } from 'expo-router';
import HomePage from './index';
import Register from './register';
import Login from './login';
import Admin from './adminPage';
import Employee from './employeePage';
import Schedule from './schedule';


// Create a UserContext
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route path="/registration" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/adminPage" component={Admin} />
        <Route path="/employeePage" component={Employee} />
        <Route path="/schedule" component={Schedule} />

      </Router>
    </UserProvider>
  );
}

export default App;
