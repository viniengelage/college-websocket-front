import { FormEventHandler, useCallback, useState, useRef } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import L, { LatLng } from "leaflet";

import icon from "../assets/pin.svg";

export interface ISubmitProps {
  description: string;
  lat: number;
  lng: number;
}

export interface IProps {
  onSubmit(data: ISubmitProps): void;
}

export function DraggableMarker({ onSubmit }: IProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<LatLng>({} as LatLng);

  const map = useMapEvents({
    click(e) {
      map.locate();
      setPosition(e.latlng);
    },
  });

  const iconPerson = new L.Icon({
    iconUrl: icon,
    iconSize: new L.Point(40, 55),
  });

  const handleSubmit = useCallback<FormEventHandler<Element>>(
    (e) => {
      e.preventDefault();

      if (inputRef.current) {
        onSubmit({
          description: inputRef.current.value,
          lat: position.lat,
          lng: position.lng,
        });

        inputRef.current.value = ''
      }

    },
    [onSubmit, position]
  );

  return Object.keys(position).length === 0 ? null : (
    <Marker position={position} icon={iconPerson}>
      <Popup>
        <Popup>
          <form onSubmit={handleSubmit}>
            <input maxLength={512} ref={inputRef} />
          </form>
        </Popup>
      </Popup>
    </Marker>
  );
}
