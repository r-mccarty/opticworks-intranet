# OpticWorks Intranet

[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)

Internal documentation and resources for OpticWorks team members. This site provides centralized access to employee handbooks, IT resources, development guides, and company policies.

## 🌐 Deployment Architecture

This intranet is deployed as a secure, internal knowledge base using modern cloud infrastructure:

- **Hosting**: Cloudflare R2 (zero egress fees for static site hosting)
- **Authentication**: Google Cloud Identity/Workspace via OIDC
- **Access Control**: Cloudflare Access (Zero Trust) - only @optic.works emails
- **Domain**: [https://intranet.optic.works](https://intranet.optic.works)
- **CI/CD**: GitHub Actions (automatic deployment on push to `main`)

**🔒 Security**: The site is protected by Cloudflare Access. Only authenticated users with @optic.works email addresses can access the intranet.

**📚 Setup Instructions**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment and configuration instructions.

## 🚀 Project Structure

Inside of your Astro + Starlight project, you'll see the following folders and files:

```
.
├── public/
├── src/
│   ├── assets/
│   ├── content/
│   │   └── docs/
│   └── content.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.

Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🎨 Customization

This site uses the OpticWorks brand color `#61ee64` (bright green) throughout the theme. Custom styles are defined in `src/styles/custom.css`.

## 📚 Content Sections

- **Getting Started**: Onboarding information for new employees
- **Employee Handbook**: Company culture, benefits, and time-off policies
- **IT Resources**: Software tools, security guidelines, and support
- **Development**: Setup guides, coding standards, and Git workflow
- **Policies**: Code of conduct and company policies

## 📝 Contributing

### Adding or Editing Documentation

1. **Content Location**: All documentation lives in `src/content/docs/`
2. **File Format**: Use Markdown (`.md`) or MDX (`.mdx`) files
3. **Routing**: Files are automatically exposed as routes based on their path:
   - `src/content/docs/handbook/benefits.md` → `/handbook/benefits`
4. **Images**: Add images to `src/assets/` and reference them with relative links

### Making Changes

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/opticworks-intranet.git
   cd opticworks-intranet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:4321`

4. Make your changes to files in `src/content/docs/`

5. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "Describe your changes"
   git push origin main
   ```

6. GitHub Actions will automatically build and deploy your changes to [https://intranet.optic.works](https://intranet.optic.works)

### Sidebar Navigation

The sidebar is manually configured in `astro.config.mjs`. After adding new pages, update the sidebar configuration to include them in the navigation.

### Styling

- Custom styles: `src/styles/custom.css`
- Brand color: `#61ee64` (OpticWorks green)
- Theme supports both light and dark modes

## 👀 Want to learn more?

Check out [Starlight's docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).
