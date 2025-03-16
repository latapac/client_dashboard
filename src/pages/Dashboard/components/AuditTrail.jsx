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

    // New state for date-time filtering
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const itemsPerPage = 16;

    useEffect(() => {
        getAuditTrailData(serialNumber).then((data) => {
            setAuditData(data);
            setFilteredData(data);
        });
    }, [serialNumber]);

    // Filter function for date-time range
    const filterByDateTimeRange = () => {
        let filtered = auditData;

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            filtered = filtered.filter(item => {
                const itemDate = new Date(item.ts);
                return itemDate >= start && itemDate <= end;
            });
        }

        setFilteredData(filtered);
        setCurrentPage(0);
    };

    // Combined filter effect
    useEffect(() => {
        let filtered = auditData;

        // Date range filtering
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDateRange === 'yesterday') {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            filtered = filtered.filter(item => 
                new Date(item.ts).toDateString() === yesterday.toDateString()
            );
        } else if (selectedDateRange === 'last7days') {
            const last7Days = new Date(today);
            last7Days.setDate(today.getDate() - 7);
            filtered = filtered.filter(item => new Date(item.ts) >= last7Days);
        } else if (selectedDateRange === 'last30days') {
            const last30Days = new Date(today);
            last30Days.setDate(today.getDate() - 30);
            filtered = filtered.filter(item => new Date(item.ts) >= last30Days);
        }

        // Search filtering
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(item => {
                const firstKey = Object.keys(item.d || {})[0] || '';
                return (
                    firstKey.toLowerCase().includes(query) ||
                    (item.d[firstKey]?.[0]?.toString().toLowerCase().includes(query) ?? false) ||
                    (item.d.User?.[0]?.toLowerCase()?.includes(query) ?? false)
                );
            });
        }

        setFilteredData(filtered);
        setCurrentPage(0);
    }, [auditData, searchQuery, selectedDateRange]);

    function formatTimestamp(isoString) {
        const date = new Date(isoString);
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
               `${date.getDate().toString().padStart(2, '0')} ` +
               `${date.getHours().toString().padStart(2, '0')}:` +
               `${date.getMinutes().toString().padStart(2, '0')}:` +
               `${date.getSeconds().toString().padStart(2, '0')}`;
    }

    // **Pagination**
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className="min-h-screen flex flex-col p-0.5 bg-gray-100 dark:bg-gray-900">
            {/* Filters Section */}
            <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Search by Identification, Text, or User"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-1 border rounded-md focus:ring focus:ring-blue-300 w-72 dark:bg-gray-700 dark:text-white"
                />

                {/* Date-Time Range Filter */}
                <div className="flex gap-2 items-center">
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-1 border rounded-md dark:bg-gray-700 dark:text-white"
                    />
                    <span className="text-gray-600 dark:text-gray-400">to</span>
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-1 border rounded-md dark:bg-gray-700 dark:text-white"
                    />
                    <button 
                        onClick={filterByDateTimeRange}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Apply
                    </button>
                </div>

                {/* Date Range Buttons */}
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
                                onClick={() => setSelectedDateRange(range === 'all' ? '' : range)}
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

            {/* Table Section */}
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
                    <tbody>{/* Table Data */}</tbody>
                </table>
            </div>
        </div>
    );
}

export default AuditTrail;
