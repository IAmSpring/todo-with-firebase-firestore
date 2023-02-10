import { FC, ReactNode, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../providers/auth';

type Props = {
    children: ReactNode;
};

/**
 * ProtectedRoute component protects a certain the main home page of the app
 * and only allows the user to access it if they are logged in.
 * If the user is not logged in, it will redirect them to the login page.
 */
export const ProtectedRoute: FC<Props> = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace={true} />;
    }

    return <>{children}</>;
};
