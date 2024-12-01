const Payment = require('../models/Payment');
const Order = require('../models/Order');
const paypal = require('../config/paypal');

exports.createPayPalPayment = async (req, res) => {
  try {
    const { products, shippingAddress, phoneNumber } = req.body;
    
    // Calculate total amount
    let totalAmount = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Create payment in database
    const payment = await Payment.create({
      amount: totalAmount,
      method: 'credit',
      status: 'pending'
    });

    // Create PayPal payment
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal"
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/cart`,
        cancel_url: `${process.env.CLIENT_URL}/cart`
      },
      transactions: [{
        amount: {
          currency: "USD",
          total: totalAmount.toString()
        },
        description: "Payment for your order"
      }]
    };

    paypal.payment.create(create_payment_json, async function (error, paypalPayment) {
      if (error) {
        throw error;
      } else {
        // Update payment with PayPal ID
        payment.paypalPaymentId = paypalPayment.id;
        await payment.save();

        // Find approval URL
        const approvalUrl = paypalPayment.links.find(link => link.rel === "approval_url").href;

        res.json({
          success: true,
          paymentId: payment._id,
          approvalUrl
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.executePayPalPayment = async (req, res) => {
  try {
    const { paymentId, PayerID } = req.query;
    const payment = await Payment.findOne({ paypalPaymentId: paymentId });

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        error: 'Payment not found',
        debug: { paymentId, PayerID }
      });
    }

    const execute_payment_json = {
      payer_id: PayerID,
      transactions: [{
        amount: {
          currency: "USD",
          total: payment.amount.toString()
        }
      }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, paypalPayment) {
      if (error) {
        payment.status = 'failed';
        await payment.save();
        throw error;
      } else {
        payment.status = 'completed';
        payment.paypalOrderId = paypalPayment.id;
        await payment.save();

        res.json({
          success: true,
          payment
        });
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      debug: { query: req.query }
    });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPaymentByPayPalId = async (req, res) => {
  try {
    const payment = await Payment.findOne({ paypalPaymentId: req.params.paypalPaymentId });
    
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
