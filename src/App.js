import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import React from 'react'
import MainPage from './Components/MainPage/index'
import UserPage from "./Components/UserPage"
import SignIn from './Components/SignIn'
import SignUp from './Components/SignUp'

const App = () => {
//   window.addEventListener('unload', function(event) {
//     // Clear userInfo from local storage
//     localStorage.removeItem('userInfo');
//     // Optionally, you can also prompt the user before clearing the storage
//     // event.returnValue = 'Are you sure you want to leave? Your data will be lost.';
// });
  return (
    <Router>
    <Routes>
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/mainPage" element={<MainPage />} />
      {/* <Route path="/user" element={<UserPage />} /> */}
      <Route path="/user/:userId" element={<UserPage />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
    </Router>
  )
}

export default App
