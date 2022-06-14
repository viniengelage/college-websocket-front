import { createContext, useContext } from 'react';

import { io, Socket as SocketProps } from 'socket.io-client'

interface IComponentProps{
    children:JSX.Element | JSX.Element[]
}

interface IContextProps{
    socket: SocketProps;
}

const Socket = createContext({} as IContextProps);

const SocketProvider = ({ children }: IComponentProps) => {
    const socket = io("http://localhost:8080", {
        autoConnect:false,
        reconnection:false,
        transports: ['websocket'],
    });

    return (
        <Socket.Provider
            value={{ socket }}
        >
        {children}
        </Socket.Provider>
    );
};

function useSocket() {
    const context = useContext(Socket);

    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }

    return context;
}

export { SocketProvider, useSocket };