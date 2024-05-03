import { useNavigate, useRouteError } from "react-router-dom";

interface RouteError {
    data: string;
    message: string;
}

function ErrorPage() {
    const navigate = useNavigate();
    const error = useRouteError() as RouteError | null;

    console.log(error);

    return (
        <div>
            <h1>Something went wrong 😢</h1>
            <p>{error?.data || error?.message}</p>
            <button onClick={() => navigate(-1)}>&larr; Go back</button>
        </div>
    );
}

export default ErrorPage;
