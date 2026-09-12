// TurnedKey Properties - Lead Form Handler
// This will be renamed to leads.js when deploying TurnedKey site

const ADMIN_KEY = 'turned99';

// Email configuration
const EMAIL_CONFIG = {
  to: ['jjrgross@gmail.com', 'freddyviera915@gmail.com'],
  from: 'leads@turnedkey.com',
  resendApiKey: '', // Will use RESEND_API_KEY env var
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function isAdmin(url) {
  return url.searchParams.get('manage') === ADMIN_KEY;
}

async function sendLeadEmail(lead, context) {
  const apiKey = context.env.RESEND_API_KEY || EMAIL_CONFIG.resendApiKey;
  
  if (!apiKey) {
    return { success: false, error: 'No Resend API key configured. Add it to Cloudflare environment variables.' };
  }

  const emailBody = `<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { 
    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); 
    color: white; 
    padding: 30px; 
    text-align: center; 
    border-radius: 10px 10px 0 0; 
  }
  .header h1 { margin: 0; font-size: 28px; }
  .header p { margin: 5px 0 0 0; opacity: 0.95; font-size: 14px; }
  .content { 
    background: #f8fafc; 
    padding: 30px; 
    border: 1px solid #e2e8f0; 
    border-top: none; 
  }
  .field { 
    margin-bottom: 18px; 
    padding: 15px; 
    background: white; 
    border-radius: 8px; 
    border-left: 4px solid #3b82f6;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .label { 
    font-weight: bold; 
    color: #1e40af; 
    margin-bottom: 5px; 
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .value { color: #1e293b; font-size: 16px; }
  .value a { color: #3b82f6; text-decoration: none; }
  .value a:hover { text-decoration: underline; }
  .actions { 
    margin-top: 30px; 
    padding: 20px; 
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
    border-radius: 8px; 
    text-align: center; 
  }
  .actions p { margin: 0 0 15px 0; font-weight: bold; color: #1e40af; }
  .btn { 
    display: inline-block; 
    background: #3b82f6; 
    color: white !important; 
    padding: 12px 30px; 
    text-decoration: none; 
    border-radius: 8px; 
    margin: 5px; 
    font-weight: bold;
    transition: all 0.3s ease;
  }
  .btn:hover { background: #2563eb; transform: translateY(-2px); }
  .btn-secondary { background: #8b5cf6; }
  .btn-secondary:hover { background: #7c3aed; }
  .footer { 
    margin-top: 20px; 
    padding: 20px; 
    text-align: center; 
    font-size: 12px; 
    color: #64748b; 
    border-top: 1px solid #e2e8f0;
  }
  .footer a { color: #3b82f6; text-decoration: none; }
  .badge { 
    display: inline-block; 
    background: #3b82f6; 
    color: white; 
    padding: 4px 12px; 
    border-radius: 12px; 
    font-size: 11px; 
    font-weight: bold; 
    margin-left: 8px;
  }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>🔑 New Lead Submission</h1>
    <p>TurnedKey Properties</p>
  </div>
  <div class="content">
    <p style="font-size: 18px; margin-top: 0; color: #1e40af;">
      <strong>You have a new property inquiry!</strong>
      <span class="badge">NEW</span>
    </p>
    
    <div class="field">
      <div class="label">👤 Contact Name</div>
      <div class="value">${lead.name}</div>
    </div>
    
    <div class="field">
      <div class="label">📞 Phone Number</div>
      <div class="value"><a href="tel:${lead.phone}">${lead.phone}</a></div>
    </div>
    
    <div class="field">
      <div class="label">📧 Email Address</div>
      <div class="value"><a href="mailto:${lead.email}">${lead.email}</a></div>
    </div>
    
    ${lead.address ? `
    <div class="field">
      <div class="label">🏡 Property Address</div>
      <div class="value">${lead.address}</div>
    </div>
    ` : ''}
    
    ${lead.timeline ? `
    <div class="field">
      <div class="label">⏰ Desired Timeline</div>
      <div class="value">${lead.timeline}</div>
    </div>
    ` : ''}
    
    ${lead.propertyCondition ? `
    <div class="field">
      <div class="label">🔧 Property Condition</div>
      <div class="value">${lead.propertyCondition}</div>
    </div>
    ` : ''}
    
    ${lead.occupancy ? `
    <div class="field">
      <div class="label">🏠 Current Occupancy</div>
      <div class="value">${lead.occupancy}</div>
    </div>
    ` : ''}
    
    ${lead.listedWithAgent ? `
    <div class="field">
      <div class="label">📋 Listed with Agent?</div>
      <div class="value">${lead.listedWithAgent}</div>
    </div>
    ` : ''}
    
    ${lead.additionalNotes ? `
    <div class="field">
      <div class="label">📝 Additional Notes</div>
      <div class="value">${lead.additionalNotes}</div>
    </div>
    ` : ''}
    
    <div class="actions">
      <p>Quick Actions</p>
      <a href="tel:${lead.phone}" class="btn">📞 Call Now</a>
      <a href="mailto:${lead.email}" class="btn btn-secondary">📧 Send Email</a>
    </div>
  </div>
  
  <div class="footer">
    <p><strong>Submitted:</strong> ${new Date(lead.createdAt).toLocaleString('en-US', { 
      dateStyle: 'full', 
      timeStyle: 'short' 
    })}</p>
    <p style="margin-top: 15px;">
      Manage all leads at <a href="https://turnedkey.com/admin">turnedkey.com/admin</a>
    </p>
    <p style="margin-top: 10px; color: #94a3b8;">
      TurnedKey Properties | Nationwide Cash Home Buyers
    </p>
  </div>
</div>
</body>
</html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `TurnedKey Properties <${EMAIL_CONFIG.from}>`,
        to: EMAIL_CONFIG.to,
        reply_to: lead.email,
        subject: `🔑 New Lead: ${lead.name} - ${lead.phone}`,
        html: emailBody,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      return { success: false, error: `Resend error: ${result.message || 'Unknown error'}` };
    }
    
    return { success: true, emailId: result.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// GET - Retrieve leads (admin only)
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  
  if (!isAdmin(url)) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const id = url.searchParams.get('id');
  const leads = (await context.env.LEADS_KV.get('leads', { type: 'json' })) || [];

  if (id) {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return json({ error: 'Not found' }, 404);
    return json(lead);
  }

  return json(leads);
}

// POST - Submit new lead
export async function onRequestPost(context) {
  const lead = await context.request.json();

  // Validate required fields
  if (!lead.name || !lead.phone || !lead.email) {
    return json({ error: 'name, phone, and email are required' }, 400);
  }

  // Get existing leads
  const leads = (await context.env.LEADS_KV.get('leads', { type: 'json' })) || [];
  
  // Create new lead object
  const newLead = {
    id: Date.now().toString(),
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    address: lead.address || '',
    condition: lead.condition || '',
    timeline: lead.timeline || '',
    propertyCondition: lead.propertyCondition || '',
    occupancy: lead.occupancy || '',
    listedWithAgent: lead.listedWithAgent || '',
    additionalNotes: lead.additionalNotes || '',
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save to KV store
  leads.unshift(newLead);
  await context.env.LEADS_KV.put('leads', JSON.stringify(leads));
  
  // Send email notification
  const emailResult = await sendLeadEmail(newLead, context);
  
  return json({
    ...newLead,
    emailSent: emailResult.success,
    emailError: emailResult.error || null,
    emailId: emailResult.emailId || null
  }, 201);
}

// PUT - Update existing lead (admin only)
export async function onRequestPut(context) {
  const url = new URL(context.request.url);
  
  if (!isAdmin(url)) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const updates = await context.request.json();
  if (!updates.id) return json({ error: 'id is required' }, 400);

  const leads = (await context.env.LEADS_KV.get('leads', { type: 'json' })) || [];
  const idx = leads.findIndex((l) => l.id === updates.id);
  
  if (idx === -1) return json({ error: 'Not found' }, 404);

  leads[idx] = { 
    ...leads[idx], 
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  await context.env.LEADS_KV.put('leads', JSON.stringify(leads));
  return json(leads[idx]);
}

// DELETE - Remove lead (admin only)
export async function onRequestDelete(context) {
  const url = new URL(context.request.url);
  
  if (!isAdmin(url)) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const id = url.searchParams.get('id');
  if (!id) return json({ error: 'id is required' }, 400);

  const leads = (await context.env.LEADS_KV.get('leads', { type: 'json' })) || [];
  const filtered = leads.filter((l) => l.id !== id);
  
  await context.env.LEADS_KV.put('leads', JSON.stringify(filtered));
  return json({ success: true });
}

// OPTIONS - CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
