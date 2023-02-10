import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TodoCard } from './todo-card';

afterEach(cleanup);

describe('TodoCard component', () => {
    it('renders the children', () => {
        const text = 'Todo item';
        const { getByText } = render(
            <TodoCard>
                <p>{text}</p>
            </TodoCard>
        );

        expect(getByText(text)).toBeInTheDocument();
    });
});
