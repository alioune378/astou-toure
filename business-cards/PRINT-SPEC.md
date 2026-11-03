# Astou Touré — business card print specification

## Size

| | |
|---|---|
| Finished (trim) | 3.5 × 2 in (US standard) |
| With bleed | 3.75 × 2.25 in (0.125 in bleed on every side) |
| Safe area | Keep text 0.125 in inside the trim. Every element in the design already respects this. |
| Sides | Front: onyx with the approved logo. Back: ivory with contact details. |

## Files

| File | Use |
|---|---|
| `print/astou-toure-card-front-and-back.pdf` | Upload this two-page file (page 1 = front, page 2 = back) |
| `print/astou-toure-card-front.pdf`, `…-back.pdf` | The same pages as separate files, for printers that want one file per side |
| `print/*-600dpi-with-bleed.png` | 2250 × 1350 px images at 600 dpi, for printers that prefer images (VistaPrint accepts these) |
| `preview/*-trimmed.png` | How the finished card looks after cutting |
| `preview/*-proof-guides.png` | Proofs with guides: red = trim line, blue = safe area |
| `card-master.html` + `render-cards.mjs` | Editable master. Change the text, then re-render. |

## Colour

- Onyx `#0B0B0B` · Ivory `#F7F3E8` · Muted gold `#C6A15B` · Soft bronze `#8A5E3C`.
- The files are RGB. VistaPrint and most online printers convert to CMYK automatically.
- For a printer that wants CMYK, ask for these builds:
  - Front background: rich black, roughly C60 M40 Y40 K100.
  - Gold text: roughly C20 M35 Y75 K5.
- Order a printed proof first. Printed gold ink can never look metallic: it prints as a warm tan.
- The back uses only flat colours. No simulated metallic gradients are used.

## The logo on the front

- The front uses the approved logo exactly as supplied: the gold AT, the "ASTOU TOURÉ" wordmark and "ASTOU STYLE & BOUTIQUE".
- That logo is a raster image with built-in gold shading, at about 540 dpi at printed size. It prints sharply, as a photographic gold tone.
- The logo kit itself notes that no true vector version exists yet. That matters only for foil.

## Real foil (optional, recommended for the premium version)

Foil needs a separate one-colour vector file (100% black = foil), with no shading.

1. Redraw the AT monogram and the wordmark as vector artwork in Illustrator or Affinity. Use a manual redraw, not auto-trace, so the letter shapes stay faithful to the approved logo.
2. Make a foil layer containing the monogram, the wordmark and the descriptor line (front only), in gold foil.
   - Minimum line weight: 0.25 pt.
   - Minimum foil text size: 6 pt.
3. The front then prints onyx with foil on top. Keep the back as it is, in flat ink.
4. Suggested stock: 16–32 pt, soft-touch or matte black (for example VistaPrint "Foil Accent", or Moo "Luxe").

## Text and type

- Back contact text: Jost 6.9 pt. Address: 6.4 pt. Name: Bodoni Moda 12.5 pt.
- The PDFs embed the fonts.
- Some print prepress checks warn about "Type 3" fonts in browser-made PDFs. If a printer rejects the PDF, upload the 600 dpi PNG files instead.
- Fonts: Bodoni Moda and Jost, both under the SIL Open Font License (see `fonts/`).

## QR code

The back currently shows a marked placeholder. Once the final website address is confirmed:

```bash
node render-cards.mjs https://final-address.com
```

This puts a vector QR code (onyx on ivory) in the placeholder's place. Test-scan a printed proof before ordering in quantity.
