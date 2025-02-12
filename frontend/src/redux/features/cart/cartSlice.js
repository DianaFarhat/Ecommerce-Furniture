import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cartUtils";

// Function to get the user’s cart using the user ID
const getUserCart = () => {
  const storedUser = JSON.parse(localStorage.getItem("userInfo"));
  const loggedInUserId = storedUser?.data?.user._id; // Extract user ID safely

  if (!loggedInUserId) return { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

  const allCarts = JSON.parse(localStorage.getItem("carts")) || {}; // Get all carts
  return allCarts[loggedInUserId] || { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };
};

const initialState = getUserCart();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
 addToCart: (state, action) => {
  const { user, rating, numReviews, reviews, qty = 1, ...item } = action.payload; // Extract qty

  const newItem = {
    ...item,
    qty, // Explicitly set qty
    isBundle: item.isBundle || false,
    discount: item.discount || 0,
  };

  if (!newItem.isBundle) {
    // If it's NOT a bundle, check if the item already exists in cart
    const existItem = state.cartItems.find((x) => x._id === item._id && x.isBundle==false);

    if (existItem) {
      // If item exists, update its quantity
     state.cartItems = state.cartItems.map((x) =>
        x._id === existItem._id && !x.isBundle
          ? { ...x, qty: existItem.qty + 1 } 
          : x
      );
    } else {
      // If item does NOT exist, add as a new entry
      state.cartItems = [...state.cartItems, newItem];
    }
  } else {
    // If it IS a bundle, always add as a separate entry
    state.cartItems = [...state.cartItems, newItem];
  }

  return updateCart(state);
},


    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },

    resetCart: (state) => {
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      const loggedInUserId = storedUser?.data?.user._id; // Extract user ID safely
      if (loggedInUserId) {
        const allCarts = JSON.parse(localStorage.getItem("carts")) || {};
        delete allCarts[loggedInUserId]; // Remove only the logged-in user's cart
        localStorage.setItem("carts", JSON.stringify(allCarts));
      }
      return getUserCart(); // Reset the cart with the user's cart data
    },

   refreshCart:(state)=>{
      const storedUser = JSON.parse(localStorage.getItem("userInfo"));
      const loggedInUserId = storedUser?.data?.user._id; // Extract user ID safely
    
      if (!loggedInUserId) return { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };
    
      const allCarts = JSON.parse(localStorage.getItem("carts")) || {}; // Get all carts
      return allCarts[loggedInUserId] || { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };
    
    
  }}
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  resetCart,refreshCart
} = cartSlice.actions;

export default cartSlice.reducer;