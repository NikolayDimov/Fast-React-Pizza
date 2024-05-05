import { formatCurrency } from "../../utils/helpers";
import DeleteItem from "./DeleteItem";
import { CartItemProps } from "./cartSlice";

const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const { pizzaId, name, quantity, totalPrice } = item;

    return (
        <li className="py-3 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <p className="mb-1 sm:mb-0">
                {quantity}&times; {name}
            </p>
            <div className="flex gap-4 justify-between items-center">
                <p className="text-sm font-bold">{formatCurrency(totalPrice)}</p>

                <DeleteItem pizzaId={pizzaId} />
            </div>
        </li>
    );
};

export default CartItem;
