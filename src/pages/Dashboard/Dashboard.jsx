import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMachineData, getMachines, logoutService } from '../../backservice/backservice';
import 'chart.js/auto';
import { FaMoon, FaSun, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';

function Dashboard() {
  const userData = useSelector((state) => state.authSlice.userData);
  const [currentMachine, setCurrentMachine] = useState(null);
  const [machineData, setMachineData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const [machinesList, setMachinesList] = useState([]);

  useEffect(() => {
    if (userData?.c_id) {
      getMachines(userData.c_id)
        .then((data) => {
          if (data) {
            setMachinesList(data);
            if (machinesList) {
              setCurrentMachine(machinesList[0].serial_number);
            }
          }
        })
        .catch(() => {
          console.log('machines fetch failed');
        })
        .finally(() => {
        });
    }
  }, [userData?.c_id]);
  const navigate = useNavigate();

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

      <div className={`w-full h-auto md:w-64 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div className={`p-4 flex justify-center items-center text-2xl font-serif border-b-2 mb-1 ${isDarkMode ? 'border-blue-500 text-slate-50' : 'border-blue-300 text-gray-800'}`}>
          <span role="img" aria-label="factory" className={isDarkMode ? 'text-blue-500' : 'text-blue-600'}>🏭</span> PACMAC
        </div>
        <div className="p-4">
          <h1 className='text-2xl text-slate-50 p-3'>
            MACHINES
          </h1>
          <ul className="space-y-2">
            {machinesList.length > 0 ? (
              machinesList.map((element) => (
                <li
                  key={element.serial_number}
                  onClick={() => { 
                    navigate(`/data?serial_number=${element.serial_number}`);
                  }}
                  className={`cursor-pointer p-2 rounded transition duration-200 ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    }`}
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

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold flex items-center ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>

          </h1>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {/* Theme Toggle Button */}
            <button onClick={toggleTheme} className="focus:outline-none">
              {isDarkMode ? (
                <FaMoon className="text-blue-500 text-2xl" />
              ) : (
                <FaSun className="text-yellow-500 text-2xl" />
              )}
            </button>

            {/* Welcome Message */}
            <div className={`p-3 rounded-lg shadow-sm flex items-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
              <span className={`mr-2 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Welcome,</span>
              <span className={`font-semibold text-lg ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{userData?.username}</span>
            </div>

            {/* Logout Dropdown */}
            <div className="relative">
              <button onClick={toggleDropdown} className="flex items-center focus:outline-none">
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
        <Outlet context={{ isDarkMode, machineData }} />
      </div>
    </div>
  );
}

export default Dashboard;
