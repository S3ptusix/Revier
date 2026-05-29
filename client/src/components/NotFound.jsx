import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold text-emerald-500">404</h1>

                <p className="mt-4 text-2xl font-semibold text-gray-800">
                    Page Not Found
                </p>

                <p className="mt-2 text-gray-500">
                    Sorry, the page you’re looking for doesn’t exist or has been moved.
                </p>

                <div className="mt-6 flex justify-center gap-4">
                    <Link
                        to="/home"
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                    >
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}