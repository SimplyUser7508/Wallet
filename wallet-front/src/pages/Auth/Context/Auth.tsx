import React, { createContext, useState, Dispatch, SetStateAction, FC, ReactNode, useContext } from "react";
import { AxiosInstance } from "axios";
import api from "../../Api/Api";

// Интерфейс для состояния аутентификации
interface AuthState {
    email?: string;
    token?: string | null;
}

// Интерфейс для контекста аутентификации
interface AuthContextType {
    auth: AuthState;
    setAuth: Dispatch<SetStateAction<AuthState>>;
    api: AxiosInstance;
}

// Создаем контекст с начальным значением
const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    // Используем хук useState для управления состоянием аутентификации
    const [auth, setAuth] = useState<AuthState>({ token: null });

    return (
        <AuthContext.Provider value={{ auth, setAuth, api }}>
            {children}
        </AuthContext.Provider>
    );
};

// Кастомный хук для использования контекста аутентификации
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;
