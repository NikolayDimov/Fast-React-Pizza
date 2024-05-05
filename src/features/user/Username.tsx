import { useSelector } from "react-redux";

export type UserRootState = {
    user: {
        username: string;
        status: "idle" | "loading" | "error";
        position: {
            latitude: number;
            longitude: number;
        };
        address: string;
        error: string;
    };
};

const Username: React.FC = () => {
    const username = useSelector((state: UserRootState) => state.user.username);

    if (!username) return null;

    return <div className="hidden text-sm font-semibold md:block">{username}</div>;
};

export default Username;
