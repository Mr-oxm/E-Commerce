import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AiOutlineLoading } from "react-icons/ai";
import CategoryProductsSlider from '../../components/Shared/CategoryProductsSlider';
import routes from '../../constants/routes';
import { categories } from '../../constants/categories';
import LoadingAnimation from '../../components/Shared/LoadingAnimation';
import CategoryIcons from '../../components/Landing/CategoryIcons';
import HeroBanner from '../../components/Landing/HeroBanner';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const productsRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(routes.product.getAllProducts);
        setProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) return <LoadingAnimation />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const getProductsByCategory = (category) => {
    return products.filter(product => product.category.includes(category));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroBanner onShopNowClick={scrollToProducts} />
      <CategoryIcons />
      <h1 ref={productsRef} className="text-3xl font-bold mb-8 pt-2">Our Products</h1>
      {categories.map((category) => {
        const categoryProducts = getProductsByCategory(category);
        if (categoryProducts.length > 0) {
          return (
            <CategoryProductsSlider
              key={category}
              category={category}
              products={categoryProducts}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default LandingPage;
