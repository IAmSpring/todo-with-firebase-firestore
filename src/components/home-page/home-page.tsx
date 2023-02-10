import React, {
    useContext,
    useEffect,
    useState,
    ChangeEvent,
    KeyboardEvent,
} from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
    collection,
    updateDoc,
    onSnapshot,
    doc,
    deleteDoc,
    where,
    query,
} from 'firebase/firestore';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import { CheckIcon, CrossIcon } from '../icons';
import { db } from '../../firebase';
import { AuthContext } from '../../providers/auth';
import { AddTodo } from '../add-todo';
import { Todo } from '../../models/todo';
import { TodoCard } from '../todo-card';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { HomePageButton } from '../home-page-button';

enum FilterState {
    ALL = 'All',
    ACTIVE = 'Active',
    COMPLETED = 'Completed',
}

export const HomePage = () => {
    /**
     * `todos` - state that holds an array of Todo objects
     *           or `null` if no todos have been fetched yet.
     */
    const [todos, setTodos] = useState<Todo[] | null>(null);

    /**
     * `updatedTitle` - state that holds the updated title
     *                  of a Todo being edited.
     */
    const [updatedTitle, setUpdatedTitle] = useState<string>('');

    /**
     * `updatingId` - state that holds the `id` of a Todo
     *                being edited or an empty string if no Todo
     *                is being edited.
     */
    const [updatingId, setUpdatingId] = useState<string>('');

    /**
     * `activeFilter` - state that holds the currently active filter.
     *                  The possible values are `FilterState.ALL`,
     *                  `FilterState.ACTIVE`, and `FilterState.COMPLETED`.
     */
    const [activeFilter, setActiveFilter] = useState<FilterState>(
        FilterState.ALL
    );

    const isSmallScreen = useMediaQuery('(max-width:375px)');

    /**
     * `user` - the authenticated user from the `AuthContext`.
     */
    const { user } = useContext(AuthContext);

    /**
     * `inputRef` - a reference to the text input element for when updating the title of a Todo.
     */
    const inputRef = React.useRef<HTMLInputElement>(null);

    /**
     * useEffect hook that focuses the input field when `updatingId` is not an empty string, and blurs it when it is.
     */
    useEffect(() => {
        if (updatingId !== '') {
            inputRefFocus();
        } else if (inputRef.current) {
            inputRef.current.blur();
        }
    }, [updatingId]);

    /**
     * A useEffect that sets up a real-time listener on the `todos` collection in Firestore and updates the `todos` state with the latest data, if the user is logged in.
     */
    useEffect(() => {
        if (user) {
            /**
             * q - a Firestore query that fetches all Todos that belong to a user with the user's `uid`.
             */
            const q = query(
                collection(db, 'todos'),
                where('userId', '==', user?.uid)
            );

            /**
             * subscribeToTodos - sets up a real-time listener on the `todos` collection in Firestore
             * and updates the `todos` state with the latest data.
             */
            const subscribeToTodos = () => {
                return onSnapshot(q, (querySnapshot) => {
                    const todos: Todo[] = [];
                    querySnapshot.forEach((doc) => {
                        const todoItem = {
                            id: doc.id,
                            ...doc.data(),
                        };
                        todos.push(todoItem as Todo);
                    });
                    setTodos(todos);
                });
            };

            const unsub = subscribeToTodos();

            return unsub;
        }
    }, [user]);

    /**
     * resetUpdatingIdAndTitle - resets the `updatingId` and `updatedTitle` state.
     */
    const resetUpdatingIdAndTitle = () => {
        setUpdatingId('');
        setUpdatedTitle('');
    };

    /**
     * handleTitleClick - sets the `updatingId` and `updatedTitle` state with the selected Todo's ID and title.
     * @param {Todo} todo - the Todo that was clicked
     */
    const handleTitleClick = (todo: Todo) => {
        if (updatingId !== '') {
            resetUpdatingIdAndTitle();
        }
        const passedId = todo.id ? todo.id : '';
        setUpdatingId(passedId);
        setUpdatedTitle(todo.title);
    };

    /**
     * setInputValue - updates the `updatedTitle` state with the input value.
     * @param {ChangeEvent<HTMLInputElement>} event - the ChangeEvent that triggered the function
     */
    const setInputValue = (event: ChangeEvent<HTMLInputElement>) => {
        setUpdatedTitle(event.target.value);
    };

    /**
     * onKeyPress - triggers the update of the Todo title when the enter key is pressed.
     * @param {KeyboardEvent<HTMLInputElement>} event - the KeyboardEvent that triggered the function
     */
    const onKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (updatedTitle !== '') {
                handleTitleUpdate();
            }
        }
    };

    /**
     * onKeyUp - resets the `updatingId` and `updatedTitle` states when the escape key is pressed.
     * @param {KeyboardEvent<HTMLInputElement>} event - the KeyboardEvent that triggered the function
     */
    const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Escape') {
            resetUpdatingIdAndTitle();
        }
    };

    /**
     * handleRadioCheck - updates the `isCompleted` todo property in Firestore database.
     * @param {Todo} todo - the Todo object to update
     */
    const handleRadioCheck = (todo: Todo) => {
        if (todo.id) {
            const docReference = doc(db, 'todos', todo.id);
            updateDoc(docReference, {
                isCompleted: !todo.isCompleted,
            });
        }
        resetUpdatingIdAndTitle();
    };

    /**
     * handleTitleUpdate - updates the `title` Todo property in the Firestore database.
     */
    const handleTitleUpdate = () => {
        if (updatingId !== '') {
            const docReference = doc(db, 'todos', updatingId);
            updateDoc(docReference, {
                title: updatedTitle,
            });
            resetUpdatingIdAndTitle();
        }
    };

    /**
     * deleteTodo - deletes a Todo from the Firestore database.
     * @param {Todo} todo - the Todo object to delete
     */
    const deleteTodo = (todo: Todo) => {
        if (todo.id) {
            deleteDoc(doc(db, 'todos', todo.id));
        }
        resetUpdatingIdAndTitle();
    };

    /**
     * activeTodos - an array of todos where the `isCompleted` property is set to `false`.
     */
    const activeTodos = todos?.filter((todo) => !todo.isCompleted) ?? [];

    /**
     * completedTodos - an array of todos where the `isCompleted` property is set to `true`.
     */
    const completedTodos = todos?.filter((todo) => todo.isCompleted) ?? [];

    /**
     * filteredTodos - an array of todos filtered based on the `activeFilter` state.
     * If `activeFilter` is set to `ALL`, all todos are returned.
     * If `activeFilter` is set to `ACTIVE`, only todos with `isCompleted` set to `false` are returned.
     * If `activeFilter` is set to `COMPLETED`, only todos with `isCompleted` set to `true` are returned.
     */
    const filteredTodos =
        activeFilter === FilterState.ALL
            ? todos
            : todos?.filter((todo) => {
                  const filterCondition =
                      activeFilter === FilterState.ACTIVE ? false : true;

                  return todo.isCompleted === filterCondition;
              });

    /**
     * clearCompleted - deletes all of a user's completed Todo from the Firestore database.
     */
    const clearCompleted = () => {
        completedTodos.forEach(deleteTodo);
    };

    /**
     * inputRefFocus - triggered by useEffect "updatingId" dependancy and sends focus on text input of todo title being modified.
     */
    const inputRefFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    /**
     * todoItems: Maps through an array of todos and creates a list of todos with
     *            the ability to complete, update, and delete each individual todo.
     *
     * @param filteredTodos: An array of Todo objects representing the filtered todos.
     * @param handleRadioCheck: A callback function that is executed when a todo is checked.
     * @param handleTitleClick: A callback function that is executed when a todo's title is clicked.
     * @param setInputValue: A callback function that is executed when the value of the input field changes.
     * @param onKeyPress: A callback function listening for the enter that is executed when a key is pressed in the input field.
     * @param onKeyUp: A callback function listening for the escape key that is executed when a key is released in the input field.
     * @param inputRef: A reference to the input field element.
     * @param deleteTodo: A callback function that is executed when a todo is deleted.
     * @param updatingId: The id of the todo currently being updated.
     * @param updatedTitle: The new modified title of the todo being updated.
     *
     * @returns: A list of todos with the ability to complete, update, and delete each individual todo.
     */
    const todoItems = filteredTodos?.map((todo: Todo) => (
        <ListItem
            disablePadding
            sx={{
                p: 0,
                m: 0,
                borderBottom: '1px solid #dfdfdf',
                '& .delete-icon': {
                    visibility: 'hidden',
                },
                '&:hover .delete-icon': {
                    visibility: 'visible',
                },
            }}
        >
            <ListItemButton>
                {todo.isCompleted ? (
                    <div onClick={() => handleRadioCheck(todo)}>
                        <CheckIcon />
                    </div>
                ) : (
                    <Radio
                        checked={false}
                        onChange={() => handleRadioCheck(todo)}
                        inputProps={{ 'aria-label': todo.title }}
                    />
                )}
                <ListItemText>
                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        {todo.id === updatingId ? (
                            <Box component="span" width="80%">
                                <TextField
                                    id="input-with-sx"
                                    fullWidth
                                    variant="standard"
                                    label="Press Enter To Update Or Escape To Cancel"
                                    value={updatedTitle}
                                    onChange={setInputValue}
                                    onKeyPress={onKeyPress}
                                    onKeyUp={onKeyUp}
                                    inputRef={inputRef}
                                />
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    textDecoration: todo.isCompleted
                                        ? 'line-through'
                                        : 'none',
                                }}
                                component="span"
                                width="80%"
                                style={{ backgroundColor: 'transparent' }}
                                onClick={() => handleTitleClick(todo)}
                            >
                                {todo.title}
                            </Box>
                        )}
                        <IconButton
                            className="delete-icon"
                            onClick={() => deleteTodo(todo)}
                        >
                            <CrossIcon />
                        </IconButton>
                    </Grid>
                </ListItemText>
            </ListItemButton>
        </ListItem>
    ));

    /**
    Displays the main todo list along with the AddTodo form and the three
    filtering buttons. The filtering buttons appear differently depending
    on the screen size.
    */
    return (
        <div>
            <AddTodo resetUpdatingIdAndTitle={resetUpdatingIdAndTitle} />
            <TodoCard>
                <CardContent sx={{ p: 0 }}>
                    <List>{todoItems}</List>
                </CardContent>
                <CardActions>
                    <Grid
                        container
                        alignItems={'center'}
                        justifyContent="space-between"
                    >
                        <Box component="span">
                            {activeTodos?.length} item
                            {activeTodos?.length === 1 ? '' : 's'} left
                        </Box>
                        {!isSmallScreen && (
                            <Box sx={{ display: 'flex' }}>
                                <HomePageButton
                                    isActive={activeFilter === FilterState.ALL}
                                    onClick={() =>
                                        setActiveFilter(FilterState.ALL)
                                    }
                                >
                                    All
                                </HomePageButton>
                                <HomePageButton
                                    isActive={
                                        activeFilter === FilterState.ACTIVE
                                    }
                                    onClick={() =>
                                        setActiveFilter(FilterState.ACTIVE)
                                    }
                                >
                                    Active
                                </HomePageButton>
                                <HomePageButton
                                    isActive={
                                        activeFilter === FilterState.COMPLETED
                                    }
                                    onClick={() =>
                                        setActiveFilter(FilterState.COMPLETED)
                                    }
                                >
                                    Completed
                                </HomePageButton>
                            </Box>
                        )}
                        <Box>
                            <HomePageButton onClick={clearCompleted}>
                                {' '}
                                Clear Completed
                            </HomePageButton>
                        </Box>
                    </Grid>
                </CardActions>
            </TodoCard>

            {isSmallScreen && (
                <TodoCard>
                    <CardContent>
                        <HomePageButton
                            isActive={activeFilter === FilterState.ALL}
                            onClick={() => setActiveFilter(FilterState.ALL)}
                        >
                            All
                        </HomePageButton>
                        <HomePageButton
                            isActive={activeFilter === FilterState.ACTIVE}
                            onClick={() => setActiveFilter(FilterState.ACTIVE)}
                        >
                            Active
                        </HomePageButton>
                        <HomePageButton
                            isActive={activeFilter === FilterState.COMPLETED}
                            onClick={() =>
                                setActiveFilter(FilterState.COMPLETED)
                            }
                        >
                            Completed
                        </HomePageButton>
                    </CardContent>
                </TodoCard>
            )}
        </div>
    );
};
