# Sick Stuff Shop

A Rails 8 e-commerce application with auto-deployment to VPS using Kamal.

## Tech Stack

- **Framework**: Rails 8.1.1
- **Ruby Version**: 3.3.4
- **Database**: SQLite3
- **Frontend**: React with Inertia.js
- **Deployment**: Kamal to VPS (213.134.31.142)
- **Container Registry**: GitHub Container Registry (ghcr.io)
- **CI/CD**: GitHub Actions

## Development Setup

```bash
# Install dependencies
bundle install
npm install

# Setup database
bin/rails db:setup

# Start development server
bin/dev
```

## Deployment

The application automatically deploys to VPS on every push to the `main` branch via GitHub Actions.

### Manual Deployment

```bash
# Deploy to production
bin/kamal deploy

# Other useful commands
bin/kamal app logs    # View application logs
bin/kamal console     # Access Rails console
bin/kamal shell       # SSH into the container
```

## Production URL

The application is deployed at:
- **Primary**: https://sickstuff.shop
- **Alternate**: https://www.sickstuff.shop

The application uses Let's Encrypt for automatic SSL certificate provisioning and renewal.
