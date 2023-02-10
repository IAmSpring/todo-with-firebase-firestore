import { createContext, FC, ReactNode, useState } from 'react';
import { User } from 'firebase/auth';

type AuthContextType = {
    user: User | null;
    setUser: ((user: User) => void) | null;
    signOut: (() => void) | null;
};

export const AuthContext = createContext<AuthContextType>({
    user: null, // The authenticated user or null if there is no authenticated user
    setUser: null, // A function to set the authenticated user in the context
    signOut: null, // A function to sign out the authenticated user and remove them from the context
});

type Props = {
    children: ReactNode;
};

/**
 * The AuthProvider component is a context provider for the authenticated user.
 * It provides the authenticated user, a function to set the authenticated user,
 * and a function to sign out the authenticated user to its children.
 */
export const AuthProvider: FC<Props> = ({ children }) => {
    /**
     * A helper function to retrieve the authenticated user from session storage.
     * @returns The authenticated user or null if there is no authenticated user in session storage.
     */
    const getFromStorage = () => {
        const userFromStorage = sessionStorage.getItem('user');
        if (userFromStorage) {
            return JSON.parse(userFromStorage);
        }
        return null;
    };

    /**
     * The state for the authenticated user.
     */
    const [user, setUser] = useState<User | null>(getFromStorage());

    /**
     * A helper function to set the authenticated user in session storage.
     * @param user The authenticated user to set.
     */
    const setToStorage = (user: User) => {
        setUser(user);
        sessionStorage.setItem('user', JSON.stringify(user));
    };

    /**
     * A helper function to remove the authenticated user from session storage and sign out the user.
     */
    const removeFromStorage = () => {
        sessionStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        setUser: setToStorage,
        signOut: removeFromStorage,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
