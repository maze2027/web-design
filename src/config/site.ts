/**
 * Single source of truth for NAP (name/address/phone) and business facts.
 * Anything marked [CONFIRM] is a placeholder that must be verified before launch.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.jkspeedydrivingschool.com").replace(/\/$/, "");

export const business = {
  name: "JK Speedy Driving School",
  phoneDisplay: "(908) 757-3456",
  phoneE164: "+19087573456",
  phoneHref: "tel:+19087573456",
  address: {
    street: "134 Somerset St, 2nd Floor",
    streetSchema: "134 Somerset St, 2nd Floor",
    city: "North Plainfield",
    region: "NJ",
    postalCode: "07060",
    country: "US",
    oneLine: "134 Somerset St, 2nd Floor, North Plainfield, NJ 07060",
  },
  // [CONFIRM] approximate coordinates for 134 Somerset St; verify against the Google Business Profile pin.
  geo: { lat: 40.6224, lng: -74.4248 },
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "20:00" },
    { days: ["Saturday"], opens: "09:00", closes: "13:00" },
  ],
  languages: ["es", "en", "pt", "ar"] as const,
  // [CONFIRM] WhatsApp number, digits only with country code.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "1XXXXXXXXXX",
  email: null as string | null, // [CONFIRM]
  listings: {
    yelp: "https://www.yelp.com/biz/jk-speedy-driving-school-north-plainfield",
    // [CONFIRM] replace with the real Google Business Profile URL.
    google: "https://www.google.com/maps/search/?api=1&query=JK+Speedy+Driving+School+134+Somerset+St+North+Plainfield+NJ",
    // [CONFIRM] replace with the "Write a review" short link from the Google Business Profile.
    googleReview: "https://www.google.com/maps/search/?api=1&query=JK+Speedy+Driving+School+North+Plainfield+NJ",
  },
  social: {
    facebook: null as string | null, // [CONFIRM]
    instagram: null as string | null, // [CONFIRM]
  },
  mvcLicenseNumber: null as string | null, // [CONFIRM] NJ MVC driving school license #
  mvcUrl: "https://www.nj.gov/mvc/",
  mvcLicenseUrl: "https://www.nj.gov/mvc/license/",
  lastVerified: "2026-11",
} as const;

const destination = encodeURIComponent(business.address.oneLine);
export const mapLinks = {
  directions: `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
  embed: `https://www.google.com/maps?q=${encodeURIComponent("JK Speedy Driving School, " + business.address.oneLine)}&output=embed`,
};

export const whatsappHref = (text: string) =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(text)}`;

/** Service slugs are stable IDs; localized anchors live in the message files. */
export const SERVICE_IDS = ["permit", "lessons", "road-test", "nervous", "teen", "adult"] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];
