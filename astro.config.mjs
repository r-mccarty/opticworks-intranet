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
					label: 'Policies',
					autogenerate: { directory: 'policies' },
				},
			],
		}),
	],
});
