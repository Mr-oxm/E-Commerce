import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaShoppingCart, FaCheck } from 'react-icons/fa';
import routes from '../../constants/routes';
import { useShoppingCart } from '../../context/ShoppingCartContext';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams();
  const { addToCart, cartItems } = useShoppingCart();

  useEffect(() => {
    const fetchProductByID = async () => {
      try {
        const response = await axios.get(routes.product.getProductById(id));
        setProduct(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProductByID();
  }, [id]);

  if (loading) return <div className="text-center p-8 h-full">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-8 h-full">{error}</div>;
  if (!product) return <div className="text-center p-8 h-full">Product not found</div>;

  const averageRating = product.ratings.length > 0
    ? (product.ratings.reduce((sum, rating) => sum + rating.rating, 0) / product.ratings.length).toFixed(1)
    : 'No ratings';

  const isInCart = cartItems.some(item => item._id === product._id);

  return (
    <div className="container mx-auto px-4 py-8 relative ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        <div className="space-y-4">
          <div className="flex justify-center items-center p-4 rounded-lg w-full h-96 ">
            <img src={product.images[currentImageIndex]} alt={product.name} className="max-w-full h-full object-contain p-0 md:p-8 z-10" />
          </div>
          <div className="flex space-x-2 overflow-x-auto ">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} - Image ${index + 1}`}
                className={`w-20 h-20 z-10 object-cover cursor-pointer ${index === currentImageIndex ? 'border-2 border-blue-500' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className="z-10">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <FaStar className="text-yellow-400 mr-1" />
            <span>{averageRating} ({product.ratings.length} reviews)</span>
          </div>
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <p className="mb-4">Seller: {product.seller.username}</p>
          <div className="mb-4">
            <p className="font-semibold">Categories:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {product.category.map((cat, index) => (
                <span key={index} className="card bg-base-100 px-2 py-1 rounded-full text-sm">{cat}</span>
              ))}
            </div>
          </div>
          <p className="mb-4">In Stock: {product.countInStock}</p>
          <button 
            className={`btn ${isInCart ? 'btn-accent' : 'btn-primary'}`}
            onClick={() => addToCart(product)}
            disabled={isInCart}
          >
            {isInCart ? (
              <>
                <FaCheck className="mr-2" /> In Cart
              </>
            ) : (
              <>
                <FaShoppingCart className="mr-2" /> Add to Cart
              </>
            )}
          </button>
          <h2 className="text-2xl font-bold my-4">Description</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
        </div>
      </div>
      <div className="mt-8 z-10">
        <h2 className="text-2xl font-bold mb-4">Product Reviews</h2>
        {product.ratings.length > 0 ? (
          <ul className="space-y-4">
            {product.ratings.map((rating, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{rating.rating}</span>
                </div>
                <p>{rating.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {/* Backbluer  */}
      <img src={product.images[0]} alt={product.name} className=" select-none max-w-full h-full object-contain absolute opacity-10 blur-2xl top-0 left-0 z-0"  />
    </div>
  );
};

export default ProductDetails;
