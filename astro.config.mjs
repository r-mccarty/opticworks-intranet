// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://intranet.optic.works',
	integrations: [
		starlight({
			title: 'OpticWorks Intranet',
			description: 'Internal documentation and resources for OpticWorks team members',
			logo: {
				light: './src/assets/logo-light.svg',
				dark: './src/assets/logo-dark.svg',
				replacesTitle: false,
			},
			customCss: ['./src/styles/custom.css'],
			head: [
				{
					tag: 'script',
					attrs: { type: 'module' },
					content: `
						const ensureLabel = (selector, label) => {
							document.querySelectorAll(selector).forEach((el) => {
								if (!el.getAttribute('aria-label')) {
									el.setAttribute('aria-label', label);
								}
							});
						};

						window.addEventListener('DOMContentLoaded', () => {
							ensureLabel('starlight-theme-select select', 'Theme');
							ensureLabel('starlight-lang-select select', 'Language');
						});
					`,
				},
			],
			sidebar: [
				{
					label: 'Overview',
					items: [
						{ label: 'Welcome', slug: 'index' },
						{ label: 'Onboarding', slug: 'getting-started/onboarding' },
					],
				},
				{
					label: 'Workspace & Access',
					items: [
						{ label: 'Infrastructure', slug: 'it/infrastructure' },
						{ label: 'Secrets (Infisical)', slug: 'it/infisical' },
						{ label: 'Hardware Access', slug: 'it/hardware' },
						{ label: 'Software & Tools', slug: 'it/software' },
					],
				},
				{
					label: 'Engineering Playbooks',
					items: [
						{ label: 'Development Setup', slug: 'development/setup' },
						{ label: 'Code Standards', slug: 'development/standards' },
						{ label: 'Git Workflow', slug: 'development/git-workflow' },
					],
				},
				{
					label: 'Projects',
					items: [
						{ label: 'Overview', slug: 'projects' },
						{ label: 'Agent Control Plane', slug: 'projects/agent-harness' },
						{
							label: 'RS-1 Platform',
							items: [
								{ label: 'Overview', slug: 'projects/rs-1' },
								{ label: 'Architecture', slug: 'projects/rs-1/architecture' },
								{ label: 'Development Guide', slug: 'projects/rs-1/development' },
								{ label: 'Deployment', slug: 'projects/rs-1/deployment' },
							],
						},
						{
							label: 'Presence Detection Engine',
							items: [
								{ label: 'Overview', slug: 'projects/presence-engine' },
								{ label: 'Architecture', slug: 'projects/presence-engine/architecture' },
								{ label: 'Development Guide', slug: 'projects/presence-engine/development' },
								{ label: 'Home Assistant Integration', slug: 'projects/presence-engine/home-assistant' },
							],
						},
						{
							label: 'OpticWorks Store',
							items: [
								{ label: 'Overview', slug: 'projects/store' },
								{ label: 'Architecture', slug: 'projects/store/architecture' },
								{ label: 'Development Guide', slug: 'projects/store/development' },
								{ label: 'Deployment & Operations', slug: 'projects/store/operations' },
							],
						},
						{ label: 'N8N Marketing Automation', slug: 'projects/n8n-marketing-automation' },
						{ label: 'Lessons Learned', slug: 'projects/lessons-learned' },
						{ label: 'Shared Resources', slug: 'projects/shared-resources' },
					],
				},
				{
					label: 'Products',
					items: [
						{
							label: 'RS-1 User Manual',
							items: [
								{ label: 'Overview', slug: 'products/rs-1' },
								{ label: 'Quick Start', slug: 'products/rs-1/quick-start' },
								{ label: 'Architecture', slug: 'products/rs-1/architecture' },
								{ label: 'Hardware Overview', slug: 'products/rs-1/hardware' },
								{ label: 'Provisioning & Setup', slug: 'products/rs-1/roomplan' },
								{ label: 'Zones & Tuning', slug: 'products/rs-1/calibration' },
								{ label: 'Daily Usage', slug: 'products/rs-1/usage' },
								{ label: 'Integrations', slug: 'products/rs-1/integrations' },
								{ label: 'Troubleshooting', slug: 'products/rs-1/troubleshooting' },
								{ label: 'Specifications', slug: 'products/rs-1/specifications' },
							],
						},
					],
				},
				{
					label: 'Policies',
					autogenerate: { directory: 'policies' },
				},
			],
		}),
	],
});
