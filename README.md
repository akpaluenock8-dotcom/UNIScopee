UNI-check — Deploying with Vercel (Node.js serverless verify endpoint)

Files included:
  - index.html         (front-end; find and replace pk_live_YOUR_PUBLIC_KEY with your Paystack Live Public Key)
  - api/verify.js      (serverless function; set PAYSTACK_SECRET_KEY env var)
  - vercel.json        (Vercel config)

Steps to deploy:
1. Replace in index.html:
   const PAYSTACK_PUBLIC_KEY = 'pk_live_YOUR_PUBLIC_KEY';
   with your actual Paystack Live Public Key (pk_live_xxx...)

2. On Vercel:
   - Create a new project and upload these files (or connect a git repo)
   - In Project Settings > Environment Variables, add:
       PAYSTACK_SECRET_KEY = sk_live_YOUR_SECRET_KEY
     (set to Production)
   - Deploy the project.

3. Test:
   - Open the site, enter subjects, click "Pay GH₵18 & Get Programmes"
   - When the Paystack popup completes, the site calls /api/verify
   - If verification returns success and amount >= 1800 pesewas, results will display.

Security notes:
- Do NOT place secret key in index.html.
- Keep PAYSTACK_SECRET_KEY only in server environment variables.
