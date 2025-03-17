import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMachineData,getMachineUser } from '../../../backservice/backservice';
import {Bar} from 'react-chartjs-2'; 
import model from '/model.jpg';

function MachindeData() {
  const isDarkMode = false;

  const [machineData, setMachineData] = useState({});
  const [user,setUser] = useState("")

  const navigate = useNavigate()

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
  const totalProduction=machineData?.d?.Total_Production;
  const goodProduction=machineData?.d?.Good_Count;
  const badProduction=machineData?.d?.Reject_Counters;
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
      getMachineUser(serialNumber).then((data)=>{
        setUser(data)
    })
    };

    fetchdata();

    const intervalId = setInterval(() => {
      fetchdata();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [serialNumber]);

  return (
    <>
      <div className={`bg-gray-200 min-w-3xl max-w-8xl  ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className='bg-blue-500 h-16 flex items-center min-w-3xl  max-w-8xl shadow-md'>
        <p className='text-2xl font-bold text-white ml-5'>PACMAC</p>
        <div>

        </div>
      </div>
 
      {/* Navigation Bar */}
      <div className='flex flex-row justify-evenly mt-1 py-2 min-w-3xl max-w-8xl gap-1'>
        {['Home', 'Analytics', 'Devices', 'Reports', 'Status'].map((item, index) => (
          <div key={index} className='bg-white w-[34vh] flex justify-center py-2 shadow-sm hover:shadow-md transition-all cursor-pointer'>
            {item}
          </div>
        ))}
        <div className='bg-blue-600 rounded-lg text-white w-[22vh] flex justify-center items-center py-2 
        shadow-sm hover:shadow-md transition-all cursor-pointer' onClick={()=> navigate("/audit?serial_number=" +serialNumber)}>
          Audit Trail
        </div>
      </div>

      {/* Machine Overview */}
      <div className='flex flex-row px-2 max-w-8xl mt-3  min-w-3xl gap-3'>
        <div className='w-68 h-46 bg-white rounded-lg shadow-md '>
          <img src={model} alt="" className='h-full object-cover' />
        </div>
        <div className='flex flex-col gap-2'>
          {/* Top Row */}
          <div className='flex flex-row justify-around gap-3 '>
            {[
              { label: 'Status', value: 'RUN', color: 'bg-green-400', textColor: 'black' },
              { label: 'Total Production', value:  machineData?.d?.Total_Production, color: 'text-blue-800', textColor: 'blue-800'},
              { label: 'Good Production', value:  machineData?.d?.Good_Count, color: 'text-teal-600', textColor: 'teal-600' },
              { label: 'Bad Production', value:  machineData?.d?.Reject_Counters, color: 'text-red-600', textColor: 'red-600' },
            ].map((item, index) => (
              <div key={index} className='bg-white w-60 h-22 flex flex-col justify-center items-center shadow-sm hover:shadow-md transition-all'>
                <h1>
                  {item.label === 'Status' ? (
                    <button className={`${item.color} text-${item.textColor} px-4 py-1 text-2xl rounded-sm`}>{item.value}</button>
                  ) : (
                    <span className={`text-3xl font-semibold ${item.color}`}>{item.value}</span>
                  )}
                </h1>
                <p className='text-[2vh] text-gray-600 mt-1 '>{item.label}</p>
              </div>
            ))}
          </div>

          {/* Bottom Row */}
          <div className='flex flex-row justify-evenly gap-3 '>
            {[
              { label: 'Batch Number', value: machineData?.d?.Batch_Number },
              { label: 'OEE',  value: machineData?.d?.current_OEE ? Number(machineData.d.current_OEE).toFixed(2) : '0.00' },
              { label: 'Current Speed',value: machineData?.d?.current_speed },
              { label: 'Recipe Number', value: machineData?.d?.Reciepe_Name },
            ].map((item, index) => (
              <div key={index} className='bg-white w-60 h-22 flex flex-col justify-center items-center shadow-sm hover:shadow-md transition-all'>
                <h1 className='text-3xl font-semibold text-gray-800'>{item.value}</h1>
                <p className='text-sm text-gray-600 mt-1'>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className='flex flex-row min-w-xl max-w-8xl h-[400px]  mt-6  justify-evenly'>
        {/* OEE Graph */}
        <div className='bg-white w-[49%] h-full flex shadow-md '>
          <div className={`rounded-lg p-6  ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold md:text-xl mb-4 text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>
              Overall Equipment Effectiveness
            </h3>
            <div className="relative h-80 w-100">
              <Bar
                data={{
                  labels: ['Availability', 'Performance', 'Quality'],
                  datasets: [
                    {
                      label: 'OEE Components',
                      data: [availability, performance, quality],
                      backgroundColor: [
                        'rgba(37, 99, 235, 0.6)', // Navy Blue
                        'rgba(20, 184, 166, 0.6)', // Teal
                        'rgba(107, 114, 128, 0.6)', // Gray
                      ],
                      borderColor: [
                        'rgba(37, 99, 235, 1)', // Navy Blue
                        'rgba(20, 184, 166, 1)', // Teal
                        'rgba(107, 114, 128, 1)', // Gray
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        color: isDarkMode ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)',
                      },
                      grid: {
                        color: isDarkMode ? 'rgba(55, 65, 81, 0.2)' : 'rgba(229, 231, 235, 0.2)',
                      },
                    },
                    x: {
                      ticks: {
                        color: isDarkMode ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)',
                      },
                      grid: {
                        color: isDarkMode ? 'rgba(55, 65, 81, 0.2)' : 'rgba(229, 231, 235, 0.2)',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  barThickness: 70, // Decreased bar width
                }}
              />
            </div>
          </div>
        </div>

        {/* Production Graph */}
        <div className='bg-white w-[49%] h-full flex shadow-md '>
          <div className={`rounded-lg p-6  ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold md:text-xl mb-4 text-center ${isDarkMode ? 'text-blue-400' : 'text-blue-800'}`}>
              Production Overview
            </h3>
            <div className="relative h-80 w-100">
              <Bar 
                data={{
                  labels: ['Total Production', 'Good Production', 'Bad Production'],
                  datasets: [
                    {
                      label: 'Production',
                      data: [totalProduction, goodProduction, badProduction],
                      backgroundColor: [
                        'rgba(37, 99, 235, 0.6)', // Navy Blue
                        'rgba(20, 184, 166, 0.6)', // Teal
                        'rgba(107, 114, 128, 1)', // Gray
                      ],
                      borderColor: [
                        'rgba(37, 99, 235, 1)', // Navy Blue
                        'rgba(20, 184, 166, 1)', // Teal
                        'rgba(107, 114, 128, 1)', // Gray
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: isDarkMode ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)',
                      },
                      grid: {
                        color: isDarkMode ? 'rgba(55, 65, 81, 0.2)' : 'rgba(229, 231, 235, 0.2)',
                      },
                    },
                    x: {
                      ticks: {
                        color: isDarkMode ? 'rgba(209, 213, 219, 1)' : 'rgba(75, 85, 99, 1)',
                      },
                      grid: {
                        color: isDarkMode ? 'rgba(55, 65, 81, 0.2)' : 'rgba(229, 231, 235, 0.2)',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  barThickness: 70, // Decreased bar width
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default MachindeData;