import { TrackingContext } from "@/context/TrackingContext";
import { useContext } from "react";

export function useTracking() {
  const context = useContext(TrackingContext);

  if (!context) {
    throw new Error(
      "useTracking must be used inside TrackingProvider"
    );
  }

  return context;
}