import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const schema = yup.object().shape({
  name: yup.string().required('Food name is required'),
  type: yup.string().required('Food type is required'),
  quantity: yup.string().required('Quantity is required'),
  description: yup.string(),
  allergens: yup.string(),
  expiry: yup.date().required('Expiry date is required').min(new Date(), 'Expiry date must be in the future'),
  preparationTime: yup.string().required('Preparation time is required'),
});

const AddFoodPage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      
      // For local development, we'll just use the image preview URL
      let imageUrl = imagePreview || '';
      
      // Combine form data with image URL
      const foodData = {
        ...data,
        imageUrl,
        status: 'available',
        createdAt: new Date().toISOString(),
      };
      
      // Here you would typically save to your database
      console.log('Food data to save:', foodData);
      
      toast.success('Food listing added successfully!');
      reset();
      setImagePreview(null);
    } catch (error) {
      toast.error('Error adding food listing: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Add New Food Listing</h1>
        <p className="text-gray-600 dark:text-gray-300">Share details about your surplus food</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Food Image */}
          <div>
            <label className="block text-sm font-medium mb-1">Food Image</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400">Preview</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-600 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  Choose Image
                </label>
              </div>
            </div>
          </div>

          {/* Food Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Food Name *</label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="e.g., Fresh Vegetables, Cooked Pasta"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Food Type and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-1">Food Type *</label>
              <select
                id="type"
                {...register('type')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select type</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Dairy">Dairy</option>
                <option value="Bakery">Bakery</option>
                <option value="Meat">Meat</option>
                <option value="Prepared">Prepared Meals</option>
                <option value="Other">Other</option>
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium mb-1">Quantity *</label>
              <input
                id="quantity"
                type="text"
                {...register('quantity')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 5 kg, 10 portions"
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Describe the food (optional)"
            />
          </div>

          {/* Allergens and Expiry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="allergens" className="block text-sm font-medium mb-1">Allergens</label>
              <input
                id="allergens"
                type="text"
                {...register('allergens')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Contains nuts, gluten"
              />
            </div>
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium mb-1">Expiry Date *</label>
              <input
                id="expiry"
                type="date"
                {...register('expiry')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry.message}</p>}
            </div>
          </div>

          {/* Preparation Time */}
          <div>
            <label htmlFor="preparationTime" className="block text-sm font-medium mb-1">Preparation Time *</label>
            <select
              id="preparationTime"
              {...register('preparationTime')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select preparation time</option>
              <option value="Morning">Morning (8am-12pm)</option>
              <option value="Afternoon">Afternoon (12pm-5pm)</option>
              <option value="Evening">Evening (5pm-9pm)</option>
              <option value="Flexible">Flexible</option>
            </select>
            {errors.preparationTime && <p className="text-red-500 text-sm mt-1">{errors.preparationTime.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={uploading}
              className="w-full py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Adding Food...' : 'Add Food Listing'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddFoodPage;