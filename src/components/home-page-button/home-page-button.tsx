import { FC, ReactNode } from 'react';
import Button from '@mui/material/Button';

type HomePageButtonProps = {
    isActive?: boolean;
    children: ReactNode;
    onClick?: () => void;
};

/**
 * A custom button component to be used for showing the active & inactive filtering on the home page
 */
export const HomePageButton: FC<HomePageButtonProps> = (props) => {
    const { isActive = false } = props;

    /**
     * Returns a button component with the specified color based on the `isActive` property
     */
    return (
        <Button
            sx={{ color: isActive ? 'info.light' : 'text.secondary' }}
            {...props}
        >
            {props.children}
        </Button>
    );
};
