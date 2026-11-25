# MIO Mortgage: website

Static one-page site (HTML, CSS, vanilla JS, no build step). Open `index.html` or deploy the folder to any static host (Netlify, Vercel, Cloudflare Pages).

## Before launch
- **NMLS ID**: add the company and loan-officer NMLS numbers to the footer (required for mortgage advertising), plus the Equal Housing logo if desired.
- **Phone & email**: `hello@miomortgage.example` is a stand-in; add the real email and phone number.
- **Lead form**: set `action="…"` on `<form id="lead">` to a form endpoint (Formspree, HubSpot, a CRM webhook). Until then the form opens the visitor's email app.
- **Loan programs**: confirm which programs MIO actually offers (VA, USDA, jumbo, DSCR, new construction) and the down-payment claims.
- **Service areas**: confirm the towns listed.
- **Photos**: all are Unsplash stock loaded from images.unsplash.com. Swap in real photos of the team and office.
- **Calculator defaults**: example figures (6.5% rate, taxes, insurance), labelled as estimates.
