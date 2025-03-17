import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMachines, logoutService } from '../../backservice/backservice';
import 'chart.js/auto';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Outlet } from 'react-router-dom';
import logo from "/logo.png";
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const userData = useSelector((state) => state.authSlice.userData);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [machinesList, setMachinesList] = useState([]);
  const navigate = useNavigate();
  const { pathname } = useLocation();

   const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serialNumber = queryParams.get('serial_number');


   

  const dropdownRef = useRef(null);

  const memoizedOutlet = useMemo(() => (
    <Outlet />
  ), []);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

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
        });
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className={`min-h-screen h-auto flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}

      <div className={`sticky top-0 left-0 self-start w-auto md:${isMenuOpen?"w-64":""} shadow-lg h-screen overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
       
        <div className={`${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className={`p-4 flex justify-center items-center text-2xl font-serif border-b-2 mb-1 ${isDarkMode ? 'border-blue-500 text-slate-50' : 'border-blue-300 text-gray-800'}`}>
            <img src={logo} className='h-5' alt="" />
          </div>
          <div className="p-4 hidden md:flex flex-col justify-between h-auto max-h-screen">
            <div>
              <h1
                className="text-2xl text-blue-500 font-bold p-3 hover:cursor-pointer hidden md:block"
                onClick={() => navigate(-1)}
              >
                {pathname !== "/" ? (
                  <i className="fa-solid fa-arrow-left"></i>
                ) : (
                  ""
                )}
                Machines
              </h1>
              <ul className={`space-y-2 hidden md:block`}>
                {machinesList.length > 0 ? (
                  machinesList.map((element) => (
                    <li
                      key={element.serial_number}
                      onClick={() => {
                        navigate(`/data?serial_number=${element.serial_number}`);
                      }}
                      className={`cursor-pointer p-2 rounded transition duration-200
                      ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}
                      hover:bg-blue-400 hover:text-white`}
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
        <h1 onClick={toggleMenu} className={`text-xl p-5 ${isMenuOpen?'mt-[43vh]':"mt-[90vh]"} hover:cursor-pointer`}>
          ☰
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1">

        {/* Machine Details */}
        {memoizedOutlet}
      </div>

    </div>
  );
}

export default Dashboard;

