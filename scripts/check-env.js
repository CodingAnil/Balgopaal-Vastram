#!/usr/bin/env node

/**
 * Environment Variables Check Script
 * This script validates that all required environment variables are set
 * Run this before deployment to ensure all services will work correctly
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'NEXT_PUBLIC_RAZORPAY_KEY_ID',
  'SENDGRID_API_KEY',
  'FROM_EMAIL',
  'ADMIN_EMAIL',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'ADMIN_PASSWORD',
]

const optionalEnvVars = ['NEXT_PUBLIC_SITE_URL', 'SITE_URL', 'NODE_ENV']

console.log('🔍 Checking environment variables...\n')

let hasAllRequired = true
const missing = []
const present = []

// Check required variables
requiredEnvVars.forEach((varName) => {
  if (process.env[varName]) {
    present.push(varName)
    console.log(`✅ ${varName}`)
  } else {
    missing.push(varName)
    console.log(`❌ ${varName} - MISSING`)
    hasAllRequired = false
  }
})

console.log('\n📋 Optional variables:')
optionalEnvVars.forEach((varName) => {
  if (process.env[varName]) {
    console.log(`✅ ${varName}`)
  } else {
    console.log(`⚠️  ${varName} - Not set (optional)`)
  }
})

console.log('\n📊 Summary:')
console.log(
  `✅ Required variables present: ${present.length}/${requiredEnvVars.length}`
)
if (missing.length > 0) {
  console.log(`❌ Missing required variables: ${missing.length}`)
  console.log(`   ${missing.join(', ')}`)
}

if (hasAllRequired) {
  console.log('\n🎉 All required environment variables are set!')
  console.log('✅ Ready for deployment!')
  process.exit(0)
} else {
  console.log('\n⚠️  Some required environment variables are missing.')
  console.log('📝 Please set them in your deployment environment.')
  console.log('\n📖 For more information, see:')
  console.log('   - VERCEL_DEPLOYMENT.md')
  console.log('   - .env.example')
  process.exit(1)
}
