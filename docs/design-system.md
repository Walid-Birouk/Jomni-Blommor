# Jomni Blommor: design direction "Nordic botanical"

Status: **proposal, awaiting client approval.** Replace with the client's brand (logo, colours, fonts) if they have one.

## Idea

A Swedish flower shop in cool northern daylight. The background is pale like birch bark. Green comes from moss and stems. Colour accents come from the flowers themselves. The photos carry the page, and everything around them stays quiet.

The one bold element is the **meadow in the wind**: line-drawn flowers that grow up from the ground in the hero and sway as the wind rolls through them in a wave.

- On phones the meadow fills the first screen. The headline, "Blomsterbutik på Södermalm i Stockholm" and the address sit over its bottom on a soft birch fade, and "Beställ" is in the sticky bar. The rest of the words follow right after.
- On desktop the meadow sits behind the words: low on the left under the text, tall on the right.
- Arrival: on load the flowers grow up from the ground in a left-to-right wave (about one second, plays once) while a gust blows petals across.
- Gusts also come every 7 to 13 seconds and when the visitor scrolls. The cursor parts the stems and pushes drifting petals aside.
- A pause button stops it all. It stops off-screen, and reduced motion shows the meadow still and fully grown.

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
- Mobile hero: the meadow fills the first screen with the headline, place and address over its bottom; the order button is in the sticky bar, and a short lead with a second order button follows.
- Desktop hero: text on the left, the meadow growing tall on the right and staying low beneath the text.
- Services appear as an editorial list. Each row pairs a photo with a name and one sentence, and the layout alternates sides on desktop. There are no rows of identical cards.
- A sticky bottom bar on mobile shows "Beställ" and, once the number is known, "Ring oss". The page reserves space for it so it never covers content.

## Site map

| Page | Swedish | English |
|---|---|---|
| Home | `/` | `/en/` |
| Shop: roses, bunches, plants, pots | `/butik/` | `/en/shop/` |
| Build a bouquet (step-by-step with live preview) | `/butik/skapa-bukett/` | `/en/shop/build-a-bouquet/` |
| Weddings and events | `/brollop-och-event/` | `/en/weddings-and-events/` |
| Funerals (calmer page, no cursor petals) | `/begravning/` | `/en/funerals/` |
| Business and subscriptions | `/foretag/` | `/en/business/` |
| About and contact (story, map, reviews, form) | `/om-oss/` | `/en/about/` |

Service pages share one template: intro with photo, what we offer with line-drawn stamps, a numbered how-it-works sequence, and a dark closing band with the next step. Shop items without a photo get a line-drawn illustration in the same hand as the meadow.

## Page sections (mock)

1. Hero: the meadow in the wind with the headline, place and address; then a short lead, the order button and the opening slot.
2. Seasonal band in deep moss: the one dark section. Switched on and off in `src/content/seasons/`.
3. Services as an editorial spread with offset photos, not equal cards. Funeral flowers get a quiet rule and calmer spacing.
4. "Från bänken": a photo collage of the work on a sage band.
5. About: large photo beside the story.
6. Order request form beside the shop's details. It is a demo until a form service is chosen.

Photos are Unsplash stock marked "Exempelbild" (credits in `src/assets/stock/CREDITS.md`). They must be replaced with the client's own photos before launch.

Below the hero, scrolling is the wind: a few petals blow across the page while the visitor scrolls, then fade.

## Spacing, radius, motion

- 4 px base spacing scale (`--space-1` to `--space-9`). Sections use fluid vertical padding.
- Radius by role: controls 6 px, photos 2 px.
- Motion is the wind: in the hero, and as scroll-driven petals below it. Everything else stays still apart from colour transitions on buttons and links. Reduced motion is respected.

## Open questions for the client

- Do you have a logo, colours or fonts already?
- Is this direction right, or should it be warmer, more romantic or more modern?
- Photos: can we use your own, or is a photoshoot planned?
