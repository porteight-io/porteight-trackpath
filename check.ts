import axios from "axios";
import { DateRange, fetchTrackingDataResponse, HistoryData } from "./interfaces/interface";
import { segmentTrackingData, toISTDate } from "./helpers/validate";
import "dotenv/config";

const fetchTrackingHistory = async (
  truckId: string,
  range?: DateRange,
) => {
    console.log("Fetching tracking history for:", truckId, range);
    const simulatorUrl = process.env.NEXT_PUBLIC_SIMULATOR_URL;
    console.log("Simulator URL:", simulatorUrl);
  try {
    // Try simulator API first if available
    if (simulatorUrl && range?.from && range?.to) {
      try {
        const simulatorResponse = await axios.get(
          `${simulatorUrl}/api/tracking-history?truckId=${truckId}&dateFrom=${toISTDate(range.from)}&dateTo=${toISTDate(range.to)}`,
        );
        const simulatorData = simulatorResponse.data;
        console.log("Fetched from simulator:", simulatorData);
        return { data: segmentTrackingData(simulatorData), length: simulatorData.data.length };
      } catch (simulatorError) {
        // Fall through to Tinybird API
      }
    }
  } catch (error) {
    // Error handling
    console.error("Error fetching tracking history:", error);
  }
};

fetchTrackingHistory("HR00AB0000", {
    from: new Date("2026-05-10T00:00:00"),
  to: new Date("2026-05-15T23:59:59"),
})