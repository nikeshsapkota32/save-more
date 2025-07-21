// src/components/ImpactStats.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaRecycle, FaHandHoldingHeart, FaUtensils } from 'react-icons/fa';
import { GiMeal } from 'react-icons/gi';

const ImpactStats = ({ listings = [] }) => {
  const calculateStats = () => {
    const totalItems = listings.length;
    const availableItems = listings.filter(item => item.status === 'available').length;
    const pendingItems = listings.filter(item => item.status === 'pending').length;
    const claimedItems = listings.filter(item => item.status === 'claimed').length;
    
    // Estimate meals saved (assuming each item can feed 2-4 people)
    const estimatedMeals = totalItems * 3;
    
    // Estimate CO2 saved (assuming 3.5kg CO2 per meal saved)
    const co2Saved = estimatedMeals * 3.5;
    
    // Estimate water saved (assuming 1250 liters per meal)
    const waterSaved = estimatedMeals * 1250;
    
    return {
      totalItems,
      availableItems,
      pendingItems,
      claimedItems,
      estimatedMeals,
      co2Saved,
      waterSaved
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total Food Items',
      value: stats.totalItems,
      icon: <FaUtensils className="text-3xl text-emerald-600" />,
      color: 'bg-emerald-100',
      description: 'Items added to the platform'
    },
    {
      title: 'Available for Pickup',
      value: stats.availableItems,
      icon: <FaLeaf className="text-3xl text-green-600" />,
      color: 'bg-green-100',
      description: 'Ready for volunteers'
    },
    {
      title: 'Pending Pickups',
      value: stats.pendingItems,
      icon: <FaHandHoldingHeart className="text-3xl text-amber-600" />,
      color: 'bg-amber-100',
      description: 'Scheduled for pickup'
    },
    {
      title: 'Estimated Meals',
      value: stats.estimatedMeals,
      icon: <GiMeal className="text-3xl text-rose-600" />,
      color: 'bg-rose-100',
      description: 'People that can be fed'
    }
  ];

  const impactMetrics = [
    {
      label: 'CO₂ Saved',
      value: `${stats.co2Saved.toFixed(1)} kg`,
      description: 'Carbon emissions prevented'
    },
    {
      label: 'Water Saved',
      value: `${(stats.waterSaved / 1000).toFixed(1)}k L`,
      description: 'Water resources conserved'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-2xl shadow-lg ${stat.color}`}
          >
            <div className="flex items-center justify-between mb-4">
              {stat.icon}
              <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{stat.title}</h3>
            <p className="text-sm text-gray-600">{stat.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Impact Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-lg p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Environmental Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {impactMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold mb-2">{metric.value}</div>
              <div className="text-xl font-medium mb-1">{metric.label}</div>
              <div className="text-emerald-100 text-sm">{metric.description}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <FaRecycle className="text-4xl mx-auto mb-2 text-emerald-200" />
          <p className="text-emerald-100">
            Every food item rescued helps reduce waste and feed communities
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ImpactStats; 