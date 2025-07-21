// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FoodListPage from './pages/FoodListPage';
import AddFoodPage from './pages/AddFoodPage';
import FoodDetailPage from './pages/FoodDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import VolunteerPage from './pages/VolunteerPage';
import ProtectedRoute from './components/ProtectedRoute';
import TestimonialPage from './pages/TestimonialPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorkPage';
import './App.css';
import RestaurantDashboard from './pages/ResturantDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import FoodList from './components/FoodList';

function App() {
  return (
    <div className="app min-h-screen bg-green-50 text-gray-800">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="/testimonials" element={<TestimonialPage />} />
          <Route path="/about" element={<AboutPage />} />
<Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="food" element={<FoodListPage />} />
            <Route path="food/add" element={<AddFoodPage />} />
            <Route path="food/:id" element={<FoodDetailPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="volunteers" element={<VolunteerPage />} />
            <Route path="/restaurant" element={<RestaurantDashboard />} />
           <Route path="/volunteer" element={<VolunteerDashboard />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;