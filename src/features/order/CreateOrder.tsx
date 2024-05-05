import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { PizzaOrder } from "./Order";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { UserRootState } from "../user/Username";
import { clearCart, getCart, getTotalCartPrice } from "../cart/cartSlice";
import EmptyCart from "../cart/EmptyCart";
import store from "../../store";
import { useState } from "react";
import { formatCurrency } from "../../utils/helpers";
import { fetchAddress } from "../user/userSlice";

export interface Order {
    customer: string;
    phone: string;
    address: string;
    priority?: boolean;
    cart: PizzaOrder[];
}

export interface Errors {
    phone?: string;
}

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) => /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(str);

// const fakeCart: PizzaOrder[] = [
//     {
//         pizzaId: 12,
//         name: "Mediterranean",
//         quantity: 2,
//         unitPrice: 16,
//         totalPrice: 32,
//     },
//     {
//         pizzaId: 6,
//         name: "Vegetale",
//         quantity: 1,
//         unitPrice: 13,
//         totalPrice: 13,
//     },
//     {
//         pizzaId: 11,
//         name: "Spinach and Mushroom",
//         quantity: 1,
//         unitPrice: 15,
//         totalPrice: 15,
//     },
// ];

function CreateOrder() {
    const dispatch = useDispatch();
    const { username, status: addressStatus, position, address, error: errorAddress } = useSelector((state: UserRootState) => state.user);
    const isLoadingAddress = addressStatus === "loading";
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    const [withPriority, setWithPriority] = useState(false);

    const formErrors: Errors | undefined = useActionData() as Errors | undefined;
    // const cart = fakeCart;
    const cart = useSelector(getCart);
    console.log(cart);

    const totalCartPrice = useSelector(getTotalCartPrice);
    const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
    const totalPrice = totalCartPrice + priorityPrice;

    if (!cart.length) return <EmptyCart />;

    return (
        <div className="py-6 px-4">
            <h2 className="text-xl font-semibold mb-8">Ready to order? Let's go!</h2>

            {/* <Form method="POST" action="/order/new"> */}
            <Form method="POST">
                <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
                    <label className="sm:basis-40">First Name</label>
                    <input className="input grow" type="text" name="customer" defaultValue={username} required />
                </div>

                <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
                    <label className="sm:basis-40">Phone number</label>
                    <div className="grow">
                        <input className="input w-full" type="tel" name="phone" required />
                        {formErrors?.phone && <p className="text-xs mt-2 text-red-700 bg-red-100 p2 rounded-md">{formErrors.phone}</p>}
                    </div>
                </div>

                <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center relative">
                    <label className="sm:basis-40">Address</label>
                    <div className="grow">
                        <input
                            className="input w-full"
                            type="text"
                            name="address"
                            disabled={isLoadingAddress}
                            defaultValue={address}
                            required
                        />
                        {addressStatus === "error" && <p className="text-xs mt-2 text-red-700 bg-red-100 p2 rounded-md">{errorAddress}</p>}
                    </div>
                    {!position.latitude && !position.longitude && (
                        <span className="absolute right-0.5 z-10 top=[3px]">
                            <Button
                                disabled={isLoadingAddress}
                                type="small"
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(fetchAddress());
                                }}
                            >
                                Get Position
                            </Button>
                        </span>
                    )}
                </div>

                <div className="mb-12 flex gap-5 items-center">
                    <input
                        className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
                        type="checkbox"
                        name="priority"
                        id="priority"
                        checked={withPriority}
                        onChange={(e) => setWithPriority(e.target.checked)}
                    />
                    <label className="font-medium" htmlFor="priority">
                        Want to yo give your order priority?
                    </label>
                </div>

                <div>
                    <input type="hidden" name="cart" value={JSON.stringify(cart)} />
                    <input
                        type="hidden"
                        name="postion"
                        value={position.longitude && position.latitude ? `${position.latitude},${position.longitude}` : ""}
                    />
                    <Button type="primary" disabled={isSubmitting || isLoadingAddress}>
                        {isSubmitting ? "Placing order..." : `Order now for ${formatCurrency(totalPrice)}`}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const data: { [key: string]: string | File } = Object.fromEntries(formData);

    console.log("Form data:", data);

    const order: Partial<Order> = {
        ...data,
        cart: JSON.parse(data.cart as string) as PizzaOrder[],
        priority: data.priority === "on",
    };

    console.log(order);

    const errors: Errors = {};
    if ("phone" in data && typeof data.phone === "string") {
        order.phone = data.phone;
    }
    if (order.phone && !isValidPhone(order.phone as string)) {
        errors.phone = "Please give us your correct phone number. We might need it to contact you.";
    }

    if (Object.keys(errors).length > 0) return errors;

    // If everything is okay, create a new order and redirect
    const newOrder = await createOrder(order as Order);

    // Do NOT overuse
    store.dispatch(clearCart());

    return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
