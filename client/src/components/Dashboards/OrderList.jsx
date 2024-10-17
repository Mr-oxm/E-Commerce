const OrderList = ({ orders }) => {
    return (
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.status}</td>
                <td>${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

export default OrderList;
  