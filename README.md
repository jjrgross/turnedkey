# TurnedKey Properties Website

Modern, professional website for TurnedKey Properties - Nationwide cash home buyers.

## 🏢 Business Info
- **Company:** TurnedKey Properties
- **Phone:** (262) 425-5984
- **Emails:** jjrgross@gmail.com, freddyviera915@gmail.com
- **Domain:** turnedkey.com
- **Service Area:** Nationwide (All 50 States)

## 🎨 Design
- Modern blue-purple gradient theme
- Responsive mobile-first design
- Smooth animations and effects
- Custom key icon branding

## 🚀 Deployment

### Cloudflare Pages (Recommended)
1. Connect this repo to Cloudflare Pages
2. Configure:
   - Build output: `dist`
   - Add environment variable: `RESEND_API_KEY`
   - Create KV namespace: `turnedkey-leads` (bind as `LEADS_KV`)
3. Add custom domains: turnedkey.com, www.turnedkey.com

### Environment Variables
- `RESEND_API_KEY` - Get from https://resend.com/api-keys
- `LEADS_KV` - KV namespace for storing leads

## 📧 Email Setup (Resend)

Required DNS records in Cloudflare:
```
TXT: resend._domainkey → [your DKIM key]
CNAME: rsend → rsend.forge.rmta.net
CNAME: send → send.forge.rmta.net
TXT: _dmarc → v=DMARC1; p=none;
```

## 📁 Structure
- `/dist` - Static website files (HTML, CSS, JS, images)
- `/functions/api/leads.js` - Cloudflare Pages Function for lead handling
- `/.github` - GitHub Actions (optional)

## 🧪 Testing
After deployment, test the lead form at https://turnedkey.com

## 💰 Cost
- Hosting: FREE (Cloudflare Pages)
- Email: FREE (Resend - 3,000/month)
- Domain: ~$12/year
- **Total: $0/month**

---

**This is completely separate from Metro House Pros!**
