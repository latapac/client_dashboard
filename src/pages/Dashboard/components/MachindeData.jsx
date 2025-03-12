import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';
import { getMachineData } from '../../../backservice/backservice';

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
      <div className="container mx-auto px-4 py-6">
        {/* Machine Status Section */}
        <div className={`rounded-lg shadow-md p-4 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h6 className={`text-lg md:text-xl font-bold mb-3 flex flex-col sm:flex-row justify-between items-center ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
            <span className="mb-2 sm:mb-0">
              Serial No. {machineData?.serial_number}
            </span>
            <span className="text-sm sm:text-base">
              Status: {' '}
              <span className={getStatusColor(mstatus[Number(machineData?.d?.status)])}>
                {mstatus[Number(machineData?.d?.status)]}
              </span>
            </span>
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {['current_speed', 'Batch_Number', 'Reciepe_Name'].map((key, index) => (
              <div key={index} className={`p-2 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-1 sm:mb-0`}>
                  {key.replace(/_/g, ' ')}
                </p>
                <p className={`text-base sm:text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
                  {machineData?.d?.[key]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Production Details Section */}
        <div className={`rounded-lg shadow-md p-4 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h6 className={`text-lg md:text-xl font-bold mb-3 ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
            Production Details
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {['Total_Production', 'Good_Count', 'Reject_Counters'].map((key, index) => (
              <div key={index} className={`p-2 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-1 sm:mb-0`}>
                  {key.replace(/_/g, ' ')}
                </p>
                <p className={`text-base sm:text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
                  {machineData?.d?.[key]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* OEE Details Section */}
        <div className={`rounded-lg shadow-md p-4 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h6 className={`text-lg md:text-xl font-bold mb-3 ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
            OEE Details
          </h6>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {['Performance', 'Availability', 'Quality'].map((key, index) => (
              <div key={index} className={`p-2 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} mb-1 sm:mb-0`}>
                  {key}
                </p>
                <p className={`text-base sm:text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
                  {eval(key.toLowerCase())}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Production Chart */}
          <div className={`rounded-lg shadow-md p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold md:text-xl mb-3 md:mb-4 text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Production Overview
            </h3>
            <div className="relative aspect-square max-h-96 mx-auto">
              <div className="absolute inset-0">
                <Doughnut
                  data={productionData}
                  options={{
                    ...options,
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {machineData?.d?.Total_Production || 0}
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Total Units
                </span>
              </div>
            </div>
          </div>

          {/* OEE Chart */}
          <div className={`rounded-lg shadow-md p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold md:text-xl mb-3 md:mb-4 text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Overall Equipment Effectiveness
            </h3>
            <div className="relative aspect-square max-h-96 mx-auto">
              <div className="absolute inset-0">
                <Doughnut
                  data={oeeData}
                  options={{
                    ...oeeOptions,
                    responsive: true,
                    maintainAspectRatio: false
                  }}
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {oeeValue}%
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Current OEE
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default MachindeData;