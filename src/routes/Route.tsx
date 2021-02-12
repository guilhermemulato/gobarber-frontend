import React from 'react';
import {
    RouteProps as ReactRouteDOMProps,
    Redirect,
    Route as ReactRouteDOM,
} from 'react-router-dom';
import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactRouteDOMProps {
    isPrivate?: boolean;
    component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
    isPrivate = false,
    component: Componet,
    ...rest
}) => {
    const { user } = useAuth();
    return (
        <ReactRouteDOM
            {...rest}
            render={() => {
                return isPrivate === !!user ? (
                    <Componet />
                ) : (
                    <Redirect
                        to={{ pathname: isPrivate ? '/' : '/dashboard' }}
                    />
                );
            }}
        />
    );
};

export default Route;
