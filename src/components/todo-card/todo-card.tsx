import { FC, ReactNode } from 'react';
import Card from '@mui/material/Card';

type Props = {
    children: ReactNode;
};

/**
 * The TodoCard component is a styled Material UI Card component
 * used to display a todo item.
 */
export const TodoCard: FC<Props> = ({ children, ...props }) => {
    return (
        <Card
            {...props}
            sx={[
                { mt: 2 },
                (theme) => ({
                    backgroundColor:
                        theme.palette.mode === 'dark'
                            ? 'primary.main'
                            : 'background.paper',
                }),
            ]}
        >
            {children}
        </Card>
    );
};
