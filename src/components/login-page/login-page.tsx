import { useState, ChangeEvent, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import { AuthContext } from '../../providers/auth';

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const LoginPage = () => {
    /**
     * email holds the value of the email entered by the user
     * setEmail sets the value of email when called
     */
    const [email, setEmail] = useState('');

    /**
     * password holds the value of the password entered by the user
     * setPassword sets the value of password when called
     */
    const [password, setPassword] = useState('');

    /**
     * error holds the value of any error messages to be displayed to the user
     * setError sets the value of error when called
     */
    const [error, setError] = useState('');

    /**
     * user holds the current user information obtained from the AuthContext
     * setUser sets the value of user in the AuthContext
     */
    const { user, setUser } = useContext(AuthContext);

    const navigate = useNavigate();

    /**
     * If the user is authenticated, the user will be redirected to the home page
     */
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    /**
     * setEmailValue sets the value of email in the state.
     * It is triggered when the email input field changes and resets error to an empty string
     */
    const setEmailValue = (event: ChangeEvent<HTMLInputElement>) => {
        setError('');
        setEmail(event.target.value);
    };

    /**
     * setPasswordValue sets the value of password in the state.
     * It is triggered when the password input field changes and resets error to an empty string
     */
    const setPasswordValue = (event: ChangeEvent<HTMLInputElement>) => {
        setError('');
        setPassword(event.target.value);
    };

    /**
     * emailFieldCheck is a function that checks if the email field is empty.
     * If the email field is empty, an error message is displayed to the user and the function returns false.
     * If the email field is not empty, the function returns true.
     */
    const emailFieldCheck = () => {
        if (!email) {
            setError('Please enter an email address');
            return false;
        }
        return true;
    };

    /**
     * passwordFieldCheck is a function that checks if the password field is empty.
     * If the password field is empty, an error message is displayed to the user and the function returns false.
     * If the password field is not empty, the function returns true.
     */
    const passwordFieldCheck = () => {
        if (!password) {
            setError('Please enter your password');
            return false;
        }
        return true;
    };

    /**
     * Signs in the user using Google as the authentication provider
     */
    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // The signed-in user info.
                const user = result.user;
                if (user && setUser) {
                    setUser(user);
                }
            })
            .catch((error) => {
                handleError(error.code);
            });
    };

    /**
     * Signs up a new user with the their provided email and password
     */
    const signUp = () => {
        if (emailFieldCheck() && passwordFieldCheck()) {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    if (user && setUser) {
                        setUser(user);
                    }
                })
                .catch((error) => {
                    handleError(error.code);
                });
        }
    };

    /**
     * Signs in the user using their provided email and password
     */
    const loginWithEmailAndPassword = () => {
        if (emailFieldCheck() && passwordFieldCheck()) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    if (user && setUser) {
                        setUser(user);
                    }
                })
                .catch((error) => {
                    handleError(error.code);
                });
        }
    };

    /**
     * handleError - A function that handles the error codes received from Firebase authentication
     * @param {string} error - The error code received from Firebase authentication
     */
    const handleError = (error: string) => {
        if (error === 'auth/email-already-in-use') {
            setError('The email address is already in use');
        } else if (error === 'auth/invalid-email') {
            setError('The email address is not valid');
        } else if (error === 'auth/user-not-found') {
            setError('No user found with this email address');
        } else if (error === 'auth/operation-not-allowed') {
            setError('Operation not allowed');
        } else if (error === 'auth/weak-password') {
            setError('The password is too weak');
        } else if (error === 'auth/wrong-password') {
            setError('The password is incorrect');
        } else if (error === 'auth/missing-email') {
            setError('Please enter an email address');
        } else {
            setError(error);
        }
    };

    /**
     * Renders a Card component with two TextFields for entering email and password and
     * three buttons for Signup, Login, and Login with Google.
     */
    return (
        <Card>
            <CardContent sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                {error && <h4 className="error-text">{error}</h4>}
                <TextField
                    id="filled-basic"
                    value={email}
                    onChange={setEmailValue}
                    fullWidth
                    label="Email"
                    variant="filled"
                />
                <TextField
                    id="filled-basic"
                    label="Password"
                    value={password}
                    fullWidth
                    type="password"
                    onChange={setPasswordValue}
                    variant="filled"
                />
            </CardContent>
            <CardActions>
                <Button color="secondary" variant="text" onClick={signUp}>
                    Signup
                </Button>
                <Button variant="text" onClick={loginWithEmailAndPassword}>
                    Login
                </Button>
                <Button variant="text" onClick={signInWithGoogle}>
                    Login with Google
                </Button>
            </CardActions>
        </Card>
    );
};
