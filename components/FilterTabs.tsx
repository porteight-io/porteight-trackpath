"use client";

import {
  bumpTruckRotationOnSubmit,
  detectStoppages,
  fetchTrackingHistory,
  formatDateForFilter,
  getTodayString,
  parseFilterDate,
  validateFilters,
} from "@/helpers/validate";
import { FilterPayload, VehicleNumber } from "@/interfaces/interface";
import { getRegNo } from "@/services/regno.service";
import {
  AccessTimeFilledIcon,
  ArrowDropDownIcon,
  ClearIcon,
  DateRangeIcon,
  DownloadIcon,
  SubmitIcon,
} from "./FilterIcons";
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTracking } from "@/hooks/useTracking";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

/**
 * The date/time fields: a ._div_1bxhq_6 wrapper carrying 10px of right padding,
 * a ._label_1bxhq_11 floated onto the border, and a Bootstrap .form-control
 * input that owns the 33px box, #898989 border and .375rem radius.
 */
function Field({
  label,
  width,
  borderClass,
  children,
}: {
  label: string;
  width: number;
  borderClass: string;
  children: ReactNode;
}) {
  return (
    <div className="relative shrink-0 pr-[10px]">
      <span className="pointer-events-none absolute left-[8px] top-0 z-10 -translate-y-1/2 bg-white px-[5px] text-[11px] leading-[1.5] text-[#666]">
        {label}
      </span>
      <div
        style={{ width }}
        className={`flex h-[33px] items-center gap-1 rounded-[5.25px] border pl-[10.5px] pr-[8px] ${borderClass}`}
      >
        {children}
      </div>
    </div>
  );
}

const fieldInputClass =
  "h-full w-full min-w-0 bg-transparent text-[14px] font-normal leading-[21px] text-[#212529] outline-none placeholder:text-slate-400";

/** The two time inputs render a step smaller than the date input. */
const timeInputClass =
  "h-full w-full min-w-0 bg-transparent text-[13px] font-normal leading-[19.5px] text-[#212529] outline-none placeholder:text-slate-400";

const buttonBase =
  "h-[33px] min-w-[64px] cursor-pointer items-center justify-center gap-2 whitespace-nowrap text-[12.25px] font-medium leading-[1.75] tracking-[0.35px] text-white transition-colors duration-[250ms] disabled:cursor-not-allowed disabled:opacity-70";

/** MuiButton-outlined: 5px/15px padding, 5px radius, keeps the outlined border. */
const submitButtonClass = `flex rounded-[5px] border border-[rgba(25,118,210,0.5)] bg-[#1d4897] px-[15px] py-[5px] ${buttonBase}`;

/** MuiButton-contained: 6px/16px padding, 4px radius, no border, a shade lighter. */
const downloadButtonClass = `inline-flex rounded-[4px] bg-[#1a4b95] px-[16px] py-[6px] ${buttonBase}`;

export default function FilterBar() {
  const [regNumber, setRegNumber] = useState("");
  const [vehicleNumbers, setVehicleNumbers] = useState<VehicleNumber[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { historyData, setTrackPath, setTruckData, setHistoryData, setStoppages } =
    useTracking();

  useEffect(() => {
    const fetchAndSeed = async () => {
      try {
        const numbers = await getRegNo();
        setVehicleNumbers(numbers);

        const first = numbers?.[0];
        if (first) {
          setRegNumber(first.registrationNo);
          const today = parseFilterDate(getTodayString());
          setStartDate(today);
          setEndDate(today);
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
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const buildPayload = useCallback(
    (): FilterPayload => ({
      regNumber,
      startDate: startDate ? formatDateForFilter(startDate) : "",
      endDate: endDate ? formatDateForFilter(endDate) : "",
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
      const fromDate = new Date(
        `${formatDateForFilter(startDate!)}T${normalizedStartTime}:00`,
      );
      const toDate = new Date(
        `${formatDateForFilter(endDate!)}T${normalizedEndTime}:00`,
      );

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
      setHistoryData(flattenedData);
      setStoppages(detectStoppages(flattenedData));
      bumpTruckRotationOnSubmit();

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

  const handleDownload = () => {
    if (historyData.length === 0) {
      setError("Nothing to download yet. Submit a search first.");
      return;
    }

    const columns = [
      "timestamp",
      "latitude",
      "longitude",
      "heading",
      "eventData_ignitionStatus",
    ] as const;

    const rows = historyData.map((point) =>
      columns.map((column) => point[column] ?? "").join(","),
    );
    const csv = [columns.join(","), ...rows].join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${regNumber || "trace"}-trace.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="shrink-0 bg-white pr-5 pt-[11px]">
      {error && (
        <p className="mb-2 text-xs font-medium text-red-500">{error}</p>
      )}

      {/* .trace-header: flex, gap 10px, margin-bottom 10px. */}
      <div className="mb-[10px] flex flex-wrap items-center gap-[10px]">
        {/* MUI Autocomplete: 236px, input root padded 6px / 65px for the adornment. */}
        <div ref={dropdownRef} className="relative w-[236px] shrink-0">
          <span className="pointer-events-none absolute left-[8px] top-0 z-10 -translate-y-1/2 bg-white px-[5px] text-[11.25px] leading-[1.5] text-[#666]">
            Reg No
          </span>
          <div className="relative flex h-[33px] items-center rounded-[4px] border border-[rgba(0,0,0,0.23)] py-[6px] pl-[6px] pr-[65px]">
            <input
              type="text"
              value={isDropdownOpen ? search : regNumber}
              placeholder="Search vehicle..."
              onFocus={() => {
                setSearch(regNumber);
                setIsDropdownOpen(true);
              }}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsDropdownOpen(true);
              }}
              className="h-full w-full min-w-0 bg-transparent pl-[8px] pr-[4px] text-[14px] font-normal tracking-[0.13132px] text-[rgba(0,0,0,0.87)] outline-none placeholder:text-slate-400"
            />

            {/* .MuiAutocomplete-endAdornment sits absolutely, 9px off the right. */}
            <div className="absolute right-[9px] top-1/2 flex -translate-y-1/2 items-center">
              {regNumber && (
                <button
                  type="button"
                  title="Clear"
                  aria-label="Clear"
                  onClick={() => {
                    setRegNumber("");
                    setSearch("");
                  }}
                  className="grid h-[25.5px] w-[25.5px] cursor-pointer place-items-center rounded-full p-[4px] text-[rgba(0,0,0,0.54)]"
                >
                  <ClearIcon size={17.5} />
                </button>
              )}
              <button
                type="button"
                aria-label="Open"
                onClick={() => setIsDropdownOpen((open) => !open)}
                className="grid h-[25px] w-[25px] cursor-pointer place-items-center rounded-full p-[2px] text-[#1a4b95]"
              >
                <ArrowDropDownIcon size={21} />
              </button>
            </div>
          </div>

          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 max-h-[300px] w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((item) => (
                  <button
                    key={item.registrationNo}
                    type="button"
                    className="w-full cursor-pointer border-b border-slate-100 px-4 py-2 text-left text-sm hover:bg-slate-100"
                    onClick={() => {
                      setRegNumber(item.registrationNo);
                      setSearch("");
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

        {/* .trace-header__datetime: 529px of flex with no gap of its own. */}
        <div className="flex shrink-0">
          <Field label="Start Date - End Date" width={200} borderClass="border-[#898989]">
            <DatePicker
              selectsRange
              selected={startDate}
              startDate={startDate ?? undefined}
              endDate={endDate ?? undefined}
              onChange={([nextStart, nextEnd]) => {
                setStartDate(nextStart);
                setEndDate(nextEnd);
              }}
              dateFormat="dd-MM-yyyy"
              placeholderText="dd-mm-yyyy - dd-mm-yyyy"
              wrapperClassName="flex-1 min-w-0 h-full"
              className={fieldInputClass}
            />
            <DateRangeIcon size={21} className="shrink-0 text-[#898989]" />
          </Field>

          <Field label="Start Time" width={149.5} borderClass="border-[#d2d2d2]">
            <TimeInput24
              value={startTime}
              onChange={setStartTime}
              className={`no-time-icon ${timeInputClass}`}
            />
            <AccessTimeFilledIcon size={21} className="shrink-0 text-[#898989]" />
          </Field>

          <Field label="End Time" width={149.5} borderClass="border-[#d2d2d2]">
            <TimeInput24
              value={endTime}
              onChange={setEndTime}
              className={`no-time-icon ${timeInputClass}`}
            />
            <AccessTimeFilledIcon size={21} className="shrink-0 text-[#898989]" />
          </Field>
        </div>

        {/* Each .trace-header__action is its own flex child of the 10px row. */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={submitButtonClass}
        >
          {isLoading ? "Loading..." : "Submit"}
          <SubmitIcon size={22} className="-mr-1" />
        </button>

        <button
          type="button"
          onClick={handleDownload}
          className={downloadButtonClass}
        >
          Download
          <DownloadIcon size={18} className="-mr-1" />
        </button>
      </div>
    </section>
  );
}
