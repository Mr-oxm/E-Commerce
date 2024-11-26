import { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCard from '../Cards/ProductCard';
import { Link } from 'react-router-dom';

const CategoryProductsSlider = ({ category, products }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef(null);

  const handlePrev = () => {
    if (sliderRef.current) {
      const newPosition = Math.max(0, scrollPosition - sliderRef.current.offsetWidth);
      setScrollPosition(newPosition);
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.offsetWidth;
      const newPosition = Math.min(maxScroll, scrollPosition + sliderRef.current.offsetWidth);
      setScrollPosition(newPosition);
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [scrollPosition]);

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{category}</h2>
        <Link to={`/search?category=${category}`}>
          <button className="btn btn-sm btn-ghost">View All</button>
        </Link>
      </div>
      <div className="relative">
        <div 
          ref={sliderRef}
          className="flex flex-row gap-4 w-full overflow-x-hidden scroll-smooth"
        >
          {products.map((product) => (
            <div key={product._id} className="flex-shrink-0 w-80">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-1 bg-base-300 p-2 rounded-full shadow-md"
          onClick={handlePrev}
        >
          <FaChevronLeft />
        </button>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-1 bg-base-300 p-2 rounded-full shadow-md"
          onClick={handleNext}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default CategoryProductsSlider;
