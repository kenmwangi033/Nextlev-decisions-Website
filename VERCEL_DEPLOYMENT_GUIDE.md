# 🚀 Vercel Deployment Guide for nextlevdecisions.com

This guide will help you deploy the NextLev Decisions landing page to Vercel with the custom domain `nextlevdecisions.com`.

## 📋 Pre-Deployment Checklist

- [x] Project structure verified
- [x] Vercel configuration updated (`vercel.json`)
- [x] Build scripts optimized
- [x] Production environment configured
- [ ] Domain DNS settings configured
- [ ] Environment variables set in Vercel

## 🔧 Environment Variables Setup

Configure these environment variables in your Vercel project dashboard:

### Required Variables
```
VITE_MAIN_APP_URL=https://app.nextlevdecisions.com
VITE_API_BASE_URL=https://api.nextlevdecisions.com
VITE_DEMO_URL=https://app.nextlevdecisions.com/demo
VITE_CONTACT_EMAIL=info@nextlevdecisions.com
VITE_SUPPORT_PHONE=+254 728 399 504
```

### Optional Analytics & Tracking
```
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_HOTJAR_ID=your_hotjar_id
VITE_HUBSPOT_PORTAL_ID=your_hubspot_id
```

### Feature Flags
```
VITE_ENABLE_CHAT=true
VITE_ENABLE_EXIT_INTENT=true
VITE_ENABLE_LEAD_MAGNETS=true
```

## 🌐 Domain Configuration

### Step 1: Add Domain to Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Domains**
3. Add `nextlevdecisions.com`
4. Add `www.nextlevdecisions.com` (optional)

### Step 2: Configure DNS Records
Add these DNS records in your Squarespace domain settings:

#### For Root Domain (nextlevdecisions.com)
```
Type: A
Name: @
Value: 76.76.19.61
TTL: 3600
```

#### For WWW Subdomain (optional)
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Step 3: Verify Domain
- Vercel will automatically verify the domain
- SSL certificate will be provisioned automatically
- Wait for DNS propagation (can take up to 24 hours)

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
npm run deploy:vercel:domain
```

### Option 2: Deploy via Git Integration
1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main branch
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

### Option 3: Manual Deployment
```bash
# Build the project
npm run build

# Deploy the dist folder
vercel --prod
```

## 🔍 Post-Deployment Testing

### Essential Tests
- [ ] Landing page loads at `https://nextlevdecisions.com`
- [ ] All navigation links work
- [ ] Contact forms submit successfully
- [ ] Demo links generate properly
- [ ] Mobile responsiveness verified
- [ ] Page speed performance checked
- [ ] SSL certificate active

### Performance Optimization
- [ ] Images are optimized
- [ ] CSS/JS bundles are minified
- [ ] Browser caching headers working
- [ ] CDN delivery active

## 📊 Analytics & Monitoring

### Google Analytics Setup
1. Create a Google Analytics 4 property
2. Add the tracking ID to Vercel environment variables
3. Verify tracking in Google Analytics Real-Time reports

### Vercel Analytics
1. Enable Vercel Analytics in project settings
2. Monitor Core Web Vitals
3. Track performance metrics

## 🔧 Troubleshooting

### Common Issues

#### Domain Not Working
- Check DNS propagation: https://dnschecker.org
- Verify DNS records in Squarespace
- Wait up to 24 hours for full propagation

#### Build Failures
- Check Node.js version (should be 18.x)
- Verify all dependencies are installed
- Check for TypeScript errors

#### Environment Variables Not Working
- Ensure variables are prefixed with `VITE_`
- Redeploy after adding new variables
- Check variable names for typos

### Performance Issues
- Enable Vercel's Edge Network
- Optimize images with Vercel's Image Optimization
- Check bundle size and code splitting

## 📞 Support

### Technical Support
- **Email**: info@nextlevdecisions.com
- **Phone**: +254 728 399 504

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

## 🎯 Next Steps After Deployment

1. **SEO Setup**
   - Submit sitemap to Google Search Console
   - Configure meta tags and Open Graph
   - Set up Google Analytics goals

2. **Monitoring**
   - Set up uptime monitoring
   - Configure error tracking
   - Monitor Core Web Vitals

3. **Marketing**
   - Set up conversion tracking
   - Configure A/B testing
   - Implement heatmap analytics

---

## 🚀 Quick Deploy Commands

```bash
# Build and test locally
npm run build
npm run preview

# Deploy to Vercel
npm run deploy:vercel:domain

# Check deployment status
vercel ls
```

**Domain**: nextlevdecisions.com  
**Framework**: Vite + React + TypeScript  
**Hosting**: Vercel  
**Status**: Ready for deployment ✅
