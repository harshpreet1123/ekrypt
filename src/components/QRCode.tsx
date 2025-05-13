"use client";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCode({ url }: { url: string }) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <QRCodeCanvas value={url} size={200} />
      <p className="mt-2 text-center">Scan to visit</p>
    </div>
  );
}