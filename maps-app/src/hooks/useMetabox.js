import {useRef, useEffect, useState, useCallback} from 'react'
import mapboxgl from "mapbox-gl";
import {v4}  from 'uuid';
import {Subject} from "rxjs";
mapboxgl.accessToken = 'pk.eyJ1IjoidmFsZW56dWVsYTIxIiwiYSI6ImNrbWFxMm0xdjF1cXoyb281aDU2Njh5ZXQifQ.3koj0khQvt6oNmCFeCgQrw';

export const useMapbox = (pointerStart) => {
    //Reference this Map
    const mapDiv = useRef();
    const setRef = useCallback((node) => {
        mapDiv.current = node
    }, [])

    const markers = useRef({})

    const mapa = useRef();
    const [coords, setCoords] = useState(pointerStart);

    //Observers Rxjs
    const moveMarks =  useRef(new Subject());
    const newMarks = useRef(new Subject());

    //Add Markers
    const addMarker = useCallback((event, id)=>{

        const {lng, lat}= event.lngLat || event;

        const marker = new mapboxgl.Marker();
        marker.id = id || v4() //Todo marker ID

        marker.setLngLat([lng,lat])
            .addTo(mapa.current)
            .setDraggable(true)

        //To assign of object de markers
        markers.current[marker.id] = marker;

        if(!id){
            newMarks.current.next({
                id: marker.id,
                lng,
                lat
            })
        }


        //Call position movement markers
        marker.on('drag', ({target}) => {
            const {id} = target;
            const {lng, lat} = target.getLngLat()
            //Emitir change marker
            moveMarks.current.next({
                id,
                lng,
                lat
            })

        })

    },[])

    const updatePosition = useCallback(({id, lng, lat}) => {
        markers.current[id].setLngLat([lng, lat])
    },[])


    useEffect(()=>{
        mapa.current = new mapboxgl.Map({
            container: mapDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [pointerStart.lng, pointerStart.lat],
            zoom:  pointerStart.zoom
        });
    },[pointerStart])

    //Move map
    useEffect(() => {
        mapa.current?.on('move', () => {
            const {lng,lat} = mapa.current.getCenter()
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)
            })
        })
    },[])


    useEffect(()=>{
        mapa.current?.on('click',(event)=>{
            addMarker(event)
        })
    },[addMarker])

    return{
        addMarker,
        updatePosition,
        newMarks$: newMarks.current,
        moveMarks$: moveMarks.current,
        coords,
        setRef
    }

}
