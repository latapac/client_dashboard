import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuditTrailData } from '../../../backservice/backservice';

function AuditTrail() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serialNumber = queryParams.get('serial_number');

    const [auditData, setAuditData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage,setItemsPerPage] = useState(10); 

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

    useEffect(() => {
        const fetchData = ()=>{
            getAuditTrailData(serialNumber).then((data) => {
                setAuditData(data);
            });
        }
        const intervalId = setInterval(() => {
            fetchData();
          }, 4000);
      
          return () => clearInterval(intervalId);
    }, [serialNumber]);


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = auditData.slice(indexOfFirstItem, indexOfLastItem);


    const paginate = (pageNumber) => setCurrentPage(pageNumber);



    return (
        <>
            <div className="m-5 overflow-x-auto rounded-lg shadow-lg">
                <table className="min-w-full bg-white dark:bg-gray-800">
                    <thead className="bg-blue-500">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 dark:text-slate-300 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 dark:text-slate-300 uppercase tracking-wider">
                                Identification
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 dark:text-slate-300 uppercase tracking-wider">
                                Text
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 dark:text-slate-300 uppercase tracking-wider">
                                User
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {currentItems?.map((data) => { 
                            return(
                            <tr key={data._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {formatTimestamp(data?.ts)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {Object.keys(data?.d)[0]}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {data?.d[Object.keys(data?.d)[0]]}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {data?.d?.User !== undefined ? data?.d?.User[0] === "" ? "SYSTEM" : data?.d?.User[0] : "NULL"}
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <nav className="block">
                    <ul className="flex pl-0 rounded list-none flex-wrap">
                        {[...Array(Math.ceil(auditData.length / itemsPerPage)).keys()].map(number => (
                            <li key={number + 1}>
                                <button
                                    onClick={() => paginate(number + 1)}
                                    className={`${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'text-blue-500 hover:bg-blue-100'} px-3 py-2 mx-1 border rounded`}
                                >
                                    {number + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default AuditTrail;