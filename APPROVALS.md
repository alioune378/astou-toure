# Still needed from Astou before publication

1. **Overall approval** of the design, the text (English, Spanish and French; ideally a native Spanish speaker from her clientele reads the Spanish once) and the "Meet Astou Touré" copy. Her own story can replace or enrich it.
2. **Client photo consent.** Written OK from the clients shown, who are recognisable in photos 07, 08, 09 and 10 (05 and 06 are less identifiable). Or confirmation that consent was already given.
3. **Nappy and Boho photographs.** 4–8 real photos of each specialty, so these two sections show her work instead of "coming soon".
4. **Portrait:** received and used, as supplied (resized only). Confirm she's happy with it on the site.
5. **Opening hours** and how appointments work (days, salon versus travel, any deposit policy). Nothing is shown until she confirms.
6. **Travel.** How far she travels, out-of-state conditions and any travel fees. The site only says "subject to availability".
7. **WhatsApp.** Is 718-300-3011 on WhatsApp? If yes, the WhatsApp button can be switched on.
8. **Request delivery.** Approve sending requests by email to astoutoure167@gmail.com through Netlify Forms. The site currently opens the visitor's own email app instead.
9. **Boutique.** Real products, photos and how she sells them (in person, Instagram or online). Until then it stays "Coming soon".
10. **Website address** (domain). Needed for the business-card QR code and the Google Business Profile.
11. **Business cards.** Approve the proofs, and choose standard print or gold foil. Foil needs a vector redraw of the logo, as the approved logo is a raster image.
12. **Duplicate photo.** `astou_14` is a near-identical second angle of `astou_11`. Only one is used. Confirm which she prefers.
13. **Editorial images ("Beyond the salon").**
   - Confirm the publication name and issue date for "Fractal Affinities". Neither is shown on the site until confirmed.
   - Get permission to display the pages and photographs on her website. Editorial photos belong to the photographer and the publication, not to Astou.
   - Confirm which of the five gallery images come from the "Fractal Affinities" shoot, and Astou's role on each (sole hair, or shared with Thomas Dunkin). The site currently says only "From Astou's editorial collaborations" and states the joint credit as printed.

14. **New photos and videos (November 2026).** See `MEDIA.md` for every file.
   - **Editorial chapters.** "Fashion editorial", "Artistic headwraps" and "Memorable encounters" are on the page with a neutral "in preparation" line. They fill in automatically once approved items are added to `ED_CHAPTERS` in `src/content.ts`.
   - **Archive and editorial images (01, 03–08): published 4 Nov 2026.** The owner confirmed that Astou has authorization to share them, and that she did the hair and headwraps. Still useful:
     - Names: added 4 Nov 2026 as the owner confirmed them (group portrait: Amy, Alima, Iman, Astou; framed photo: Beyoncé and Astou; black-and-white: Astou, Beyoncé, Alima; purple headwrap and the two-look image: Beyoncé). The two other fashion images (full-length look, blue backdrop) name no one; say if they should.
     - The original, unrestored photos. The files on the site are AI-enhanced; the page says they were "digitally restored".
     - Publication and photographer credits for the fashion images.
   - **Image 02 ("Sculptural beauty").** Published as part of the credited "Fractal Affinities" shoot. Confirm Astou worked on this specific look (the printed credit is shared with Thomas Dunkin).
   - **Client consent** for the new client photos and videos: curved cornrows, highlighted micro braids, rolled updo (other salon customers are visible behind her), and the clients filmed in the eight videos, several of whom show their faces.
   - **Videos.** All 12 are published. The night-time cornrow clip (filmed outdoors) shows passers-by in the background.
15. **Contact details.**
   - Style partner Alima (+1 347 814 9472) is now shown in the contact section and footer. Confirm she is happy to be listed by first name.
   - **hello@astoustyle.com** is not used yet. The domain and mailbox are not configured, so requests still go to astoutoure167@gmail.com. Switch once the domain is live and a test email has arrived.
   - "Bliss Beauty World" has been removed from the website as instructed. It still appears on the business-card proofs; say if the cards should be updated too.
16. **Editorial: facts still to confirm with Astou** (updated 4 Nov 2026)
   1. **Couture images (03, 04, 08).** For each image: did she design the headpiece, make it, wrap it on set, or style the hair? Images 04 and 08 were described as "made by Astou"; she still needs to confirm which of these roles applies. No individual credit is shown until then.
   2. **Encounter with Beyoncé (05).** Did she do Beyoncé's hair for that occasion? Also the date, place and occasion.
   3. **Model per image (02, 07).** The printed page and Fashion Gone Rogue (March 2012) list the four models: Ataui Deng, Jeneil Williams, Cora Keegan, Nairoby Matos. The site names them for the editorial as a whole, not per image. Check 02 (Cora Keegan?) and 07 (Jeneil Williams?) against the original magazine pages.
   4. **L'Officiel Paris, March 2011 (03).** Confirm that this image comes from that issue. Confirm whether 04 and 08 do too; they are not labelled with it.
   5. **Originals.** Original photographs or magazine scans to replace the AI-enhanced copies, especially for 01, 05 and 06 (personal photos with real people) and 03 (magazine image).
   6. **Display rights.** Astou's authorization is confirmed. For the magazine images (02, 03, 04, 07, 08 and the "Fractal Affinities" pages), the photographs belong to the photographers and publications: confirm that portfolio use on a business website is covered. For 01, 05 and 06, confirm that the people pictured agreed to the photos being shared.

    "Masterpiece Theatre" vs "Fractal Affinities" is resolved. The printed "Fractal Affinities" credit block lists the same photographer, hair team, stylist, colourist, make-up artist, manicurist and the four models as the Garage Spring/Summer 2012 coverage, so it is one editorial. The site now shows it as one collection, one credit. "Masterpiece Theatre" was not found in published coverage, so it is not used on the site.
17. **Authenticity review of the enhanced editorial and celebrity images** (4 Nov 2026). No original prints or scans have been supplied, so nothing could be compared side by side. Every image in the Editorial & legacy section is an AI-enhanced copy. Their faces, hair and fabric textures may be partly reconstructed, so all of them are flagged for replacement. Priority order:
   1. 05 and 06 (personal photos with Beyoncé), then 01 (group with Iman): documentary photos of real people, so the risk is highest.
   2. 03 (L'Officiel image): its magazine text was clearly AI-reconstructed and has been cropped out. The image itself should come from an original scan.
   3. 04 and 08, then the Garage / "Fractal Affinities" images.

   The page says plainly that the images are digitally enhanced copies, not originals.
18. **Booking.** The form still runs in "demo" mode: it opens the visitor's email app with the request written out to astoutoure167@gmail.com, including the hairstyle, reference look, reference photo link and privacy notes. Switching to automatic Netlify delivery requires a test submission received in that inbox (see README). hello@astoustyle.com is not used until the domain and mailbox work.
19. **Redesign, 5 Nov 2026: still needed from Astou.**
   1. **Boutique photographs.** Received 5 Nov 2026 (17 photographs) and published on the boutique page (#/boutique): 3 turbans and 12 dresses, each with "Ask about this piece". Still to confirm: that each piece is actually stocked; prices, sizes and materials if she wants them shown; supplier or designer names if they should be credited (one photograph carries a "Le Mirage" label, left as is). Two dress photographs (06 hanging, 13 modelled) may show the same blue dress; they are listed separately because the visible details differ, so say if they are one piece. Many supplier photographs show models; confirm they may be used (supplier catalogue images).
   2. **How the boutique sells.** In person at the salon, by Instagram message, or both? The site currently says only "no online checkout; ask Astou".
   3. **Video with beaded braids** (`braids-beaded-360`). Removed from the site. Restore only if the client was 18 or over and agreed to be filmed, and the background figure is not a child.
   4. **Video soundtracks.** Is the music on each clip licensed (or original)? If not, the audio will be removed and replaced with licensed music.
   5. **Salon Digest rights.** The cover and the feature page belong to the publication and its photographer. Astou's authorization covers her own use; confirm that showing the pages on her website is acceptable. "MHB" is printed as the salon; confirm Astou was working there at the time.
   6. **Client consent for the new photos:** gold ornament updo (04, 05; other clients are visible behind her) and crystal ornament chignon (06).
   7. **Appointment delivery: one step left.** Requests are now stored in Netlify Forms. Tested 6 Nov 2026 (01:15 UTC) on the live site: the test request was accepted and stored with every field, then deleted. **Add the email notification** (README, "Appointment requests"), otherwise nobody is emailed when a request arrives.
   8. **Custom domain.** Done 5 Nov 2026: https://astoustyle.com is the primary address (Netlify DNS, Let's Encrypt certificate); www and astou-toure.netlify.app redirect to it. Email on the domain: not set up yet (owner will do it later).
   9. **Boutique inquiries** go to a second Netlify form, `boutique-inquiry`. Add an email notification for it too.
   10. **Young client video** (`braids-young-client-back`): published from the back only, cut before the child turns her head. Confirm a parent agreed to it being published.
   11. **Iman group portrait** (`ar_group_portrait`): removed 5 Nov 2026 for the final audit (no AI-altered image of Iman). The only copy is AI-enhanced. It can return from the original, unenhanced photograph.
