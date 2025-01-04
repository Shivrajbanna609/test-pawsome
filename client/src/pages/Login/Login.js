import React, { useState, useContext, useRef, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../Context/AppContect';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [isOTPStage, setIsOTPStage] = useState(false); // Toggle to OTP Verification Stage

  const navigate = useNavigate();
  const { backendurl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const inputRefs = useRef([]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setIsOTPStage(false); // Reset OTP stage
  };

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendurl}/api/auth/send-verify-otp`, { email });
      if (data.success) {
        toast.success('Verification OTP sent to your email');
        setIsOTPStage(true); // Move to OTP verification stage
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;

      if (isOTPStage) {
        // Verify OTP
        const otpArray = inputRefs.current.map(e => e.value);
        const otp = otpArray.join('');

        const { data } = await axios.post(backendurl + '/api/auth/verify-account', { otp });
        if (data.success) {
          toast.success(data.message);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else if (!isLogin) {
        // Sign Up
        const { data } = await axios.post(backendurl + '/api/auth/register', { name, email, password });
        if (data.success) {
          toast.success('Signup successful! Sending OTP...');
          await sendVerificationOtp(); // Explicitly send OTP after signup
        } else {
          toast.error(data.message);
        }
      } else {
        // Sign In
        const { data } = await axios.post(backendurl + '/api/auth/login', { email, password });
        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong!');
    }
  };

  useEffect(() => {
    // Auto navigate if user is already verified
    if (!isOTPStage) return;
    getUserData();
  }, [isOTPStage]);

  return (
    <div className='auth-container'>
      <form className="auth-form" onSubmit={onSubmitHandler}>
        <div className='logoLI'>
          <img src={require('../../assets/Login_dog.png')} alt="Logo" />
        </div>
        <h2>{isOTPStage ? 'Verify OTP' : isLogin ? 'SIGN IN' : 'SIGN UP'}</h2>

        <div className='inputs'>
          {isOTPStage ? (
            <div className='otp-container'>
              {Array(6).fill(0).map((_, index) => (
                <input
                  type='text'
                  maxLength='1'
                  key={index}
                  required
                  className='otp-input'
                  ref={e => inputRefs.current[index] = e}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              ))}
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {!isLogin && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </>
              )}
            </>
          )}
        </div>

        <input
          type="submit"
          value={isOTPStage ? "Verify OTP" : isLogin ? "Sign In" : "Sign Up"}
        />

        {/* Toggle Button */}
        {!isOTPStage && (
          <div className="switch-links">
            {isLogin ? (
              <span>
                Don’t have an account?{' '}
                <button type="button" onClick={toggleForm} className="toggle-btn">
                  Sign Up
                </button>
                <br/>
                <button type="button" onClick={()=> navigate('/forget-password')} className="toggle-btn">
                  Forget Password ?
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button type="button" onClick={toggleForm} className="toggle-btn">
                  Sign In
                </button>
                <br/>
                <button type="button" onClick={()=> navigate('/forget-password')} className="toggle-btn">
                  Forget Password ?
                </button>
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
