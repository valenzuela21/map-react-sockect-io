import React from 'react'
import {MapPages} from './pages/MapPages'
import {SocketProvider} from "./context/SocketContext";
export const MapsApp = () => {
    return(
        <SocketProvider>
            <MapPages />
        </SocketProvider>
        )
}
