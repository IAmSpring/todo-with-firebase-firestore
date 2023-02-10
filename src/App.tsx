import { Outlet } from 'react-router-dom';
import { Header } from './components/header';
import Container from '@mui/material/Container';
import './App.css';

/**
 * This is the main component of the app that holds the header and
 * routes using the Outlet component from react-router-dom.
 */
function App() {
    return (
        <Container maxWidth="md">
            <Header />
            <main className="app-container">
                <Outlet />
            </main>
        </Container>
    );
}

export default App;
