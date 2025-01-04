import React, { useContext, useState } from 'react';
import './Navbar.css';
import PC_logo from '../../assets/PC_logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../../Context/AppContect';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendurl, setIsLoggedin, setUserData } = useContext(AppContext);
  const [isHovered, setIsHovered] = useState(false);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendurl + '/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendurl + '/api/auth/logout');
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="navbar">
      <a href="/" className="logo">
        <img src={PC_logo} alt="Logo" />
      </a>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/Chat">Chat</Link></li>
        <li><Link to="/petpage">Pet</Link></li>
        <li><Link to="/Doctor">Doctor</Link></li>
      </ul>
      <div className="logs">
        {userData ? (
          <div
            className="user-info"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span className="user-initial">{userData.name[0].toUpperCase()}</span>

            {isHovered && (
              <div className="hover-box">
                <ul>
                  {!userData.isAccountVerified && (
                    <li
                      onClick={sendVerificationOtp}
                      className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                    >
                      Verify Email
                    </li>
                  )}
                  <li
                    onClick={logout}
                    className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <i className="black fa-regular fa-user"></i>
          </Link>
        )}
        <span className="divider"></span>
        <Link to="/petpage">
          <i className="black fa-solid fa-magnifying-glass"></i>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
