# Jomni Blommor: design direction "Nordic botanical"

Status: **proposal, awaiting client approval.** Replace with the client's brand (logo, colours, fonts) if they have one.

## Idea

A Swedish flower shop in cool northern daylight. The background is pale like birch bark. Green comes from moss and stems. Colour accents come from the flowers themselves. The photos carry the page, and everything around them stays quiet.

The one bold element is the **glasshouse arch** with a **bouquet in the wind**. The arch is rounded at the top like an orangery window, and nothing else on the site uses that shape. Inside it, an illustrated bouquet in a zinc florist bucket sways on a shared breeze while petals and leaves drift across the hero.

- Gusts come on load, every 7 to 13 seconds, and when the visitor scrolls.
- Flowers lean away from the cursor, a quick pass over a bloom shakes a petal loose, and a tap shakes the bouquet.
- A "Stoppa vinden" button pauses it all. It stops off-screen, and shows a still frame for reduced motion.
- The illustration stands in for photos in this mock. Real photos of the client's bouquets can replace it or sit beside it later.

## Colour

| Token | Hex | Use | Contrast |
|---|---|---|---|
| Birch | `#F3F4EF` | Page background | |
| Sage mist | `#E3E8DE` | Alternating sections | |
| Ink | `#1E2A24` | Text | 13.5:1 on birch |
| Lichen | `#53604F` | Secondary text | 6.0:1 on birch, 5.4:1 on sage |
| Moss | `#3E5B40` | Brand, links, secondary button, dark sections | 6.9:1 on birch, white text 7.6:1 |
| Peony | `#9E2F4F` | Primary CTA only ("Beställ") | white text 7.1:1, 6.4:1 on birch |
| Border strong | `#6F7A69` | Form and UI borders | 4.1:1 on birch, 3.6:1 on sage |

All text pairs pass WCAG 2.2 AA (4.5:1). The focus ring is peony on light backgrounds and birch on moss, because peony on moss is only 1.07:1.

Peony is reserved for the single main action on each screen, so it always means "this is the next step".

## Type

- **Headings: Fraunces** (variable serif, 300 to 700). Soft, slightly old-style shapes that feel handmade. Large headings use weight 400 with tight leading.
- **Body and UI: Instrument Sans** (variable sans, 400 to 700). Clear at small sizes and on phones.
- Both are self-hosted as woff2 with `font-display: swap`, and support å, ä and ö.
- Fluid scale from `--step--1` to `--step-5` (about 14 to 80 px). Body text is 16 to 17 px, with a line height of 1.6 and a measure of about 62 characters.
- Sentence case everywhere. No all-caps labels, no small "eyebrow" labels above headings.

## Layout

- Mobile first, designed at 360 px wide. Content is left aligned.
- Mobile hero: arched photo first, then the headline, a single line saying what and where, and one primary button.
- Desktop hero: text on the left, a large arched photo on the right.
- Services appear as an editorial list. Each row pairs a photo with a name and one sentence, and the layout alternates sides on desktop. There are no rows of identical cards.
- A sticky bottom bar on mobile shows "Beställ" and, once the number is known, "Ring oss". The page reserves space for it so it never covers content.

## Page sections (mock)

1. Hero: headline, address, opening slot, order button, and the bouquet in the wind.
2. Seasonal band in deep moss: the one dark section. Switched on and off in `src/content/seasons/`.
3. Services as an editorial spread with offset photos, not equal cards. Funeral flowers get a quiet rule and calmer spacing.
4. "Från bänken": a photo collage of the work on a sage band.
5. About: large photo beside the story.
6. Order request form beside the shop's details. It is a demo until a form service is chosen.

Photos are Unsplash stock marked "Exempelbild" (credits in `src/assets/stock/CREDITS.md`). They must be replaced with the client's own photos before launch.

Below the hero, scrolling is the wind: a few petals blow across the page while the visitor scrolls, then fade.

## Spacing, radius, motion

- 4 px base spacing scale (`--space-1` to `--space-9`). Sections use fluid vertical padding.
- Radius by role: controls 6 px, photos 2 px, and the hero arch is fully rounded at the top.
- Motion is the wind: in the hero, and as scroll-driven petals below it. Everything else stays still apart from colour transitions on buttons and links. Reduced motion is respected.

## Open questions for the client

- Do you have a logo, colours or fonts already?
- Is this direction right, or should it be warmer, more romantic or more modern?
- Photos: can we use your own, or is a photoshoot planned?
