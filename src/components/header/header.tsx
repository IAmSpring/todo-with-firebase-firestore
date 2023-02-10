import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { MoonIcon, SunIcon } from '../icons';
import { AppThemeContext } from '../../providers/theme';
import { AuthContext } from '../../providers/auth';
import { Theme } from '../../theme';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import './header.css';

/**
 * Displays either the 'LOGIN' or 'TASK LIST' header text, depending on the current location.
 * Also provides the functionality to change the application theme and log out of the user session.
 */
export const Header = () => {
    /**
     * Retrieves the current theme and the function to set the theme from the AppThemeContext.
     */
    const { currentTheme, setTheme } = useContext(AppThemeContext);

    /**
     * Retrieves the current user and the sign out function from the AuthContext.
     */
    const { user, signOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Calculates the header text to be displayed, depending on the current location pathname.
     */
    const headerText = location.pathname === '/login' ? 'LOGIN' : 'TASK LIST';

    /**
     * Function to change the current theme of the app to either the DARK or LIGHT theme, depending on the current theme.
     */
    const setCurrentTheme = () => {
        const newTheme = currentTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
        setTheme && setTheme(newTheme);
    };

    /**
     * Function to log out the user from the current session.
     * The user will be signed out and redirected to the '/login' page.
     */
    const logout = () => {
        signOut && signOut();
        navigate('/login');
    };

    /**
     * Return displays the header of the application including header text and logout button if the user is logged in.
     * If the user is logged in, it displays a theme switcher button to switch between dark and light theme.
     * The header text is either "TASK LIST" or "LOGIN", depending on the current location path.
     */
    return (
        <header>
            <Grid container justifyContent="right">
                {user && (
                    <Button sx={[{ mt: 2, color: 'white' }]} onClick={logout}>
                        Logout
                    </Button>
                )}
            </Grid>
            <Grid container justifyContent={'space-between'} mt={5} mb={3}>
                <h1 className="app-header">{headerText}</h1>
                {user && (
                    <IconButton
                        color="primary"
                        aria-label="theme switcher"
                        onClick={setCurrentTheme}
                    >
                        {currentTheme === Theme.DARK ? (
                            <SunIcon />
                        ) : (
                            <MoonIcon />
                        )}
                    </IconButton>
                )}
            </Grid>
        </header>
    );
};
