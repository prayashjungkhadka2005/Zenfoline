import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [timeRange, setTimeRange] = useState('7d');
    const [metrics, setMetrics] = useState({
        totalViews: 0,
        uniqueVisitors: 0,
        averageTimeOnSite: 0,
        bounceRate: 0,
    });

    // Sample data - replace with actual API calls
    const viewsData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Page Views',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            },
        ],
    };

    const visitorData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Unique Visitors',
                data: [45, 39, 60, 61, 46, 45, 30],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    useEffect(() => {
        // Simulated API call - replace with actual API integration
        setMetrics({
            totalViews: 1250,
            uniqueVisitors: 850,
            averageTimeOnSite: 2.5,
            bounceRate: 35,
        });
    }, [timeRange]);

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div>
                <h1 className="text-xl font-semibold text-gray-800">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Track your portfolio's performance and engagement.</p>
            </div>

            {/* Time Range Selector */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Time Range</h2>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 p-2.5"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                    </select>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(metrics).map(([key, value]) => (
                    <div key={key} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                            {key.split(/(?=[A-Z])/).join(' ')}
                        </h3>
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Page Views Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Page Views Over Time</h3>
                    <div className="h-[300px]">
                        <Line data={viewsData} />
                    </div>
                </div>

                {/* Traffic Sources Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Traffic Sources</h3>
                    <div className="h-[300px]">
                        <Bar data={visitorData} />
                    </div>
                </div>

                {/* Device Types Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Types</h3>
                    <div className="h-[300px]">
                        <Bar data={viewsData} />
                    </div>
                </div>

                {/* Geographic Distribution Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Distribution</h3>
                    <div className="h-[300px]">
                        <Bar data={viewsData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics; 