/**
 * NextLev Decisions - Lead Capture API
 * This is an example API endpoint for handling contact form submissions
 * Deploy this to Vercel, Netlify Functions, or your preferred serverless platform
 */

// For Vercel deployment
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const leadData = req.body;
    
    // Validate required fields
    if (!leadData.email || !leadData.firstName || !leadData.lastName) {
      return res.status(400).json({ 
        error: 'Missing required fields: email, firstName, lastName' 
      });
    }

    // Generate demo access token
    const demoToken = generateDemoToken(leadData.email);
    const demoLink = `https://app.nextlevdecisions.com/demo?token=${demoToken}&email=${encodeURIComponent(leadData.email)}&name=${encodeURIComponent(leadData.firstName + ' ' + leadData.lastName)}`;

    // 1. Save to your database (replace with your DB logic)
    await saveLeadToDatabase(leadData);

    // 2. Send to CRM (HubSpot example)
    await sendToHubSpot(leadData);

    // 3. Send welcome email with demo access
    await sendWelcomeEmail(leadData, demoLink);

    // 4. Send internal notification
    await sendInternalNotification(leadData);

    // Return success response with demo link
    res.status(200).json({
      success: true,
      message: 'Lead captured successfully',
      demoLink: demoLink,
      leadId: generateLeadId()
    });

  } catch (error) {
    console.error('Error processing lead:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process lead submission'
    });
  }
}

// Helper Functions

function generateDemoToken(email) {
  // Create a secure token for demo access
  // In production, use proper JWT or similar
  const timestamp = Date.now();
  const data = `${email}:${timestamp}`;
  return Buffer.from(data).toString('base64');
}

function generateLeadId() {
  return 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function saveLeadToDatabase(leadData) {
  // Example with Supabase
  /*
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  const { data, error } = await supabase
    .from('leads')
    .insert([{
      first_name: leadData.firstName,
      last_name: leadData.lastName,
      email: leadData.email,
      company: leadData.company,
      job_title: leadData.jobTitle,
      company_size: leadData.companySize,
      budget: leadData.budget,
      timeline: leadData.timeline,
      challenges: leadData.currentChallenges,
      source: leadData.source || 'landing_page',
      demo_requested: true,
      created_at: new Date().toISOString()
    }]);
  
  if (error) throw error;
  */
  
  // For demo purposes, just log
  console.log('Lead saved to database:', leadData);
}

async function sendToHubSpot(leadData) {
  // HubSpot integration
  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    console.log('HubSpot token not configured, skipping CRM sync');
    return;
  }

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          email: leadData.email,
          firstname: leadData.firstName,
          lastname: leadData.lastName,
          company: leadData.company,
          jobtitle: leadData.jobTitle,
          hs_lead_status: 'NEW',
          leadSource: 'Landing Page',
          demo_requested: 'true',
          company_size: leadData.companySize,
          budget_range: leadData.budget,
          implementation_timeline: leadData.timeline,
          current_challenges: leadData.currentChallenges
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.status}`);
    }

    console.log('Lead synced to HubSpot successfully');
  } catch (error) {
    console.error('Failed to sync to HubSpot:', error);
    // Don't fail the entire request if CRM sync fails
  }
}

async function sendWelcomeEmail(leadData, demoLink) {
  // Email service integration (SendGrid example)
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Email service not configured, skipping welcome email');
    return;
  }

  const emailContent = `
    <h2>Welcome to NextLev Decisions, ${leadData.firstName}!</h2>
    
    <p>Thank you for your interest in our AI-powered decision intelligence platform. We're excited to show you how NextLev Decisions can transform your organization's strategic decision-making process.</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>🚀 Your Demo is Ready!</h3>
      <p>Click the link below to access your personalized demo environment:</p>
      <a href="${demoLink}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Access Your Demo</a>
    </div>
    
    <h3>📋 What's included in your demo:</h3>
    <ul>
      <li>✅ Full AI scoring engine with 50+ criteria</li>
      <li>✅ Sample projects with real-world scenarios</li>
      <li>✅ All 11 specialized reports</li>
      <li>✅ ESG/SDG tracking dashboard</li>
      <li>✅ Team collaboration features</li>
    </ul>
    
    <h3>📞 Next Steps:</h3>
    <p>Our team will reach out within 24 hours to schedule a personalized consultation. In the meantime, explore the demo and don't hesitate to contact us with any questions.</p>
    
    <p>Best regards,<br>
    The NextLev Decisions Team<br>
    📧 info@nextlevdecisions.com<br>
    📱 +254 728 399 504</p>
  `;

  try {
    // SendGrid implementation
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: leadData.email, name: `${leadData.firstName} ${leadData.lastName}` }],
          subject: 'Welcome to NextLev Decisions - Your Demo is Ready! 🚀'
        }],
        from: { 
          email: 'info@nextlevdecisions.com', 
          name: 'NextLev Decisions' 
        },
        content: [{
          type: 'text/html',
          value: emailContent
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`SendGrid API error: ${response.status}`);
    }

    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

async function sendInternalNotification(leadData) {
  // Send notification to your team
  const notificationContent = `
    🎯 New Lead Captured!
    
    Name: ${leadData.firstName} ${leadData.lastName}
    Email: ${leadData.email}
    Company: ${leadData.company}
    Title: ${leadData.jobTitle}
    Company Size: ${leadData.companySize}
    Budget: ${leadData.budget}
    Timeline: ${leadData.timeline}
    
    Challenges: ${leadData.currentChallenges}
    
    Source: Landing Page
    Demo Requested: Yes
    Timestamp: ${new Date().toISOString()}
  `;

  // Send to Slack, email, or your preferred notification system
  console.log('Internal notification:', notificationContent);
}
