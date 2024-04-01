import React, { createContext, useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import speakNchatLogo from '../Images/Frame 63.png'
import speakNchatTextLogo from '../Images/Frame 64.png'
import './index.css'
 
export const loginContext = createContext();
 
const SignUp = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmpassword: '',
  });
  const [errors, setErrors] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    confirmpassword: '',
  });
 
  const { firstname, lastname, email, phone, password, confirmpassword } = data;
 
  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Reset error when input changes
  };
 
  const submitHandler = (e) => {
    e.preventDefault();
 
    let formValid = true;
    const newErrors = { ...errors };
 
    // Check for empty fields
    if (firstname.trim() === '') {
      newErrors.firstname = 'Please enter your first name';
      formValid = false;
    }
 
    if (lastname.trim() === '') {
      newErrors.lastname = 'Please enter your last name';
      formValid = false;
    }
 
    if (email.trim() === '') {
      newErrors.email = 'Please enter your email';
      formValid = false;
    }
 
    if (phone.trim() === '') {
      newErrors.phone = 'Please enter your phone number';
      formValid = false;
    }
 
    if (password.trim() === '') {
      newErrors.password = 'Please enter your password';
      formValid = false;
    } else if (!isPasswordValid(password)) {
      newErrors.password =
        'Password must be at least 8 characters long and contain at least 1 character, 1 symbol, and 1 number';
      formValid = false;
    }
 
    if (confirmpassword.trim() === '') {
      newErrors.confirmpassword = 'Please confirm your password';
      formValid = false;
    } else if (password !== confirmpassword) {
      newErrors.confirmpassword = 'Passwords do not match';
      formValid = false;
    }
 
    if (!formValid) {
      setErrors(newErrors);
      return; // Don't proceed with submission if form is invalid
    }
 
    // Proceed with form submission if all fields are filled
    axios.get('https://speak-n-chat-default-rtdb.firebaseio.com/register.json')
      .then(response => {
        const registeredUsers = response.data;
        for (const key in registeredUsers) {
          if (registeredUsers[key].email === email) {
            newErrors.email = 'Email already exists';
            formValid = false;
          }
           if (registeredUsers[key].phone === phone){
            newErrors.phone = 'phone already exists';
            formValid = false;
           }
        }
 
        if (!formValid) {
          setErrors(newErrors);
          return; // Don't proceed with submission if email already exists
        }
 
        // Proceed with form submission if all fields are filled and email is unique
        axios
          .post('https://speak-n-chat-default-rtdb.firebaseio.com/register.json', data)
          .then(() => {
            // alert('Submitted Successfully');
            setData({ firstname: '',
            lastname: '',
            email: '',
            phone: '',
            password: '',
            confirmpassword: '',})
            navigate('/login');
          })
          .catch(error => console.error('Error submitting form:', error));
      })
      .catch(error => console.error('Error fetching registered users:', error));
  };

 
  const isPasswordValid = (password) => {
    // Password must be at least 8 characters long and contain at least 1 character, 1 symbol, and 1 number
    return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };
 
  return (
    <main>
    <div className="signup-page">
      <div className="logo-container">
          <img className="speakNchatLogo" src={speakNchatLogo} alt="speak-n-chat-logo" />
          {/* <img className="text-logo" src={speakNchatTextLogo} alt="speak-n-chat-text-logo" /> */}
      </div>
      <hr className="hr-line"/>
      <div className='signup-container'>
        <form autoComplete='off' className="signup-form" onSubmit={submitHandler}>
          <input
            type='text'
            name='firstname'
            value={firstname}
            onChange={changeHandler}
            placeholder='Enter Your FirstName'
          />
          <br />
          {errors.firstname && <div className='error'>{errors.firstname}</div>}
          <input
            type='text'
            name='lastname'
            value={lastname}
            onChange={changeHandler}
            placeholder='Enter Your LastName'
          />
          <br />
          {errors.lastname && <div className='error'>{errors.lastname}</div>}
          <input
            type='email'
            name='email'
            value={email}
            onChange={changeHandler}
            placeholder='Enter Your Email'
          />
          <br />
          {errors.email && <div className='error'>{errors.email}</div>}
          <input
            type='phone'
            name='phone'
            value={phone}
            onChange={changeHandler}
            placeholder='Mobile number'
          />
          <br />
          {errors.phone && <div className='error'>{errors.phone}</div>}
          <input
            type='password'
            name='password'
            value={password}
            onChange={changeHandler}
            placeholder='Enter Your Password'
          />
          <br />
          {errors.password && <div className='error'>{errors.password}</div>}
          <input
            type='password'
            name='confirmpassword'
            value={confirmpassword}
            onChange={changeHandler}
            placeholder='Confirm Your Password'
          />
          <br />
          {errors.confirmpassword && <div className='error'>{errors.confirmpassword}</div>}
          <input type='submit' name='Signup' value='Sign up' />
        </form>
        <p>
          Already have an account? <Link to="/login"><button type="button">Sign In</button></Link>
        </p>
      </div>
    </div>
    </main>
  );
};
 
export default SignUp;