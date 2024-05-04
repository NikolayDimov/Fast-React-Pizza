import { useSelector } from "react-redux";

type RootState = {
    user: {
        username: string;
    };
};

const Username: React.FC = () => {
    const username = useSelector((state: RootState) => state.user.username);

    if (!username) return null;

    return <div className="hidden text-sm font-semibold md:block">{username}</div>;
};

export default Username;
