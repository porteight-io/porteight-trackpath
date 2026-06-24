import {
  fetchTrackingHistory,
  getTodayString,
  validateFilters,
} from "@/helpers/validate";
import { FilterPayload, VehicleNumber } from "@/interfaces/interface";
import { getRegNo } from "@/services/regno.service";
import { Check, ChevronDown, Play, RotateCw } from "lucide-react";
import { useCallback, useEffect, useState, useRef, useMemo, ChangeEvent } from "react";
import Button from "./UI/Button";
import { useTracking } from "@/hooks/useTracking";
import { RiArrowDropDownFill } from "@remixicon/react";

function formatTime24h(time: string) {
  const [hours = "0", minutes = "0"] = time.split(":");
  const parsed = new Date();
  parsed.setHours(Number(hours), Number(minutes), 0, 0);

  if (Number.isNaN(parsed.getTime())) return "00:00";

  return `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}`;
}

function isValidTime24h(time: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

function normalizeTimeInput(value: string): string {
  if (!value) return "";

  const colonMatch = value.match(/^(\d{1,2}):(\d{1,2})$/);
  if (colonMatch) {
    return formatTime24h(`${colonMatch[1]}:${colonMatch[2].padEnd(2, "0")}`);
  }

  const digits = value.replace(/\D/g, "");
  if (digits.length === 4) {
    return formatTime24h(`${digits.slice(0, 2)}:${digits.slice(2)}`);
  }

  if (digits.length === 3) {
    return formatTime24h(`${digits.slice(0, 1)}:${digits.slice(1)}`);
  }

  if (isValidTime24h(value)) {
    return formatTime24h(value);
  }

  return value;
}

function TimeInput24({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d:]/g, "").slice(0, 5);
    onChange(raw);
  };

  const handleBlur = () => {
    if (!value) return;
    onChange(normalizeTimeInput(value));
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      placeholder="HH:mm"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
      title="24-hour format (HH:mm)"
    />
  );
}

export default function FilterBar() {
  const [regNumber, setRegNumber] = useState("Truck No.");
  const [vehicleNumbers, setVehicleNumbers] = useState<VehicleNumber[]>([]);
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
        if (first) {
          setRegNumber(first.registrationNo);
          setStartDate(getTodayString());
          setEndDate(getTodayString());
          setStartTime("00:00");
          setEndTime("23:59");
          setTruckData({
            truck_no: first.registrationNo,
            eventStatus: "OFF",
            model: first.model || "",
          });
        }
      } catch (err) {
        console.error("Failed to load registration numbers:", err);
      }
    };

    fetchAndSeed();
  }, [setTruckData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
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

  const selectedVehicle = useMemo(
    () =>
      vehicleNumbers.find((item) => item.registrationNo === regNumber) ?? null,
    [vehicleNumbers, regNumber],
  );

  const handleSubmit = async () => {
    const normalizedStartTime = normalizeTimeInput(startTime);
    const normalizedEndTime = normalizeTimeInput(endTime);
    setStartTime(normalizedStartTime);
    setEndTime(normalizedEndTime);

    const payload = {
      ...buildPayload(),
      startTime: normalizedStartTime,
      endTime: normalizedEndTime,
    };
    const validationError = validateFilters(payload);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const fromDate = new Date(`${startDate}T${normalizedStartTime}:00`);
      const toDate = new Date(`${endDate}T${normalizedEndTime}:00`);

      const response = await fetchTrackingHistory(regNumber, {
        from: fromDate,
        to: toDate,
      });

      const flattenedData = response?.data?.flat() || [];

      const coordinates = flattenedData.map(
        (item: { latitude: string; longitude: string }) => ({
          lat: Number(item.latitude),
          lng: Number(item.longitude),
        }),
      );

      setTrackPath(coordinates);

      const latestEvent = flattenedData[flattenedData.length - 1];

      setTruckData({
        truck_no: regNumber,
        eventStatus: latestEvent?.eventData_ignitionStatus,
        lat: Number(latestEvent?.latitude),
        lng: Number(latestEvent?.longitude),
        model: selectedVehicle?.model || "",
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
    alert("Play!");
  };

  return (
    <section className="border-b border-slate-200 bg-white lg:px-18 md:px-10 px-6 pb-3 pt-1 font-['Calibri',_sans-serif]">
      {error && (
        <p className="mb-2 text-xs font-medium text-red-500">{error}</p>
      )}

      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-wrap items-end gap-5">
          <div className="flex flex-col">
            <div className="relative">
              <div className="flex flex-col">
                <label className="text-[12px] text-slate-500">Reg Number</label>

                <div ref={dropdownRef} className="relative w-60">
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
                    className="h-8 w-full border-b border-slate-300 bg-transparent font-medium outline-none text-[15px]"
                  />

                  <RiArrowDropDownFill size={16} className="absolute right-0 top-3 text-slate-600" />

                  {isDropdownOpen && (
                    <div className="absolute z-50 mt-2 max-h-[300px] w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                      {filteredVehicles.length > 0 ? (
                        filteredVehicles.map((item) => (
                          <button
                            key={item.registrationNo}
                            type="button"
                            className="w-full cursor-pointer border-b px-4 py-2 text-left text-sm hover:bg-slate-100"
                            onClick={() => {
                              setRegNumber(item.registrationNo);
                              setSearch(item.registrationNo);
                              setTruckData((prev) => ({
                                ...prev,
                                truck_no: item.registrationNo,
                                model: item.model || "",
                              }));
                              setIsDropdownOpen(false);
                            }}
                          >
                            {item.registrationNo}
                          </button>
                        ))
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

          <div className="flex flex-col">
            <label className="text-[12px] text-slate-500">Start Date</label>
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-8 border-b border-slate-300 bg-transparent font-medium outline-none text-[15px]"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[12px] text-slate-500">End Date</label>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-8 border-b border-slate-300 bg-transparent font-medium outline-none text-[15px]"
            />
          </div>

          <div className="flex flex-col mr-4">
            <label className="text-[12px] text-slate-500">Start Time</label>
            <TimeInput24
              value={startTime}
              onChange={setStartTime}
              className="no-time-icon h-8 w-[72px] border-b border-slate-300 bg-transparent font-medium outline-none text-[15px]"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[12px] text-slate-500">End Time</label>
            <TimeInput24
              value={endTime}
              onChange={setEndTime}
              className="no-time-icon h-8 w-[72px] border-b border-slate-300 bg-transparent font-medium outline-none text-[15px]"
            />
          </div>

          <div className="flex gap-6 ml-6">
            <Button
              variant="primary"
              text={isLoading ? "Loading..." : "Submit"}
              backIcon={
                <i className="fa fa-check text-[10px]" aria-hidden="true"></i>
              }
              size="md"
              onClick={handleSubmit}
              disabled={isLoading}
            />

            <Button
              variant="primary"
              text="Reset"
              backIcon={<RotateCw size={12} />}
              size="md"
              onClick={handleReset}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex items-end gap-12">
          <div className="flex flex-col">
            <label className="text-[12px] text-slate-500">Speed</label>
            <div className="relative">
              <select
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="h-8 appearance-none border-b border-slate-300 bg-transparent pr-8 font-medium outline-none text-[15px]"
              >
                <option value="1x">1x</option>
                <option value="2x">2x</option>
                <option value="4x">4x</option>
                <option value="8x">8x</option>
              </select>

              <RiArrowDropDownFill size={16} className="absolute right-0 top-3 text-slate-600" />
              
            </div>
          </div>

          <div className="relative">
            <span className="absolute -right-3 -top-2 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
              New
            </span>
            <Button
              variant="primary"
              text={isPlaying ? "Stop" : "Play"}
              backIcon={<Play size={12} fill={"#000000"} />}
              size="md"
              onClick={handlePlay}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
