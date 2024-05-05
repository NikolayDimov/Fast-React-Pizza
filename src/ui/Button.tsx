import { Link } from "react-router-dom";

interface ButtonProps {
    children: React.ReactNode;
    disabled?: boolean;
    to?: string;
    type?: "primary" | "small" | "secondary";
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Button: React.FC<ButtonProps> = ({ children, disabled, to, type = "primary", onClick }) => {
    const base =
        "bg-yellow-400 uppercase font-semibold text-sm text-stone-800  inline-block tracking-wide rounded-full hover:bg-yellow-300 transition-colors duration-300 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-offset-2 disabled:cursor-not-allowed";

    const styles = {
        primary: base + " py-3 px-4 md:px-6 md:py-4",
        small: base + " px-4 py-2 md:px-5 md:py-2.5 text-xs",
        secondary:
            "uppercase font-semibold text-sm text-stone-400 border-2 border-stone-300 inline-block tracking-wide rounded-full hover:bg-stone-300 hover:text-stone-800 transition-colors duration-300 focus:outline-none focus:ring focus:ring-stone-200 focus:text-stone-800 focus:ring-offset-2 disabled:cursor-not-allowed py-2.5 px-4 md:px-6 md:py-3.5",
    };

    if (to) {
        return (
            <Link to={to} className={styles[type]}>
                {children}
            </Link>
        );
    }

    if (onClick) {
        return (
            <button onClick={onClick} disabled={disabled} className={styles[type]}>
                {children}
            </button>
        );
    }

    return (
        <button disabled={disabled} className={styles[type]}>
            {children}
        </button>
    );
};

export default Button;
