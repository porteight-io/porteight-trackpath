import {
  BarChart3,
  LocateFixed,
  Share2,
  TrendingUp,
  LayoutDashboard,
  MapPin,
  Pin,
  MapPinIcon,
  Building2,
} from "lucide-react";
import Button from "./UI/Button";
import { useTracking } from "@/hooks/useTracking";
import NodeGeocoder from "node-geocoder";
import { useEffect, useState } from "react";
import { getLocationName } from "@/helpers/getLocation";
import { RiMapPin2Fill } from "@remixicon/react";

export default function VehicleInfo() {
  const { truckData } = useTracking();
  const [location, setLocation] = useState<string>("");
  const lat = truckData?.lat;
  const lon = truckData?.lng;
  console.log("VehicleInfo LatLng:", lat, lon);

  useEffect(() => {
    if (lat && lon) {
      getLocationName(lat, lon)
        .then((location) => {
          console.log("Resolved Location:", location);
          setLocation(location);
        })
        .catch((error) => {
          console.error("Error fetching location:", error);
        });
    }
  }, [lat, lon]);

  return (
    <section className="bg-[#4377db] lg:px-18 md:px-10 px-6 py-6 text-white font-calibri">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="secondary"
              text="Trace"
              frontIcon={
                <RiMapPin2Fill size={16} />
              }
              size="lg"
            />

            <Button
              variant="secondary"
              text="Trend"
              frontIcon={
                <i className="fa fa-line-chart" aria-hidden="true"></i>
              }
              size="lg"
            />

            <Button
              variant="secondary"
              text="KPI Compare"
              frontIcon={<i className="fa fa-bar-chart" aria-hidden="true"></i>}
              size="lg"
            />

            <Button
              variant="secondary"
              text="Vehicle Dashboard"
              frontIcon={
                <i className="fa fa-exclamation" aria-hidden="true"></i>
              }
              size="lg"
            />

            <Button
              variant="secondary"
              text="Near by Places"
              frontIcon={<Building2 size={16} />}
              size="lg"
            />
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              text="Download"
              backIcon={
                <i className="fa fa-download" aria-hidden="true"></i>
              }
              size="md"
            />

            <Button
              variant="primary"
              text="Share"
              backIcon={<Share2 size={14} fill="#000000" />}
              size="md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
