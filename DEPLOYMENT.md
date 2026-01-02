# Deployment Guide: OpticWorks Intranet

This guide provides complete instructions for deploying the OpticWorks Intranet to Cloudflare Pages with Zero Trust authentication.

## Architecture Overview

- **Hosting**: Cloudflare Pages (static site hosting)
- **Authentication**: Google Cloud Identity/Workspace as Identity Provider (IdP) via OIDC
- **Access Control**: Cloudflare Access (Zero Trust)
- **Domain**: `intranet.optic.works`
- **Access Policy**: Only @optic.works email addresses
- **CI/CD**: GitHub Actions automatically deploys on push to `main` branch

---

## Section 1: Cloudflare Setup

### 1.1 Create a Cloudflare Account

1. Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)
2. Sign up for a Cloudflare account (free tier is sufficient)
3. Verify your email address

### 1.2 Add the optic.works Domain

1. In the Cloudflare dashboard, click **Add a site**
2. Enter `optic.works` and click **Continue**
3. Select the **Free** plan
4. Cloudflare will scan your existing DNS records
5. Review the DNS records and click **Continue**
6. Update your domain registrar's nameservers to the ones provided by Cloudflare:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
7. Wait for DNS propagation (can take up to 24 hours, typically much faster)
8. Cloudflare will send an email when your site is active

### 1.3 Create a Cloudflare Pages Project

1. In the Cloudflare dashboard, navigate to **Pages** in the left sidebar
2. Click **Create a project**
3. Connect the GitHub repository: `r-mccarty/opticworks-intranet`
4. Configure the build:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**

> **Note**: If you plan to deploy exclusively through GitHub Actions, you still need the Pages project created so the workflow can publish to it.

### 1.4 Generate an API Token

1. In the Cloudflare dashboard, click on your profile icon (top right)
2. Go to **My Profile** → **API Tokens**
3. Click **Create Token**
4. Use the **Edit Cloudflare Pages** template or create a custom token with these permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
5. Set **Account Resources** to the account containing your Pages project
6. Optionally set a TTL (time to live) for security
7. Click **Continue to summary** → **Create Token**
8. **IMPORTANT**: Copy the token immediately and store it securely
   - You won't be able to see it again
   - This will be used as `CLOUDFLARE_API_TOKEN` in GitHub

### 1.5 Find Your Cloudflare Account ID

1. In the Cloudflare dashboard, go to **Pages** or any **Workers** page
2. Look for your **Account ID** in the right sidebar
3. Copy this ID - it will be used as `CLOUDFLARE_ACCOUNT_ID` in GitHub

---

## Section 2: GitHub Secrets Configuration

### 2.1 Add Secrets to GitHub Repository

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/opticworks-intranet`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the first secret:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Value**: Paste the API token from Section 1.4
   - Click **Add secret**
5. Add the second secret:
   - **Name**: `CLOUDFLARE_ACCOUNT_ID`
   - **Value**: Paste the Account ID from Section 1.5
   - Click **Add secret**

### 2.2 Verify the Workflow

1. The GitHub Actions workflow (`.github/workflows/deploy.yml`) will run automatically on:
   - Any push to the `main` branch
   - Manual trigger via **Actions** tab → **Deploy to Cloudflare Pages** → **Run workflow**
2. To verify the first deployment:
   - Go to the **Actions** tab in your GitHub repository
   - You should see a workflow run in progress or completed
   - Click on the run to view logs
   - Ensure all steps complete successfully (green checkmarks)

> **Troubleshooting**: If the workflow fails, check the logs for errors. Common issues include incorrect API tokens, account IDs, or missing dependencies.

---

## Section 3: Cloudflare Access Configuration

This section sets up Zero Trust authentication so only @optic.works email addresses can access the intranet.

### 3.1 Enable Cloudflare Zero Trust

1. In the Cloudflare dashboard, click **Zero Trust** in the left sidebar
2. If prompted, enter a **team name** (e.g., `opticworks`)
   - This creates a team domain: `opticworks.cloudflareaccess.com`
3. Select the **Free** plan (supports up to 50 users)

### 3.2 Configure Google as Identity Provider

You need **Google Workspace Admin** access to complete this step.

#### Step 1: Create OAuth Credentials in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one (e.g., `opticworks-auth`)
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen (if not already done):
   - User type: **Internal** (for Google Workspace users only)
   - App name: `OpticWorks Intranet`
   - Authorized domains: Add `optic.works`
6. Create OAuth Client:
   - Application type: **Web application**
   - Name: `Cloudflare Access`
   - **Authorized redirect URIs**: Add this URL:
     ```
     https://opticworks.cloudflareaccess.com/cdn-cgi/access/callback
     ```
     (Replace `opticworks` with your team name from Section 3.1)
7. Click **Create** and copy:
   - **Client ID**
   - **Client Secret**

#### Step 2: Add Google to Cloudflare Zero Trust

1. In Cloudflare Zero Trust dashboard, go to **Settings** → **Authentication**
2. Click **Add new** under **Login methods**
3. Select **Google**
4. Enter the credentials from Step 1:
   - **App ID**: Paste the Google OAuth **Client ID**
   - **Client Secret**: Paste the Google OAuth **Client Secret**
5. Click **Save**
6. Test the integration by clicking **Test**

### 3.3 Create an Access Application

1. In Cloudflare Zero Trust, go to **Access** → **Applications**
2. Click **Add an application**
3. Select **Self-hosted**
4. Configure the application:
   - **Application name**: `OpticWorks Intranet`
   - **Session duration**: `24 hours` (or your preference)
   - **Application domain**:
     - **Subdomain**: `intranet`
     - **Domain**: `optic.works`
   - **Accept all available identity providers**: Ensure Google is checked
5. Click **Next**

### 3.4 Create an Access Policy

1. On the **Add a policy** page:
   - **Policy name**: `OpticWorks Employees Only`
   - **Action**: `Allow`
2. Under **Configure rules**, add this rule:
   - **Selector**: `Emails ending in`
   - **Value**: `@optic.works`
3. Click **Next** → **Add application**

### 3.5 Connect Custom Domain to Cloudflare Pages

1. In the Cloudflare dashboard, go to **Pages** → **opticworks-intranet**
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter the custom domain: `intranet.optic.works`
5. Click **Continue**
6. Cloudflare will create the DNS record and enable HTTPS
7. Wait a few minutes for DNS propagation

> **Important**: The custom domain connection routes traffic through Cloudflare Access, which handles authentication.

---

## Section 4: DNS Configuration

### 4.1 Verify DNS Records

1. In the Cloudflare dashboard, go to **DNS** → **Records**
2. Verify that a CNAME record exists for `intranet.optic.works`:
   - **Type**: `CNAME`
   - **Name**: `intranet`
   - **Target**: (automatically created by Cloudflare when connecting the domain to Pages)
   - **Proxy status**: `Proxied` (orange cloud icon)
3. If the record doesn't exist, Cloudflare should have created it automatically in Section 3.5
   - If you need to create it manually, use the target provided by Cloudflare Pages

### 4.2 Test DNS Propagation

1. Open a terminal and run:
   ```bash
   nslookup intranet.optic.works
   ```
2. Verify that it resolves to a Cloudflare IP address
3. Alternatively, use [https://dnschecker.org](https://dnschecker.org) to check global DNS propagation

### 4.3 Test the Deployment

1. Open a browser and navigate to `https://intranet.optic.works`
2. You should be redirected to the Cloudflare Access login page
3. Click **Google** and sign in with an **@optic.works** email address
4. Upon successful authentication, you should see the OpticWorks Intranet homepage

> **Troubleshooting**:
> - If you get a 404 error, ensure the Pages project has a successful deployment (check that the GitHub Actions workflow deployed successfully)
> - If you can't log in, verify the Google OAuth credentials and that your email ends with `@optic.works`
> - If you see a Cloudflare error page, check the Access policy configuration

---

## Optional: Enable Nightly Rebuilds

To enable automatic nightly rebuilds at 1 AM UTC:

1. Open `.github/workflows/deploy.yml`
2. Uncomment the schedule trigger:
   ```yaml
   schedule:
     - cron: '0 1 * * *'
   ```
3. Commit and push the change

This ensures the site is rebuilt daily even if no code changes occur, which can be useful for content that includes dynamic dates or external data.

---

## Maintenance & Updates

### Deploying Changes

1. Make changes to the content in `src/content/docs/` or update the site code
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Update documentation"
   git push origin main
   ```
3. GitHub Actions will automatically build and deploy to Cloudflare Pages
4. Changes will be live in 2-5 minutes

### Managing Access

To update who can access the intranet:

1. Go to **Cloudflare Zero Trust** → **Access** → **Applications**
2. Click **OpticWorks Intranet** → **Policies**
3. Edit the policy to add/remove email addresses or change rules

### Monitoring

- **GitHub Actions**: View deployment logs in the **Actions** tab of your repository
- **Cloudflare Analytics**: View traffic and access logs in **Zero Trust** → **Analytics**
- **Pages Analytics**: View build and deployment history in **Pages** → **opticworks-intranet**

---

## Security Considerations

1. **API Token Security**:
   - Never commit API tokens to the repository
   - Rotate API tokens periodically
   - Use minimal permissions (Pages Edit only)

2. **Access Control**:
   - Regularly review who has access in Cloudflare Zero Trust
   - Monitor access logs for suspicious activity
   - Consider enabling Multi-Factor Authentication (MFA) for Google Workspace

3. **Pages Project**:
   - Keep the project access controlled via Cloudflare Access
   - Avoid exposing the default `.pages.dev` URL publicly

4. **GitHub Repository**:
   - Enable branch protection on the `main` branch
   - Require pull request reviews for sensitive changes
   - Consider adding a CODEOWNERS file

---

## Support

For issues or questions:

- **Deployment issues**: Check GitHub Actions logs and Cloudflare Pages deployments
- **Authentication issues**: Review Cloudflare Zero Trust logs and Google OAuth settings
- **Content issues**: See the [README.md](./README.md) for contribution guidelines

---

## Success Checklist

- [ ] Cloudflare account created and `optic.works` domain added
- [ ] Cloudflare Pages project `opticworks-intranet` created
- [ ] API token generated and stored securely
- [ ] GitHub secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` configured
- [ ] GitHub Actions workflow runs successfully
- [ ] Cloudflare Zero Trust enabled with Google as IdP
- [ ] Access application created for `intranet.optic.works`
- [ ] Access policy restricts access to `@optic.works` emails only
- [ ] Custom domain connected to Pages project
- [ ] DNS records configured and propagated
- [ ] Site accessible at `https://intranet.optic.works` with authentication required
