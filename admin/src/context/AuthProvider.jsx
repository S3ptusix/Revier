/* eslint-disable react-refresh/only-export-components */

import { useState, useEffect, createContext } from 'react';
import { fetchAdmin } from '../services/authServices';
import { socket } from "../socket";

export const UserContext = createContext();

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    /* =========================
       FETCH ADMIN
    ========================= */
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

    /* =========================
       🔌 SOCKET CONNECTION
    ========================= */
    useEffect(() => {
        if (!admin) return;

        socket.connect();

        // ✅ wait for connection
        socket.on("connect", () => {
            console.log("🔌 Socket connected:", socket.id);

            // join rooms AFTER connection
            socket.emit("join_room", "admins");
        });

        return () => {
            socket.off("connect"); // cleanup
            socket.disconnect();
        };
    }, [admin]);

    return (
        <UserContext.Provider
            value={{
                admin,
                setAdmin,
                isAuthenticated: !!admin,
                loading
            }}
        >
            {children}
        </UserContext.Provider>
    );
}