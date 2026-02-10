/* eslint-disable react-refresh/only-export-components */

import { useState, useEffect, createContext } from 'react';
import { fetchAdmin } from '../services/authServices';

export const UserContext = createContext();

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const setAdminDetails = async () => {
            try {
                const response = await fetchAdmin();
                setAdmin(response);
            } catch {
                setAdmin(null);
            } finally {
                setLoading(false);
            }
        };
        setAdminDetails();
    }, []);

    return (
        <UserContext.Provider value={{ admin, setAdmin, isAuthenticated: !!admin, loading }}>
            {children}
        </UserContext.Provider>
    );
}
