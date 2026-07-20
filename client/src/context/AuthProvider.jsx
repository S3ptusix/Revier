/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext } from 'react';
import { fetchUser } from '../services/authServices';
import { socket } from "../socket";

export const UserContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* =========================
       FETCH USER
    ========================= */
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

    /* =========================
       🔌 SOCKET CONNECTION
    ========================= */
    useEffect(() => {
        if (!user) return;

        socket.connect();

        socket.on("connect", () => {
            console.log("🔌 User connected:", socket.id);

            // ✅ join personal room
            socket.emit("join_room", `user_${user.id}`);
        });

        return () => {
            socket.off("connect");
            socket.disconnect();
        };
    }, [user]);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                isAuthenticated: !!user,
                loading
            }}
        >
            {children}
        </UserContext.Provider>
    );
}