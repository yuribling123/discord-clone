"use client";
import {
    Children,
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import { io as ClientIO } from "socket.io-client";

// custom type
type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

// share values like data or functions between components
const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

// access the current value of SocketContext
export const useSocket = () => {
    return useContext(SocketContext);
};

// make the context values available to any child components that are wrapped inside SocketProvider
export const SocketProvider = ({
    children
}: {
    children: React.ReactNode
}) => {
    // Expression expected.
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        //Initialize Socket
        const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: false,
        });

        // Handle Connection Events
        socketInstance.on("connect",()=>{setIsConnected(true)})
        socketInstance.on("disconnect",()=>{setIsConnected(false)})

        //The socket instance is saved in the component’s state using setSocket        
        setSocket(socketInstance);

        //makes sure that the socket is properly disconnected when the component is removed from the screen
        return () =>{
            socketInstance.disconnect();
        }

    }, []);


    return (
        // This makes the socket and isConnected values available to all components that are children of SocketProvider
        <SocketContext.Provider value={{socket,isConnected}}>
            {children}
        </SocketContext.Provider>
    )

};
