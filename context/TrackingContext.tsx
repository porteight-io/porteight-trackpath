"use client";

import {
  createContext,
  useState,
  ReactNode,
} from "react";

type TrackPoint = {
  lat: number;
  lng: number;
};

type TruckProp = {
  truck_no: string;
  eventStatus: string;
  // model: string;
  // reporting_time: string;
  // current_location: string;
}

type TrackingContextType = {
  trackPath: TrackPoint[];
  truckData: TruckProp;
  setTruckData: React.Dispatch<React.SetStateAction<TruckProp>>;
  setTrackPath: React.Dispatch<React.SetStateAction<TrackPoint[]>>;
};

export const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined
);

export function TrackingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [trackPath, setTrackPath] = useState<TrackPoint[]>([]);
  const [truckData, setTruckData] = useState<TruckProp>({
    truck_no: "",
    eventStatus: "",
    // model: "",
    // reporting_time: "",
    // current_location: ""
  });

  return (
    <TrackingContext.Provider
      value={{
        trackPath,
        setTrackPath,
        truckData,
        setTruckData
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}