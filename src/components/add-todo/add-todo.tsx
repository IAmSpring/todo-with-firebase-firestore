import { FC, KeyboardEvent, useContext, ChangeEvent, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { AuthContext } from '../../providers/auth';
import { TodoCard } from '../todo-card';

type AddTodoProps = {
    resetUpdatingIdAndTitle: (() => void) | null;
};

/**
 * AddTodo allows users to add a new to-do item to the to-do list.
 * It uses the AuthContext to get the user's information and the state management hook useState to manage the input value.
 * @param {AddTodoProps} props Passes the resetUpdatingIdAndTitle function into the AddTodo component.
 */
export const AddTodo: FC<AddTodoProps> = (props) => {
    // Get the user information from the AuthContext
    const { user } = useContext(AuthContext);

    // Initialize the state to manage the new todo's title input value
    const [input, setInput] = useState('');

    /**
     * Resets the updatingIdAndTitle in the home-page component when a new todo title is being created.
     */
    const resetUpdating = () => {
        props.resetUpdatingIdAndTitle?.();
    };

    /**
     * Updates the input state with the current value of the input field.
     * @param {ChangeEvent<HTMLInputElement>} event The change event of the input field.
     */
    const setInputValue = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    /**
     * Adds a new to-do item to the to-do list when the user presses the enter key.
     * @param {KeyboardEvent<HTMLInputElement>} event The keyboard event of the input field.
     */
    const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (input !== '') {
                addDoc(collection(db, 'todos'), {
                    title: input,
                    isCompleted: false,
                    userId: user?.uid,
                });
                setInput('');
            }
        }
    };

    /**
     * Renders a TodoCard component which contains a text input for adding a new todo item.
     */
    return (
        <TodoCard>
            <CardContent
                sx={{
                    p: 0,
                    pl: 3,
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                        borderBottom: 'none',
                    },
                    '& .MuiInput-underline:after': { borderBottom: 'none' },
                    '& .MuiInput-underline:before': { borderBottom: 'none' },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    <RadioButtonUncheckedIcon
                        sx={{ color: 'action.active', mr: 1, my: 0.5 }}
                    />
                    <TextField
                        id="input-with-sx"
                        fullWidth
                        label="Add Task"
                        variant="standard"
                        value={input}
                        onChange={setInputValue}
                        onKeyPress={onKeyPress}
                        onSelect={resetUpdating}
                    />
                </Box>
            </CardContent>
        </TodoCard>
    );
};
