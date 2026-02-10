export default function ErrorMessage({ children }) {
    return (
        <p className="text-red-500 text-center bg-red-500/10 p-2 rounded-lg">{children}</p>
    );
}