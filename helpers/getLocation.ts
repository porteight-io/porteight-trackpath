type AddressComponent = {
  long_name: string;
  types: string[];
};

/** Prefers a short "City, State, Country" label over the full postal address. */
const pickComponent = (components: AddressComponent[], types: string[]) =>
  components.find((component) =>
    types.some((type) => component.types.includes(type)),
  )?.long_name;

const toShortLabel = (components: AddressComponent[] = []) => {
  const parts = [
    pickComponent(components, [
      "locality",
      "sublocality",
      "administrative_area_level_3",
      "administrative_area_level_2",
    ]),
    pickComponent(components, ["administrative_area_level_1"]),
    pickComponent(components, ["country"]),
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : null;
};

export const getLocationName = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return toShortLabel(result.address_components) ?? result.formatted_address;
    }

    return "Location not found";
  } catch (error) {
    console.error(error);
    return "Error fetching location";
  }
};
