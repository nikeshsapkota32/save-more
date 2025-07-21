// src/api/food.js
import { db } from "../firebase/config";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Add new food listing
export const addFoodListing = async (foodData) => {
  try {
    const docRef = await addDoc(collection(db, "foodListings"), foodData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Get all food listings
export const getFoodListings = async () => {
  const querySnapshot = await getDocs(collection(db, "foodListings"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};