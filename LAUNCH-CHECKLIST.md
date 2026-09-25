# Launch checklist

## Implemented in this update

- Responsive discovery, profiles, chat, favorites, login, onboarding and subscription views.
- Light, dark and system appearance with before-paint persistence.
- Browser-local favorites, search and language/mood filters.
- Failed sends retain drafts; failed history loads require retry; quota errors show the paywall.
- Checkout is blocked unless the advertised plan is INR 49900/month.
- Core API and subscription service validate the actual Razorpay plan before checkout.

## Required before launch

- Configure the INR 499 monthly Razorpay plan, key ID, secret and signed webhook secret on the server only. Never add secrets to NEXT_PUBLIC variables.
- Test checkout, pending confirmation, duplicate callbacks, renewals, cancellation, expiry, refunds and failed payments in provider test mode. Mocked browser tests do not verify provider integration.
- Complete Google Play billing configuration and test purchases. Keep alternative billing disabled until programme approval and complete the required external transaction and refund reporting checks.
- Reconcile existing paid memberships before enabling the core API subscription-service connection. Do not switch to an empty entitlement database.
- Verify shared memory isolation, onboarding updates and deletion with the deployed Mem0 service across companions.
- Verify session refresh behind the production proxy, email delivery and published privacy/terms links.
- Configure offsite database backups and test restoration; local scheduled backups alone are insufficient.
- Rotate infrastructure tokens previously shared in chat.

## Design references

- https://linear.app/changelog/2026-03-12-ui-refresh
- https://vercel.com/geist/theme-switcher
- https://github.com/shadcn-ui/ui

The implementation retains the existing companion assets and local React/lucide patterns; it does not install these reference projects.
