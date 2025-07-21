import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // NEW: Redirect based on role
  useEffect(() => {
    if (user) {
      if (user.role === 'restaurant_owner') {
        navigate('/restaurant');
      } else {
        navigate('/volunteer');
      }
    }
  }, [user, navigate]);

  // ... existing loading state ...
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-emerald-800">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};
export default DashboardPage;