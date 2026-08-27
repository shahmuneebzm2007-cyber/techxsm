const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendOrderConfirmation = async (order) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('[Email Mock] Order confirmation for order:', order.orderID);
    return;
  }
  
  const mailOptions = {
    from: `"TechXSM" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: order.user.email,
    subject: `Order Confirmation - ${order.orderID}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Your order <strong>${order.orderID}</strong> has been confirmed.</p>
      <p>Total Amount: Rs ${order.totalAmount?.toLocaleString('en-PK')}</p>
      <p>Payment Method: Cash on Delivery</p>
      <h3>Shipping Address:</h3>
      <p>${order.shippingAddress.fullName}<br/>
      ${order.shippingAddress.street}, ${order.shippingAddress.city}<br/>
      ${order.shippingAddress.state}, ${order.shippingAddress.pincode}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent to', order.user.email);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};

const sendShippingNotification = async (order, tracking) => {
  const transporter = createTransporter();
  if (!transporter) {
    console.log('[Email Mock] Shipping notification for order:', order.orderID);
    return;
  }
  
  const mailOptions = {
    from: `"TechXSM" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: order.user.email,
    subject: `Your order ${order.orderID} has been shipped!`,
    html: `
      <h1>Order Shipped</h1>
      <p>Good news! Your order <strong>${order.orderID}</strong> is on its way.</p>
      <p>Courier: ${tracking.courierName}</p>
      <p>Tracking ID: ${tracking.courierTrackingId}</p>
      <p>You can track your order using this internal ID: <strong>${tracking.trackingID}</strong></p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Shipping notification email sent to', order.user.email);
  } catch (error) {
    console.error('Error sending shipping notification email:', error);
  }
};

module.exports = {
  sendOrderConfirmation,
  sendShippingNotification
};
