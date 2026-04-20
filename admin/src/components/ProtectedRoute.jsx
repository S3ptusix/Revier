import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/AuthProvider';
import { useContext } from 'react';
import Loading from './Loading';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { admin, loading } = useContext(UserContext);

    if (loading) {
        return (
            <div className='h-screen w-screen'>
                <Loading />
            </div>
        );
    };

    if (!admin) return <Navigate to="/" replace />;

    if (allowedRoles && !allowedRoles.includes(admin.role)) return <Navigate to="/" replace />;

    return children;
}
