# Ariana’s

Подарочная витрина домашней пекарни Арианы. Статический сайт и устанавливаемое PWA для телефона и компьютера.

## Возможности

- Bento layout, glass panels, motion, mobile navigation, search and category filters.
- Пироги, самса, сладкая выпечка и сезонные/праздничные наборы.
- Локальный демопрофиль, история черновиков, локальные отзывы.
- Telegram/VK share links and an explicit map placeholder until the real address is provided.
- Корзина, количество, дата, имя, контакт и пожелания.
- Подготовка текста заявки, копирование, системное меню обмена.
- Корзина и черновик хранятся в localStorage на устройстве.
- Service Worker для офлайн-доступа после первого открытия.
- Адаптивная вёрстка, диалоги с клавиатурным управлением.

## Публикация

Vercel team: Kava's projects (`team_Q0gSAvCYwRobOio0EUxnhM3F`).
Vercel project: `ariana-s` (`prj_wPcKwz77o6qx7KLYzy6VZgJYwnKn`).
Production branch: `main`. Vercel automatically deploys pushes to this branch.
Production URL: https://ariana-s.vercel.app
Deployment configuration: `vercel.json`, output directory `dist`. No build dependencies.

GitHub repository: https://github.com/kava-studia/Ariana-s

## Before accepting real orders

Obtain Ariana’s confirmed contact, catalogue, photos, ingredients/allergens, prices and fulfilment terms. Replace illustrative content and connect the actual order destination. There is no backend, payment or automatic submission; do not advertise this as a functioning order reception service yet.

## Editing

`dist/app.js`: catalogue and order behavior. `dist/style.css`: visual styles. `dist/index.html`: editorial copy. Replace `dist/assets/bakery.webp` with approved product photography and update image labels. Increment cache version in `dist/sw.js` on releases.

## Validation

`node --check dist/app.js` and `node --check dist/sw.js` passed. Browser checked: render, add to cart, order form and generated order text. 390px iframe browser check passed with no horizontal overflow. Profile prefill, checkout and persistent draft history verified. Real-device PWA installation remains manual.

## Artwork

Hero asset: `dist/assets/bakery.webp`, generated with the built-in image generation tool. Prompt: premium editorial photograph of a golden lattice apple pie and triangular sesame samsa on cream ceramic plates, burgundy gingham cloth, ivory tabletop and warm natural window light. No text or people. The site labels the generated imagery as illustrative.


Bento artwork: dist/assets/collections.webp. Built-in image generation prompt: four equal photographic quadrants showing samsa, a small cherry cake, a Christmas bakery gift box and a Halloween bakery gift box; warm ivory and caramel editorial food photography, no text or people. All product imagery and holiday offerings are labelled illustrative concepts.

Account is a local demo profile, not server authentication. Orders stay on the device until the visitor explicitly shares the text. Reviews are stored only on the visitor device, and the two editorial sample reviews are clearly marked. No confirmed customer reviews have been published.


Colour refinement: cherry, lavender, butter yellow and pistachio surfaces. Russian UI copy, scroll reveals with reduced-motion support, 16px mobile form fields, tablet navigation breakpoint, and viewport checks at 360/768/1280px. All three checked widths have no horizontal body overflow; mobile navigation and catalogue filters verified.


Usability pass: removed public demo/concept/placeholder labels, decorative arrows/stars, sample customer reviews and the unconfigured map. Replaced social-profile placeholders with functional share actions. Body text is 17–18px on mobile, primary buttons at least 56px. Quantity input and Remove actions replace symbol-only controls. Mobile checkout verified with quantity=3, correct date/contact, and Telegram share text. 360px and 768px checks passed with no horizontal overflow or clipped intro card.

Production boundaries: no fabricated prices or address, no server account authentication, and no automatic order reception. Visitor explicitly selects Ariana in Telegram to send a prepared order. Direct contact, actual prices and fulfilment settings are still required for a full online shop. Local review entry was removed alongside sample public reviews.
