import React, { useEffect, useState, useRef,useMemo } from 'react'; // Added useRef
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMachines, logoutService } from '../../backservice/backservice';
import 'chart.js/auto';
import {  FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';
import logo from "/logo.png"
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const userData = useSelector((state) => state.authSlice.userData);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [machinesList, setMachinesList] = useState([]);
  const navigate = useNavigate();
  const {pathname} = useLocation()

  // Ref for dropdown
  const dropdownRef = useRef(null);

  const memoizedOutlet = useMemo(() => (
    <Outlet  />
  ), []);

  // Handle clicks outside the dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  // Add event listener for outside clicks
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (userData?.c_id) {
      getMachines(userData.c_id)
        .then((data) => {
          if (data) {
            setMachinesList(data);
          }
        })
        .catch(() => {
          console.log('machines fetch failed');
        })
        .finally(() => {});
    }
  }, [userData?.c_id]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    if (logoutService()) {
      navigate('/login');
    }
  };  

  return (
    <div className={`min-h-screen h-auto flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`w-full h-auto md:w-64 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div className={`p-4 flex justify-center items-center text-2xl font-serif border-b-2 mb-1 ${isDarkMode ? 'border-blue-500 text-slate-50' : 'border-blue-300 text-gray-800'}`}>
         <img src={logo} className='h-5' alt="" /> PACMAC
        </div>
        <div className="p-4 flex flex-col justify-between h-screen max-h-screen">
          <div>
            <h1 className="text-2xl text-blue-500 font-bold p-3 hover:cursor-pointer" onClick={() => navigate('/')}>
            {pathname=="/data"?(<i className="fa-solid fa-arrow-left"></i>):""} Machines
            </h1>
            <ul className="space-y-2">
              {machinesList.length > 0 ? (
                machinesList.map((element) => (
                  <li
                    key={element.serial_number}
                    onClick={() => {
                      navigate(`/data?serial_number=${element.serial_number}`);
                    }}
                    className={`cursor-pointer p-2 rounded transition duration-200 ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
                  >
                    {element.serial_number}
                  </li>
                ))
              ) : (
                <div className={isDarkMode ? 'text-white' : 'text-gray-800'}>No machines available</div>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
        <div className='text-3xl font-bold text-blue-500  border-b-2  pb-3'>Machine Status</div>
          <h1 className={`text-4xl font-bold flex items-center ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}></h1>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">


            {/* Welcome Message */}
            <div className={`p-3 rounded-lg shadow-sm flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}
             hover:drop-shadow-xl`}>
              <span className={`mr-2 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Welcome,</span>
              <span className={`font-semibold text-lg ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{userData?.username}</span>
            </div>

            {/* Logout Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={toggleDropdown} className="flex items-center focus:outline-none  hover:shadow-cyan-500">
                <FaUser className={`text-2xl ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`} />
              </button>
              {isDropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className={`block w-full px-4 py-2 text-sm ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-800 hover:bg-gray-200'}`}
                    >
                      <FaSignOutAlt className="inline-block mr-2" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Machine Details */}
        
         {memoizedOutlet}
       
      </div>
    </div>
  );
}

export default Dashboard;