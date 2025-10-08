---
title: Security Guidelines
description: Security best practices and guidelines for OpticWorks employees.
---

## Security Policy Overview

At OpticWorks, security is everyone's responsibility. These guidelines help protect our company data, customer information, and intellectual property.

:::caution
Failure to follow security guidelines may result in disciplinary action. When in doubt, contact the security team at security@opticworks.com.
:::

## Password Security

### Password Requirements
- **Minimum length:** 12 characters
- **Complexity:** Mix of uppercase, lowercase, numbers, and symbols
- **Unique:** Never reuse passwords across services
- **Regular updates:** Change passwords every 90 days

### Password Manager (Required)
- **Tool:** 1Password (company-provided)
- **Usage:** ALL work passwords must be stored in 1Password
- **Master password:** Use a strong, memorable passphrase
- **Never:** Share passwords via email, Slack, or text

### Two-Factor Authentication (2FA)
Required for:
- Email and Google Workspace
- GitHub and code repositories
- AWS and cloud services
- VPN access
- Admin panels and internal tools

**Preferred 2FA method:** Duo Mobile authenticator app

## Device Security

### Company Devices
- Keep operating system and software up to date
- Enable full-disk encryption (FileVault on macOS, BitLocker on Windows)
- Set auto-lock after 5 minutes of inactivity
- Use strong device passwords/PINs
- Never share your device with others

### Personal Devices (BYOD)
If using personal devices for work:
- Install company MDM (Mobile Device Management)
- Use 1Password for all work accounts
- Keep devices updated with latest security patches
- Separate work and personal data
- Report lost/stolen devices immediately

### Physical Security
- Lock your screen when stepping away
- Don't leave devices unattended in public
- Use privacy screens in public spaces
- Secure devices when traveling
- Report lost or stolen equipment to IT immediately

## Network Security

### VPN Usage (Required)
Use VPN when:
- Working from home or remote locations
- Accessing internal company resources
- Using public WiFi networks
- Connecting to production systems

**VPN Setup:** See instructions in IT portal

### WiFi Security
- **Office WiFi:** Use OpticWorks-Secure network
- **Public WiFi:** Always use VPN
- **Home WiFi:** Use WPA3 or WPA2 encryption
- **Never:** Connect to unknown or open networks without VPN

### Remote Access
- Use company VPN for all remote connections
- Never use personal RDP or remote desktop tools
- Access internal resources only through approved methods
- Log out when finished working

## Data Protection

### Data Classification

#### Public
- Marketing materials
- Public website content
- Press releases

#### Internal
- Internal communications
- Project documentation
- Non-sensitive business data

#### Confidential
- Customer data
- Financial information
- Unreleased product information
- Employee personal information

#### Restricted
- Credentials and passwords
- Security configurations
- Compliance-related data
- Trade secrets

### Handling Confidential Data
- Store in approved company systems only
- Encrypt when transferring
- Share only on a need-to-know basis
- Delete securely when no longer needed
- Never upload to personal cloud storage

### Email Security
- Verify sender before opening attachments
- Hover over links before clicking
- Watch for phishing attempts
- Use encryption for sensitive data
- Report suspicious emails to security@opticworks.com

## Cloud Security

### Approved Cloud Services
- Google Workspace
- GitHub
- AWS (for authorized teams)
- Slack
- Jira/Confluence

### Shadow IT (Prohibited)
- Don't use unapproved cloud services for company data
- Request approval before using new SaaS tools
- Check with IT before sharing company data externally

### Cloud Access
- Use SSO (Single Sign-On) when available
- Enable 2FA on all cloud accounts
- Review access permissions regularly
- Revoke access for former employees immediately

## Development Security

### Code Security
- Never commit credentials or API keys to repos
- Use environment variables for sensitive configs
- Scan dependencies for vulnerabilities
- Follow [Code Standards](/development/standards/)
- Review code for security issues

### API Keys & Secrets
- Store in approved secret management systems
- Rotate regularly (every 90 days)
- Use different keys for dev, staging, production
- Revoke immediately if exposed
- Never share in Slack or email

### GitHub Security
- Enable 2FA on GitHub account
- Use SSH keys for authentication
- Don't commit sensitive data
- Review pull requests for security issues
- Report security vulnerabilities privately

## Incident Response

### Security Incidents
If you suspect a security incident:

1. **Stop:** Don't delete evidence or logs
2. **Disconnect:** Isolate affected systems if safe to do so
3. **Report:** Contact security@opticworks.com immediately
4. **Document:** Note what happened and when
5. **Cooperate:** Work with security team on resolution

### Common Security Incidents
- Phishing emails or suspicious messages
- Lost or stolen devices
- Suspected malware or virus
- Unauthorized access attempts
- Data breaches or leaks
- Accidental data exposure

### Phishing & Social Engineering

#### Warning Signs
- Urgent or threatening language
- Requests for credentials or sensitive data
- Unexpected attachments or links
- Sender address doesn't match display name
- Poor grammar or spelling

#### If You Receive Phishing
1. Don't click links or download attachments
2. Don't reply or provide information
3. Forward to security@opticworks.com
4. Delete the email
5. Report in #security Slack channel

## Compliance

### Data Privacy
- Follow GDPR, CCPA, and other regulations
- Minimize collection of personal data
- Respect user privacy preferences
- Delete data when requested
- Report privacy incidents immediately

### Customer Data
- Access only what's needed for your role
- Never share customer data externally
- Anonymize when possible
- Follow data retention policies
- Obtain consent before using for new purposes

## Security Training

### Required Training
- Annual security awareness training
- Phishing simulation exercises
- Role-specific security training
- Incident response procedures

### Ongoing Education
- Monthly security newsletters
- #security Slack channel
- Security team office hours
- Internal security documentation

## Contact Security Team

### How to Reach Us
- **Email:** security@opticworks.com
- **Slack:** #security
- **Emergency:** Call IT hotline (24/7)
- **Anonymous reporting:** Security hotline

### When to Contact
- Security questions or concerns
- Suspected security incidents
- Need security tool access
- Report vulnerabilities
- Request security review

## Quick Reference

### Security Checklist
- [ ] 1Password installed and configured
- [ ] 2FA enabled on all accounts
- [ ] VPN installed and working
- [ ] Device encryption enabled
- [ ] Auto-lock configured
- [ ] Latest OS and software updates installed
- [ ] Completed security training
- [ ] Familiar with incident reporting process

Remember: **If you see something, say something.** Security is everyone's responsibility.
