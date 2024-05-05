import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { OrderData } from "./Order";
import { updateOrder } from "../../services/apiRestaurant";

interface UpdateOrderProps {
    order: OrderData;
}

const UpdateOrder: React.FC<UpdateOrderProps> = ({ order }) => {
    const fetcher = useFetcher();

    return (
        <fetcher.Form method="PATCH" className="text-right">
            <Button type="primary">Make priority</Button>
        </fetcher.Form>
    );
};

export default UpdateOrder;

export async function action({ request, params }) {
    console.log("update");

    const data = { priority: true };
    // await updateOrder(params.orderId, data);
    await updateOrder(params.orderId, data);
    return null;
}
