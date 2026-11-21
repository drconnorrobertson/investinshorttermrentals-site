# Invest in Short Term Rentals

Static site for investinshorttermrentals.com, a BNB Accelerator partner squeeze/blog site. Deploys to Vercel as static HTML.

Worksheet controls are defined in `scripts/worksheet-controls.mjs`. Each comparison input must have a form control on that topic page. The release pipeline runs `node scripts/test-worksheet-controls.mjs dist` against the actual generated forms and submit handlers, including zero-availability, fraction and payment-mode boundaries. Preserve the existing scenario assumptions and URLs when changing controls.
