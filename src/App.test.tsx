import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task list header', () => {
  render(<BrowserRouter><App/></BrowserRouter>);
  const headerElement = screen.getByRole('heading', { name: /TASK LIST/i });
  expect(headerElement).toBeInTheDocument();
});