/**
 * Generate Static HTML for Squarespace Upload
 * This script converts the built React app into a single HTML file
 * that can be uploaded directly to Squarespace
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');
const outputDir = path.join(__dirname, '..', 'squarespace-export');

function generateStaticFiles() {
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read the built index.html
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('Build files not found. Run "npm run build" first.');
    process.exit(1);
  }

  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Read and inline CSS files
  const cssDir = path.join(distDir, 'assets');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
    
    cssFiles.forEach(cssFile => {
      const cssPath = path.join(cssDir, cssFile);
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      
      // Replace CSS link with inline styles
      const cssLinkRegex = new RegExp(`<link[^>]*href="[^"]*${cssFile}"[^>]*>`, 'g');
      html = html.replace(cssLinkRegex, `<style>${cssContent}</style>`);
    });
  }

  // Read and inline JS files (optional - may be too large)
  // For large JS files, you might want to keep them separate
  
  // Update any absolute paths to relative paths
  html = html.replace(/href="\/assets\//g, 'href="assets/');
  html = html.replace(/src="\/assets\//g, 'src="assets/');

  // Add Squarespace-specific meta tags
  const squarespaceMeta = `
  <!-- Squarespace Integration Meta Tags -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="format-detection" content="telephone=no">
  `;

  html = html.replace('<head>', `<head>${squarespaceMeta}`);

  // Write the final HTML file
  const outputPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(outputPath, html);

  // Copy remaining assets
  if (fs.existsSync(cssDir)) {
    const assetsOutputDir = path.join(outputDir, 'assets');
    if (!fs.existsSync(assetsOutputDir)) {
      fs.mkdirSync(assetsOutputDir, { recursive: true });
    }

    // Copy JS and other assets
    const assetFiles = fs.readdirSync(cssDir);
    assetFiles.forEach(file => {
      if (!file.endsWith('.css')) { // CSS already inlined
        fs.copyFileSync(
          path.join(cssDir, file),
          path.join(assetsOutputDir, file)
        );
      }
    });
  }

  // Create deployment instructions
  const instructions = `
# Squarespace Deployment Instructions

## Files Generated:
- index.html (main landing page with inlined CSS)
- assets/ (JavaScript and other assets)

## Deployment Options:

### Option 1: Code Block (Recommended)
1. In Squarespace, add a "Code Block" to your page
2. Copy the contents of index.html and paste it into the Code Block
3. Upload assets to your site's File Manager
4. Update asset paths in the code if needed

### Option 2: Developer Mode
1. Enable Developer Mode in Squarespace
2. Upload these files to your template
3. Link the index.html content in your template

### Option 3: External Hosting + Embed
1. Upload files to Netlify/Vercel (recommended)
2. Use Squarespace's embed block to include the hosted version
3. Set domain to point to your Squarespace site

## Domain Setup:
1. In Squarespace, go to Settings > Domains
2. Connect your nextlevdecisions.com domain
3. Set up SSL certificate (automatic in Squarespace)

## Important Notes:
- Test thoroughly on mobile devices
- Ensure all forms work correctly
- Set up proper analytics tracking
- Configure contact form backend integration
`;

  fs.writeFileSync(path.join(outputDir, 'DEPLOYMENT_INSTRUCTIONS.md'), instructions);

  console.log('✅ Static files generated successfully!');
  console.log(`📁 Files saved to: ${outputDir}`);
  console.log('📋 Check DEPLOYMENT_INSTRUCTIONS.md for next steps');
}

// Run the script
generateStaticFiles();
