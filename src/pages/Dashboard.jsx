import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMachineData, getMachines, logoutService } from '../backservice/backservice';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { FaMoon, FaSun, FaUser, FaSignOutAlt } from 'react-icons/fa';

function Dashboard() {
  const userData = useSelector((state) => state.authSlice.userData);
  const [currentMachine, setCurrentMachine] = useState(null);
  const [machineData, setMachineData] = useState({});
  const [machinesList, setMachinesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
          setLoading(false);
        });
    }
  }, [userData?.c_id]);

  useEffect(() => {
    if (!currentMachine) {
      return;
    }
    getMachineData(currentMachine)
      .then((data) => {
        setMachineData(data);
        console.log(machineData);
      })
      .catch((e) => {
        alert(e);
      });
  }, [currentMachine]);

  const productionData = {
    labels: ['Good Count', 'Rejected Count'],
    datasets: [
      {
        data: [machineData?.d?.Good_Count || 0, machineData?.d?.Reject_Counters || 0],
        backgroundColor: ['#00FF00', '#FF0000'],
        borderColor: ['#00FF00', '#FF0000'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    circumference: 180,
    rotation: -90,
    cutout: '70%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  const needleValue = machineData?.d?.current_OEE || 0;
  const needleData = {
    datasets: [
      {
        data: [needleValue, 100 - needleValue],
        backgroundColor: ['#00FFFF', isDarkMode ? '#333333' : '#E0E0E0'],
        borderWidth: 0,
      },
    ],
  };

  const needleOptions = {
    circumference: 180,
    rotation: -90,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className={`min-h-screen h-auto flex flex-col md:flex-row ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <div className={`w-full h-auto md:w-64 shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div className={`p-4 flex justify-center items-center text-2xl font-serif border-b-2 mb-1 ${isDarkMode ? 'border-blue-500 text-slate-50' : 'border-blue-300 text-gray-800'}`}>
          <span role="img" aria-label="factory" className={isDarkMode ? 'text-blue-500' : 'text-blue-600'}>🏭</span> PACMAC
        </div>
        <div className="p-4">
          <div className={`pl-1 font-medium text-2xl mb-4 flex items-center ${isDarkMode ? 'text-slate-50' : 'text-gray-800'}`}>
            <span role="img" aria-label="gears" className={isDarkMode ? 'text-blue-500' : 'text-blue-600'}>⚙️</span> MACHINES
          </div>
          {loading ? (
            <div className={isDarkMode ? 'text-white text-lg text-center' : 'text-gray-800 text-lg text-center'}>Loading machines...</div>
          ) : (
            <ul className="space-y-2">
              {machinesList.length > 0 ? (
                machinesList.map((element) => (
                  <li
                    key={element.serial_number}
                    onClick={() => setCurrentMachine(element.serial_number)}
                    className={`cursor-pointer p-2 rounded transition duration-200 ${
                      currentMachine === element.serial_number
                        ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                        : isDarkMode ? 'text-white hover:bg-blue-700' : 'text-gray-800 hover:bg-blue-200'
                    }`}
                  >
                    {element.serial_number}
                  </li>
                ))
              ) : (
                <div className={isDarkMode ? 'text-white' : 'text-gray-800'}>No machines available</div>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold flex items-center ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
            <span role="img" aria-label="dashboard" className={isDarkMode ? 'text-blue-500' : 'text-blue-600'}>📊</span> Dashboard
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
        <div className={`rounded-lg shadow-md p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-3xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
            <span role="img" aria-label="chart" className={isDarkMode ? 'text-blue-500' : 'text-blue-600'}>📈</span> Machine Performance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`font-medium text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Serial Number</p>
              <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.serial_number}</p>
            </div>
            <div className={`p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`font-medium text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Status</p>
              <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.status}</p>
            </div>
            <div className={`p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`font-medium text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>OEE</p>
              <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.current_OEE}</p>
            </div>
            <div className={`p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`font-medium text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Current Speed</p>
              <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.current_speed}</p>
            </div>
            <div className={`p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`font-medium text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Batch Number</p>
              <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.Batch_Number}</p>
            </div>
            <div className={`p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <p className={`font-medium text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Recipe Name</p>
              <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.Reciepe_Name}</p>
            </div>
          </div>
        </div>

        {/* Half-Donut Charts and Needle Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Good Count vs Rejected Count */}
          <div className={`rounded-lg shadow-md p-6 flex flex-col justify-center items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ height: '100%' }}>
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>Production Overview</h3>
            <div className="relative min-h-80">
              <Doughnut data={productionData} options={options} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
                  {machineData?.d?.Total_Production || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Needle Indicator for OEE */}
          <div className={`rounded-lg shadow-md p-6 flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ height: '100%' }}>
            <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>OEE</h3>
            <div className="relative" style={{ height: '300px' }}>
              <Doughnut data={needleData} options={needleOptions} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
                  {needleValue}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
