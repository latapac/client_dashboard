import React, { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2';
import { useLocation, useOutletContext } from 'react-router-dom';
import { getMachineData } from '../../../backservice/backservice';

function MachindeData() {

  const { isDarkMode } = useOutletContext()

  const [machineData, setMachineData] = useState({})

  const mstatus = ["STOP", "RUNNING", "IDLE", "ABORTED"]

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');

  function getStatusColor(status) {
    switch (status) {
      case "STOP":
        return "text-red-500"
        break;
      case "RUNNING":
        return "text-green-500"
        break;
      case "IDLE":
        return "text-yellow-500"
        break;
      case "ABORTED":
        return "text-orange-300"
        break;
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

  const needleValue = machineData?.d?.current_OEE ? Number(machineData.d.current_OEE).toFixed(2) : '0.00';
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

  useEffect(() => {

    const fetchdata = ()=>{getMachineData(serialNumber).then((data) => {
      setMachineData(data)
    })}

    fetchdata();
    
    const intervalId = setInterval(() => {
      fetchdata();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [serialNumber])

  return (
   <>
    <div className={`rounded-lg shadow-md p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} text-`}>
             <h6 className={`text-2xl font-bold mb-6 flex justify-between items-center ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
               <span role="img" aria-label="chart" className={isDarkMode ? 'text-blue-500' : 'text-blue-600'}>Serial No. {machineData?.serial_number} </span>
              <span>Status : <span className={getStatusColor(mstatus[Number(machineData?.d?.status)])}> {mstatus[Number(machineData?.d?.status)]} </span>
             </span></h6>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
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
    <div className={`rounded-lg shadow-md p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}  `}>
    <h6 className={`text-2xl font-bold mb-6 flex justify-between items-center ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>
               <span role="img" aria-label="chart" className={isDarkMode ? 'text-blue-500' : 'text-blue-600'}>Production Details</span>
              
             </h6>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
               <div className={`p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} `}>
                 <p className={`font-medium text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Total Production</p>
                 <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.Total_Production}</p>
               </div>
               <div className={`p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}  `}>
                 <p className={`font-medium text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Good Production</p>
                 <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.Good_Count}</p>
               </div>
               <div className={`p-4 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}  `}>
                 <p className={`font-medium text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>Bad Production</p>
                 <p className={`text-xl font-semibold ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>{machineData?.d?.Reject_Counters}</p>
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
          
   </>
  )
}

export default MachindeData
