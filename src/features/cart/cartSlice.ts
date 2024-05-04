import { createSlice } from "@reduxjs/toolkit";
import { CartItemType } from "./CartItem";

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
