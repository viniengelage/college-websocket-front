import { useEffect, useState } from "react";

interface IConnectionProps{
  rtt:number;
}

const getConnection = () => {
  const { rtt } = navigator.connection as unknown as IConnectionProps

  return {
    connection: navigator.connection,
    isOnline: rtt,
  };
};

export const useNetwork = () => {
  const [connection, updateConnection] = useState(getConnection().connection);
  const [isOnline, setIsOnline] = useState(!!getConnection().isOnline);

  useEffect(() => {
    const updateStatus = () => {
      updateConnection(getConnection().connection);
      setIsOnline(!!getConnection().isOnline);
    };

    connection.addEventListener("change", updateStatus);
    return () => connection.removeEventListener("change", updateStatus);
  }, [connection]);

  return { connection, isOnline };
};
