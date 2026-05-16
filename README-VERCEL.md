# Deploying to Vercel

This repo contains a Create React App frontend in the `frontend/` folder. The `vercel.json` added in this branch configures Vercel to build from `frontend/package.json` using `@vercel/static-build`.

Steps to deploy (recommended):

1. In Vercel, import the GitHub repository `basudev-n/The-Gardenia`.
2. When configuring the project, set the **Root Directory** to `/frontend`.
3. Ensure Build Command is `npm run build` and Output Directory is `build`.
4. Add any required Environment Variables (example):
   - `LEAD_WEBHOOK_URL` — webhook to forward leads to (optional)
5. Deploy. Vercel will run the build and publish the site.

If you prefer I create the Vercel project for you, provide a Vercel Personal Access Token and I'll complete the setup and create the deployment.
