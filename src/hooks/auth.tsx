import React, { createContext, useCallback, useContext, useState } from 'react';
import { api } from '../services/apiClient';

interface User {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
}
interface SignInCredencials {
    email: string;
    password: string;
}

interface AuthState {
    token: string;
    user: User;
}

interface AuthContextData {
    user: User;
    signIn(credencials: SignInCredencials): Promise<void>;
    signOut(): void;
    updateUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const [data, setData] = useState<AuthState>(() => {
        const token = localStorage.getItem('@goBarber:token');
        const user = localStorage.getItem('@goBarber:user');

        if (token && user) {
            api.defaults.headers.authorization = `Bearer ${token}`;
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

        api.defaults.headers.authorization = `Bearer ${token}`;

        setData({ token, user });
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem('@goBarber:token');
        localStorage.removeItem('@goBarber:user');

        setData({} as AuthState);
    }, []);

    const updateUser = useCallback(
        (user: User) => {
            localStorage.setItem('@goBarber:user', JSON.stringify(user));

            setData({
                token: data.token,
                user,
            });
        },
        [setData, data.token],
    );

    return (
        <AuthContext.Provider
            value={{ user: data.user, signIn, signOut, updateUser }}
        >
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
