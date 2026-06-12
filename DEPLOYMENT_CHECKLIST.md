# CRAFTECH — PRODUCTION DEPLOYMENT CHECKLIST

**Deployment Date:** ___________  
**Deployed By:** ___________  
**Status:** ⬜ Ready | 🟡 In Progress | 🟢 Complete

---

## **PHASE 1: PRE-DEPLOYMENT VERIFICATION**

### ✅ Code Quality
- [ ] No `console.log()` statements in production code (use pino)
- [ ] No `.env` file in git (only `.env.example`)
- [ ] No hardcoded secrets in code
- [ ] No `TODO` or `FIXME` comments left
- [ ] All TypeScript/linting errors resolved
- [ ] No unused imports
- [ ] All API endpoints tested

### ✅ Environment Variables
**Backend (.env):**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=<production-uri>
JWT_SECRET=<strong-32-char-secret>
CLOUDINARY_CLOUD_NAME=<name>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
ADMIN_EMAIL=<email>
ADMIN_PASSWORD=<strong-password>
FRONTEND_URL=https://craftechengineers.com
ADMIN_URL=https://admin.craftechengineers.com
SMTP_HOST=<smtp-host>
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASS=<password>
CONTACT_EMAIL=<contact-inbox>
CORS_ORIGIN=https://craftechengineers.com
```

**Frontend (.env.production):**
```
VITE_API_URL=https://api.craftechengineers.com
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

- [ ] All env vars set and verified
- [ ] Secrets stored in secure vault (not in files)
- [ ] API_URL points to production backend
- [ ] Database URI is production MongoDB Atlas

### ✅ Database
- [ ] MongoDB Atlas cluster created
- [ ] Backup enabled (daily)
- [ ] Indexes created on: projects (slug, category), leads (status, createdAt), users (email)
- [ ] Initial seed data loaded (admin user, default settings)
- [ ] Connection string tested from backend
- [ ] Connection pooling configured (10-50 connections)

### ✅ File Storage
- [ ] Cloudinary account verified
- [ ] API credentials working
- [ ] Upload folders configured (projects, media, gallery)
- [ ] CDN caching enabled
- [ ] CORS settings for image domains

### ✅ Email
- [ ] SMTP credentials verified
- [ ] Test email sent to admin
- [ ] Lead notification emails working
- [ ] Auto-reply template configured
- [ ] Sender address whitelisted (no spam folder)

### ✅ Security
- [ ] HTTPS/SSL certificate obtained (Let's Encrypt or paid)
- [ ] JWT_SECRET is minimum 32 characters, strong
- [ ] Admin password is strong (12+ chars, mixed)
- [ ] Database backups are encrypted
- [ ] Rate limiting configured
- [ ] CORS whitelist only includes production domains
- [ ] Helmet security headers enabled
- [ ] HSTS enabled (Strict-Transport-Security)
- [ ] API key rotation plan documented

### ✅ Domain & DNS
- [ ] Domain registered (craftechengineers.com)
- [ ] SSL certificate purchased/configured
- [ ] DNS records pointing to production server
  - [ ] A record → API server IP
  - [ ] CNAME record → Frontend CDN (if using)
  - [ ] MX records → Email service
- [ ] DNS propagation verified (24-48 hours)
- [ ] www redirect configured
- [ ] Email records (SPF, DKIM, DMARC) configured

### ✅ Monitoring & Logging
- [ ] Error tracking setup (Sentry recommended)
- [ ] Application logging to stdout (Docker-friendly)
- [ ] Health endpoint `/api/health` accessible
- [ ] Uptime monitoring configured (UptimeRobot)
- [ ] Performance monitoring setup
- [ ] Log aggregation service (CloudWatch/ELK) ready

### ✅ Backups
- [ ] Database automatic backups enabled (daily)
- [ ] Backup retention: 30 days minimum
- [ ] Cloudinary media automatically backed up
- [ ] Restore procedure tested
- [ ] Contact backups stored securely (encrypted)

---

## **PHASE 2: DEPLOYMENT**

### 🖥️ Backend Deployment (Node.js)

**Option A: Railway / Render (Recommended for MVP)**
```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Deploy from git
railway up
```

**Option B: Self-hosted (VPS)**
```bash
# SSH into server
ssh root@<server-ip>

# Install Node, npm, git
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Clone repo
cd /var/www
git clone <repo-url> craftech-api
cd craftech-api

# Install dependencies
npm ci --only=production

# Create .env file
nano .env
# (paste production env vars)

# Test locally
npm start
# Should see: "API running on port 5000"

# Setup PM2 (process manager)
sudo npm install -g pm2
pm2 start src/index.js --name craftech-api
pm2 startup
pm2 save

# Setup nginx reverse proxy
sudo apt-get install nginx
```

**Nginx Config** (`/etc/nginx/sites-available/craftech-api`):
```nginx
server {
    listen 80;
    server_name api.craftechengineers.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API health check
    location /api/health {
        proxy_pass http://localhost:5000/api/health;
        access_log off;
    }
}
```

**Enable SSL:**
```bash
sudo certbot --nginx -d api.craftechengineers.com
```

- [ ] Backend deployed and running
- [ ] `/api/health` returns `{status: 'ok'}`
- [ ] SSL certificate installed
- [ ] Database connection working
- [ ] Email service tested
- [ ] Cloudinary uploads working

### 🎨 Frontend Deployment

**Option A: Vercel (Easiest)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd craftech-frontend
vercel --prod
```

**Option B: Netlify**
```bash
# Deploy via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

**Option C: Self-hosted**
```bash
# Build
cd craftech-frontend
npm run build

# Copy to server
scp -r dist/* user@server:/var/www/craftech-frontend/

# Nginx config for frontend
```

**Nginx Config** (`/etc/nginx/sites-available/craftech-web`):
```nginx
server {
    listen 80;
    server_name craftechengineers.com www.craftechengineers.com;
    root /var/www/craftech-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api {
        proxy_pass http://api.craftechengineers.com;
    }
}
```

- [ ] Frontend deployed
- [ ] Domain accessible (craftechengineers.com)
- [ ] SSL certificate installed
- [ ] Static assets cached
- [ ] API requests proxied correctly

---

## **PHASE 3: POST-DEPLOYMENT VERIFICATION**

### 🧪 Functional Testing (Critical Path)

**Test Lead Capture (Most Important):**
```
1. Navigate to https://craftechengineers.com
2. Go to Contact section
3. Fill contact form: name, email, phone, message
4. Submit form
5. Verify:
   - [ ] Success toast appears ("Thank you...")
   - [ ] Lead appears in /admin/leads
   - [ ] Email notification sent to admin
   - [ ] Lead has correct status "new"
   - [ ] All fields saved correctly
```

**Test Admin Panel:**
```
1. Navigate to https://admin.craftechengineers.com (or /admin/login)
2. Login with ADMIN_EMAIL / ADMIN_PASSWORD
3. Verify:
   - [ ] Dashboard loads
   - [ ] Can view leads
   - [ ] Can edit settings
   - [ ] Can upload images
   - [ ] Logout works
```

**Test Contact Information:**
```
1. Check homepage
   - [ ] Phone number matches Settings
   - [ ] WhatsApp button has correct number
   - [ ] Footer shows correct info
   - [ ] Contact form has correct destination
2. Click WhatsApp button
   - [ ] Opens WhatsApp with correct number
3. Click Call button
   - [ ] Initiates call to correct number
```

**Test Image Loading:**
```
1. Homepage
   - [ ] Hero image loads fast
   - [ ] Project images load
   - [ ] Images lazy-load on scroll
2. Admin
   - [ ] Can upload images
   - [ ] Images appear in Cloudinary
   - [ ] Cloudinary transforms applied (w_1200, q_auto)
```

**Test Error Scenarios:**
```
1. Submit contact form with missing fields
   - [ ] Validation errors appear
2. Submit invalid email
   - [ ] Email validation rejects
3. Network error during upload
   - [ ] User sees error message
   - [ ] No partial data saved
```

### 📊 Performance Checks

```bash
# Test API response time
curl -w "@curl-format.txt" -o /dev/null -s https://api.craftechengineers.com/api/health

# Should be < 100ms
```

**Lighthouse Score Target:**
- [ ] Performance: ≥85
- [ ] Accessibility: ≥90
- [ ] Best Practices: ≥90
- [ ] SEO: ≥95

Run: `https://pagespeed.web.dev/`

### 🔒 Security Verification

```bash
# SSL certificate check
curl -I https://craftechengineers.com
# Should show: "HTTP/2 200"

# HSTS header present
curl -I https://craftechengineers.com | grep Strict-Transport-Security
```

- [ ] SSL certificate valid (not self-signed)
- [ ] HSTS header present
- [ ] No sensitive data in HTML/JS
- [ ] Rate limiting working (test with rapid requests)
- [ ] CORS only allows production domains

### 📈 Monitoring Verification

- [ ] Uptime monitor shows 100%
- [ ] Error tracking (Sentry) receiving events
- [ ] Application logs visible and clean
- [ ] No errors in browser console (production)
- [ ] Database connection pool healthy

---

## **PHASE 4: LAUNCH FINALIZATION**

### 📢 Go-Live Checklist

- [ ] Team notified of launch
- [ ] Slack/Teams alert configured for production errors
- [ ] On-call schedule defined (who monitors first 24h)
- [ ] Rollback plan documented
- [ ] Emergency contact list shared
- [ ] DNS TTL lowered 24h before launch (for fast rollback)

### 📊 First 24 Hours Monitoring

**Monitor these metrics:**
- Lead submission success rate (target: 99%)
- API response time (target: <200ms)
- Database connection pool (target: <50% utilization)
- Cloudinary upload success (target: 100%)
- Email delivery (target: 100%)
- Error rate (target: <0.1%)

**Daily checks:**
- [ ] View admin dashboard → leads count increasing
- [ ] Check email inbox → admin notifications arriving
- [ ] Spot-check database → data accurate
- [ ] Review error logs → no unexpected errors
- [ ] Test contact form → still working

### 🔄 Rollback Plan

**If critical issue found:**
```bash
# Point DNS back to staging
# Revert code: git revert <commit-hash>
# npm run build && deploy
# Verify staging fully working before trying again

# Timeline: 30 min target from alert to resolved
```

---

## **POST-LAUNCH: FIRST WEEK**

### Day 1
- [ ] Monitor error logs hourly
- [ ] Confirm 5+ leads captured
- [ ] Test admin receiving notifications
- [ ] Check database disk space
- [ ] Verify backup completed

### Day 2-3
- [ ] Continue hourly monitoring (can go to 4-hour intervals)
- [ ] Review all captured leads
- [ ] Respond to first customer inquiry
- [ ] Check Lighthouse score again

### Day 4-7
- [ ] Switch to daily monitoring
- [ ] Analyze lead sources (traffic)
- [ ] Verify all admin features used successfully
- [ ] Plan Phase 3 (Premium Polish) work
- [ ] Create runbook for common issues

---

## **CRITICAL CONTACTS & ESCALATION**

**On-Call Engineer:** ___________  
**Backup Engineer:** ___________  
**Database Admin:** ___________  
**Hosting Support:** ___________  
**Email Support:** ___________  

**Escalation:**
- 0-1 hour: On-call handles
- 1-4 hours: Notify backup + lead
- 4+ hours: Full team mobilized

---

## **ROLLOUT SUCCESS CRITERIA**

✅ All criteria must be met before marking as "COMPLETE":

1. **Leads flowing** - 5+ leads captured in first 24h ✓
2. **Admin working** - Can view/edit all content ✓
3. **Zero critical errors** - No 500 errors in logs ✓
4. **Performance acceptable** - API <200ms response time ✓
5. **Backups running** - Daily automated backups confirmed ✓
6. **Team trained** - Admin users know how to edit content ✓
7. **Monitoring active** - Error alerts configured ✓

**Status: 🟢 DEPLOYED - {date}**

---

## **NOTES**

Document any issues, decisions, or changes made during deployment:

[space for notes]

