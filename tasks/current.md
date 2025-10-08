# Migration Task: Deploy OpticWorks Intranet to Cloudflare R2 with Zero Trust Access

## Context
This is the **opticworks-intranet** repository - an Astro Starlight documentation site that needs to be deployed to Cloudflare R2 with Zero Trust access control. Only authenticated employees with @optic.works email addresses should be able to access `intranet.optic.works`.

## Current Repository State
- **Framework**: Astro 5.6.1 with Starlight 0.36.0 (documentation theme)
- **Build Command**: `npm run build`
- **Build Output**: `./dist/` directory
- **Content Location**: `src/content/docs/` (Markdown/MDX files)
- **Current Deployment**: None configured yet (no `.github/workflows/` folder exists)

## Target Architecture
1. **Hosting**: Cloudflare R2 bucket (zero egress fees)
2. **Authentication**: Google Cloud Identity as IdP via OIDC
3. **Access Control**: Cloudflare Access (Zero Trust)
4. **Domain**: intranet.optic.works
5. **Policy**: Allow only @optic.works email addresses

## Required Tasks

### Task 1: Create GitHub Actions Deployment Workflow
Create `.github/workflows/deploy.yml` with:
- **Trigger**: On push to `main` branch + manual workflow dispatch
- **Optional**: Nightly rebuild at 1 AM UTC (cron: '0 1 * * *')
- **Steps**:
  1. Checkout code
  2. Setup Node.js (use version 20)
  3. Install dependencies (`npm ci`)
  4. Build Astro site (`npm run build`)
  5. Deploy to Cloudflare R2 using Wrangler CLI
- **Required Secrets**: 
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`
- **R2 Bucket Name**: `opticworks-intranet`

### Task 2: Create Wrangler Configuration
Create `wrangler.toml` (or add R2 configuration) for the bucket setup. The config should:
- Define the R2 bucket name
- Set any necessary compatibility settings
- Be minimal and clean

### Task 3: Update Site Configuration
Update `astro.config.mjs`:
- Change the title from "My Docs" to "OpticWorks Intranet"
- Remove or update the GitHub social link
- Customize as needed for an internal knowledge base
- Ensure build output is optimized for static hosting

### Task 4: Create Deployment Documentation
Create `DEPLOYMENT.md` with complete instructions for:

#### Section 1: Cloudflare Setup
1. How to create a Cloudflare account and add the optic.works domain
2. How to create an R2 bucket named `opticworks-intranet`
3. How to generate an API token with R2 write permissions
4. How to find your Cloudflare Account ID

#### Section 2: GitHub Secrets Configuration
1. Where to add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` in GitHub
2. How to verify the workflow runs successfully

#### Section 3: Cloudflare Access Configuration
Step-by-step instructions to:
1. Navigate to Cloudflare Zero Trust dashboard
2. Configure Google as an identity provider (OIDC/SAML)
   - Required: Google Workspace/Cloud Identity admin access
   - OAuth client ID and secret setup
3. Create an Access Application for `intranet.optic.works`
4. Set Access Policy: "Allow if authenticated with Google AND email ends with @optic.works"
5. Connect the custom domain to the R2 bucket
6. Enable HTTPS (automatic with Cloudflare)

#### Section 4: DNS Configuration
1. Add CNAME record for `intranet.optic.works` pointing to Cloudflare
2. Verify DNS propagation

### Task 5: Update README.md
Add an overview section explaining:
- This is the OpticWorks internal knowledge base
- It's built with Astro Starlight
- It's deployed to Cloudflare R2 with Zero Trust access
- Link to DEPLOYMENT.md for setup instructions
- Basic contribution guidelines (how to add/edit documentation)

## Technical Requirements

### Deployment Script Specifics
For the GitHub Actions workflow, use this approach for R2 deployment:
```yaml
- name: Deploy to Cloudflare R2
  run: |
    npx wrangler r2 object put opticworks-intranet --file=./dist --recursive
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Or use the sync approach for better incremental updates:
```yaml
npx wrangler r2 bucket sync ./dist opticworks-intranet --delete-orphaned
```

### Security Considerations
- R2 bucket must remain private (no public access)
- All access goes through Cloudflare Access authentication
- GitHub Actions should only have write permissions to R2, nothing else
- Consider adding branch protection rules to `main`

## Content Customization (Optional)
Consider updating the starter content:
- Replace example guides with actual company documentation
- Add sections for: HR policies, Engineering guides, Product docs, etc.
- Customize the hero section on the homepage
- Add company logo/branding

## Success Criteria
✅ GitHub Actions workflow successfully builds and deploys to R2  
✅ Site is accessible at intranet.optic.works  
✅ Unauthenticated users are redirected to Google login  
✅ Only @optic.works email addresses can access the site  
✅ DEPLOYMENT.md provides complete setup instructions  
✅ README.md reflects the new architecture

## Questions to Address
1. Should we enable the nightly rebuild schedule?
2. Do we need staging/production environments (separate branches/buckets)?
3. Should we add a "Last updated" timestamp to pages?
4. Do we want to preserve build logs/history in GitHub Actions?

---

**Start by creating the GitHub Actions workflow and wrangler configuration, then proceed with the documentation files.**