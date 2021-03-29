import React, {useEffect, useContext} from 'react'
import {useMapbox} from "../hooks/useMetabox";
import {SocketContext} from "../context/SocketContext";

const pointerStart = {
    lng: 5,
    lat: 34,
    zoom: 5
}

export const MapPages = () => {
    const {setRef, coords, newMarks$, moveMarks$, addMarker, updatePosition} = useMapbox(pointerStart);
    const { socket } = useContext(SocketContext);

    //Call markers existing
    useEffect(()=>{
        socket.on('markers-actives',(markers)=>{
            for(const key of Object.keys(markers)){
                //console.log(markers[key])
                //Add Marker
                addMarker(markers[key], key)
            }
        })
    },[socket, addMarker])

    //Origin new marker map
    useEffect(() => {
        newMarks$.subscribe(marker => {
                socket.emit('marker-new', marker)
        })
    },[newMarks$, socket])

    //Move new marker map
    useEffect(() => {
            moveMarks$.subscribe( marker => {
               socket.emit('marker-update', marker)
            })
    }, [socket, moveMarks$])

    //Comunicate with new marker
    useEffect(()=>{
        socket.on('marker-new',(marker)=>{
            addMarker(marker, marker.id)
        })
    },[socket, addMarker])

    //Receive marker updates
    useEffect(() => {
        socket.on('marker-update', (marker) => {
            updatePosition(marker)
        })
    }, [socket, updatePosition])

    return (
        <>
            <div className="infowindow">
                Lat: {coords.lat} | Lng: {coords.lng} | zoom: {coords.zoom}
            </div>
            <div
                className="mapContainer"
                ref={setRef}
            >
            </div>
        </>
    )
}
