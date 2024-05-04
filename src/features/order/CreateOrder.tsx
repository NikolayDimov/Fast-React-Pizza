import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { PizzaOrder } from "./Order";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";

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

const fakeCart: PizzaOrder[] = [
    {
        pizzaId: 12,
        name: "Mediterranean",
        quantity: 2,
        unitPrice: 16,
        totalPrice: 32,
    },
    {
        pizzaId: 6,
        name: "Vegetale",
        quantity: 1,
        unitPrice: 13,
        totalPrice: 13,
    },
    {
        pizzaId: 11,
        name: "Spinach and Mushroom",
        quantity: 1,
        unitPrice: 15,
        totalPrice: 15,
    },
];

function CreateOrder() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    // const [withPriority, setWithPriority] = useState(false);
    const cart = fakeCart;

    const formErrors: Errors | undefined = useActionData() as Errors | undefined;

    return (
        <div className="py-6 px-4">
            <h2 className="text-xl font-semibold mb-8">Ready to order? Let's go!</h2>

            {/* <Form method="POST" action="/order/new"> */}
            <Form method="POST">
                <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
                    <label className="sm:basis-40">First Name</label>
                    <input className="input grow" type="text" name="customer" required />
                </div>

                <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
                    <label className="sm:basis-40">Phone number</label>
                    <div className="grow">
                        <input className="input w-full" type="tel" name="phone" required />
                        {formErrors?.phone && <p className="text-xs mt-2 text-red-700 bg-red-100 p2 rounded-md">{formErrors.phone}</p>}
                    </div>
                </div>

                <div className="mb-5 flex gap-2 flex-col sm:flex-row sm:items-center">
                    <label className="sm:basis-40">Address</label>
                    <div className="grow">
                        <input className="input w-full" type="text" name="address" required />
                    </div>
                </div>

                <div className="mb-12 flex gap-5 items-center">
                    <input
                        className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
                        type="checkbox"
                        name="priority"
                        id="priority"
                        // value={withPriority}
                        // onChange={(e) => setWithPriority(e.target.checked)}
                    />
                    <label className="font-medium" htmlFor="priority">
                        Want to yo give your order priority?
                    </label>
                </div>

                <div>
                    <input type="hidden" name="cart" value={JSON.stringify(cart)} />
                    <Button type="primary" disabled={isSubmitting}>
                        {isSubmitting ? "Placing order..." : "Order now"}
                    </Button>
                </div>
            </Form>
        </div>
    );
}

export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const data: Record<string, FormDataEntryValue> = Object.fromEntries(formData);

    // Define a function to check if a value is a PizzaOrder array
    const isPizzaOrderArray = (value: unknown): value is PizzaOrder[] => {
        return Array.isArray(value) && value.every((item) => typeof item === "object" && item !== null);
    };

    // Cast data to Order type and handle type mismatches
    const order: Partial<Order> = {
        customer: data.customer?.toString() || "",
        phone: data.phone?.toString() || "",
        address: data.address?.toString() || "",
        cart: isPizzaOrderArray(data.cart) ? (data.cart as PizzaOrder[]) : [],
        priority: data.priority === "on",
    };

    // Initialize errors object
    const errors: Errors = {};

    // Validate phone number
    if (order.phone && !isValidPhone(order.phone)) errors.phone = "Please enter a correct phone number!";

    // Check for errors and handle redirection
    if (Object.keys(errors).length > 0) return errors;

    const newOrder = await createOrder(order as Order);

    return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
