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

     useEffect(() => {
        if (userData?.c_id) {
          getMachines(userData.c_id)
            .then((data) => {
              if (data) {
                setMachinesList(data);
                if(data){
                    data.forEach(async (machine)=>{
                        const mdata = await getMachineData(machine.serial_number)
                        let obj = machineData
                        obj[machine.serial_number] = mdata
                        setMachineData({...obj})
                    })
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

  return (
    <div>
    <h1 className='text-2xl text-slate-50 p-3'>
        MACHINES
    </h1>
      <ul className="space-y-2">
              {machinesList.length > 0 ? (
                machinesList.map((element) => {
                 return( <li
                    key={element.serial_number}
                    onClick={()=>{navigate("/data",{state:{serial_number:element.serial_number}})}}
                    className={`cursor-pointer p-2 rounded transition duration-200 ${
                       isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    }`}
                  >
                    {element.serial_number}
                    <span>statatus:{machineData[element.serial_number]?.d?.status[0]}</span>
                  </li>)
                })
              ) : (
                <div className={isDarkMode ? 'text-white' : 'text-gray-800'}>No machines available</div>
              )}
            </ul>
    </div>
  )
}

export default MachineList
