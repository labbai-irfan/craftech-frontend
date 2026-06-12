# CRAFTECH — PRODUCTION LAUNCH (QUICK START)

**TL;DR: Get live in 2-3 hours**

---

## **30-MIN PREP**

### Backend Environment Variables
```bash
# Create .env in craftech-backend/
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/craftech
JWT_SECRET=$(openssl rand -base64 32)
CLOUDINARY_CLOUD_NAME=dcx2gs6mm
CLOUDINARY_API_KEY=YOUR_KEY
CLOUDINARY_API_SECRET=YOUR_SECRET
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=StrongPassword123!
FRONTEND_URL=https://craftechengineers.com
ADMIN_URL=https://admin.craftechengineers.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=sales@example.com
CORS_ORIGIN=https://craftechengineers.com
EOF
```

### Frontend Environment
```bash
# craftech-frontend/.env.production
cat > .env.production << 'EOF'
VITE_API_URL=https://api.craftechengineers.com
EOF
```

### Database Setup (MongoDB Atlas)
1. Go to mongodb.com → Create account
2. Create cluster (M0 free tier is fine for MVP)
3. Create database user
4. Get connection string
5. Paste into MONGODB_URI
6. Whitelist your server IP

### Test Before Deploying
```bash
# Backend
cd craftech-backend
npm ci
npm start
# Should show: "API running on port 5000"
# Test: curl http://localhost:5000/api/health

# Frontend
cd craftech-frontend
npm ci
npm run build
# Should complete with no errors
# Check dist/ folder exists
```

---

## **1-HOUR DEPLOY**

### Option A: Easiest (Recommended)

**Backend → Railway**
```bash
npm install -g @railway/cli
cd craftech-backend
railway login
railway up
# Follow prompts, paste your .env
# Takes 5-10 min
```

**Frontend → Vercel**
```bash
npm install -g vercel
cd craftech-frontend
vercel --prod
# Select: craftech
# Paste env vars when prompted
# Takes 5-10 min
```

**Domain Setup**
```bash
# In Vercel dashboard:
1. Settings → Domains
2. Add craftechengineers.com
3. Update DNS with CNAME records provided

# In Railway dashboard:
1. Settings → Custom Domain
2. Add api.craftechengineers.com
3. Update DNS with CNAME records provided
```

### Option B: Self-Hosted (VPS)

**Rent VPS:** DigitalOcean, Linode, or Hetzner ($5-10/month)

**SSH Setup:**
```bash
ssh root@<server-ip>
apt update && apt upgrade -y
apt install nodejs npm git nginx certbot python3-certbot-nginx -y

# Clone repo
cd /var/www
git clone <your-repo-url> craftech
cd craftech/craftech-backend

# Setup backend
npm ci --only=production
pm2 start src/index.js --name api
pm2 startup && pm2 save

# Setup nginx
# Edit /etc/nginx/sites-available/default with config from DEPLOYMENT_CHECKLIST.md
# Get SSL cert
certbot --nginx -d api.craftechengineers.com
systemctl restart nginx

# Deploy frontend to /var/www/html
cd ../craftech-frontend
npm run build
rm -rf /var/www/html/*
cp -r dist/* /var/www/html/
```

---

## **15-MIN VERIFICATION**

### Test Everything Works

**Lead Submission:**
1. Go to https://craftechengineers.com (or staging)
2. Scroll to Contact
3. Fill form: name, email, phone, message
4. Submit
5. Check:
   - ✅ Success toast appears
   - ✅ Email arrives at CONTACT_EMAIL
   - ✅ Lead in admin panel at /admin/leads

**Admin Access:**
1. Go to https://admin.craftechengineers.com/login
2. Login with ADMIN_EMAIL / ADMIN_PASSWORD
3. Check:
   - ✅ Dashboard loads
   - ✅ Can see leads list
   - ✅ Can edit settings (phone, WhatsApp, etc)
   - ✅ Can view projects

**Performance:**
```bash
# Test API speed
curl -w "@curl-format.txt" -o /dev/null -s https://api.craftechengineers.com/api/health

# Should be <100ms
```

**SSL:**
```bash
curl -I https://craftechengineers.com
# Should show "HTTP/2 200" (not 301 redirect)
```

---

## **LAUNCH CHECKLIST**

Print this and check off:

```
⬜ .env created with all secrets
⬜ Database connected and accessible
⬜ Email service tested (sent test email)
⬜ Cloudinary account verified
⬜ Backend deployed and /api/health returns 200
⬜ Frontend deployed and loads
⬜ Domain DNS updated and propagated
⬜ SSL certificates installed
⬜ Contact form tested (lead submitted)
⬜ Admin login tested
⬜ Settings saved and reflected on site
⬜ Error monitoring configured (Sentry or similar)
⬜ Backup scheduled
⬜ On-call schedule created
⬜ Team trained on admin panel
⬜ Monitoring alerts configured

ALL CHECKED? → LIVE ✅
```

---

## **FIRST HOURS: WHAT TO MONITOR**

Watch these real-time:

**Dashboards:**
- Railway/Vercel dashboard (deploy logs, errors)
- MongoDB Atlas (connection, storage)
- Error tracking (Sentry, if enabled)

**Manual checks (every 30 min for first 2 hours):**
```bash
# Is backend up?
curl https://api.craftechengineers.com/api/health

# Any errors?
# Check error logs in hosting provider

# Any leads coming in?
# Login to admin → /admin/leads
```

**Alert Criteria (escalate immediately):**
- ❌ API returning 500 errors
- ❌ Contact form not submitting
- ❌ Emails not being sent
- ❌ Database connection failing
- ❌ Site returns 503 (server down)

---

## **ROLLBACK PLAN (If something breaks)**

**Immediate (< 2 minutes):**
```bash
# If deployed to Railway/Vercel, go to dashboard
# Click "Rollback to previous deploy"
# Takes 2-5 minutes
```

**If rollback fails:**
```bash
# Revert code
git revert <broken-commit-hash>
git push
# Redeploy (5-10 min)
```

**Communication:**
- Message team: "Issue detected, rolling back"
- Once rolled back: "Rolled back, investigating root cause"
- Fix locally, test, then redeploy

---

## **SUCCESS METRICS (First 24h)**

✅ **All green = successful launch:**

| Metric | Target | Status |
|--------|--------|--------|
| Uptime | 99%+ | 🟢 |
| API response | <200ms | 🟢 |
| Leads captured | 5+ | 🟢 |
| Email delivery | 100% | 🟢 |
| Error rate | <0.1% | 🟢 |
| SSL valid | ✅ | 🟢 |
| Admin access | ✅ | 🟢 |

---

## **NEXT STEPS**

After launch:

1. **Monitor for 24 hours** (hourly checks)
2. **Get feedback from team** (does admin work smoothly?)
3. **Collect first leads** (follow up with them)
4. **Then start Phase 3** (Premium Polish)

**Do NOT:**
- Worry about performance optimization (too early)
- Add new features (focus on quality of leads)
- Tweak design extensively (collect real data first)
- Plan RBAC (only when team grows)

**DO:**
- Respond quickly to new leads
- Track where leads come from
- Monitor error logs
- Document any issues found

---

## **EMERGENCY CONTACTS**

**If production breaks:**

Your name: ___________  
Your phone: ___________  
Your email: ___________  

**Hosting support:**
- Railway: support@railway.app
- Vercel: support.vercel.com
- MongoDB: support.mongodb.com

**Response time target: 30 minutes**

---

**Deployment timestamp: ________________**

**Deployed by: ________________**

**Status: 🟢 LIVE** (or 🟡 ISSUES, 🔴 ROLLED BACK)
