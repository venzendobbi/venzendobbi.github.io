# Srishti & Manas — Modern Wedding E-Invite

This version is inspired by the attached reference video:
- editorial, minimal invitation layout
- warm ivory / blush / muted taupe palette
- high-contrast serif typography + elegant script
- lots of whitespace
- delicate butterfly motif
- large type and soft visual transitions
- mobile-first vertical experience

## RSVP — no backend required

The RSVP is designed to use Google Forms.

### Setup
1. Create a Google Form with whatever questions you want, e.g.:
   - Name
   - Will you attend?
   - Number of guests
   - Which events will you attend?
   - Dietary requirements
   - Phone/email (optional)
2. Click **Send** in Google Forms.
3. Select the **link** icon and copy the form URL.
4. Open `script.js`.
5. Replace:
   `const GOOGLE_FORM_URL = "";`
   with:
   `const GOOGLE_FORM_URL = "YOUR_GOOGLE_FORM_URL";`
6. Save and redeploy.

The website will then send guests to your Google Form when they click RSVP. Google stores the responses, so you do not need your own backend/database.

## If you want the form embedded

You can also embed the Google Form in the RSVP section using its iframe embed code. The tradeoff is that the RSVP experience will visually look like a Google Form rather than your custom invitation. The current setup keeps the invitation design clean and sends guests to the form.

## Customize photos

The photo section currently has a beautiful placeholder so the site works immediately. Replace the `.photo-placeholder` block in `index.html` with:

`<img src="assets/couple.jpg" alt="Srishti and Manas">`

and add your image at:
`assets/couple.jpg`

## Deploy

This is a completely static website:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any normal web server

No Node.js or database is required.
