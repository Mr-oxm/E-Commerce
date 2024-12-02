import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import routes from '../../constants/routes';
import { categories } from '../../constants/categories';
import ProductCard from '../../components/Cards/ProductCard';
import { FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import LoadingAnimation from '../../components/Shared/LoadingAnimation';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState({ 
    min: searchParams.get('minPrice') || '', 
    max: searchParams.get('maxPrice') || '' 
  });
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortOrder, setSortOrder] = useState('asc');
  const [tempPriceRange, setTempPriceRange] = useState({ 
    min: searchParams.get('minPrice') || '', 
    max: searchParams.get('maxPrice') || '' 
  });

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const keyword = searchParams.get('keyword');
      
      console.log('Selected Category:', selectedCategory);
      console.log('Raw URL params:', searchParams.toString());
      
      // Build the filter URL with all parameters
      let url;
      if (keyword) {
        url = `${routes.product.search}?keyword=${keyword}`;
      } else {
        url = `${routes.product.filter}?`;
        if (selectedCategory) {
          const encodedCategory = encodeURIComponent(selectedCategory.trim());
          console.log('Encoded category:', encodedCategory);
          url += `category=${encodedCategory}&`;
        }
        if (priceRange.min) url += `minPrice=${priceRange.min}&`;
        if (priceRange.max) url += `maxPrice=${priceRange.max}&`;
        // Remove trailing & if exists
        url = url.replace(/&$/, '');
      }

      console.log('Final URL:', url);

      const response = await axios.get(url);
      let filteredProducts = response.data.data;

      // If there's a keyword, apply additional client-side filters
      if (keyword) {
        if (selectedCategory) {
          filteredProducts = filteredProducts.filter(product => 
            product.category.includes(selectedCategory)
          );
        }

        if (priceRange.min || priceRange.max) {
          filteredProducts = filteredProducts.filter(product => {
            const price = Number(product.price);
            const min = priceRange.min ? Number(priceRange.min) : Number.MIN_SAFE_INTEGER;
            const max = priceRange.max ? Number(priceRange.max) : Number.MAX_SAFE_INTEGER;
            return price >= min && price <= max;
          });
        }
      }

      setProducts(filteredProducts);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setPriceRange(tempPriceRange);
    
    const params = new URLSearchParams(searchParams);
    if (selectedCategory) params.set('category', selectedCategory);
    else params.delete('category');
    if (tempPriceRange.min) params.set('minPrice', tempPriceRange.min);
    else params.delete('minPrice');
    if (tempPriceRange.max) params.set('maxPrice', tempPriceRange.max);
    else params.delete('maxPrice');
    setSearchParams(params);
  };

  const handleSort = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    const sortedProducts = [...products].sort((a, b) => {
      return newOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });
    setProducts(sortedProducts);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    const keyword = params.get('keyword');
    
    // Reset all states
    setTempPriceRange({ min: '', max: '' });
    setPriceRange({ min: '', max: '' });
    setSelectedCategory('');
    
    // Clear all params except keyword
    params.forEach((value, key) => {
      if (key !== 'keyword') {
        params.delete(key);
      }
    });
    
    setSearchParams(params);
  };

  if (loading) return <LoadingAnimation />;
  if (error) return <div className="text-center text-error h-full p-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 bg-base-200 p-4 rounded-lg h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FaFilter /> Filters
            </h2>
            <button onClick={clearFilters} className="btn btn-ghost btn-xs">
              Clear
            </button>
          </div>

          {/* Category Filter */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Category</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Price Range</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                className="input input-bordered w-full"
                value={tempPriceRange.min}
                onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: e.target.value })}
              />
              <input
                type="number"
                placeholder="Max"
                className="input input-bordered w-full"
                value={tempPriceRange.max}
                onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: e.target.value })}
              />
            </div>
          </div>

          {/* Apply Filters Button */}
          <button 
            onClick={handleFilter} 
            className="btn btn-primary w-full"
          >
            Apply Filters
          </button>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {products.length} Results Found
            </h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={handleSort}
            >
              Sort by Price {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-8">
              No products found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 