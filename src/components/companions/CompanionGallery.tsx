"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function CompanionGallery({ name, photos }: { name: string; photos: string[] }) {
  const [selected, setSelected] = useState(0);
  return <div className="e-companion-gallery" aria-label={`${name}'s AI portrait gallery`}>
    <div className="e-gallery-photo"><Image src={photos[selected]} alt={`${name}, fictional AI portrait ${selected + 1}`} fill priority sizes="(max-width: 600px) 100vw, 45vw" style={{ objectFit: "cover", objectPosition: "50% 40%" }} /></div>
    <div className="e-gallery-controls">
      <button className="e-icon" aria-label="Previous portrait" title="Previous portrait" onClick={() => setSelected((selected - 1 + photos.length) % photos.length)} disabled={photos.length < 2}><ChevronLeft size={20} /></button>
      <div className="e-gallery-thumbnails">{photos.map((photo, index) => <button key={photo} aria-label={`View portrait ${index + 1}`} aria-pressed={index === selected} title={`Portrait ${index + 1}`} onClick={() => setSelected(index)}><Image src={photo} alt="" fill sizes="48px" style={{ objectFit: "cover" }} /></button>)}</div>
      <button className="e-icon" aria-label="Next portrait" title="Next portrait" onClick={() => setSelected((selected + 1) % photos.length)} disabled={photos.length < 2}><ChevronRight size={20} /></button>
    </div>
    <p className="e-fine">AI-generated character portraits</p>
  </div>;
}
