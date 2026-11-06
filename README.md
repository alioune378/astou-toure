# Astou Touré — The Art of Hair

The website and business cards for **Astou Style & Boutique**, built by **Dalal Technologies**.

- **Brand direction:** Option 2 gives the prestige layer (AT monogram; onyx, ivory, muted gold and bronze). Option 3 gives the editorial layer (the oversized ASTOU TOURÉ wordmark and fashion-magazine layouts).
- **Languages:** English (default), Spanish and French. The Spanish and French are written for her Bronx clientele (warm, natural phrasing, "tú" in Spanish, "vous" in French), not translated word for word.
- **Stack:** React 18 · Vite 5 · TypeScript · plain CSS · Netlify.

## Run and deploy

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # → dist/
```

To deploy: push to GitHub, then in Netlify choose **Add new site → Import from Git**. `netlify.toml` already sets the build (`npm run build`, publish `dist`, Node 20).

`?lang=es` opens the Spanish version and `?lang=fr` the French one. The language choice is remembered on the visitor's device.

## Appointment requests

A request is never shown as a confirmed booking. There's no payment and no fixed price.

Visitors choose one of three appointment types: salon (Bronx), private on-location (New York), or out-of-state / special event.
They can tick "Please keep my request confidential" and add discretion notes.

| `VITE_FORMS_MODE` | What happens |
|---|---|
| `netlify` (current) | The request, including the optional inspiration photo, is stored in Netlify Forms ("appointment-request"). The visitor sees "Request received" only after Netlify accepts it; otherwise they see an error with Astou's phone and email. |
| `demo` | The form checks every field, then opens the visitor's email app with a ready-written email to astoutoure167@gmail.com. The website stores nothing. |

**Email to Astou (required):** in Netlify, go to Project configuration → Forms → Form notifications → Add notification → Email notification.
Set it to astoutoure167@gmail.com (or her assistant's address) for the form "appointment-request". Until this is done,
requests are stored in Netlify (Forms → appointment-request) but nobody is emailed.

**Testing:** run the "Live appointment-form test" workflow in GitHub Actions. It sends one request named
"TEST — website check (please delete)". Delete it in Netlify afterwards.

**WhatsApp:** the button is built in but turned off. Set `whatsapp: true` in `src/content.ts` only after Astou confirms that 718-300-3011 is on WhatsApp.

## Updating content

| What | Where |
|---|---|
| Phone, email, Instagram, address | `src/content.ts` → `BIZ` |
| Style categories and their text | `src/content.ts` → `CATS` |
| Photos, captions, alt text, categories | `src/content.ts` → `PHOTOS` (image files in `public/photos/`) |
| Featured collections ("The art of the finished look") | `src/content.ts` → `LOOKS` |
| Videos ("The artistry in motion") | `src/content.ts` → `CLIP_GROUPS` (files in `public/media/video/`: `.mp4` plus a `.webp` poster) |
| Memorable encounters (shown only when filled) | `src/content.ts` → `ENCOUNTERS` |
| Every media file and its status | `MEDIA.md` |
| Colours, fonts, spacing | `src/styles/tokens.css` |
| Logo, monogram, favicons | `public/brand/` (from the approved logo kit) |

**Adding a photo:**
1. Export a WebP at 480, 800 and 1200 px wide, plus a JPEG fallback, named like the existing files.
2. Add the photo to `PHOTOS` and `src/photo-manifest.json`.
3. Mark it `client` (a real client) or `study` (a mannequin head). Never label a mannequin study as a client.

## Launch checklist (search engines)

The site is set to **noindex** until Astou approves it. At launch:
1. Delete the `<meta name="robots" content="noindex">` line in `index.html`.
2. Delete the `X-Robots-Tag` header block in `netlify.toml`.
3. In `public/robots.txt`, replace the content with `Allow: /`.
4. Add the final domain to the `og:image` URL and to `"image"` in the JSON-LD.

## Local search: Google Business Profile plan

1. Claim or create **Astou Style & Boutique** at business.google.com. Use the exact address: 9 East 167th Street, Bronx, NY 10452.
   - If she works inside another business's premises, Google may ask her to verify. Use the profile's suite or booth field if she has one.
2. Primary category: **Hair salon**. Secondary categories: **Braiding service**, **Beauty salon**.
3. Use the same phone, website and Instagram everywhere: the profile, Instagram bio and website. Search engines match these.
4. Add her real photos (the same ones as the website) and a short description in plain language. That description should naturally mention nappy styles, boho braids, sculptural braided updos and the Bronx.
5. Add hours only once she confirms them. Then add the same hours to the website's JSON-LD (`openingHoursSpecification`).
6. Reviews: ask real clients after an appointment. Never write or buy reviews. The site shows no ratings until real ones exist.

No ranking is promised. These steps give Google accurate, consistent information.

## Live vs. demo features

| Feature | Status |
|---|---|
| Phone, email, Instagram and Google Maps links | Live (tested) |
| Portfolio, filters and full-screen viewer (swipe on phones) | Live |
| Featured looks with "Inquire about a similar style" (pre-fills the form with the look) | Live |
| Videos: tap to play, one at a time, starts muted, sound and full-screen buttons, pauses when scrolled away | Live |
| Memorable encounters | Built, hidden until photos are confirmed (see `APPROVALS.md` item 14) |
| English / Spanish / French | Live |
| Appointment request | Live through the visitor's own email app: the request arrives in astoutoure167@gmail.com once the client presses send. The website itself does not store or send anything yet. |
| Automatic request delivery (Netlify Forms) | Prepared, not switched on. Turn it on only after a test request is received in Astou's inbox. |
| WhatsApp button | Prepared, off until the number is confirmed |
| Boutique | "Coming collection": there are no products yet |

## Editorial section ("Beyond the salon")

- The credited page (`ed_monochrome_editorial_portrait_and_credits`) is the case study.
- The second scan (`ed_monochrome_editorial_portrait_credits`) appears only as "Read the printed credits", not as a separate project.
- The "Fractal Affinities" article page appears as supporting evidence.
- The five other images form the editorial gallery.
- Credits are transcribed exactly as printed. The hair credit is shared with Thomas Dunkin, and the site says so.
- No publication name, date or model or celebrity identity is stated.
- These images never appear in the bookable style categories, including Nappy and Boho.

## Integrity rules followed

- Photos were only cropped and lightly colour-corrected (as supplied). No AI-generated or altered hair, faces or hairlines.
- Astou's portrait is used exactly as supplied (resized for the web, no retouching).
- Mannequin studies are labelled as mannequin studies, and client photos as client photos.
- Nappy and Boho have no matching photos yet, so they're presented typographically, with "coming soon". No unrelated photo is mislabelled to fill the gap.
- No invented hours, prices, testimonials, awards, press, celebrity clients or biography details.
- The boutique is a "coming collection": no products or prices are invented.

See `APPROVALS.md` and `business-cards/PRINT-SPEC.md`.
