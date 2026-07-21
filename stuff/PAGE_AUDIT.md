# Transgarant.lt Page Audit

Audit date: 2026-07-13  
Page checked: https://www.transgarant.lt  
Final URL: https://www.transgarant.lt/lt

## Summary

The current Transgarant page is usable and mostly server-rendered, which is good for crawlability and no-JS fallback. The main weaknesses are performance, outdated template structure, weak metadata, and accessibility issues. For the remake, we should preserve the useful business content but rebuild the page with cleaner semantic HTML, optimized media, faster loading, and stronger conversion paths.

## Project Direction

The goal is to create a completely new website for Transgarant, not only patch the current one. The new site should keep the current site's overall content structure, because it already contains the key business sections: homepage/hero, about, services, inquiry form, careers, and contacts. We will modify that structure where needed to make the experience clearer, faster, more modern, and easier to use.

The new website should be built with Next.js and server-side rendering. This gives us strong SEO, fast initial content delivery, good no-JS readability, and a better foundation for multilingual pages, forms, metadata, image optimization, and future content updates.

For image delivery, the rebuild should prefer WebP instead of PNG wherever possible to improve page load speed and reduce total payload size. A deeper image and performance analysis will be done later, especially for the current large service images and hero/transport visuals.

## Lighthouse Snapshot

Run against `https://www.transgarant.lt/lt` on 2026-07-13.

- Performance: 58
- Accessibility: 73
- Best practices: 96
- SEO: 92
- First Contentful Paint: 5.5s
- Largest Contentful Paint: 8.9s
- Speed Index: 6.4s
- Total Blocking Time: 150ms
- Cumulative Layout Shift: 0
- Total payload: 4.6 MB

## No-JS Behavior

The page exposes most of its key content in the raw HTML:

- Navigation
- Hero/slider markup
- Services
- Inquiry form
- Career section
- Contact details
- Contact form
- Google Maps iframe

This means the site is not fully dependent on JavaScript for content visibility. However, interactive pieces likely degrade without JavaScript, especially the slider, tabs, styled selects, animations, mobile navigation, and form UX.

For the remake, basic content and section navigation should work without JavaScript. JavaScript should enhance the page, not be required for reading it.

## Main Issues

### Performance

Performance is the biggest technical problem.

- Total network payload is about 4.6 MB.
- Three service images are each about 954 KB:
  - `/img/pos1.png`
  - `/img/pos2.png`
  - `/img/pos3.png`
- Old vendor CSS and JS add weight:
  - Revolution Slider
  - Bootstrap-era CSS
  - jQuery plugins
  - animation/customizer styles
- Render-blocking CSS and Google Fonts delay first paint.
- Static assets appear to have poor or missing cache lifetimes.
- LCP is slow at 8.9s.

Recommended remake approach:

- Replace the heavy slider with a lightweight static or minimally animated hero.
- Convert large PNG/JPG assets to WebP where possible.
- Use responsive image sizes with `srcset`.
- Add explicit image dimensions to avoid layout uncertainty.
- Load only the CSS and JS needed for the page.
- Use long-lived caching for fingerprinted static assets.
- Avoid loading multiple font families and unnecessary font weights.

### SEO

The page is crawlable, but metadata needs work.

Current findings:

- The document title is `Pavadinimas`, which looks like a placeholder.
- No meta description was found.
- No sitemap was found at `/sitemap.xml`.
- `robots.txt` exists and allows crawling.
- Language alternate links exist for LT, EN, PL, and RU.
- Core content is server-rendered, which is good.

Recommended remake approach:

- Add a proper page title, for example:
  `Transgarant Group - Krovinių gabenimas, logistika ir sandėliavimas`
- Add a focused meta description.
- Add canonical URL.
- Add Open Graph metadata.
- Add `hreflang` links for all supported languages.
- Generate `sitemap.xml`.
- Keep meaningful section content in HTML, not hidden behind client-only rendering.

### Accessibility

Lighthouse accessibility score was 73. Main issues:

- Missing `lang` attribute on `<html>`.
- Viewport uses `maximum-scale=1`, which restricts mobile zoom.
- Some text has insufficient color contrast.
- Logo link has no accessible name because the logo image has empty alt text.
- Google Maps iframe has no title.
- Heading order is inconsistent.
- Some select elements are missing proper labels.
- Some links rely only on icon content or have weak accessible names.
- The document does not expose a clear main landmark.

Recommended remake approach:

- Use `<html lang="lt">`.
- Use a zoom-friendly viewport:
  `width=device-width, initial-scale=1`
- Add `<main>`.
- Use one clear `h1`.
- Keep heading levels sequential.
- Add real labels for every form control.
- Add accessible names for icon links.
- Add `title` to the map iframe.
- Ensure body text and form placeholders meet contrast requirements.

### Content And UX

The current site contains useful business information, but the layout feels like an older template:

- Heavy animated hero/slider.
- Animated logo.
- Long one-page structure.
- Dense service tabs.
- Important inquiry/contact actions are present but could be clearer.
- Career section takes a large amount of space.

For the remake, the first screen should quickly communicate:

- Who Transgarant is.
- What services they provide.
- Where they operate.
- How to request a quote.

The most important actions should be:

- Request an offer
- Contact the team
- View services

## Suggested Page Structure For Rebuild

1. Header
   - Logo
   - Navigation
   - Language switcher
   - Primary CTA: request offer

2. Hero
   - Clear logistics-focused headline
   - Short value proposition
   - Primary and secondary CTAs
   - Real transport/logistics visual

3. Services
   - Full truck loads
   - Partial and small cargo
   - Warehousing and logistics
   - Each service should have short copy and a direct CTA

4. About / Trust
   - Company overview
   - Experience, markets, reliability points
   - Optional stats or partner/trust indicators

5. Inquiry Form
   - Clear quote request flow
   - Proper labels and validation
   - Mobile-friendly inputs

6. Careers
   - Shorter overview
   - Open roles or general application form

7. Contacts
   - Address
   - Phone
   - Email
   - Map
   - Contact form

8. Footer
   - Company details
   - Navigation
   - Social/contact links
   - Language links

## Rebuild Priorities

1. Preserve the no-JS readability.
2. Optimize images before designing around them.
3. Remove old template dependencies.
4. Build semantic HTML and accessible forms from the start.
5. Add proper SEO metadata.
6. Make the quote/contact path obvious.
7. Keep the visual style professional, transport-focused, and modern.

## Verdict

The existing site is functional and crawlable, but technically old and heavy. A recreation should not copy the old slider/template structure directly. The better direction is to reuse the business content and rebuild the experience as a fast, semantic, mobile-friendly logistics site with clear services and strong inquiry flow.
