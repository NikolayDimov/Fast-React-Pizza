import { createSlice } from "@reduxjs/toolkit";

export interface State {
    cart: {
        pizzaId: number;
        name: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }[];
}

const initialState: State = {
    // cart: [],

    cart: [
        {
            pizzaId: 12,
            name: "Mediterranean",
            quantity: 2,
            unitPrice: 16,
            totalPrice: 32,
        },
    ],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state: State, action) {
            state.cart.push(action.payload);
        },
        deleteItem(state: State, action) {
            state.cart = state.cart.filter((item) => item.pizzaId !== action.payload);
        },
        increaseItemQuantity(state: State, action) {
            const item = state.cart.find((item) => item.pizzaId === action.payload);
            if (item) {
                item.quantity++;
                item.totalPrice = item.quantity * item.unitPrice;
            }
        },
        decreaseItemQuantity(state: State, action) {
            const item = state.cart.find((item) => item.pizzaId === action.payload);
            if (item) {
                item.quantity--;
                item.totalPrice = item.quantity * item.unitPrice;
            }
        },
        clearCart(state: State) {
            state.cart = [];
        },
    },
});

export const { addItem, deleteItem, increaseItemQuantity, decreaseItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
