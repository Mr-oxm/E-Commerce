const PaymentMethod = ({ paymentMethod, setPaymentMethod }) => (
  <div className="form-control w-full">
    <label className="label">
      <span className="label-text font-semibold">Payment Method</span>
    </label>
    <div className="flex gap-4">
      <label className="label cursor-pointer justify-start gap-2">
        <input
          type="radio"
          name="payment"
          className="radio"
          value="cash"
          checked={paymentMethod === 'cash'}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        <span className="label-text">Cash on Delivery</span>
      </label>
      <label className="label cursor-pointer justify-start gap-2">
        <input
          type="radio"
          name="payment"
          className="radio"
          value="credit"
          checked={paymentMethod === 'credit'}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        <span className="label-text">Credit Card</span>
      </label>
    </div>
  </div>
);

export default PaymentMethod;
