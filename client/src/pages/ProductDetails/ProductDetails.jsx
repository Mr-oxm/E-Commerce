import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaShoppingCart, FaCheck } from 'react-icons/fa';
import routes from '../../constants/routes';
import { useShoppingCart } from '../../context/ShoppingCartContext';
import Reviews from '../../components/Reviews/Reviews';
import LoadingAnimation from '../../components/Shared/LoadingAnimation';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);

  const { id } = useParams();
  const { addToCart, cartItems } = useShoppingCart();


  useEffect(() => {
    const fetchProductByID = async () => {
      try {
        const response = await axios.get(routes.product.getProductById(id));
        const productData = response.data.data;
        setProduct(productData);
        setCurrentPrice(productData.hasVariations ? productData.basePrice : productData.price);
        setCurrentStock(productData.stock);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to fetch product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProductByID();
  }, [id]);

  const handleVariationChange = (variationName, option) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationName]: option
    }));
    
    setSelectedOption(option);
    
    const totalVariationPrice = Object.values({
      ...selectedVariations,
      [variationName]: option
    }).reduce((sum, opt) => sum + (opt.price || 0), 0);
    
    setCurrentPrice(product.basePrice + totalVariationPrice);
    setCurrentStock(option.stock);
  };

  const areAllVariationsSelected = () => {
    if (!product?.hasVariations) return true;
    return product.variations.every(variation => 
      selectedVariations[variation.name]
    );
  };

  const handleAddToCart = () => {
    if (product.hasVariations) {
      addToCart({
        ...product,
        price: currentPrice,
        stock: currentStock,
        selectedVariations: Object.entries(selectedVariations).map(([name, option]) => ({
          name,
          option: option.name,
          price: option.price || 0,
          totalPrice: product.basePrice + (option.price || 0)
        }))
      });
    } else {
      addToCart(product);
    }
  };

  const handleReviewUpdate = async () => {
    // Refresh product data to get updated reviews
    try {
      const response = await axios.get(routes.product.getProductById(id));
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching updated product:', error);
    }
  };

  if (loading) return <LoadingAnimation />;
  if (error) return <div className="text-center text-red-500 p-8 h-full">{error}</div>;
  if (!product) return <div className="text-center p-8 h-full">Product not found</div>;

  const averageRating = product.ratings.length > 0
    ? (product.ratings.reduce((sum, rating) => sum + rating.rating, 0) / product.ratings.length).toFixed(1)
    : 'No ratings';

  const isInCart = cartItems.some(item => item._id === product._id);

  return (
    <>
    <div className="container mx-auto px-4 py-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        <div className="space-y-4 md:col-span-1 col-span-2">
          <div className="flex justify-center items-center p-4 rounded-lg w-full h-96">
            <img 
              src={product.images[currentImageIndex]} 
              alt={product.name} 
              className="max-w-full h-full object-contain p-0 md:p-8 z-10" 
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} - Image ${index + 1}`}
                className={`w-20 h-20 z-10 object-cover cursor-pointer ${
                  index === currentImageIndex ? 'border-2 border-blue-500' : ''
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className="z-10 col-span-2 md:col-span-1">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <FaStar className="text-yellow-400 mr-1" />
            <span>{averageRating} ({product.ratings.length} reviews)</span>
          </div>
          <p className="text-2xl font-bold mb-4">
            ${product.hasVariations 
              ? currentPrice?.toFixed(2)
              : product.price.toFixed(2)
            }
          </p>
          <p className="mb-4">Seller: <Link className='text-primary hover:text-primary/70' to={`/profile/${product.seller._id}`}>{product.seller.profile.fullName}</Link></p>
          <div className="mb-4">
            <p className="font-semibold">Categories:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {product.category.map((cat, index) => (
                <span key={index} className="card bg-base-100 px-2 py-1 rounded-full text-sm">
                  {cat}
                </span>
              ))}
            </div>
          </div>
          {product.hasVariations && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Base Price: ${product.basePrice.toFixed(2)}</p>
              {product.variations.map((variation, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold mb-2">{variation.name}:</p>
                  <div className="flex flex-wrap gap-2">
                    {variation.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        className={`btn btn-sm ${
                          selectedVariations[variation.name]?.name === option.name
                            ? 'btn-primary'
                            : 'btn-outline'
                        }`}
                        onClick={() => handleVariationChange(variation.name, option)}
                      >
                        <span>{option.name}</span>
                        {option.price > 0 && (
                          <span className="ml-1 text-xs">
                            (+${option.price.toFixed(2)})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedVariations[variation.name] && (
                    <p className="text-sm text-gray-600 mt-1">
                      Selected: {selectedVariations[variation.name].name}
                      {selectedVariations[variation.name].price > 0 && 
                        ` (+$${selectedVariations[variation.name].price.toFixed(2)})`
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="mb-4">
            In Stock: 
            <span className='font-bold mx-2'>
              {product.hasVariations ? currentStock : product.stock}
            </span>
          </p>
          <button 
            className={`btn ${isInCart ? 'btn-accent' : 'btn-primary'}`}
            onClick={handleAddToCart}
            disabled={isInCart || !areAllVariationsSelected()}
          >
            {isInCart ? (
              <>
                <FaCheck className="mr-2" /> In Cart
              </>
            ) : (
              <>
                <FaShoppingCart className="mr-2" /> 
                {!areAllVariationsSelected() 
                  ? 'Select Options' 
                  : 'Add to Cart'
                }
              </>
            )}
          </button>
        </div>
        <div className='space-y-4 col'>
          <h2 className="text-2xl font-bold my-4">Description</h2>
          <p className="text-gray-600 mb-4">{product.description}</p>
        </div>
      </div>
      <Reviews 
        product={product}
        onReviewUpdate={handleReviewUpdate}
      />
    </div>
    {/* Blur effect */}
    {/* <img 
      src={product.images[0]} 
      alt={product.name} 
      className="select-none max-w-full h-full object-contain absolute opacity-10 blur-2xl top-0 left-0 !-z-0"  
    /> */}
    </>
  );
};

export default ProductDetails;
