# GitHub Secrets Configuration

This document lists all the secrets that need to be configured in GitHub for the CI/CD pipeline to work properly.

## Required Secrets

### Database Secrets
- `POSTGRES_PASSWORD` - Secure password for PostgreSQL database
- `POSTGRES_DB` - Database name (default: smajobb)
- `POSTGRES_USER` - Database user (default: postgres)

### API Secrets
- `JWT_SECRET` - Secret key for JWT token generation and validation
- `JWT_ISSUER` - JWT issuer claim (default: smajobb)
- `JWT_AUDIENCE` - JWT audience claim (default: smajobb_users)

### Stripe Payment Configuration
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_test_` for testing, `sk_live_` for production)
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (starts with `pk_test_` for testing, `pk_live_` for production)
- `STRIPE_WEBHOOK_SECRET` - Webhook secret for Stripe events (starts with `whsec_`)

### SendGrid Email Configuration
- `SENDGRID_API_KEY` - Your SendGrid API key (starts with `SG.`)
- `SENDGRID_FROM_EMAIL` - Email address that will appear as sender (e.g., noreply@smajobb.se)
- `SENDGRID_FROM_NAME` - Display name for sender (e.g., Smajobb)

### Future Payment Methods (to be implemented later)
- `SWISH_API_KEY` - API key for Swish mobile payments (Swedish market)
- `KLARNA_API_KEY` - API key for Klarna buy-now-pay-later (Swedish market)
- `TWILIO_ACCOUNT_SID` - Twilio account SID for SMS notifications
- `TWILIO_AUTH_TOKEN` - Twilio auth token for SMS notifications

## How to Configure

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each secret with the exact name and value

## Getting API Keys

### Stripe
1. Sign up at [stripe.com](https://stripe.com)
2. Go to Developers > API keys
3. Copy your publishable and secret keys
4. For webhooks: Developers > Webhooks > Add endpoint

### SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Go to Settings > API keys
3. Create a new API key with "Mail Send" permissions
4. Copy the API key

## Environment Variables

These secrets will be automatically mapped to environment variables in the CI/CD pipeline:

```yaml
env:
  POSTGRES_PASSWORD: ${{ secrets.POSTGRES_PASSWORD }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
  STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
  SENDGRID_API_KEY: ${{ secrets.SENDGRID_API_KEY }}
  # ... etc
```

## Security Notes

- Never commit secrets to the repository
- Use test keys for development, live keys only for production
- Rotate secrets regularly
- Consider using GitHub's encrypted secrets for sensitive data
- Stripe test keys are safe to use in development (they can't process real payments)

## Testing

### Stripe Test Cards
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995

### SendGrid Test
- SendGrid provides a test email feature in their dashboard
- Use your own email for testing initially
