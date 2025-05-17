import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiEye, FiUsers, FiClock, FiTrendingDown } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/userAuthStore';
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
    Filler
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
    Legend,
    Filler
);

// Map metric keys to icons and labels
const metricDetails = {
    totalSessions: { 
        label: 'Total Sessions', 
        icon: <FiEye className="w-5 h-5 text-blue-500" />,
        description: 'The total number of sessions started by visitors in the selected time range.'
    },
    uniqueVisitors: { 
        label: 'Unique Visitors', 
        icon: <FiUsers className="w-5 h-5 text-green-500" />,
        description: 'The number of distinct users who visited your portfolio.'
    },
    averageSessionDuration: { 
        label: 'Avg. Session Duration', 
        icon: <FiClock className="w-5 h-5 text-purple-500" />, 
        suffix: 's',
        description: 'The average length of a session in seconds.'
    },
    bounceRate: { 
        label: 'Bounce Rate', 
        icon: <FiTrendingDown className="w-5 h-5 text-red-500" />, 
        suffix: '%',
        description: 'The percentage of sessions where users left after viewing only one page.'
    },
};

const Analytics = () => {
    const navigate = useNavigate();
    const { token, isAuthenticated, logout, userId } = useAuthStore();
    const [timeRange, setTimeRange] = useState('7d');
    const [metrics, setMetrics] = useState({
        totalSessions: 0,
        uniqueVisitors: 0,
        averageSessionDuration: 0,
        bounceRate: 0,
    });
    const [trafficSources, setTrafficSources] = useState([]);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [timeTrends, setTimeTrends] = useState([]);
    const [browserStats, setBrowserStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            navigate('/login', { state: { message: "Please log in to view analytics" } });
            return;
        }

        const fetchAnalyticsData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const headers = { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // Fetch all analytics data in parallel
                const [summaryRes, trafficRes, devicesRes, trendsRes, browsersRes] = await Promise.all([
                    axios.get(`http://localhost:3000/api/analytics/summary?userId=${userId}&timeRange=${timeRange}`, { headers }),
                    axios.get(`http://localhost:3000/api/analytics/traffic-sources?userId=${userId}&timeRange=${timeRange}`, { headers }),
                    axios.get(`http://localhost:3000/api/analytics/device-types?userId=${userId}&timeRange=${timeRange}`, { headers }),
                    axios.get(`http://localhost:3000/api/analytics/time-trends?userId=${userId}&timeRange=${timeRange}`, { headers }),
                    axios.get(`http://localhost:3000/api/analytics/browser-stats?userId=${userId}&timeRange=${timeRange}`, { headers })
                ]);

                setMetrics(summaryRes.data.data);
                setTrafficSources(trafficRes.data.data);
                setDeviceTypes(devicesRes.data.data);
                setTimeTrends(trendsRes.data.data);
                setBrowserStats(browsersRes.data.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
                if (error.response?.status === 403) {
                    setError('Your session has expired. Please log in again.');
                    logout();
                    navigate('/login', { state: { message: "Your session has expired. Please log in again." } });
                } else {
                    setError('Failed to load analytics data. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [timeRange, token, isAuthenticated, navigate, logout, userId]);

    // Chart options
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

    // Prepare chart data
    const pageViewsData = {
        labels: timeTrends.map(trend => trend.date),
        datasets: [{
            label: 'Page Views',
            data: timeTrends.map(trend => trend.pageViews),
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgb(59, 130, 246)',
            tension: 0.3,
            pointBackgroundColor: 'rgb(59, 130, 246)',
            pointRadius: 4,
        }],
    };

    const trafficSourcesData = {
        labels: trafficSources.map(source => source.source),
        datasets: [{
            label: 'Traffic Source',
            data: trafficSources.map(source => source.count),
            backgroundColor: [
                'rgba(59, 130, 246, 0.7)',
                'rgba(16, 185, 129, 0.7)',
                'rgba(249, 115, 22, 0.7)',
                'rgba(107, 114, 128, 0.7)',
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

    const deviceTypesData = {
        labels: deviceTypes.map(device => device.device),
        datasets: [{
            label: 'Users by Device',
            data: deviceTypes.map(device => device.count),
            backgroundColor: [
                'rgba(139, 92, 246, 0.6)',
                'rgba(239, 68, 68, 0.6)',
                'rgba(245, 158, 11, 0.6)',
            ],
            borderColor: [
                'rgba(139, 92, 246, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(245, 158, 11, 1)',
            ],
            borderWidth: 1,
        }],
    };

    const browserStatsData = {
        labels: browserStats.map(browser => `${browser.browser} ${browser.version}`),
        datasets: [{
            label: 'Users by Browser',
            data: browserStats.map(browser => browser.count),
            backgroundColor: 'rgba(20, 184, 166, 0.6)',
            borderColor: 'rgba(20, 184, 166, 1)',
            borderWidth: 1,
        }],
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold mb-2">Error</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

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
                        <option value="24h">Last 24 hours</option>
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(metricDetails).map(([key, { label, icon, suffix, description }]) => (
                    <div key={key} className="relative group bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-start gap-4 cursor-pointer">
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
                        {/* Tooltip */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-3 py-2 z-10 w-56 text-center pointer-events-none">
                            {description}
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
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 w-full">Traffic Sources</h3>
                    <div className="w-[250px] h-[250px] mt-2">
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

                {/* Browser Stats Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Browser Distribution</h3>
                    <div className="h-[300px]">
                        <Bar data={browserStatsData} options={barChartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics; 