# debbie. — portfolio

A static, single-page portfolio for Debbie: an oversized introduction, a pastel sculptural keyboard spelling **PORTFOLIO**, a continuous editorial marquee, and a contact section.

curated by ui.debbie

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Semantic markup: header, hero, keyboard, marquee, contact, footer, dialogs |
| `styles.css` | All styling, organised into numbered sections (tokens → reduced motion) |
| `script.js` | Site config, contact links, automatic key sequence, dialogs, marquee sizing |

No build step and no dependencies. Fonts load from Fontshare (Satoshi) and Google Fonts (Inter, Instrument Serif), with system fallbacks and `display=swap`.

## Run it

Open `index.html` in a browser, or serve the folder locally:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Update the email address

Edit the single config value at the top of `script.js`:

```js
const SITE_CONFIG = {
  CONTACT_EMAIL: "hello@debbie.example",
};
```

`hello@debbie.example` is a development placeholder and does not receive email. Replace it with a real address before publishing. The nav **Let’s talk**, the **Contact Me** and **Enter** keys, the dialog links and the contact section all read from this value.

## Adding real work

The **Selected Work** dialog (opened by P, F and the nav **Work** link) currently reads “Selected website and identity concepts.” When real projects are ready, add their actual titles and links to `#dialog-work` in `index.html`.

## Notes

- The keyboard is drawn on a 900 × 312 coordinate system and scales with its container (`--u` in `styles.css`), so it is never wider than the screen.
- The automatic key sequence pauses on pointer hover, keyboard focus, open dialogs and hidden tabs, and is off when `prefers-reduced-motion` is set. With reduced motion, the marquee becomes a static, wrapping message.

## Personal use

This prompt is for personal use only and is not for sale.

This website was originally built with GPT-6 Astra. This prompt is tailored to that workflow. Results may differ on other platforms. Using GPT-6 Astra is recommended for the closest match, but identical results are not guaranteed, even on the same platform.

curated by ui.debbie
