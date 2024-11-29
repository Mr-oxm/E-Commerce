import { FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-base-200">
    <FaShoppingCart className="text-9xl mb-4 text-base-content opacity-20" />
    <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
    <p className="text-base-content opacity-60 mb-4">Looks like you haven't added any items to your cart yet.</p>
    <Link to="/" className="btn btn-primary">
      Start Shopping
    </Link>
  </div>
);

export default EmptyCart;
