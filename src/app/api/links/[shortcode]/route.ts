import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Link } from "@/model/Link";
import { Analytics } from "@/model/Analytics";
import { getGeoData } from "@/lib/geoDataGetter";

export async function GET(
  req: NextRequest,
  { params }: { params: { shortcode: string } }
) {
  await connectDB();
  const { shortcode } = params;
  console.log("+++++++");
  console.log(shortcode);
  console.log("+++++++");
  const link = await Link.findOne({ shortCode: shortcode });
  console.log(link);

  if (!link) return new NextResponse("Link not found", { status: 404 });

  // Check TTL
  if (
    link.ttlMinutes &&
    new Date(link.createdAt).getTime() + link.ttlMinutes * 60000 < Date.now()
  ) {
    return new NextResponse("Link expired", { status: 410 });
  }

  // Check max clicks
  if (link.maxClicks && link.clickCount >= link.maxClicks) {
    return new NextResponse("Link click limit reached", { status: 410 });
  }

  // One-time check
  if (link.oneTimeOnly && link.clickCount >= 1) {
    return new NextResponse("One-time link already used", { status: 410 });
  }

  // Update click count
  link.clickCount += 1;
  await link.save();

  // Record analytics
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.ip || "";
  const ua = req.headers.get("user-agent") || "";
  const referrer = req.headers.get("referer") || "";
  const geo = await getGeoData(ip);

  await Analytics.create({
    linkId: link._id,
    ip,
    timestamp: new Date(),
    userAgent: ua,
    referrer,
    country: geo.country || "",
    browser: "", // Optional: Parse UA
    os: "", // Optional: Parse UA
  });

  return NextResponse.json({ destination: link.originalUrl }, { status: 200 });
}
