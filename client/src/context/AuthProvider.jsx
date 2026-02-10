/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext } from 'react';
import { fetchUser } from '../services/authServices';

export const UserContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const setUserDetails = async () => {
            try {
                const response = await fetchUser();
                setUser(response);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        setUserDetails();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isAuthenticated: !!user, loading }}>
            {children}
        </UserContext.Provider>
    );
}
