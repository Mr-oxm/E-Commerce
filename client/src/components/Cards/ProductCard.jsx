import { FaShoppingCart, FaStar, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useShoppingCart } from '../../context/ShoppingCartContext';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useShoppingCart();
  const isInCart = cartItems.some(item => item._id === product._id);
  const averageRating = product.ratings.length > 0
    ? (product.ratings.reduce((sum, rating) => sum + rating.rating, 0) / product.ratings.length).toFixed(1)
    : 'No ratings';

  const isDisabled = product.hasVariations || product.stock === 0;
  
  return (
    <div className="card w-full bg-base-100 border border-transparent hover:border-primary transition-all duration-300" >
        <Link to={`/product/${product._id}`}>
            <figure>
                <img src={product.images[0]} alt={product.name} className="h-48 w-full object-contain" />
            </figure>
        </Link>
        <div className="card-body">
            <Link to={`/product/${product._id}`}>
                <h2 className="card-title text-base-content hover:text-primary ease-in-out transition-all truncate">{product.name}</h2>
            </Link >
            <p className="text-gray-600 text-sm mb-2 truncate">
                {product.description}
            </p>
            <div className="flex items-center mb-2">
                <FaStar className="text-yellow-400 mr-1" />
                <span>
                  {averageRating}
                </span>
            </div>
            <div className="flex gap-4 justify-between items-center">
                <span className="text-xl font-bold flex-1 truncate">
                  {product.hasVariations ? `From $${product.basePrice.toFixed(2)}` : `$${product.price.toFixed(2)}`}
                </span>
                <button 
                  className={`btn ${isInCart ? 'btn-accent' : isDisabled ? 'btn-disabled' : 'btn-primary'}`} 
                  onClick={() => !isDisabled && addToCart(product)}
                  disabled={isInCart || isDisabled}
                  title={product.hasVariations ? 'Select options on product page' : product.stock === 0 ? 'Out of stock' : ''}
                >
                  {isInCart ? <FaCheck /> : 
                   product.stock === 0 ? 'Out of Stock' :
                   product.hasVariations ? 'Options' :
                   <FaShoppingCart />}
                </button>
            </div>
        </div>
    </div>
  );
};

export default ProductCard;
