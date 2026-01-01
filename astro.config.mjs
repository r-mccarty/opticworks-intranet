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
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Welcome', slug: 'index' },
						{ label: 'New Employee Onboarding', slug: 'getting-started/onboarding' },
					],
				},
				{
					label: 'Employee Handbook',
					items: [
						{ label: 'Company Culture', slug: 'handbook/culture' },
						{ label: 'Benefits & Perks', slug: 'handbook/benefits' },
						{ label: 'Time Off Policy', slug: 'handbook/time-off' },
					],
				},
				{
					label: 'IT Resources',
					items: [
						{ label: 'Software & Tools', slug: 'it/software' },
						{ label: 'Security Guidelines', slug: 'it/security' },
						{ label: 'Support Tickets', slug: 'it/support' },
					],
				},
				{
					label: 'Development',
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
						{
							label: 'hardwareOS',
							items: [
								{ label: 'Overview', slug: 'projects/hardware-os' },
								{ label: 'Architecture', slug: 'projects/hardware-os/architecture' },
								{ label: 'Development Guide', slug: 'projects/hardware-os/development' },
								{ label: 'Deployment', slug: 'projects/hardware-os/deployment' },
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
						{ label: 'Shared Resources', slug: 'projects/shared-resources' },
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
