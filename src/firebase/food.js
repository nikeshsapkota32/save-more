// src/firebase/food.js
import { db, storage, auth } from './config';
import { 
  collection, addDoc, getDocs, doc, 
  updateDoc, deleteDoc, onSnapshot, query,
  orderBy, where, serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// 0. Upload image to Firebase Storage
export const uploadImage = async (imageFile) => {
  const storageRef = ref(storage, `foodImages/${Date.now()}_${imageFile.name}`);
  await uploadBytes(storageRef, imageFile);
  return await getDownloadURL(storageRef);
};

// 1. Add/Edit Food Listing (handles image upload)
export const saveFoodListing = async ({ id, ...data }, imageFile, userId) => {
  let imageUrl = data.image || null;
  
  // Upload new image if exists
  if (imageFile) {
    const storageRef = ref(storage, `foodImages/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    imageUrl = await getDownloadURL(storageRef);
  }

  const foodData = { 
    ...data, 
    image: imageUrl,
    userId: userId || auth.currentUser?.uid,
    restaurantId: userId || auth.currentUser?.uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: 'available'
  };

  return id 
    ? await updateDoc(doc(db, 'foodListings', id), foodData)
    : await addDoc(collection(db, 'foodListings'), foodData);
};

// 2. Get All Listings
export const getFoodListings = async () => {
  const snapshot = await getDocs(collection(db, 'foodListings'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// 3. Get Listings by Restaurant (for restaurant dashboard)
export const getRestaurantListings = async (restaurantId) => {
  const q = query(
    collection(db, 'foodListings'),
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// 4. Get Available Listings (for volunteer dashboard)
export const getAvailableListings = async () => {
  const q = query(
    collection(db, 'foodListings'),
    where('status', '==', 'available'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// 5. Real-time listener for all listings
export const subscribeToFoodListings = (callback) => {
  const q = query(collection(db, 'foodListings'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(listings);
  });
};

// 6. Real-time listener for restaurant listings
export const subscribeToRestaurantListings = (restaurantId, callback) => {
  const q = query(
    collection(db, 'foodListings'),
    where('restaurantId', '==', restaurantId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(listings);
  });
};

// 7. Real-time listener for available listings
export const subscribeToAvailableListings = (callback) => {
  const q = query(
    collection(db, 'foodListings'),
    where('status', '==', 'available'),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(listings);
  });
};

// 8. Update listing status
export const updateListingStatus = async (id, status) => {
  await updateDoc(doc(db, 'foodListings', id), {
    status,
    updatedAt: serverTimestamp()
  });
};

// 9. Delete Listing
export const deleteFoodListing = async (id) => {
  await deleteDoc(doc(db, 'foodListings', id));
};

// 10. Add pickup request
export const addPickupRequest = async (listingId, volunteerData) => {
  const pickupData = {
    listingId,
    volunteerId: auth.currentUser?.uid,
    volunteerName: volunteerData.name,
    volunteerEmail: volunteerData.email,
    status: 'pending',
    requestedAt: serverTimestamp()
  };
  
  return await addDoc(collection(db, 'pickupRequests'), pickupData);
};

// 11. Get pickup requests for a listing
export const getPickupRequests = async (listingId) => {
  const q = query(
    collection(db, 'pickupRequests'),
    where('listingId', '==', listingId),
    orderBy('requestedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};