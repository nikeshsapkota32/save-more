// src/components/FoodForm.jsx
import { useState } from 'react';
import { saveFoodListing } from '../firebase/food';

export default function FoodForm({ existingFood, onClose }) {
  const [form, setForm] = useState({
    name: existingFood?.name || '',
    quantity: existingFood?.quantity || '',
    ...existingFood
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveFoodListing(form, imageFile);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        placeholder="Food Name"
        value={form.name}
        onChange={(e) => setForm({...form, name: e.target.value})}
        required
        className="w-full p-2 border rounded"
      />
      
      <input
        placeholder="Quantity (e.g., 5 boxes)"
        value={form.quantity}
        onChange={(e) => setForm({...form, quantity: e.target.value})}
        required
        className="w-full p-2 border rounded"
      />
      
      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="w-full p-2 border rounded"
      />
      
      {form.image && !imageFile && (
        <img src={form.image} alt="Preview" className="h-32 object-cover" />
      )}

      <button 
        type="submit" 
        disabled={isSaving}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}