import { 
  FaMoneyBillWave, FaShoppingCart, FaBoxes, FaChartLine, 
  FaPercentage, FaTruck, FaExclamationTriangle, FaArrowUp, 
  FaArrowDown, FaBox, FaShippingFast, FaUserClock, FaChartPie,
  FaMoneyBillAlt, FaCalendarAlt
} from 'react-icons/fa';

const SalesSummary = ({ orders }) => {
  // Existing calculations
  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const totalProductsSold = orders.reduce((sum, order) => 
    sum + order.products.reduce((pSum, product) => pSum + product.quantity, 0), 0);
  const fulfillmentRate = orders.length > 0 
    ? ((deliveredOrders / totalOrders) * 100).toFixed(1)
    : 0;

  // New calculations
  const processingOrders = orders.filter(order => order.status === 'processing').length;
  const shippedOrders = orders.filter(order => order.status === 'shipped').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
  
  // Calculate average order value
  const avgOrderValue = totalOrders > 0 
    ? (totalSales / totalOrders).toFixed(2)
    : 0;

  // Get orders from last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentOrders = orders.filter(order => new Date(order.createdAt) > thirtyDaysAgo);
  const recentSales = recentOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Calculate cancellation rate
  const cancellationRate = totalOrders > 0
    ? ((cancelledOrders / totalOrders) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-4 space-y-6 h-screen">
      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <div className="stats shadow bg-primary text-primary-content">
          <div className="stat">
            <div className="stat-figure text-primary-content">
              <FaMoneyBillWave className="w-8 h-8" />
            </div>
            <div className="stat-title text-primary-content">Total Revenue</div>
            <div className="stat-value text-primary-content">${totalSales.toFixed(2)}</div>
            <div className="stat-desc flex items-center gap-1 text-primary-content">
              <FaArrowUp className="text-success" />
              Last 30 days: ${recentSales.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="stats shadow bg-secondary text-secondary-content">
          <div className="stat">
            <div className="stat-figure">
              <FaShoppingCart className="w-8 h-8" />
            </div>
            <div className="stat-title text-primary-content">Total Orders</div>
            <div className="stat-value text-secondary-content">{totalOrders}</div>
            <div className="stat-desc text-secondary-content">Lifetime orders</div>
          </div>
        </div>

        <div className="stats shadow bg-accent text-accent-content">
          <div className="stat">
            <div className="stat-figure">
              <FaMoneyBillAlt className="w-8 h-8" />
            </div>
            <div className="stat-title text-primary-content">Avg. Order Value</div>
            <div className="stat-value text-accent-content">${avgOrderValue}</div>
            <div className="stat-desc text-accent-content">Per order revenue</div>
          </div>
        </div>

        <div className="stats shadow bg-info text-info-content">
          <div className="stat">
            <div className="stat-figure">
              <FaBoxes className="w-8 h-8" />
            </div>
            <div className="stat-title text-primary-content">Products Sold</div>
            <div className="stat-value text-info-content">{totalProductsSold}</div>
            <div className="stat-desc text-info-content">Total units</div>
          </div>
        </div>
      </div>

      {/* Middle Row - Order Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-warning">
              <FaUserClock className="w-6 h-6" />
            </div>
            <div className="stat-title text-warning">Pending</div>
            <div className="stat-value text-warning">{pendingOrders}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-info">
              <FaBox className="w-6 h-6" />
            </div>
            <div className="stat-title text-info">Processing</div>
            <div className="stat-value text-info">{processingOrders}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaShippingFast className="w-6 h-6" />
            </div>
            <div className="stat-title text-primary">Shipped</div>
            <div className="stat-value text-primary">{shippedOrders}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-success">
              <FaTruck className="w-6 h-6" />
            </div>
            <div className="stat-title text-success">Delivered</div>
            <div className="stat-value text-success">{deliveredOrders}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-error">
              <FaExclamationTriangle className="w-6 h-6" />
            </div>
            <div className="stat-title text-error">Cancelled</div>
            <div className="stat-value text-error">{cancelledOrders}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <FaCalendarAlt className="w-6 h-6" />
            </div>
            <div className="stat-title text-secondary">Recent</div>
            <div className="stat-value text-secondary">{recentOrders.length}</div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stats shadow bg-base-200">
          <div className="stat">
            <div className="stat-figure text-success">
              <FaChartLine className="w-8 h-8" />
            </div>
            <div className="stat-title text-success">Fulfillment Rate</div>
            <div className="stat-value text-success">{fulfillmentRate}%</div>
            <div className="stat-desc">Orders delivered successfully</div>
          </div>
        </div>

        <div className="stats shadow bg-base-200">
          <div className="stat">
            <div className="stat-figure text-error">
              <FaChartPie className="w-8 h-8" />
            </div>
            <div className="stat-title text-error">Cancellation Rate</div>
            <div className="stat-value text-error">{cancellationRate}%</div>
            <div className="stat-desc">Orders cancelled</div>
          </div>
        </div>

        <div className="stats shadow bg-base-200">
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaPercentage className="w-8 h-8" />
            </div>
            <div className="stat-title text-primary">Processing Rate</div>
            <div className="stat-value text-primary">
              {totalOrders > 0 ? ((processingOrders / totalOrders) * 100).toFixed(1) : 0}%
            </div>
            <div className="stat-desc">Orders being processed</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;