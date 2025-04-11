import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiEye, FiUsers, FiClock, FiTrendingDown } from 'react-icons/fi';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
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
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Map metric keys to icons and labels
const metricDetails = {
    totalViews: { label: 'Total Views', icon: <FiEye className="w-5 h-5 text-blue-500" /> },
    uniqueVisitors: { label: 'Unique Visitors', icon: <FiUsers className="w-5 h-5 text-green-500" /> },
    averageTimeOnSite: { label: 'Avg. Time on Site', icon: <FiClock className="w-5 h-5 text-purple-500" />, suffix: 'm' },
    bounceRate: { label: 'Bounce Rate', icon: <FiTrendingDown className="w-5 h-5 text-red-500" />, suffix: '%' },
};

const Analytics = () => {
    const [timeRange, setTimeRange] = useState('7d');
    const [metrics, setMetrics] = useState({
        totalViews: 0,
        uniqueVisitors: 0,
        averageTimeOnSite: 0,
        bounceRate: 0,
    });

    // --- Sample Data ---
    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };
    
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true },
        },
    };

    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { padding: 15, boxWidth: 12, font: { size: 11 } }
            },
        },
    };

    const pageViewsData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Views',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.1)', // Lighter blue fill
            borderColor: 'rgb(59, 130, 246)', // Blue line
            tension: 0.3, // Smoother curve
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointRadius: 4,
        }],
    };

    // New Doughnut data for Traffic Sources
    const trafficSourcesData = {
        labels: ['Direct', 'Referral', 'Organic Search', 'Social'],
        datasets: [{
            label: 'Traffic Source',
            data: [300, 150, 450, 100],
            backgroundColor: [
                'rgba(59, 130, 246, 0.7)', // Blue
                'rgba(16, 185, 129, 0.7)', // Green
                'rgba(249, 115, 22, 0.7)',  // Orange
                'rgba(107, 114, 128, 0.7)', // Gray
            ],
            borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(16, 185, 129, 1)',
                'rgba(249, 115, 22, 1)',
                'rgba(107, 114, 128, 1)',
            ],
            borderWidth: 1,
        }],
    };

    // Sample data for Device Types (Bar Chart)
    const deviceTypesData = {
        labels: ['Desktop', 'Mobile', 'Tablet'],
        datasets: [{
            label: 'Users by Device',
            data: [550, 650, 50],
            backgroundColor: [
                'rgba(139, 92, 246, 0.6)', // Purple
                'rgba(239, 68, 68, 0.6)', // Red
                'rgba(245, 158, 11, 0.6)', // Amber
            ],
            borderColor: [
                'rgba(139, 92, 246, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(245, 158, 11, 1)',
            ],
            borderWidth: 1,
        }],
    };

    // Sample data for Geo Distribution (Horizontal Bar maybe?) Let's stick to Vertical Bar for now
     const geoData = {
        labels: ['USA', 'India', 'UK', 'Canada', 'Germany'],
        datasets: [{
            label: 'Visitors by Country',
            data: [400, 250, 150, 100, 50],
             backgroundColor: 'rgba(20, 184, 166, 0.6)', // Teal
             borderColor: 'rgba(20, 184, 166, 1)',
            borderWidth: 1,
        }],
    };


    useEffect(() => {
        // Simulated API call - replace with actual API integration
        // Example: fetch(`/api/analytics?range=${timeRange}`).then(...)
        setMetrics({
            totalViews: 1250,
            uniqueVisitors: 850,
            averageTimeOnSite: 2.5,
            bounceRate: 35,
        });
    }, [timeRange]);

    return (
        <div className="space-y-5">
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
                {Object.entries(metricDetails).map(([key, { label, icon, suffix }]) => (
                    <div key={key} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                             {icon}
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                {label}
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {metrics[key]}{suffix || ''}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Page Views Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Page Views Over Time</h3>
                    <div className="h-[300px]">
                        <Line data={pageViewsData} options={lineChartOptions} />
                    </div>
                </div>

                {/* Traffic Sources Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center"> {/* Center Doughnut */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 w-full">Traffic Sources</h3> {/* Title full width */}
                    <div className="w-[250px] h-[250px] mt-2"> {/* Fixed size container */}
                        <Doughnut data={trafficSourcesData} options={doughnutChartOptions} />
                    </div>
                </div>

                {/* Device Types Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Device Types</h3>
                    <div className="h-[300px]">
                        <Bar data={deviceTypesData} options={barChartOptions} />
                    </div>
                </div>

                {/* Geographic Distribution Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Distribution</h3>
                    <div className="h-[300px]">
                        <Bar data={geoData} options={barChartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics; 