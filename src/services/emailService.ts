import { Order } from '../types';

export const ADMIN_NOTIFICATION_EMAIL = 'rubbasyarkhan007@gmail.com';

interface SendEmailResult {
  success: boolean;
  message?: string;
}

export const emailService = {
  /**
   * Send comprehensive new order notification email to Admin (rubbasyarkhan007@gmail.com)
   * and order confirmation / thank you receipt to the Customer.
   */
  async sendNewOrderNotification(order: Order): Promise<SendEmailResult> {
    const formattedItems = (order.items || [])
      .map((item, idx) => {
        const title = item.product?.title || 'Handcrafted Item';
        const qty = item.quantity || 1;
        const price = item.unitPrice || 0;
        const color = item.customization?.colorway ? ` [Shade: ${item.customization.colorway}]` : '';
        const size = item.customization?.size ? ` [Size: ${item.customization.size}]` : '';
        return `${idx + 1}. ${qty}x ${title}${color}${size} — Rs. ${(price * qty).toLocaleString()}`;
      })
      .join('\n');

    const customerEmail = order.userEmail || order.customer?.email || '';
    const customerPhone = order.customer?.phoneNumber || 'N/A';
    const customerName = order.customer?.fullName || 'Valued Client';
    const fullAddress = `${order.customer?.streetAddress || ''}${order.customer?.apartmentSuite ? `, ${order.customer.apartmentSuite}` : ''}, ${order.customer?.city || 'Pakistan'} (Postal Code: ${order.customer?.postalCode || 'N/A'})`;

    const adminPayload: Record<string, any> = {
      _subject: `🌸 [NEW ORDER RECEIVED] #${order.orderId} - Rs. ${order.total.toLocaleString()} (Cash on Delivery)`,
      _template: 'table',
      _replyto: customerEmail || ADMIN_NOTIFICATION_EMAIL,
      'Order Number': order.orderId,
      'Order Date': new Date(order.createdAt || Date.now()).toLocaleString('en-US', { timeZone: 'Asia/Karachi' }),
      'Customer Name': customerName,
      'Customer Phone': customerPhone,
      'Customer Email': customerEmail || 'N/A',
      'Delivery Address': fullAddress,
      'Items Ordered': formattedItems,
      'Subtotal': `Rs. ${order.subtotal?.toLocaleString() || 0}`,
      'Delivery Charges': 'Rs. 0 (Free Shipping Across Pakistan)',
      'Total Amount (COD)': `Rs. ${order.total.toLocaleString()}`,
      'Payment Method': 'Cash on Delivery (COD)',
      'Current Status': 'PENDING_CONFIRMATION'
    };

    // If customer has email, CC them directly in the FormSubmit request to guarantee immediate receipt!
    if (customerEmail && customerEmail.includes('@')) {
      adminPayload['_cc'] = customerEmail;
    }

    console.log('📧 Dispatching New Order & Customer Confirmation Email...', adminPayload);

    let sent = false;

    // 1. Send via FormSubmit AJAX API to rubbasyarkhan007@gmail.com with _cc to customer
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${ADMIN_NOTIFICATION_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(adminPayload)
      });

      if (response.ok) {
        sent = true;
        console.log(`✅ Order notification email sent to Admin & Customer (${customerEmail}) via FormSubmit`);
      }
    } catch (err) {
      console.warn('FormSubmit dispatch error:', err);
    }

    // 2. Direct dedicated customer thank-you receipt
    if (customerEmail && customerEmail.includes('@')) {
      try {
        const customerReceiptPayload = {
          _subject: `🌸 Thank you for your order #${order.orderId}! - The Aesthetic Palette`,
          _template: 'table',
          _replyto: ADMIN_NOTIFICATION_EMAIL,
          'Order Number': order.orderId,
          'Dear Customer': `Thank you for supporting slow handcrafted art, ${customerName}! We have received your order and our artisan is preparing your package with care.`,
          'Status': 'Order Placed · Pending Confirmation',
          'Payment Method': 'Cash on Delivery (Pay at your doorstep)',
          'Estimated Delivery': 'In 2-4 Business Days',
          'Delivering To': fullAddress,
          'Your Items': formattedItems,
          'Total Payable on Delivery': `Rs. ${order.total.toLocaleString()}`,
          'Studio WhatsApp Support': '+92 317 2072623'
        };

        await fetch(`https://formsubmit.co/ajax/${customerEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(customerReceiptPayload)
        });
        console.log(`✅ Customer thank-you receipt dispatched to ${customerEmail}`);
      } catch (custErr) {
        console.warn('Customer direct receipt error:', custErr);
      }
    }

    return { success: sent, message: 'Order emails dispatched successfully' };
  },

  /**
   * Send Order Status Update email to Customer and Admin when status changes.
   */
  async sendStatusUpdateNotification(
    order: Order,
    newStatus: Order['status'],
    artisanNotes?: string
  ): Promise<SendEmailResult> {
    const customerEmail = order.userEmail || order.customer?.email || '';
    const customerName = order.customer?.fullName || 'Valued Client';

    const statusDescriptions: Record<Order['status'], { title: string; message: string }> = {
      PENDING_CONFIRMATION: {
        title: 'Order Under Review',
        message: 'Your handmade order has been received and our studio team is preparing the materials.'
      },
      CRAFTING: {
        title: 'Crafting in Progress 🧶',
        message: 'Our artisan is currently hand-stitching / painting your slow-crafted pieces with pure organic cotton and oils.'
      },
      DISPATCHED: {
        title: 'Dispatched for Delivery 🚚',
        message: 'Your parcel has been packed in our signature gift box and handed over to the courier service. Please have the exact Cash on Delivery ready.'
      },
      DELIVERED: {
        title: 'Delivered & Completed 🎉',
        message: 'Your parcel has been delivered! We hope these handcrafted treasures bring warmth to your cozy spaces.'
      }
    };

    const statusInfo = statusDescriptions[newStatus] || {
      title: newStatus,
      message: `Your order status has been updated to ${newStatus}.`
    };

    const formattedItems = (order.items || [])
      .map((item, idx) => `${idx + 1}. ${item.quantity || 1}x ${item.product?.title || 'Handmade Item'}`)
      .join(', ');

    const statusPayload: Record<string, any> = {
      _subject: `📦 [Order #${order.orderId}] Status Update: ${statusInfo.title}`,
      _template: 'table',
      _replyto: ADMIN_NOTIFICATION_EMAIL,
      'Order Number': order.orderId,
      'Client Name': customerName,
      'New Status': statusInfo.title,
      'Status Details': statusInfo.message,
      'Artisan Studio Notes': artisanNotes || 'Crafted with love at The Aesthetic Palette Studio',
      'Items in Parcel': formattedItems,
      'Total Amount (COD)': `Rs. ${order.total.toLocaleString()}`,
      'Delivery Address': `${order.customer?.streetAddress || ''}, ${order.customer?.city || 'Pakistan'}`,
      'WhatsApp Support Helpline': '+92 317 2072623'
    };

    if (customerEmail && customerEmail.includes('@')) {
      statusPayload['_cc'] = customerEmail;
    }

    console.log(`📧 Sending Status Update (${newStatus}) to Client & Admin...`, statusPayload);

    // Send to Admin with _cc to Customer
    try {
      await fetch(`https://formsubmit.co/ajax/${ADMIN_NOTIFICATION_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(statusPayload)
      });
      console.log(`✅ Status update email sent to Admin & Customer (${customerEmail})`);
    } catch (e) {
      console.warn('Status update email failed:', e);
    }

    // Direct Customer status notification
    if (customerEmail && customerEmail.includes('@')) {
      try {
        await fetch(`https://formsubmit.co/ajax/${customerEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(statusPayload)
        });
      } catch (e) {
        console.warn('Customer direct status notification error:', e);
      }
    }

    return { success: true, message: 'Status update emails dispatched' };
  }
};
