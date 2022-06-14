import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useSocket } from "../hooks/useSocket";
import {v4 as uuid} from 'uuid'
import L from 'leaflet';

import icon from '../assets/pin.svg';

import 'leaflet/dist/leaflet.css';
import '../styles.css';
import { DraggableMarker, ISubmitProps } from "../components/DraggableMarker";
import { useNetwork } from "../hooks/useNetwork";
import { toast } from "react-toastify";

export interface ICoordinateProps {
  _id?:string;
  hash:string;
  lat:number;
  lng:number;
  description:string;
}

export function Home() {
  const { socket } = useSocket();
  const { isOnline } = useNetwork();

  const [coordinates, setCoordinates] = useState<ICoordinateProps[]>([]);
  const [connectionWasLost,setConnectionWasLost] = useState(false);

  const iconPerson = new L.Icon({
    iconUrl: icon,
    iconSize: new L.Point(40, 55),
  });

  const handleSyncData = useCallback(() => {
    const storagedCoordinates = localStorage.getItem('storagedCoordinates');

    if(storagedCoordinates){
      const coords = JSON.parse(storagedCoordinates) as ICoordinateProps[];

      coords.map(coord => socket.emit('addCoordinates', coord))

      localStorage.removeItem('storagedCoordinates')
    }
  },[socket])

  const handleSubmit = useCallback(({description,lat,lng }:ISubmitProps) => {

    const coord = {
      description,
      lat,
      lng,
      hash: uuid()
    }

    if(isOnline){
      socket.emit("addCoordinates", coord)
    }else{
     
      const storagedCoordinates = localStorage.getItem('storagedCoordinates');
 
      const coords:ICoordinateProps[] = [];

      if(storagedCoordinates){
        const jsonCoords = JSON.parse(storagedCoordinates) as ICoordinateProps[];

        jsonCoords.map(coord => coords.push(coord))
      }

      coords.push(coord);
      
      localStorage.setItem('storagedCoordinates', JSON.stringify(coords))

      setCoordinates([...coordinates, coord])

    }
  }, [socket,isOnline,coordinates])

  useLayoutEffect(()=> {
    socket.connect()
  },[socket])

  useEffect(() => {
    socket.on("connect", () => {
        socket.emit("listCoordinates")
        toast.success("Conectado ao socket")
    });

    socket.on("listCoordinates", (data) => {
      setCoordinates(data);
    });

    socket.on("addedCoordinates", (message) => {
      toast.success(message)
    });

    socket.on("error", (message) => toast.error(message))
  }, [socket]);

  useEffect(()=>{
    if(isOnline && connectionWasLost){
      socket.connect()
      toast.info("Sincronizando dados");
      setConnectionWasLost(false)
      handleSyncData()
    }
  },[isOnline, connectionWasLost,socket,handleSyncData])

  useEffect(()=>{
    if(!isOnline){
      toast.error("Conexão perdida");
      setConnectionWasLost(true);
    }
  },[isOnline])


  return (
    <div>
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates.map(coordinate => (
           <Marker key={coordinate.hash} position={[coordinate.lat, coordinate.lng]} icon={iconPerson}>
           <Popup>
             <Popup>
               {coordinate.description}
             </Popup>
           </Popup>
         </Marker>
        ))}
        <DraggableMarker onSubmit={handleSubmit}/>
      </MapContainer>
    </div>
  );
}
