import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './style.css'
export const loginContext = createContext();

const SignIn = () => {
  const navigate = useNavigate();
  const initialState = { Id: "", email: "", password: "" };
  const [loginData, setLoginData] = useState(initialState);
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [loginErrors, setLoginErrors] = useState({});

  useEffect(() => {
    axios
      .get("https://speak-n-chat-default-rtdb.firebaseio.com/register.json")
      .then((response) => {
        let data = Object.values(response.data);
        let list = [];
        data.map((key) => list.push(data));
        setData(data);
        console.log(data, "data response from firebase");
      });
  }, []);

  const handleData = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const checkData = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const itemExist = data.findIndex(
        (item) => item.email === loginData.email
      );
      //console.log(data[itemExist])
      if (itemExist > -1) {
        if (
          data[itemExist].email === loginData.email &&
          data[itemExist].password === loginData.password
        ) {

          setFlag(true);
       
          alert("You are logged in successfully");
        //   dispatch(editForm(data[itemExist]))
          setLoginData(initialState);
          navigate("/mainPage");
          console.log(flag, "flag");
        } else {
          alert("Password Wrong, please enter correct password");
        }
      } else {
        alert("You are new user so, register please");
      }
    }
    //console.log(flag,'flag')
  };
  const hideErrors = (event) => {
    setLoginErrors({
      ...loginErrors,
      [event.target.name]: "",
    });
  };

  const checkErrors = (event) => {
    if (event.target.value === "") {
      setLoginErrors({
        ...loginErrors,
        [event.target.name]: "Enter " + event.target.name,
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};
    if (loginData.email === "") {
      errors.email = "Enter email to login";
      isValid = false;
    }
    if (loginData.password === "") {
      errors.password = "Enter password to login";
      isValid = false;
    }
    setLoginErrors(errors);
    return isValid;
  };
//   console.log(myId,'outside')

  return (
    <React.Fragment>
      
      <main class="main-container">
       <div class="login-container">
         <form class="login-form" onSubmit={checkData}>
           <div class="login-title">Login Page</div>
           <div class="input-container">
             <input
               type="text"
               class={`login-input login_page_username ${loginErrors?.email && 'border border-danger'}`}
               placeholder="Username or Email"
               onChange={handleData}
               onFocus={hideErrors}
               onBlur={checkErrors}
               value={loginData.email}
               name="email"
             />
             {loginErrors.email ? (
               <small class="login-error">{loginErrors.email}</small>
             ) : null}
           </div>
           <div class="input-container">
             <input
               type="password"
               class={`login-input login_page_username ${loginErrors?.password && 'border border-danger'}`}
               placeholder="Password"
               onChange={handleData}
               onFocus={hideErrors}
               onBlur={checkErrors}
               value={loginData.password}
               name="password"
             />
             {loginErrors.password ? (
               <small class="login-error">{loginErrors.password}</small>
             ) : null}
           </div>
           <div class="login-options">
             <div class="login-remember">
               <input type="checkbox" id="remember" />
               <label for="remember" class="login_page_rememberMe">Remember me</label>
             </div>
             <label class="login-forgot">Forgot Password?</label>
           </div>
           <input type="submit" class="login-submit" value="Login" />
         </form>
         <p>
           "Don't have an account?"
           <Link to="/SignUp"><button type="button" class="signup-button">Sign Up</button></Link>
         </p>
       </div>
      </main>


    </React.Fragment>
  );
};

export default SignIn;
