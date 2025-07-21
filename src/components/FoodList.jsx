// src/components/FoodList.jsx
import { useEffect, useState } from 'react';
import { getFoodListings, deleteFoodListing } from '../firebase/food';
import FoodForm from './FoodForm';

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState(null);

  useEffect(() => {
    const loadFoods = async () => {
      setFoods(await getFoodListings());
    };
    loadFoods();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Available Food</h2>
      
      <button 
        onClick={() => setEditingFood({})}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Add New Listing
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {foods.map(food => (
          <div key={food.id} className="border p-4 rounded shadow">
            {food.image && (
              <img src={food.image} alt={food.name} className="w-full h-48 object-cover" />
            )}
            <h3 className="text-xl font-bold">{food.name}</h3>
            <p>{food.quantity}</p>
            
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={() => setEditingFood(food)}
                className="text-blue-500"
              >
                Edit
              </button>
              <button 
                onClick={() => deleteFoodListing(food.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingFood && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded max-w-md w-full">
            <FoodForm 
              existingFood={editingFood} 
              onClose={() => setEditingFood(null)} 
            />
          </div>
        </div>
      )}
    </div>
  );
}