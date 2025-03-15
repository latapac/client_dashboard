import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMachineData, getMachines } from '../../../backservice/backservice';

function MachineList() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.authSlice.userData);
  const [machinesList, setMachinesList] = useState([]);
  const [machineData, setMachineData] = useState({});

  const isDarkMode = false;

  const mstatus = ['STOP', 'RUNNING', 'IDLE', 'ABORTED'];

  function formatTimestamp(isoString) {
    const date = new Date(isoString);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return ` ${year}/${month + 1}/${day} ${hours}:${minutes}:${seconds}`;
  }

  const dataChange = (tp) => {
    
    if(tp===undefined){
      return 'bg-red-500';
    }
    const date = new Date(tp);
    const currentTime = new Date();
    const differenceInMilliseconds = currentTime - date;
    const isChanged = differenceInMilliseconds > 60000;

    if (isChanged) {
      return 'border-l-red-500';
    } else {
      return 'border-l-green-500';
    }
  };

  function getStatusColor(status) {
    switch (status) {
      case 'STOP':
        return 'bg-red-500';
      case 'RUNNING':
        return 'bg-green-500';
      case 'IDLE':
        return 'bg-yellow-500';
      case 'ABORTED':
        return 'bg-orange-300';
      default:
        return 'bg-gray-500';
    }
  }

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
    }, 5000);

    return () => clearInterval(intervalId);
  }, [userData?.c_id]);

  return (
    <div className="md:p-1">
      <ul className="md:space-y-1">
        {machinesList.length > 0 ? (
          machinesList.map((element) => {
            const status = mstatus[Number(machineData[element.serial_number]?.d?.status)];
            const oee = Number(machineData[element.serial_number]?.d?.current_OEE[0]).toFixed(2);
            const speed = machineData[element.serial_number]?.d?.current_speed[0];
            const ts = machineData[element.serial_number]?.ts;

            return (
              <li
                key={element.serial_number}
                onClick={() => navigate(`/data?serial_number=${element.serial_number}`)}
                className={`
                  border-l-[2rem] ${dataChange(ts)}
                  group flex flex-col md:flex-row justify-between items-start p-4 rounded-lg cursor-pointer
                  transition-all duration-300 ease-in-out transform hover:scale-[1.02]
                  ${isDarkMode
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200'
                  }
                  shadow-sm hover:shadow-md
                `}
              >
                <div className="flex items-center justify-start space-x-4 ">
                  {/* <div
                    className={`w-5 h-5 rounded-full ${dataChange(ts)}`}
                  /> */}
                  <div className="flex flex-col">
                    <span className="font-mono font-medium text-xl">
                      {element.serial_number}
                    </span>
                    <p className={`text-gray-700 font-mono text-[0.8rem]`}>
                       {`${formatTimestamp(ts)}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 mt-4 md:mt-0 gap-2">
                
                  <div className="flex flex-col items-end max-w-2 ml-5">
                    <span
                      className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}
                    >
                      OEE
                    </span>
                    <span
                      className={`font-bold ${oee >= 80
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
                      className={`text-[0.8rem] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}
                    >
                      Speed
                    </span>
                    <span className={`font-bold text-xl`}>{speed}</span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className={`capitalize md:text-xl font-bold ${getStatusColor(status)} text-slate-50 p-1 rounded-sm w-38 max-w-38 text-center`}>{status}</span>
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'
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
            className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
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