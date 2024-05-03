import React from "react";
import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";

interface Pizza {
    id: number;
    name: string;
    unitPrice: number;
    ingredients: string[];
    soldOut: boolean;
    imageUrl: string;
}

const Menu: React.FC = () => {
    const menu = useLoaderData() as Pizza[];
    console.log(menu);

    return (
        <ul>
            {menu.map((pizza) => (
                <MenuItem pizza={pizza} key={pizza.id} />
            ))}
        </ul>
    );
};

export async function loader() {
    const menu = await getMenu();
    return menu;
}

export default Menu;
