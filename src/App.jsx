// src/App.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense } from 'react';
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
import RestaurantDashboard from './pages/ResturantDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import FoodList from './components/FoodList';
import ErrorBoundary from './components/ui/ErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { trackPageView } from './services/analyticsService';
import './App.css';

function App() {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    const pageName = getPageName(location.pathname);
    trackPageView(pageName, {
      path: location.pathname,
      search: location.search
    });
  }, [location]);

  return (
    <ErrorBoundary>
      <div className="app min-h-screen bg-green-50 text-gray-800">
        <Suspense
          fallback={
            <LoadingSpinner
              size="lg"
              text="Loading SaveThePlate..."
              fullScreen
            />
          }
        >
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
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

// Helper function to get readable page names for analytics
function getPageName(pathname) {
  const routes = {
    '/': 'Home',
    '/login': 'Login',
    '/register': 'Register',
    '/dashboard': 'Dashboard',
    '/food': 'Food List',
    '/food/add': 'Add Food',
    '/analytics': 'Analytics',
    '/volunteers': 'Volunteers',
    '/restaurant': 'Restaurant Dashboard',
    '/volunteer': 'Volunteer Dashboard',
    '/testimonials': 'Testimonials',
    '/about': 'About',
    '/how-it-works': 'How It Works'
  };

  // Handle dynamic routes like /food/:id
  if (pathname.startsWith('/food/') && pathname !== '/food/add') {
    return 'Food Detail';
  }

  return routes[pathname] || 'Unknown Page';
}

export default App;