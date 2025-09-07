# Vercel Deployment Guide for Balgopaal Vastram

## 🚀 Quick Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with your GitHub account
3. Click "New Project"
4. Import your repository: `https://github.com/CodingAnil/Balgopaal-Vastram`
5. Configure the project settings

### 2. Environment Variables Setup

In your Vercel project dashboard, go to **Settings → Environment Variables** and add these:

#### **Database Configuration**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/balgopaal-vastram?retryWrites=true&w=majority
```

#### **SendGrid Email Configuration**
```
SENDGRID_API_KEY=SG.your_actual_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
```

#### **Razorpay Payment Configuration**
```
RAZORPAY_KEY_ID=rzp_live_your_key_id_here
RAZORPAY_KEY_SECRET=your_secret_key_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_your_key_id_here
```

#### **Cloudinary Image Upload Configuration**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### **Admin Authentication**
```
ADMIN_PASSWORD=your_secure_admin_password_here
```

### 3. Deploy

1. Click "Deploy" 
2. Wait for the build to complete
3. Your site will be live at `https://your-project-name.vercel.app`

## 🔧 Detailed Configuration

### MongoDB Setup

1. **Create MongoDB Atlas Account**:
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a free account
   - Create a new cluster

2. **Create Database User**:
   - Go to Database Access
   - Add new database user
   - Choose password authentication
   - Give read/write access

3. **Whitelist IP Addresses**:
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Or add Vercel's IP ranges for better security

4. **Get Connection String**:
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### SendGrid Setup

1. **Create SendGrid Account**:
   - Go to [sendgrid.com](https://sendgrid.com)
   - Sign up for free account
   - Verify your email

2. **Create API Key**:
   - Go to Settings → API Keys
   - Create API Key with Full Access to Mail Send
   - Copy the key (starts with `SG.`)

3. **Verify Sender**:
   - Go to Settings → Sender Authentication
   - Verify a single sender email
   - Or set up domain authentication

### Razorpay Setup

1. **Create Razorpay Account**:
   - Go to [razorpay.com](https://razorpay.com)
   - Sign up and complete KYC

2. **Get API Keys**:
   - Go to Settings → API Keys
   - Generate Test/Live keys
   - Copy Key ID and Key Secret

3. **Configure Webhooks** (Optional):
   - Go to Settings → Webhooks
   - Add webhook URL: `https://your-domain.vercel.app/api/razorpay/webhook`

### Cloudinary Setup

1. **Create Cloudinary Account**:
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for free account

2. **Get Credentials**:
   - Go to Dashboard
   - Copy Cloud Name, API Key, and API Secret

3. **Configure Upload Presets** (Optional):
   - Go to Settings → Upload
   - Create upload presets for better control

## 🎯 Vercel Project Settings

### Build & Development Settings
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

### Node.js Version
```
Node.js Version: 18.x
```

### Environment Variables
- Set all environment variables in Vercel dashboard
- Use different values for Preview and Production environments
- Keep sensitive keys secure

## 🛡️ Security Best Practices

### Environment Variables
- ✅ Never commit `.env.local` to Git
- ✅ Use different keys for development and production
- ✅ Rotate API keys regularly
- ✅ Use strong admin passwords

### Database Security
- ✅ Use MongoDB Atlas with authentication
- ✅ Restrict IP access when possible
- ✅ Use read/write permissions only

### Payment Security
- ✅ Use Razorpay's test mode during development
- ✅ Implement proper webhook verification
- ✅ Log all payment transactions

## 🔄 Deployment Process

### Automatic Deployments
- Every push to `main` branch triggers deployment
- Preview deployments for pull requests
- Branch deployments for feature branches

### Manual Deployments
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

## 📊 Performance Optimization

### Next.js Configuration
- ✅ Image optimization enabled
- ✅ API routes optimized
- ✅ Static generation where possible
- ✅ ISR for dynamic content

### Vercel Features
- ✅ Edge Functions for global performance
- ✅ CDN for static assets
- ✅ Automatic HTTPS
- ✅ Custom domains support

## 🐛 Troubleshooting

### Common Issues

**Build Failures**:
- Check all environment variables are set
- Verify MongoDB connection string
- Ensure all dependencies are listed in package.json

**Runtime Errors**:
- Check Vercel function logs
- Verify API endpoints are working
- Test database connectivity

**Payment Issues**:
- Verify Razorpay keys are correct
- Check webhook URLs
- Test with Razorpay test cards

### Debugging

**Vercel Logs**:
```bash
vercel logs --follow
```

**Local Testing**:
```bash
vercel dev
```

## 📈 Monitoring

### Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Monitor Core Web Vitals
- Track user interactions

### Error Tracking
- Integrate Sentry for error tracking
- Monitor API response times
- Set up alerts for critical errors

## 🎉 Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify API endpoints work
- [ ] Test payment flow end-to-end
- [ ] Check email notifications
- [ ] Test admin panel functionality
- [ ] Verify image uploads work
- [ ] Test mobile responsiveness
- [ ] Check SEO meta tags
- [ ] Monitor performance scores

## 🌐 Custom Domain Setup

1. **Purchase Domain**: Buy domain from registrar
2. **Add to Vercel**: Project Settings → Domains
3. **Configure DNS**: Add CNAME record to registrar
4. **SSL Certificate**: Automatic via Vercel
5. **Update Environment**: Update email settings for custom domain

Your Balgopaal Vastram e-commerce platform is now ready for production! 🎉
