// const paypal = require('paypal-rest-sdk');
// require('dotenv').config();
// // Configure PayPal
// paypal.configure({
//   mode: 'sandbox', // Change to 'live' for production
//   client_id: process.env.PAYPAL_CLIENT_ID,
//   client_secret: process.env.PAYPAL_CLIENT_SECRET
// });

// const createPayPalPayment = (orderData) => {
//   console.log('Creating PayPal payment with orderData:', orderData);

//   const create_payment_json = {
//     intent: "sale",
//     payer: {
//       payment_method: "paypal"
//     },
//     redirect_urls: {
//       return_url: `${process.env.CLIENT_URL}/thank-you`,
//       cancel_url: `${process.env.CLIENT_URL}/cart`
//     },
//     transactions: [{
//       item_list: {
//         items: orderData.products.map(item => ({
//           name: item.product.name || 'Product',
//           sku: item.product._id.toString(),
//           price: (item.price),
//           currency: "USD",
//           quantity: item.quantity
//         }))
//       },
//       amount: {
//         currency: "USD",
//         total: (orderData.totalAmount),
//         details: {
//           subtotal: (orderData.totalAmount),
//           shipping: "0.00",
//           tax: "0.00"
//         }
//       },
//       description: "Purchase from Your Store Name"
//     }]
//   };

//   return new Promise((resolve, reject) => {
//     paypal.payment.create(create_payment_json, function (error, payment) {
//       if (error) {
//         console.error('PayPal create payment error:', error);
//         reject(error);
//       } else {
//         const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
//         if (approvalUrl) {
//           resolve({ paymentId: payment.id, approvalUrl: approvalUrl.href });
//         } else {
//           reject(new Error('No approval URL found'));
//         }
//       }
//     });
//   });
// };

// const executePayPalPayment = (paymentId, payerId, amount) => {
//   const execute_payment_json = {
//     payer_id: payerId,
//     transactions: [{
//       amount: {
//         currency: "USD",
//         total: amount.toString()
//       }
//     }]
//   };

//   return new Promise((resolve, reject) => {
//     paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve(payment);
//       }
//     });
//   });
// };

// module.exports = {
//   createPayPalPayment,
//   executePayPalPayment
// };
