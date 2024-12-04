import { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { 
  MdMonitor, 
  MdShoppingBag, 
  MdHome, 
  MdMenuBook, 
  MdSportsEsports,
  MdSportsBasketball,
  MdFace,
  MdDirectionsCar,
  MdShoppingCart,
  MdFavorite
} from 'react-icons/md';

const CategoryIcons = () => {
  const navigate = useNavigate();
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

  const categoryIcons = [
    { 
      name: 'Electronics', 
      icon: MdMonitor, 
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500'
    },
    { 
      name: 'Clothing', 
      icon: MdShoppingBag, 
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=500'
    },
    { 
      name: 'Home', 
      icon: MdHome, 
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500'
    },
    { 
      name: 'Books', 
      icon: MdMenuBook, 
      imageUrl: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?q=80&w=500'
    },
    { 
      name: 'Toys', 
      icon: MdSportsEsports, 
      imageUrl: 'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?q=80&w=500'
    },
    { 
      name: 'Sports', 
      icon: MdSportsBasketball, 
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=500'
    },
    { 
      name: 'Beauty', 
      icon: MdFace, 
      imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=500'
    },
    { 
      name: 'Automotive', 
      icon: MdDirectionsCar, 
      imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=500'
    },
    { 
      name: 'Food', 
      icon: MdShoppingCart, 
      imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=500'
    },
    { 
      name: 'Health', 
      icon: MdFavorite, 
      imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=500'
    }
  ];

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="relative">
          <div 
            ref={sliderRef}
            className="carousel flex flex-row gap-4 w-full scroll-smooth p-4"
          >
            {categoryIcons.map(({ name, icon: Icon, imageUrl }, index) => (
              <div 
                key={name} 
                className="carousel-item flex-shrink-0 relative"
                id={`slide-${index}`}
                onClick={() => navigate(`/search?category=${name}`)}
              >
                <div className="card relative w-80 h-32 group overflow-hidden transition-all duration-300 hover:scale-105">
                  <img 
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent sm:opacity-0 opacity-100 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white sm:transform sm:translate-y-4 translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-2xl sm:text-3xl sm:opacity-0 opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm sm:text-base font-medium mt-2 sm:opacity-0 opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                      {name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 ml-1 bg-base-300 p-2 rounded-full shadow-md"
            onClick={handlePrev}
          >
            <FaChevronLeft />
          </button>
          <button
            className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 mr-1 bg-base-300 p-2 rounded-full shadow-md"
            onClick={handleNext}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryIcons;