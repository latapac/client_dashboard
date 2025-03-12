import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMachineData, getMachines } from '../../../backservice/backservice';

function MachineList() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.authSlice.userData);
  const [machinesList, setMachinesList] = useState([]);
  const [machineData, setMachineData] = useState({});

 const isDarkMode = false
  const prevTpRef = useRef({});

  const mstatus = ['STOP', 'RUNNING', 'IDLE', 'ABORTED'];

  function formatTimestamp(isoString) {
    const date = new Date(isoString);
  
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
   
    return `${hours}:${minutes}:${seconds} ${day}/${month+1}/${year}`;
  }
   
  const dataChange = (serialNumber, tp) => {
    if (prevTpRef.current[serialNumber] === tp) {
      return false; // No change
    } else {
      prevTpRef.current[serialNumber] = tp;
      return true;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userData?.c_id) {
        try {
          const data = await getMachines(userData.c_id);
          if (data) {
            setMachinesList(data);
            data.forEach(async (machine) => {
              const mdata = await getMachineData(machine.serial_number);
              setMachineData((prevData) => ({
                ...prevData,
                [machine.serial_number]: mdata,
              }));
            });
          }
        } catch (error) {
          console.log('machines fetch failed');
        }
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 35000);

    return () => clearInterval(intervalId);
  }, [userData?.c_id]);

  return (
    <div className="p-1 ">
   
      <ul className="space-y-1">
        {machinesList.length > 0 ? (
          machinesList.map((element) => {
            const status = mstatus[Number(machineData[element.serial_number]?.d?.status)];
            const oee = Number(machineData[element.serial_number]?.d?.current_OEE[0]).toFixed(2);
            const speed = machineData[element.serial_number]?.d?.current_speed[0];
            const ts = machineData[element.serial_number]?.ts; // Timestamp
            
            
            return (
              <li
                key={element.serial_number}
                onClick={() => navigate(`/data?serial_number=${element.serial_number}`)}
                className={`
                  group flex justify-between items-center p-4 rounded-lg cursor-pointer
                  transition-all duration-300 ease-in-out transform hover:scale-[1.02]
                  ${
                    isDarkMode
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200'
                  }
                  shadow-sm hover:shadow-md
                `}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-5 h-5 rounded-full ${
                      dataChange(element.serial_number, ts) ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <div className='flex flex-col'>
                  <span className="font-mono font-medium text-lg">
                    {element.serial_number}
                    
                  </span>
                  <p className={`${!isDarkMode?'text-gray-800':'text-emerald-200'} font-mono`}>Last Data:{` ${formatTimestamp(ts)}`}</p>
                  </div>
                 
                  
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-sm font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      Status
                    </span>
                    <span className="capitalize">{status}</span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span
                      className={`text-sm font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      OEE
                    </span>
                    <span
                      className={`font-bold ${
                        oee >= 80
                          ? 'text-green-600'
                          : oee >= 60
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {oee}%
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span
                      className={`text-sm font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      Speed
                    </span>
                    <span className={`font-bold`}>{speed}</span>
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-600'
                    } transform transition-transform group-hover:translate-x-1`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </li>
            );
          })
        ) : (
          <div
            className={`text-center p-8 rounded-lg ${
              isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span className="text-lg">No machines found in inventory</span>
            <p className="text-sm mt-2 text-slate-500">Add new machines to get started</p>
          </div>
        )}
      </ul>
    </div>
  );
}

export default MachineList;