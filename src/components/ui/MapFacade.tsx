"use client";

import { useState } from "react";
import { mapLinks } from "@/config/site";
import { Icon } from "./Icon";

/** Click-to-load Google Map: zero third-party requests or cookies until asked. */
export function MapFacade({ loadLabel, note, frameTitle, directionsLabel, address, externalLabel }: {
  loadLabel: string;
  note: string;
  frameTitle: string;
  directionsLabel: string;
  address: string;
  externalLabel: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="card relative aspect-[4/3] w-full overflow-hidden bg-asphalt sm:aspect-[16/10]">
      {show ? (
        <iframe
          title={frameTitle}
          src={mapLinks.embed}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="map-grid absolute inset-0">
          <svg aria-hidden="true" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <path d="M-20 170 C 90 150, 140 60, 230 90 S 360 210, 430 120" stroke="#2b3340" strokeWidth="26" fill="none" />
            <path d="M-20 170 C 90 150, 140 60, 230 90 S 360 210, 430 120" stroke="#FFC72C" strokeWidth="2" strokeDasharray="10 9" fill="none" opacity=".7" />
            <path d="M120 -10 L 170 260" stroke="#2b3340" strokeWidth="16" />
          </svg>
          <div className="absolute start-1/2 top-[38%] -translate-x-1/2 -translate-y-full rtl:translate-x-1/2">
            <span className="grid size-14 place-items-center rounded-full rounded-br-none bg-yellow text-asphalt shadow-[0_12px_30px_-8px_rgba(255,199,44,.7)] [transform:rotate(45deg)]">
              <Icon name="pin" className="size-6 [transform:rotate(-45deg)]" />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 bg-gradient-to-t from-asphalt via-asphalt/85 to-transparent p-5 pt-16 text-paper sm:p-6">
            <p className="text-sm text-slate">{address}</p>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setShow(true)} className="btn btn-primary btn-sm">
                <Icon name="pin" className="size-4" /> {loadLabel}
              </button>
              <a href={mapLinks.directions} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-sm">
                {directionsLabel} <Icon name="external" className="size-4" />
                <span className="sr-only">{externalLabel}</span>
              </a>
            </div>
            <p className="text-xs text-slate">{note}</p>
          </div>
        </div>
      )}
    </div>
  );
}
