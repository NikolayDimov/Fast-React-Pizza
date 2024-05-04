import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";

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

function CartItem({ item }: CartItemProps) {
    const { name, quantity, totalPrice } = item;

    return (
        <li className="py-3 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <p className="mb-1 sm:mb-0">
                {quantity}&times; {name}
            </p>
            <div className="flex gap-4 justify-between items-center">
                <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>
                <Button type="small">Delete</Button>
            </div>
        </li>
    );
}

export default CartItem;

export const getTotalCartQuantity = (state: CartRootState) => state.cart.cart.reduce((sum, item) => sum + item.quantity, 0);

export const getTotalCartPrice = (state: CartRootState) => state.cart.cart.reduce((sum, item) => sum + item.totalPrice, 0);
