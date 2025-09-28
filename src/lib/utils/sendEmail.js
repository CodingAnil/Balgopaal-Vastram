import sgMail from '@sendgrid/mail'

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Email configuration
const FROM_EMAIL = process.env.FROM_EMAIL
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

/**
 * Send order confirmation emails
 * @param {string} type - 'user' or 'admin'
 * @param {object} orderData - Order data object
 * @returns {Promise<boolean>} - Success status
 */
export async function sendOrderEmail(type, orderData) {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured. Skipping email sending.')
      return false
    }

    if (!FROM_EMAIL || !ADMIN_EMAIL) {
      console.warn('Email configuration incomplete. Skipping email sending.')
      return false
    }

    let emailData

    if (type === 'user') {
      emailData = {
        to: orderData.user.email,
        from: FROM_EMAIL,
        subject: 'Your order has been placed successfully!',
        html: generateUserEmailHTML(orderData),
        text: generateUserEmailText(orderData),
      }
    } else if (type === 'admin') {
      emailData = {
        to: ADMIN_EMAIL,
        from: FROM_EMAIL,
        subject: 'New Order Received - Please Process',
        html: generateAdminEmailHTML(orderData),
        text: generateAdminEmailText(orderData),
      }
    } else {
      throw new Error('Invalid email type. Must be "user" or "admin"')
    }

    await sgMail.send(emailData)
    console.log(
      `${type} email sent successfully for order ${orderData.orderId}`
    )
    return true
  } catch (error) {
    console.error(
      `Failed to send ${type} email for order ${orderData.orderId}:`,
      error
    )

    // Log detailed error for debugging
    if (error.response && error.response.body) {
      console.error('SendGrid error details:', error.response.body)
    }

    return false
  }
}

/**
 * Generate HTML email template for user
 */
function generateUserEmailHTML(orderData) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #059669, #16a34a); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 30px; }
        .order-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .order-info h3 { margin: 0 0 15px 0; color: #1f2937; font-size: 18px; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-weight: bold; color: #6b7280; }
        .info-value { color: #1f2937; }
        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .products-table th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; color: #374151; border-bottom: 2px solid #d1d5db; }
        .products-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .products-table tr:hover { background: #f9fafb; }
        .total-section { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .total-final { font-size: 20px; font-weight: bold; color: #059669; border-top: 2px solid #059669; padding-top: 10px; }
        .footer { background: #1f2937; color: white; padding: 30px; text-align: center; }
        .contact-info { margin: 20px 0; }
        .contact-info h4 { color: #fbbf24; margin: 0 0 10px 0; }
        @media (max-width: 600px) {
          .container { margin: 0; border-radius: 0; }
          .content { padding: 20px; }
          .info-row { flex-direction: column; }
          .info-label { margin-bottom: 5px; }
          .products-table { font-size: 14px; }
          .products-table th, .products-table td { padding: 8px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🕉️ Balgopaal Vastram</h1>
          <p>Order Confirmation</p>
        </div>
        
        <div class="content">
          <h2>Dear ${orderData.user.name},</h2>
          <p>Thank you for your order! We're excited to prepare your devotional items for Laddu Gopal.</p>
          
          <div class="order-info">
            <h3>📋 Order Details</h3>
            <div class="info-row">
              <span class="info-label">Order ID:</span>
              <span class="info-value">${orderData.orderId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Order Date:</span>
              <span class="info-value">${formatDate(orderData.createdAt || orderData.date)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">${orderData.paymentMethod || 'Online Payment'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Status:</span>
              <span class="info-value" style="color: #059669; font-weight: bold;">✅ Confirmed</span>
            </div>
          </div>

          <h3>🛍️ Products Ordered</h3>
          <table class="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Color</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.size}</td>
                  <td>${item.color}</td>
                  <td>${item.quantity}</td>
                  <td>${formatPrice(item.price)}</td>
                  <td>${formatPrice(item.price * item.quantity)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatPrice(orderData.subtotal)}</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>${orderData.shipping === 0 ? 'Free' : formatPrice(orderData.shipping)}</span>
            </div>
            <div class="total-row total-final">
              <span>Total Amount:</span>
              <span>${formatPrice(orderData.total)}</span>
            </div>
          </div>

          <div class="order-info">
            <h3>📦 Shipping Details</h3>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${orderData.user.email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${orderData.user.phone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Address:</span>
              <span class="info-value">${orderData.user.address || `${orderData.user.city}, ${orderData.user.state} - ${orderData.user.pincode}`}</span>
            </div>
          </div>

          <p style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #059669;">
            <strong>🙏 Your order will be delivered in a few days. Thank you for shopping with Balgopaal Vastram!</strong>
          </p>
        </div>

        <div class="footer">
          <div class="contact-info">
            <h4>📞 Contact Us</h4>
            <p>Email: balgopaal111@gmail.com</p>
            <p>Phone: +91 9253430371</p>
            <p>Address: Mathura, Uttar Pradesh, India</p>
          </div>
          <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate HTML email template for admin
 */
function generateAdminEmailHTML(orderData) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order - Admin Notification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 30px; }
        .alert-box { background: #fef2f2; border: 2px solid #fecaca; color: #991b1b; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .order-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .order-info h3 { margin: 0 0 15px 0; color: #1f2937; font-size: 18px; }
        .info-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-row:last-child { border-bottom: none; }
        .info-label { font-weight: bold; color: #6b7280; flex: 1; }
        .info-value { color: #1f2937; flex: 2; }
        .customer-section { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .products-table th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; color: #374151; border-bottom: 2px solid #d1d5db; }
        .products-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .products-table tr:hover { background: #f9fafb; }
        .total-section { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .total-final { font-size: 20px; font-weight: bold; color: #dc2626; border-top: 2px solid #dc2626; padding-top: 10px; }
        .action-required { background: #dc2626; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .footer { background: #1f2937; color: white; padding: 20px; text-align: center; }
        @media (max-width: 600px) {
          .container { margin: 0; border-radius: 0; }
          .content { padding: 20px; }
          .info-row { flex-direction: column; }
          .info-label { margin-bottom: 5px; }
          .products-table { font-size: 14px; }
          .products-table th, .products-table td { padding: 8px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Order Alert</h1>
          <p>Admin Notification - Action Required</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            <strong>🔔 New Order Received!</strong><br>
            Customer <strong>${orderData.user.name}</strong> has placed a new order.
          </div>
          
          <div class="order-info">
            <h3>📋 Order Information</h3>
            <div class="info-row">
              <span class="info-label">Order ID:</span>
              <span class="info-value"><strong>${orderData.orderId}</strong></span>
            </div>
            <div class="info-row">
              <span class="info-label">Order Date:</span>
              <span class="info-value">${formatDate(orderData.createdAt || orderData.date)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Method:</span>
              <span class="info-value">${orderData.paymentMethod || 'Online Payment'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Payment Status:</span>
              <span class="info-value" style="color: #059669; font-weight: bold;">✅ Confirmed</span>
            </div>
            <div class="info-row">
              <span class="info-label">Total Amount:</span>
              <span class="info-value" style="color: #dc2626; font-weight: bold; font-size: 18px;">${formatPrice(orderData.total)}</span>
            </div>
          </div>

          <div class="customer-section">
            <h3>👤 Customer Details</h3>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value">${orderData.user.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${orderData.user.email}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone:</span>
              <span class="info-value">${orderData.user.phone}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Address:</span>
              <span class="info-value">${orderData.user.address || `${orderData.user.city}, ${orderData.user.state} - ${orderData.user.pincode}`}</span>
            </div>
          </div>

          <h3>🛍️ Products Ordered</h3>
          <table class="products-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Size</th>
                <th>Color</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items
                .map(
                  (item) => `
                <tr>
                  <td><strong>${item.name}</strong></td>
                  <td>${item.size}</td>
                  <td>${item.color}</td>
                  <td>${item.quantity}</td>
                  <td>${formatPrice(item.price)}</td>
                  <td><strong>${formatPrice(item.price * item.quantity)}</strong></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatPrice(orderData.subtotal)}</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>${orderData.shipping === 0 ? 'Free' : formatPrice(orderData.shipping)}</span>
            </div>
            <div class="total-row total-final">
              <span>Total Amount:</span>
              <span>${formatPrice(orderData.total)}</span>
            </div>
          </div>

          <div class="action-required">
            <h3 style="margin: 0 0 10px 0;">⚡ Action Required</h3>
            <p style="margin: 0; font-size: 16px;"><strong>Please arrange delivery for this order.</strong></p>
          </div>
        </div>

        <div class="footer">
          <p style="margin: 0; font-size: 14px;">
            This is an automated admin notification from Balgopaal Vastram ordering system.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate plain text email for user
 */
function generateUserEmailText(orderData) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  let text = `BALGOPAAL VASTRAM - Order Confirmation\n\n`
  text += `Dear ${orderData.user.name},\n\n`
  text += `Thank you for your order! We're excited to prepare your devotional items for Laddu Gopal.\n\n`

  text += `ORDER DETAILS:\n`
  text += `Order ID: ${orderData.orderId}\n`
  text += `Order Date: ${formatDate(orderData.createdAt || orderData.date)}\n`
  text += `Payment Method: ${orderData.paymentMethod || 'Online Payment'}\n`
  text += `Payment Status: Confirmed\n\n`

  text += `PRODUCTS ORDERED:\n`
  orderData.items.forEach((item, index) => {
    text += `${index + 1}. ${item.name}\n`
    text += `   Size: ${item.size}, Color: ${item.color}, Quantity: ${item.quantity}\n`
    text += `   Price: ${formatPrice(item.price)} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}\n\n`
  })

  text += `ORDER SUMMARY:\n`
  text += `Subtotal: ${formatPrice(orderData.subtotal)}\n`
  text += `Shipping: ${orderData.shipping === 0 ? 'Free' : formatPrice(orderData.shipping)}\n`
  text += `Total Amount: ${formatPrice(orderData.total)}\n\n`

  text += `SHIPPING DETAILS:\n`
  text += `Email: ${orderData.user.email}\n`
  text += `Phone: ${orderData.user.phone}\n`
  text += `Address: ${orderData.user.address || `${orderData.user.city}, ${orderData.user.state} - ${orderData.user.pincode}`}\n\n`

  text += `Your order will be delivered in a few days. Thank you for shopping with Balgopaal Vastram!\n\n`

  text += `CONTACT US:\n`
  text += `Email: balgopaal111@gmail.com\n`
  text += `Phone: +91 9253430371\n`
  text += `Address: Mathura, Uttar Pradesh, India\n\n`

  text += `This is an automated email. Please do not reply to this email.`

  return text
}

/**
 * Generate plain text email for admin
 */
function generateAdminEmailText(orderData) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  let text = `NEW ORDER ALERT - ADMIN NOTIFICATION\n\n`
  text += `A new order has been received from customer ${orderData.user.name}.\n\n`

  text += `ORDER INFORMATION:\n`
  text += `Order ID: ${orderData.orderId}\n`
  text += `Order Date: ${formatDate(orderData.createdAt || orderData.date)}\n`
  text += `Payment Method: ${orderData.paymentMethod || 'Online Payment'}\n`
  text += `Payment Status: Confirmed\n`
  text += `Total Amount: ${formatPrice(orderData.total)}\n\n`

  text += `CUSTOMER DETAILS:\n`
  text += `Name: ${orderData.user.name}\n`
  text += `Email: ${orderData.user.email}\n`
  text += `Phone: ${orderData.user.phone}\n`
  text += `Address: ${orderData.user.address || `${orderData.user.city}, ${orderData.user.state} - ${orderData.user.pincode}`}\n\n`

  text += `PRODUCTS ORDERED:\n`
  orderData.items.forEach((item, index) => {
    text += `${index + 1}. ${item.name}\n`
    text += `   Size: ${item.size}, Color: ${item.color}, Quantity: ${item.quantity}\n`
    text += `   Unit Price: ${formatPrice(item.price)}\n`
    text += `   Total: ${formatPrice(item.price * item.quantity)}\n\n`
  })

  text += `ORDER SUMMARY:\n`
  text += `Subtotal: ${formatPrice(orderData.subtotal)}\n`
  text += `Shipping: ${orderData.shipping === 0 ? 'Free' : formatPrice(orderData.shipping)}\n`
  text += `Total Amount: ${formatPrice(orderData.total)}\n\n`

  text += `ACTION REQUIRED: Please arrange delivery for this order.\n\n`

  text += `This is an automated admin notification from Balgopaal Vastram ordering system.`

  return text
}

export default { sendOrderEmail }
