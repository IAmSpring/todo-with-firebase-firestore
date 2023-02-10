import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import { HomePage } from '../components/home-page';
import { LoginPage } from '../components/login-page';
import { ProtectedRoute } from '../components/protected-route';

/**
 * AppRouterProvider is a component that provides the routing information to the
 * application using `react-router-dom` package.
 *
 * It uses the `createBrowserRouter` method to create the browser router and
 * passes it to the `RouterProvider` component which makes it available
 * throughout the application.
 *
 * The `createBrowserRouter` method accepts an array of route objects that
 * represent different paths in the application. Each route object contains
 * the path, and the component that should be rendered when the route is active.
 *
 * Here the `App` component is the root component of the
 * application and it contains two child routes - `/` and `/login`.
 *
 * The `/` route is protected by the `ProtectedRoute` component, which ensures
 * that only authenticated users can access the route and see the `HomePage` component.
 * The `/login` route is not protected and displays the `LoginPage` component.
 */

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: (
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/login',
                element: <LoginPage />,
            },
        ],
    },
]);

export const AppRouterProvider = () => {
    return <RouterProvider router={router} />;
};
