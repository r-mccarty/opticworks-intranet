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
						{ label: 'Infrastructure Overview', slug: 'it/infrastructure' },
						{ label: 'Infisical (Secrets)', slug: 'it/infisical' },
						{ label: 'Development Hardware', slug: 'it/hardware' },
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
					label: 'Products',
					items: [
						{
							label: 'RS-1 User Manual',
							items: [
								{ label: 'Overview', slug: 'products/rs-1' },
								{ label: 'Quick Start', slug: 'products/rs-1/quick-start' },
								{ label: 'Hardware Overview', slug: 'products/rs-1/hardware' },
								{ label: 'iOS App & RoomPlan', slug: 'products/rs-1/roomplan' },
								{ label: 'Calibration & Tuning', slug: 'products/rs-1/calibration' },
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
