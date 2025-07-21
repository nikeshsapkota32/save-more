// src/pages/AnalyticsPage.jsx
import { motion } from 'framer-motion';
import { Chart } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { FaChartLine, FaUtensils, FaLeaf, FaCoins } from 'react-icons/fa';

ChartJS.register(...registerables);

const AnalyticsPage = () => {
  // Mock data for charts
  const foodSavedData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Food Saved (kg)',
        data: [65, 59, 80, 81, 56, 72],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const impactData = {
    labels: ['Meals Provided', 'CO2 Saved (tons)', 'Money Saved'],
    datasets: [
      {
        label: 'Impact Metrics',
        data: [1560, 12.4, 4200],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(251, 191, 36, 0.7)',
          'rgba(59, 130, 246, 0.7)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(251, 191, 36)',
          'rgb(59, 130, 246)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const stats = [
    { 
      title: 'Total Food Saved', 
      value: '2,450 kg', 
      change: '+12%', 
      icon: <FaUtensils className="text-3xl" />,
      color: 'bg-green-100 text-green-800'
    },
    { 
      title: 'Meals Provided', 
      value: '5,120', 
      change: '+18%', 
      icon: <FaLeaf className="text-3xl" />,
      color: 'bg-blue-100 text-blue-800'
    },
    { 
      title: 'CO2 Saved', 
      value: '18.7 tons', 
      change: '+15%', 
      icon: <FaLeaf className="text-3xl" />,
      color: 'bg-yellow-100 text-yellow-800'
    },
    { 
      title: 'Money Saved', 
      value: '£12,800', 
      change: '+22%', 
      icon: <FaCoins className="text-3xl" />,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <FaChartLine className="text-primary-600 text-3xl mr-3" />
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        </div>
        <p className="text-primary-600">Track your impact and generate reports</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md border border-primary-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p className="text-green-500 text-sm mt-1">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="text-lg font-medium mb-4">Monthly Food Saved</h3>
          <div className="h-64">
            <Chart
              type="line"
              data={foodSavedData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-md"
        >
          <h3 className="text-lg font-medium mb-4">Impact Metrics</h3>
          <div className="h-64">
            <Chart
              type="bar"
              data={impactData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Generate Reports</h3>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            Download Report
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Monthly Summary', period: 'June 2023' },
            { title: 'Tax Deduction Report', period: 'Q2 2023' },
            { title: 'Annual Impact Report', period: '2023' }
          ].map((report, index) => (
            <div key={index} className="border rounded-lg p-4 hover:border-primary-300 transition-colors">
              <h4 className="font-medium">{report.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{report.period}</p>
              <button className="mt-4 text-primary-600 hover:text-primary-800 text-sm">
                Download PDF
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;