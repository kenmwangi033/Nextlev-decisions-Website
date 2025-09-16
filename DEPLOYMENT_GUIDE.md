# 🚀 NextLev Decisions Landing Page Deployment Guide

## 📋 Overview

This guide provides multiple deployment options for your NextLev Decisions landing page, with specific focus on Squarespace integration and demo access flow.

## 🎯 Deployment Options

### ⭐ **Option 1: External Hosting + Squarespace Domain (RECOMMENDED)**

This is the most flexible and professional approach:

#### A. Deploy to Vercel

**🔧 Manual Deployment (Web Interface):**
1. **Build your project locally:**
   ```bash
   npm run build
   ```

2. **Create Vercel account:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

3. **Deploy via web interface:**
   - Click "New Project"
   - Import your Git repository OR
   - Drag and drop your `dist` folder directly

4. **Configure project settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Environment Variables (if needed):**
   - Add your environment variables in the Vercel dashboard
   - Go to Project Settings → Environment Variables

**⚡ CLI Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

#### B. Deploy to Netlify

**🔧 Manual Deployment (Web Interface):**
1. **Build your project locally:**
   ```bash
   npm run build
   ```

2. **Create Netlify account:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with your preferred method

3. **Deploy via drag & drop:**
   - Go to your Netlify dashboard
   - Drag and drop your `dist` folder to the deploy area
   - Your site will be live instantly with a random URL

4. **Deploy via Git (Recommended):**
   - Click "New site from Git"
   - Connect your GitHub/GitLab/Bitbucket
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

5. **Configure custom domain:**
   - Go to Site settings → Domain management
   - Add your custom domain

**⚡ CLI Deployment:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir dist
```

#### C. Deploy to GitHub Pages

**🔧 Manual Deployment:**
1. **Install gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json:**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Configure GitHub Pages:**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select source: "Deploy from a branch"
   - Choose `gh-pages` branch

#### D. Deploy to Firebase Hosting

**🔧 Manual Deployment:**
1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project:**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: `Yes`
   - Don't overwrite index.html: `No`

4. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

#### Step 3: Configure Squarespace Domain
1. **In Squarespace:**
   - Go to Settings → Domains
   - Click "Connect Domain" 
   - Enter `nextlevdecisions.com`
   - Choose "Connect a domain you already own"

2. **DNS Configuration:**
   - In your domain registrar, set up these records:
   ```
   Type: CNAME
   Name: www
   Value: [your-vercel-url] or [your-netlify-url]
   
   Type: A (for root domain)
   Name: @
   Value: Point to your hosting provider's IP
   ```

3. **Squarespace Integration:**
   - Create a simple Squarespace page
   - Add an "Embed" block
   - Embed your hosted landing page using iframe:
   ```html
   <iframe src="https://your-landing-page.vercel.app" 
           width="100%" 
           height="100vh" 
           frameborder="0" 
           style="min-height: 100vh;">
   </iframe>
   ```

### 🔧 **Option 2: Direct Squarespace Upload**

Upload static files directly to Squarespace:

#### Method A: Developer Mode Upload

**🔧 Manual Steps:**
1. **Generate Static Files:**
   ```bash
   npm run build:static
   ```

2. **Enable Developer Mode:**
   - In Squarespace, go to Settings → Advanced → Developer Tools
   - Enable Developer Mode
   - Download your template files

3. **Upload via SFTP:**
   - Use your SFTP credentials from Squarespace
   - Upload generated files to your template directory
   - Replace template files with your built files

4. **Manual File Upload Process:**
   - Extract files from `squarespace-export/`
   - Upload `index.html` to replace your template's main page
   - Upload `assets/` folder to your template's assets directory
   - Update template references if needed

#### Method B: File Manager Upload

**🔧 Manual Steps:**
1. **Prepare Assets:**
   ```bash
   npm run build
   ```

2. **Upload Individual Assets:**
   - Go to Design → Custom CSS → Manage Files
   - Upload your CSS files from `dist/assets/`
   - Upload your JavaScript files
   - Upload any images or fonts

3. **Embed Code in Pages:**
   - Create a new page or edit existing
   - Add HTML/CSS to embed your assets
   - Reference uploaded files using Squarespace URLs

### 🎨 **Option 3: Code Block Integration**

For quick deployment without developer mode:

#### Method A: Single Code Block

**🔧 Manual Steps:**
1. **Prepare Code:**
   ```bash
   npm run build:static
   ```

2. **Add to Squarespace:**
   - Create a new page in Squarespace
   - Add a "Code Block"
   - Copy contents from `squarespace-export/index.html`
   - Paste into the Code Block
   - Save and publish

#### Method B: Multiple Code Blocks (Recommended)

**🔧 Manual Steps:**
1. **Separate Components:**
   - Split your landing page into logical sections
   - Create separate code blocks for header, hero, features, etc.

2. **Upload Assets First:**
   - Go to Design → Custom CSS → Manage Files
   - Upload all CSS and JS files
   - Note the Squarespace URLs for each file

3. **Create Page Structure:**
   - Add multiple Code Blocks to your page
   - Each block contains a section of your landing page
   - Reference uploaded assets using Squarespace URLs

4. **Link Assets:**
   ```html
   <!-- In your first code block, add CSS references -->
   <link rel="stylesheet" href="https://your-site.squarespace.com/s/your-css-file.css">
   
   <!-- In your last code block, add JS references -->
   <script src="https://your-site.squarespace.com/s/your-js-file.js"></script>
   ```

### 🌐 **Option 4: Traditional Web Hosting**

Deploy to any web hosting provider manually:

#### A. Shared Hosting (cPanel/FTP)

**🔧 Manual Steps:**
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Access your hosting control panel:**
   - Login to cPanel or your hosting provider's panel
   - Navigate to File Manager

3. **Upload files:**
   - Go to `public_html` or your domain's root directory
   - Upload all contents from the `dist` folder
   - Ensure `index.html` is in the root directory

4. **Set up redirects (optional):**
   - Create `.htaccess` file for Apache servers:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule . /index.html [L]
   ```

#### B. VPS/Dedicated Server

**🔧 Manual Steps:**
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload via SCP/SFTP:**
   ```bash
   # Upload dist folder to your server
   scp -r dist/* user@your-server.com:/var/www/html/
   ```

3. **Configure web server (Nginx example):**
   ```nginx
   server {
       listen 80;
       server_name nextlevdecisions.com www.nextlevdecisions.com;
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **Set up SSL certificate:**
   ```bash
   # Using Let's Encrypt
   sudo certbot --nginx -d nextlevdecisions.com -d www.nextlevdecisions.com
   ```

### 📱 **Option 5: CDN-Only Deployment**

Deploy static files to a CDN for global distribution:

#### A. AWS S3 + CloudFront

**🔧 Manual Steps:**
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Create S3 bucket:**
   - Go to AWS S3 console
   - Create bucket with your domain name
   - Enable static website hosting
   - Upload `dist` folder contents

3. **Configure CloudFront:**
   - Create CloudFront distribution
   - Set origin to your S3 bucket
   - Configure custom domain and SSL certificate

4. **Update DNS:**
   - Point your domain to CloudFront distribution

#### B. Cloudflare Pages

**🔧 Manual Steps:**
1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Upload via web interface:**
   - Go to Cloudflare dashboard
   - Navigate to Pages
   - Create new project
   - Upload `dist` folder

3. **Configure custom domain:**
   - Add your domain in Pages settings
   - Update DNS records as instructed

## 🔗 Demo Access Flow Configuration

### Backend Integration Setup

1. **Create API Endpoint** (replace the mock in App.tsx):
```javascript
// Replace this URL with your actual API
const response = await fetch('https://api.nextlevdecisions.com/api/leads', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    ...leadFormData,
    timestamp: new Date().toISOString(),
    source: 'landing_page',
    demoRequested: true
  }),
});
```

2. **Update Demo URL** in App.tsx:
```javascript
// Line 101 - Update with your actual app URL
const demoLink = `https://app.nextlevdecisions.com/demo?token=${btoa(leadFormData.email + Date.now())}&email=${encodeURIComponent(leadFormData.email)}&name=${encodeURIComponent(leadFormData.firstName + ' ' + leadFormData.lastName)}`;
```

### CRM Integration Options

#### HubSpot Integration
```javascript
// Add to your API endpoint
const hubspotData = {
  properties: {
    email: leadFormData.email,
    firstname: leadFormData.firstName,
    lastname: leadFormData.lastName,
    company: leadFormData.company,
    jobtitle: leadFormData.jobTitle,
    demo_requested: true
  }
};

await fetch(`https://api.hubapi.com/crm/v3/objects/contacts`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(hubspotData)
});
```

#### Salesforce Integration
```javascript
// Add to your API endpoint
const salesforceData = {
  FirstName: leadFormData.firstName,
  LastName: leadFormData.lastName,
  Email: leadFormData.email,
  Company: leadFormData.company,
  Title: leadFormData.jobTitle,
  LeadSource: 'Landing Page',
  Status: 'Demo Requested'
};
```

## 📧 Email Integration

### EmailJS Setup (Client-side)
1. Create account at [EmailJS](https://emailjs.com)
2. Create email template
3. Add to your environment variables:
```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id  
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### SendGrid/Mailgun (Server-side)
Set up server endpoint to handle email sending with your preferred service.

## 🔍 Analytics Setup

### Google Analytics 4
1. Create GA4 property
2. Add tracking ID to environment:
```
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```
3. Add tracking code to `index.html`

### Conversion Tracking
The app includes built-in conversion tracking. Events tracked:
- `lead_captured` - Form submissions
- `demo_access_clicked` - Demo link clicks
- `pricing_plan_selected` - Plan selections
- `hero_demo_request` - Hero CTA clicks

## 🛡️ Security Considerations

### Environment Variables
1. Copy `env.example` to `.env.local`
2. Fill in your actual values
3. **Never commit .env.local to version control**

### API Security
- Use HTTPS for all API calls
- Implement rate limiting
- Validate all form inputs server-side
- Use CORS properly

### Content Security Policy
Add to your hosting platform:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;
```

## 🧪 Testing Checklist

### Pre-deployment Testing
- [ ] All forms submit correctly
- [ ] Demo links generate properly
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] Page load speed (<3 seconds)
- [ ] All analytics events fire
- [ ] Email notifications work
- [ ] CRM integration functions

### Post-deployment Testing
- [ ] Domain resolves correctly
- [ ] SSL certificate active
- [ ] Contact form submissions reach your CRM
- [ ] Demo access links work
- [ ] Analytics tracking active
- [ ] Mobile experience optimized

## 📋 Manual Deployment Checklist

### Pre-Deployment Checklist
- [ ] **Environment Setup:**
  - [ ] Node.js installed (version 16+)
  - [ ] Dependencies installed (`npm install`)
  - [ ] Environment variables configured
  - [ ] API endpoints updated in code

- [ ] **Code Preparation:**
  - [ ] All forms tested locally
  - [ ] Demo URLs updated
  - [ ] Analytics tracking configured
  - [ ] Contact information updated
  - [ ] Social media links verified

- [ ] **Build Process:**
  - [ ] Run `npm run build` successfully
  - [ ] Check `dist` folder contents
  - [ ] Verify all assets are included
  - [ ] Test built files locally (`npm run preview`)

### Deployment Process Checklist
- [ ] **Choose deployment method:**
  - [ ] External hosting (Vercel/Netlify/etc.)
  - [ ] Direct Squarespace upload
  - [ ] Code block integration
  - [ ] Traditional web hosting
  - [ ] CDN deployment

- [ ] **Upload files:**
  - [ ] All HTML, CSS, JS files uploaded
  - [ ] Images and fonts uploaded
  - [ ] Correct file permissions set
  - [ ] Directory structure maintained

- [ ] **Domain Configuration:**
  - [ ] DNS records updated
  - [ ] SSL certificate configured
  - [ ] Redirects set up (www to non-www or vice versa)
  - [ ] Custom domain connected

### Post-Deployment Testing
- [ ] **Functionality Testing:**
  - [ ] Landing page loads correctly
  - [ ] All forms submit successfully
  - [ ] Demo access links work
  - [ ] Mobile responsiveness verified
  - [ ] Cross-browser compatibility checked

- [ ] **Performance Testing:**
  - [ ] Page load speed < 3 seconds
  - [ ] Images optimized and loading
  - [ ] No console errors
  - [ ] Analytics tracking active

- [ ] **Integration Testing:**
  - [ ] Contact form sends emails
  - [ ] CRM integration working
  - [ ] Demo links redirect correctly
  - [ ] All external links functional

## 🔧 Troubleshooting Common Issues

### Build Issues
**Problem:** `npm run build` fails
**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+

# Run with verbose logging
npm run build --verbose
```

**Problem:** Missing assets in build
**Solutions:**
- Check `vite.config.ts` configuration
- Verify asset paths are correct
- Ensure all imports use relative paths

### Deployment Issues
**Problem:** 404 errors on deployed site
**Solutions:**
- Add proper redirect rules for SPA
- Check if `index.html` is in the correct directory
- Verify server configuration supports client-side routing

**Problem:** CSS/JS not loading
**Solutions:**
- Check file paths are correct
- Verify MIME types are set correctly
- Check for CORS issues
- Ensure files are uploaded to correct directory

**Problem:** Forms not working
**Solutions:**
- Update API endpoints to production URLs
- Check CORS configuration
- Verify environment variables are set
- Test API endpoints independently

### Domain Issues
**Problem:** Domain not resolving
**Solutions:**
- Check DNS propagation (use DNS checker tools)
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check domain registrar settings

**Problem:** SSL certificate issues
**Solutions:**
- Verify domain ownership
- Check certificate installation
- Use SSL checker tools
- Contact hosting provider support

## 🚀 Quick Start Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
npm run deploy:vercel

# Deploy to Netlify  
npm run deploy:netlify

# Generate static files for Squarespace
npm run build:static

# Preview production build
npm run preview

# Interactive setup
npm run setup
```

## 📊 Manual Deployment Comparison

| Method | Difficulty | Speed | Cost | Custom Domain | Auto Updates |
|--------|------------|-------|------|---------------|--------------|
| Vercel Web UI | Easy | Fast | Free | ✅ | ✅ |
| Netlify Drag & Drop | Easy | Fast | Free | ✅ | ❌ |
| GitHub Pages | Medium | Medium | Free | ✅ | ✅ |
| Squarespace Code Block | Easy | Fast | Paid | ✅ | ❌ |
| Traditional Hosting | Hard | Medium | Paid | ✅ | ❌ |
| Firebase Hosting | Medium | Fast | Free/Paid | ✅ | ❌ |

## 🎯 Recommended Manual Deployment Path

For beginners, we recommend this path:

1. **Start with Netlify Drag & Drop:**
   - Build locally: `npm run build`
   - Drag `dist` folder to Netlify
   - Test with temporary URL

2. **Connect your domain:**
   - Add custom domain in Netlify
   - Update DNS records

3. **Set up continuous deployment:**
   - Connect Git repository
   - Enable auto-deploy on push

4. **Configure production settings:**
   - Add environment variables
   - Set up form handling
   - Enable analytics

## 📞 Support

For deployment assistance:
- Email: info@nextlevdecisions.com
- Phone: +254 728 399 504

## 🔄 Maintenance

### Regular Updates
- Monitor form submission rates
- Update demo URLs as needed
- Refresh testimonials and stats
- A/B test different CTAs
- Monitor page performance

### Backup Strategy
- Regular exports of form data
- Version control for code changes
- Database backups if using server-side storage

---

**Ready to deploy?** Choose your preferred option above and follow the step-by-step instructions. For fastest deployment, we recommend **Option 1** with Vercel or Netlify hosting.
