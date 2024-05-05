// Test ID: IIDSAT

import { useFetcher, useLoaderData } from "react-router-dom";
import { useEffect } from "react";
import { getOrder } from "../../services/apiRestaurant";
import { calcMinutesLeft, formatCurrency, formatDate } from "../../utils/helpers";
import OrderItem from "./OrderItem";

export interface PizzaOrder {
    pizzaId: number;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface OrderData {
    id: string;
    status?: string;
    customer?: string;
    phone?: string;
    address?: string;
    priority: boolean;
    estimatedDelivery: string;
    cart: PizzaOrder[];
    position: string;
    orderPrice: number;
    priorityPrice: number;
}

export interface OrderItemData {
    id: number;
    imageUrl: string;
    ingredients: string[];
    name: string;
    soldOut: boolean;
    unitPrice: number;
}

// const order: OrderData = {
//     id: "ABCDEF",
//     customer: "Jonas",
//     phone: "123456789",
//     address: "Arroios, Lisbon , Portugal",
//     priority: true,
//     estimatedDelivery: "2027-04-25T10:00:00",
//     cart: [
//         {
//             pizzaId: 7,
//             name: "Napoli",
//             quantity: 3,
//             unitPrice: 16,
//             totalPrice: 48,
//         },
//         {
//             pizzaId: 5,
//             name: "Diavola",
//             quantity: 2,
//             unitPrice: 16,
//             totalPrice: 32,
//         },
//         {
//             pizzaId: 3,
//             name: "Romana",
//             quantity: 1,
//             unitPrice: 15,
//             totalPrice: 15,
//         },
//     ],
//     position: "-9.000,38.000",
//     orderPrice: 95,
//     priorityPrice: 19,
// };

function Order() {
    const order = useLoaderData() as OrderData;
    const fetcher = useFetcher();

    useEffect(() => {
        if (!fetcher.data && fetcher.state === "idle") {
            fetcher.load("/menu");
        }
    }, [fetcher]);

    console.log(fetcher.data);

    if (!order) {
        return <div>Loading...</div>;
    }

    // Everyone can search for all orders, so for privacy reasons we're gonna gonna exclude names or address, these are only for the restaurant staff
    const { id, status, priority, priorityPrice, orderPrice, estimatedDelivery, cart } = order;

    const deliveryIn = calcMinutesLeft(estimatedDelivery);

    return (
        <div className="px-4 py-6 space-y-8">
            <div className="flex gap-2 items-center justify-between flex-wrap">
                <h2 className="text-xl font-semibold">Order #{id} status</h2>

                <div className="space-x-2">
                    {priority && (
                        <span className="bg-red-500 rounded-full py-1 px-3 text-sm uppercase font-semibold text-red-50">Priority</span>
                    )}
                    <span className="bg-green-500 rounded-full py-1 px-3 text-sm uppercase font-semibold text-green-50">
                        {status} order
                    </span>
                </div>
            </div>

            <div className="flex gap-2 bg-stone-200 py-5 px-6 items-center justify-between flex-wrap">
                <p className="font-medium">
                    {deliveryIn >= 0 ? `Only ${calcMinutesLeft(estimatedDelivery)} minutes left 😃` : "Order should have arrived"}
                </p>
                <p className="text-xs text-stone-500">(Estimated delivery: {formatDate(estimatedDelivery)})</p>
            </div>

            <ul className="divide-y divide-stone-200 border-b border-t">
                {cart.map((item) => (
                    <OrderItem
                        item={item}
                        key={item.pizzaId}
                        isLoadingIngredients={fetcher.state === "loading"}
                        ingredients={fetcher.data?.find((el: OrderItemData) => el.id === item.pizzaId).ingredients ?? []}
                    />
                ))}
            </ul>

            <div className="space-y-2 bg-stone-200 py-5 px-6">
                <p className="text-sm font-medium text-stone-600">Price pizza: {formatCurrency(orderPrice)}</p>
                {priority && <p className="text-sm font-medium text-stone-600">Price priority: {formatCurrency(priorityPrice)}</p>}
                {priorityPrice && <p className="font-bold">To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>}
            </div>
        </div>
    );
}

export interface LoaderParams {
    orderId: string;
}

export async function loader({ params }) {
    const order = await getOrder(params.orderId);
    return order;
}

export default Order;
