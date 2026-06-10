import {
  fetchTrackingHistory,
  getTodayString,
  validateFilters,
} from "@/helpers/validate";
import { FilterPayload } from "@/interfaces/interface";
import { getRegNo } from "@/services/regno.service";
import { Check, ChevronDown, Play, RotateCw } from "lucide-react";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import Button from "./UI/Button";
import { useTracking } from "@/hooks/useTracking";
import { List } from "react-window";

export default function FilterBar() {
  const [regNumber, setRegNumber] = useState("Truck No.");
  const [vehicleNumbers, setVehicleNumbers] = useState<
    { registrationNo: string }[]
  >([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [speed, setSpeed] = useState("2x");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const { setTrackPath } = useTracking();
  const { setTruckData } = useTracking();

  useEffect(() => {
    const fetchAndSeed = async () => {
      try {
        const numbers = await getRegNo();
        setVehicleNumbers(numbers);

        const first = numbers?.[0];
        setTruckData({
          truck_no: "Truck no.",
          eventStatus: "OFF",
          // model: "",
          // reporting_time: "",
          // current_location: ""
        });
        if (first) {
          setRegNumber(first.registrationNo);
          setStartDate(getTodayString());
          setEndDate(getTodayString());
          setStartTime("00:00");
          setEndTime("23:59");
        }
      } catch (err) {
        console.error("Failed to load registration numbers:", err);
      }
    };

    fetchAndSeed();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // @ts-ignore
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    getRegNo().then(setVehicleNumbers).catch(console.error);
  }, []);

  const buildPayload = useCallback(
    (): FilterPayload => ({
      regNumber,
      startDate,
      endDate,
      startTime,
      endTime,
    }),
    [regNumber, startDate, endDate, startTime, endTime],
  );

  const filteredVehicles = useMemo(() => {
    return vehicleNumbers.filter((item) =>
      item.registrationNo.toLowerCase().includes(search.toLowerCase()),
    );
  }, [vehicleNumbers, search]);

  const handleSubmit = async () => {
    const payload = buildPayload();
    const validationError = validateFilters(payload);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const fromDate = new Date(`${startDate}T${startTime}:00`);
      const toDate = new Date(`${endDate}T${endTime}:00`);

      const response = await fetchTrackingHistory(regNumber, {
        from: fromDate,
        to: toDate,
      });

      const flattenedData = response?.data?.flat() || [];

      const coordinates = flattenedData.map((item: any) => ({
        lat: Number(item.latitude),
        lng: Number(item.longitude),
      }));

      setTrackPath(coordinates);

      const latestEvent = flattenedData[flattenedData.length - 1];

      setTruckData({
        truck_no: regNumber,
        eventStatus:
          latestEvent?.eventData_ignitionStatus,
        lat: Number(latestEvent.latitude),
        lng: Number(latestEvent.longitude),
        // model: "",
        // reporting_time: "",
        // current_location: ""
      });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch tracking data.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const first = vehicleNumbers?.[0];
    setRegNumber("Truck No.");
    if (first) {
      setStartDate(getTodayString());
      setEndDate(getTodayString());
      setStartTime("00:00");
      setEndTime("23:59");
    }
    setSpeed("2x");
    setError(null);
    setIsPlaying(false);
  };

  const handlePlay = async () => {
    // const payload = buildPayload();
    // const validationError = validateFilters(payload);

    // if (validationError) {
    //   setError(validationError);
    //   return;
    // }

    // setError(null);

    // const playbackPayload: PlaybackPayload = { ...payload, speed };

    // if (isPlaying) {
    //   // Stop playback
    //   setIsPlaying(false);
    //   return;
    // }

    // setIsPlaying(true);

    // try {
    //   const response = await axios.post(
    //     "/api/vehicle/playback",
    //     playbackPayload,
    //     {
    //       headers: { "Content-Type": "application/json" },
    //     },
    //   );

    //   if (response.status !== 200) {
    //     const { message } = await response.data.catch(() => ({}));
    //     throw new Error(message ?? `Server error: ${response.status}`);
    //   }

    //   const data = await response.data;
    //   // TODO: hand off `data` + `speed` to your map player
    // } catch (err) {
    //   setError(
    //     err instanceof Error ? err.message : "Failed to start playback.",
    //   );
    //   setIsPlaying(false);
    // }

    alert("Play!");
  };

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const item = filteredVehicles[index];

    return (
      <div
        style={style}
        className="cursor-pointer border-b px-4 py-2 hover:bg-slate-100"
        onClick={() => {
          setRegNumber(item.registrationNo);
          setSearch(item.registrationNo);
          setIsDropdownOpen(false);
        }}
      >
        {item.registrationNo}
      </div>
    );
  };

  return (
    <section className="border-b border-slate-200 bg-white lg:px-18 md:px-10 px-6 py-3">
      {/* Validation error banner */}
      {error && (
        <p className="mb-2 text-xs font-medium text-red-500">{error}</p>
      )}

      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-wrap items-end gap-2">
          {/* Reg Number */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-slate-500">Reg Number</label>

                <div ref={dropdownRef} className="relative w-64">
                  {/* Search Input */}
                  <input
                    type="text"
                    value={search || regNumber}
                    placeholder="Search vehicle..."
                    onFocus={() => setIsDropdownOpen(true)}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setRegNumber(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    className="h-11 w-full border-b border-slate-300 bg-transparent pr-8 font-medium text-slate-700 outline-none"
                  />

                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-0 top-3 text-slate-500"
                  />

                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-md border bg-white shadow-lg">
                      {filteredVehicles.length > 0 ? (
                        <List
                          style={{
                            height: 300,
                            width: "100%",
                          }}
                          rowCount={filteredVehicles.length}
                          rowHeight={40}
                          rowComponent={Row}
                          // @ts-ignore
                          rowProps={{}}
                        />
                      ) : (
                        <div className="p-4 text-sm text-slate-500">
                          No vehicle found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-500">Start Date</label>
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-11 border-b border-slate-300 bg-transparent pr-8 font-medium text-slate-700 outline-none"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-500">End Date</label>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-11 border-b border-slate-300 bg-transparent pr-8 font-medium text-slate-700 outline-none"
            />
          </div>

          {/* Start Time */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-500">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="h-11 border-b border-slate-300 bg-transparent font-medium text-slate-700 outline-none"
            />
          </div>

          {/* End Time */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-500">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="h-11 border-b border-slate-300 bg-transparent font-medium text-slate-700 outline-none"
            />
          </div>

          <Button
            variant="primary"
            text={isLoading ? "Loading..." : "Submit"}
            backIcon={<Check size={16} />}
            size="sm"
            onClick={handleSubmit}
            disabled={isLoading}
          />

          <Button
            variant="primary"
            text="Reset"
            backIcon={<RotateCw size={16} />}
            size="sm"
            onClick={handleReset}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-end gap-6">
          {/* Speed */}
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-500">Speed</label>
            <div className="relative">
              <select
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="h-11 appearance-none border-b border-slate-300 bg-transparent pr-8 font-medium text-slate-700 outline-none"
              >
                <option value="1x">1x</option>
                <option value="2x">2x</option>
                <option value="4x">4x</option>
                <option value="8x">8x</option>
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-0 top-3 text-slate-500"
              />
            </div>
          </div>

          {/* Play / Stop */}
          <div className="relative">
            <span className="absolute -right-3 -top-2 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
              New
            </span>
            <Button
              variant="primary"
              text={isPlaying ? "Stop" : "Play"}
              backIcon={<Play size={16} fill={"#000000"} />}
              size="sm"
              onClick={handlePlay}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
