import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/AuthProvider';
import { useContext } from 'react';
import Loading from './Loading';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return (
            <div className='h-screen w-screen'>
                <Loading />
            </div>
        );
    };

    if (!user) return <Navigate to="/" replace />;

    return children;
}
