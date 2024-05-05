import { useSelector } from "react-redux";
import { State } from "./userSlice";

const Username: React.FC = () => {
    const username = useSelector((state: State) => state.username);

    if (!username) return null;

    return <div className="hidden text-sm font-semibold md:block">{username}</div>;
};

export default Username;
