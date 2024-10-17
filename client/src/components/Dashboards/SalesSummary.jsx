const SalesSummary = ({ orders }) => {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
  
    return (
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Total Sales</div>
          <div className="stat-value">${totalSales.toFixed(2)}</div>
        </div>
        
        <div className="stat">
          <div className="stat-title">Total Orders</div>
          <div className="stat-value">{totalOrders}</div>
        </div>
      </div>
    );
  };

export default SalesSummary;