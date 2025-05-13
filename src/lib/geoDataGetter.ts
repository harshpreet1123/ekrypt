// Remove:
// import geoip from "geoip-lite";

// Add:
export const getGeoData= async(ip: string)=>{
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}
