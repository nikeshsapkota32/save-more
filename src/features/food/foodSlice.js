// src/features/food/foodSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getFoodListings,
  getRestaurantListings,
  getAvailableListings,
  saveFoodListing,
  updateListingStatus,
  deleteFoodListing as firebaseDeleteFoodListing,
  uploadImage
} from '../../firebase/food';

export const fetchFoodListings = createAsyncThunk(
  'food/fetchFoodListings',
  async () => {
    const listings = await getFoodListings();
    return listings;
  }
);

export const fetchRestaurantListings = createAsyncThunk(
  'food/fetchRestaurantListings',
  async (restaurantId) => {
    const listings = await getRestaurantListings(restaurantId);
    return listings;
  }
);

export const fetchAvailableListings = createAsyncThunk(
  'food/fetchAvailableListings',
  async () => {
    const listings = await getAvailableListings();
    return listings;
  }
);

export const addFoodListing = createAsyncThunk(
  'food/addFoodListing',
  async ({ foodData, userId }, { rejectWithValue }) => {
    try {
      // Upload image if exists
      let imageUrl = '';
      if (foodData.imageFile) {
        imageUrl = await uploadImage(foodData.imageFile);
      }
      
      // Add to Firebase
      const listingData = {
        ...foodData,
        imageUrl,
        userId,
        restaurantId: userId, // For restaurant-specific listings
        status: 'available'
      };
      delete listingData.imageFile;
      
      const result = await saveFoodListing({ ...listingData }, foodData.imageFile, userId);
      return { id: result.id, ...listingData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFoodStatus = createAsyncThunk(
  'food/updateFoodStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await updateListingStatus(id, status);
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFoodListing = createAsyncThunk(
  'food/deleteFoodListing',
  async (id, { rejectWithValue }) => {
    try {
      await firebaseDeleteFoodListing(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const foodSlice = createSlice({
  name: 'food',
  initialState: {
    listings: [],
    restaurantListings: [],
    availableListings: [],
    status: 'idle',
    error: null
  },
  reducers: {
    setListings: (state, action) => {
      state.listings = action.payload;
    },
    setRestaurantListings: (state, action) => {
      state.restaurantListings = action.payload;
    },
    setAvailableListings: (state, action) => {
      state.availableListings = action.payload;
    },
    addListing: (state, action) => {
      state.listings.unshift(action.payload);
      if (action.payload.status === 'available') {
        state.availableListings.unshift(action.payload);
      }
    },
    updateListing: (state, action) => {
      const { id, ...updates } = action.payload;
      state.listings = state.listings.map(listing => 
        listing.id === id ? { ...listing, ...updates } : listing
      );
      state.restaurantListings = state.restaurantListings.map(listing => 
        listing.id === id ? { ...listing, ...updates } : listing
      );
      state.availableListings = state.availableListings.map(listing => 
        listing.id === id ? { ...listing, ...updates } : listing
      );
    },
    removeListing: (state, action) => {
      const id = action.payload;
      state.listings = state.listings.filter(listing => listing.id !== id);
      state.restaurantListings = state.restaurantListings.filter(listing => listing.id !== id);
      state.availableListings = state.availableListings.filter(listing => listing.id !== id);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all listings
      .addCase(fetchFoodListings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFoodListings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.listings = action.payload;
      })
      .addCase(fetchFoodListings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch restaurant listings
      .addCase(fetchRestaurantListings.fulfilled, (state, action) => {
        state.restaurantListings = action.payload;
      })
      // Fetch available listings
      .addCase(fetchAvailableListings.fulfilled, (state, action) => {
        state.availableListings = action.payload;
      })
      // Add food listing
      .addCase(addFoodListing.fulfilled, (state, action) => {
        state.listings.unshift(action.payload);
        if (action.payload.status === 'available') {
          state.availableListings.unshift(action.payload);
        }
      })
      // Update status
      .addCase(updateFoodStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        state.listings = state.listings.map(listing => 
          listing.id === id ? { ...listing, status } : listing
        );
        state.restaurantListings = state.restaurantListings.map(listing => 
          listing.id === id ? { ...listing, status } : listing
        );
        state.availableListings = state.availableListings.map(listing => 
          listing.id === id ? { ...listing, status } : listing
        );
      })
      // Delete listing
      .addCase(deleteFoodListing.fulfilled, (state, action) => {
        const id = action.payload;
        state.listings = state.listings.filter(listing => listing.id !== id);
        state.restaurantListings = state.restaurantListings.filter(listing => listing.id !== id);
        state.availableListings = state.availableListings.filter(listing => listing.id !== id);
      });
  }
});

export const { 
  setListings, 
  setRestaurantListings, 
  setAvailableListings,
  addListing,
  updateListing,
  removeListing
} = foodSlice.actions;

export default foodSlice.reducer;