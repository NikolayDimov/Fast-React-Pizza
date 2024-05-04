import { createSlice } from "@reduxjs/toolkit";

// Define a single type for the cart item used throughout the app
export interface CartItemType {
    pizzaId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

// Use CartItem type for component props
export interface CartItemProps {
    item: CartItemType;
}

// Define the structure of the entire cart within the state
export type CartRootState = {
    cart: {
        cart: CartItemType[];
    };
};

export interface CartState {
    cart: CartItemType[];
}

const initialState: CartState = {
    cart: [],

    // cart: [
    //     {
    //         pizzaId: 12,
    //         name: "Mediterranean",
    //         quantity: 2,
    //         unitPrice: 16,
    //         totalPrice: 32,
    //     },
    // ],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state: CartState, action) {
            state.cart.push(action.payload);
        },
        deleteItem(state: CartState, action) {
            state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
        },
        increaseItemQuantity(state: CartState, action) {
            const item = state.cart.find((item) => item.pizzaId === action.payload);
            if (item) {
                item.quantity++;
                item.totalPrice = item.quantity * item.unitPrice;
            }
        },
        decreaseItemQuantity(state: CartState, action) {
            const item = state.cart.find((item) => item.pizzaId === action.payload);
            if (item) {
                item.quantity--;
                item.totalPrice = item.quantity * item.unitPrice;
            }
        },
        clearCart(state: CartState) {
            state.cart = [];
        },
    },
});

export const { addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

export const getCart = (state: CartRootState) => state.cart.cart;

export const getTotalCartQuantity = (state: CartRootState) => state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state: CartRootState) => state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);
