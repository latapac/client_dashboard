import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { getMachineData, loginService } from '../../../backservice/backservice';

function MachindeData() {
  const isDarkMode = false;

  const [machineData, setMachineData] = useState({});

  const mstatus = ['STOP', 'RUNNING', 'IDLE', 'ABORTED'];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');

  function getStatusColor(status) {
    switch (status) {
      case 'STOP':
        return 'text-red-500';
      case 'RUNNING':
        return 'text-green-500';
      case 'IDLE':
        return 'text-yellow-500';
      case 'ABORTED':
        return 'text-orange-300';
      default:
        return 'text-gray-500';
    }
  }

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

  const oeeValue = machineData?.d?.current_OEE ? Number(machineData.d.current_OEE).toFixed(2) : '0.00';
  const performance = machineData?.d?.Performance ? Number(machineData.d.Performance).toFixed(2) : '0.00';
  const availability = machineData?.d?.Availability ? Number(machineData.d.Availability).toFixed(2) : '0.00';
  const quality = machineData?.d?.Quality ? Number(machineData.d.Quality).toFixed(2) : '0.00';

  const oeeData = {
    labels: ['Performance', 'Availability', 'Quality'],
    datasets: [
      {
        data: [performance, availability, quality],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 1,
      },
    ],
  };

  const oeeOptions = {
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

  useEffect(() => {
    const fetchdata = () => {
      getMachineData(serialNumber).then((data) => {
        setMachineData(data);
      });
    };

    fetchdata();

    const intervalId = setInterval(() => {
      fetchdata();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [serialNumber]);

  return (
    <>
      <div className={`rounded-lg shadow-md p-3 mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} h-28 `}>
        <h6 className={`text-xl font-bold mb-1.5 flex justify-between items-center ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
          <span role="img" aria-label="chart" className={isDarkMode ? 'text-blue-500' : 'text-blue-600'}>
            Serial No. {machineData?.serial_number}{' '}
          </span>
          <span>
            Status :{' '}
            <span className={getStatusColor(mstatus[Number(machineData?.d?.status)])}>
              {mstatus[Number(machineData?.d?.status)]}
            </span>
          </span>
        </h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`p-2.5 rounded-lg shadow-sm flex flex-row justify-evenly h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`font-medium text-18   ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Current Speed</p>
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.current_speed}</p>
          </div>
          <div className={`p-2.5 rounded-lg shadow-sm flex flex-row justify-evenly h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`font-medium text-18 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Batch Number</p>
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.Batch_Number}</p>
          </div>
          <div className={`p-2.5 rounded-lg shadow-sm flex flex-row justify-evenly h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`font-medium text-18  ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Recipe Name</p>
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.Reciepe_Name}</p>
          </div>
        </div>
      </div>
      <div className={`rounded-lg shadow-md p-3 mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} h-28`}>
        <h6 className={`text-xl font-bold mb-1.5 flex justify-between items-center ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
          <span role="img" aria-label="chart" className={isDarkMode ? 'text-blue-500' : 'text-blue-600'}>
            Production Details
          </span>
        </h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`p-2.5 rounded-lg shadow-sm flex flex-row justify-evenly h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`font-medium text-18 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Total Production</p>
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.Total_Production}</p>
          </div>
          <div className={`p-2.5 rounded-lg shadow-sm flex flex-row justify-evenly h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`font-medium text-18 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Good Production</p>
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.Good_Count}</p>
          </div>
          <div className={`p-2.5 rounded-lg shadow-sm flex flex-row justify-evenly h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`font-medium text-18 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Bad Production</p>
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.Reject_Counters}</p>
          </div>
        </div>
      </div>
      <div className={`rounded-lg shadow-md p-3 mb-1.5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} h-28`}>
        <h6 className={`text-xl font-bold mb-1.5 flex justify-between items-center ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
          <span role="img" aria-label="chart" className={isDarkMode ? 'text-blue-500' : 'text-blue-600'}>
            OEE Details
          </span>
        </h6>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          <div className={`p-2.5 rounded-lg shadow-sm flex flex-row justify-evenly h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`font-medium text-18 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Performance</p>
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{performance}</p>
          </div>
          <div className={`p-2.5 rounded-lg shadow-sm flex flex-row justify-evenly h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`font-medium text-18 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Availability</p>
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{availability}</p>
          </div>
          <div className={`p-2.5 rounded-lg shadow-sm flex flex-row justify-evenly h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`font-medium text-18 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Quality</p>
            <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{quality}</p>
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

        {/* OEE Chart with Performance, Availability, and Quality */}
        <div className={`rounded-lg shadow-md p-6 flex flex-col items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`} style={{ height: '100%' }}>
          <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>OEE</h3>
          <div className="relative" style={{ height: '300px' }}>
            <Doughnut data={oeeData} options={oeeOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
                {oeeValue}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MachindeData;