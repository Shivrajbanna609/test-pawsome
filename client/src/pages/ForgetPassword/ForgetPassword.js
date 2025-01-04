import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ForgetPassword.css';
import { AppContext } from '../../Context/AppContect';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { backendurl } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  
  const inputRefs = useRef([]);
  
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

  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendurl}/api/auth/send-reset-otp`, { email });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP');
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((ref) => ref.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendurl}/api/auth/reset-password`, { email, otp, newPassword });
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    }
  };

  return (
    <div className='auth-container'>
      <form className="auth-form" onSubmit={isEmailSent ? (isOtpSubmitted ? resetPassword : verifyOtp) : sendOtp}>
        <div className='logoLI'>
          <img src={require('../../assets/Login_dog.png')} alt="Logo" />
        </div>
        <h2>{!isEmailSent ? 'Reset Password' : isOtpSubmitted ? 'New Password' : 'Enter OTP'}</h2>

        <div className='inputs'>
          {!isEmailSent ? (
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          ) : isOtpSubmitted ? (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </>
          ) : (
            <div className='otp-container'>
              {Array(6).fill(0).map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  className='otp-input'
                  ref={(el) => inputRefs.current[index] = el}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  required
                />
              ))}
            </div>
          )}
        </div>

        <input
          type="submit"
          value={!isEmailSent ? 'Send OTP' : isOtpSubmitted ? 'Submit New Password' : 'Verify OTP'}
        />

        <div className="switch-links">
          <button type="button" onClick={() => navigate('/login')} className="toggle-btn">
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgetPassword;
