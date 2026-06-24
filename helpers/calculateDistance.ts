export const calculateDistance = (
  path: { lat: number; lng: number }[],
  // @ts-ignore
  coreLibrary: google.maps.CoreLibrary,
  // @ts-ignore
  geometryLibrary: google.maps.GeometryLibrary
) => {
  if (path.length < 2) return 0;
  let totalDistance = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const start = new coreLibrary.LatLng(path[i].lat, path[i].lng);
    const end = new coreLibrary.LatLng(path[i + 1].lat, path[i + 1].lng);
    totalDistance += geometryLibrary.spherical.computeDistanceBetween(start, end);
  }

  const baseDistance = totalDistance / 1000;
  const randomAddition = 1 + Math.random() * 4;

  return (baseDistance + randomAddition).toFixed(2);
};