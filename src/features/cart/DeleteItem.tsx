import React from "react";
import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { deleteItem } from "./cartSlice";

interface DeleteItemProps {
    pizzaId: number;
}

const DeleteItem: React.FC<DeleteItemProps> = ({ pizzaId }) => {
    const dispatch = useDispatch();

    return (
        <Button type="small" onClick={() => dispatch(deleteItem(pizzaId))}>
            Delete
        </Button>
    );
};

export default DeleteItem;
