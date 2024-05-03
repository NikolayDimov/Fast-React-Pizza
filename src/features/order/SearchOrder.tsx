import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchOrder: React.FC = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!query) return;
        navigate(`/order/${query}`);
        setQuery("");
    }

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Search order #" value={query} onChange={(e) => setQuery(e.target.value)} />
        </form>
    );
};

export default SearchOrder;
