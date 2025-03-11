import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { getMachineData, getMachines } from '../../../backservice/backservice'

function MachineList() {

    const navigate = useNavigate()
    const userData = useSelector((state) => state.authSlice.userData);

    const {isDarkMode} = useOutletContext()
     const [machinesList, setMachinesList] = useState([]);
     const [machineData,setMachineData] = useState({});

     const mstatus = ["STOP","RUNNING","IDLE","ABORTED"]

     
     function isMoreThan20SecondsAgoUTC(isoString) {
      const inputDate = new Date(isoString);
      const nowUTC = Date.now(); // UTC timestamp
      
      // Convert input date to UTC timestamp
      const inputUTC = inputDate.getTime();
      
      return (nowUTC - inputUTC) > 20000;
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
    
        // Fetch data immediately on mount
        fetchData();
    
        // Set up interval to fetch data every 10 seconds
        const intervalId = setInterval(() => {
          fetchData();
        }, 10000); // 10 seconds in milliseconds
    
        // Clean up the interval when the component is unmounted or when userData changes
        return () => clearInterval(intervalId);
      }, [userData?.c_id]);

  return (
    <div className="p-6 ">
    <h1 className='text-3xl font-bold mb-6 text-slate-700 dark:text-slate-200 border-b-2 border-blue-200 dark:border-blue-800 pb-3'>
        MACHINE STATUS
    </h1>
    <ul className="space-y-3">
        {machinesList.length > 0 ? (
            machinesList.map((element) => {
                const status = mstatus[Number(machineData[element.serial_number]?.d?.status)]
                console.log(element);
                
                const oee = machineData[element.serial_number]?.d?.current_OEE[0];
                
                return (
                    <li
                        key={element.serial_number}
                        onClick={() => navigate("/data", { state: { serial_number: element.serial_number } })}
                        className={`
                            group flex justify-between items-center p-4 rounded-lg cursor-pointer
                            transition-all duration-300 ease-in-out transform hover:scale-[1.02]
                            ${isDarkMode 
                                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                                : 'bg-white hover:bg-blue-50 text-slate-700 border border-slate-200'
                            }
                            shadow-sm hover:shadow-md
                        `}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full 
                                ${isMoreThan20SecondsAgoUTC(machineData?.ts) ? 'bg-green-500' : 
                                  'bg-red-500'}
                                `}
                            />
                            <span className="font-mono font-medium text-lg">
                                {element.serial_number}
                            </span>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex flex-col items-end">
                                <span className={`text-sm font-semibold ${
                                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                                }`}>
                                    Status
                                </span>
                                <span className="capitalize">{status}</span>
                            </div>
                            
                            <div className="flex flex-col items-end">
                                <span className={`text-sm font-semibold ${
                                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                                }`}>
                                    OEE
                                </span>
                                <span className={`font-bold ${
                                    oee >= 80 ? 'text-green-600' : 
                                    oee >= 60 ? 'text-yellow-600' : 
                                    'text-red-600'
                                }`}>
                                    {oee}%
                                </span>
                            </div>
                            
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`h-5 w-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'} 
                                transform transition-transform group-hover:translate-x-1`}
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </li>
                )
            })
        ) : (
            <div className={`text-center p-8 rounded-lg ${
                isDarkMode 
                    ? 'bg-slate-700 text-slate-300' 
                    : 'bg-slate-100 text-slate-600'
            }`}>
                <span className="text-lg">No machines found in inventory</span>
                <p className="text-sm mt-2 text-slate-500">Add new machines to get started</p>
            </div>
        )}
    </ul>
</div>
  )
}

export default MachineList
