import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { getAuditTrailData } from '../../../backservice/backservice';

function AuditTrail() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serialNumber = queryParams.get('serial_number');

    const [auditData, setAuditData] = useState([])

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
        getAuditTrailData(serialNumber).then((data) => {
            setAuditData(data)
        })
    }, [])

    function showValue(data, topic) {
        if (topic == "operator_login") {
            if (data.user_name[0] == "") {
                return "User Logged out"
            } else {
                return data.user_name[0] + " Logged In"
            }
        } else {
            for (let key in data) {
                return key + " Changed To " + data[key][0] 
            }
        }
    }

    return (
        <>
            <div className="m-5 overflow-x-auto rounded-lg shadow-lg">
                <table className="min-w-full bg-white dark:bg-gray-800">
                    {/* Table Header */}
                    <thead className="bg-blue-500">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 dark:text-slate-300 uppercase tracking-wider">
                                Timestamp
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 dark:text-slate-300 uppercase tracking-wider">
                                Topic Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 dark:text-slate-300 uppercase tracking-wider">
                                Value
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-50 dark:text-slate-300 uppercase tracking-wider">
                                User
                            </th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {auditData?.map((data) => (
                            <tr key={data._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {formatTimestamp(data?.ts)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {data?.topic}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                    {showValue(data?.d, data?.topic)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                {data.d.User?data.d.User[0]:"--"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default AuditTrail
