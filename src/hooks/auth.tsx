import React, { createContext, useCallback, useContext, useState } from 'react';
import { api } from '../services/apiClient';

interface SignInCredencials {
    email: string;
    password: string;
}

interface AuthState {
    token: string;
    user: object;
}

interface AuthContextData {
    user: object;
    signIn(credencials: SignInCredencials): Promise<void>;
    signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@goBarber:token');
        const user = localStorage.getItem('@goBarber:user');

        if (token && user) {
            return { token, user: JSON.parse(user) };
        }

        return {} as AuthState;
    });

    const signIn = useCallback(async ({ email, password }) => {
        const response = await api.post('/sessions', {
            email,
            password,
        });

        const { user, token } = response.data;

        localStorage.setItem('@goBarber:token', token);
        localStorage.setItem('@goBarber:user', JSON.stringify(user));

        setData({ token, user });
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem('@goBarber:token');
        localStorage.removeItem('@goBarber:user');

        setData({} as AuthState);
    }, []);

    return (
        <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('Auth context hook error');
    }

    return context;
}

export { AuthProvider, useAuth };
