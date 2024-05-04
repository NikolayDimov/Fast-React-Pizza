import Button from "../../ui/Button";
import { formatCurrency } from "../../utils/helpers";

interface CartItemProps {
    item: {
        pizzaId: number;
        name: string;
        quantity: number;
        totalPrice: number;
    };
}

function CartItem({ item }: CartItemProps) {
    const { name, quantity, totalPrice } = item;

    return (
        <li className="py-3 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <p className="mb-1 sm:mb-0">
                {quantity}&times; {name}
            </p>
            <div className="flex justify-between items-center">
                <p className="text-s, font-bold">{formatCurrency(totalPrice)}</p>
                <Button type="small">Delete</Button>
            </div>
        </li>
    );
}

export default CartItem;
