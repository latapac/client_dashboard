import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuditTrailData } from '../../../backservice/backservice';

function AuditTrail() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const serialNumber = queryParams.get('serial_number');

    const [auditData, setAuditData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState('all');

    const itemsPerPage = 16;

    useEffect(() => {
        getAuditTrailData(serialNumber).then((data) => {
            setAuditData(data);
            setFilteredData(data);
        });
    }, [serialNumber]);

    function formatTimestamp(isoString) {
        const date = new Date(isoString);
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
            `${date.getDate().toString().padStart(2, '0')} ` +
            `${date.getHours().toString().padStart(2, '0')}:` +
            `${date.getMinutes().toString().padStart(2, '0')}:` +
            `${date.getSeconds().toString().padStart(2, '0')}`;
    }

    // **Date Filtering Function**
    const filterByDateRange = (range) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let filtered = auditData;

        if (range === 'yesterday') {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            filtered = auditData.filter(item => new Date(item.ts).toDateString() === yesterday.toDateString());
        } else if (range === 'last7days') {
            const last7Days = new Date(today);
            last7Days.setDate(today.getDate() - 7);
            filtered = auditData.filter(item => new Date(item.ts) >= last7Days);
        } else if (range === 'last30days') {
            const last30Days = new Date(today);
            last30Days.setDate(today.getDate() - 30);
            filtered = auditData.filter(item => new Date(item.ts) >= last30Days);
        }

        setSelectedDateRange(range);
        setFilteredData(filtered);
        setCurrentPage(0);
    };

    // **Pagination**
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="min-h-screen flex flex-col p-0.5 bg-gray-100 dark:bg-gray-900">
            {/* Filters Section */}
            <div className="flex flex-wrap gap-2 mb-4 p-1 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Search by Identification, Text, or User"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-0.5 border rounded-md focus:ring focus:ring-blue-300 w-72 dark:bg-gray-700 dark:text-white"
                />

                <div className="flex gap-2 flex-wrap">
                    {["yesterday", "last7days", "last30days", "all"].map((range) => {
                        const labels = {
                            yesterday: "Yesterday",
                            last7days: "Last 7 Days",
                            last30days: "Last 30 Days",
                            all: "Show All",
                        };
                        const colors = {
                            yesterday: "bg-blue-500 hover:bg-blue-600",
                            last7days: "bg-green-500 hover:bg-green-600",
                            last30days: "bg-yellow-500 hover:bg-yellow-600",
                            all: "bg-gray-500 hover:bg-gray-600",
                        };

                        return (
                            <button
                                key={range}
                                onClick={() => filterByDateRange(range)}
                                className={`px-3 py-1 text-sm rounded-md text-white ${colors[range]} ${
                                    selectedDateRange === range ? "ring-2 ring-offset-2 ring-blue-400" : ""
                                }`}
                            >
                                {labels[range]}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <table className="min-w-full border-collapse">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            {["Date & Time", "Identification", "Text", "User"].map((header) => (
                                <th key={header} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((data) => {
                                const firstKey = Object.keys(data?.d)?.[0];
                                return (
                                    <tr key={data._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <td className="px-4 py-2 text-sm">{formatTimestamp(data?.ts)}</td>
                                        <td className="px-4 py-2 text-sm">{firstKey || '--'}</td>
                                        <td className="px-4 py-2 text-sm">{firstKey ? data.d[firstKey]?.[0] : '--'}</td>
                                        <td className="px-4 py-2 text-sm">{data?.d?.User?.[0] || 'NULL'}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-2 text-center text-gray-500">
                                    No matching data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 gap-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                    className={`px-4 py-2 text-sm rounded-md transition ${
                        currentPage === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                    Previous
                </button>

                <span className="px-4 py-2 text-sm font-semibold bg-gray-200 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white">
                    Page {currentPage + 1} of {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage >= totalPages - 1}
                    className={`px-4 py-2 text-sm rounded-md transition ${
                        currentPage >= totalPages - 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default AuditTrail;
