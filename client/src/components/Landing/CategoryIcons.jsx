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
  
  const categoryIcons = [
    { name: 'Electronics', icon: MdMonitor },
    { name: 'Clothing', icon: MdShoppingBag },
    { name: 'Home & Garden', icon: MdHome },
    { name: 'Books', icon: MdMenuBook },
    { name: 'Toys & Games', icon: MdSportsEsports },
    { name: 'Sports & Outdoors', icon: MdSportsBasketball },
    { name: 'Beauty & Personal Care', icon: MdFace },
    { name: 'Automotive', icon: MdDirectionsCar },
    { name: 'Food & Grocery', icon: MdShoppingCart },
    { name: 'Health & Wellness', icon: MdFavorite }
  ];

  return (
    <div className="py-8 bg-base-200">
      <div className="container mx-auto px-4 overflow-x-auto scrollbar-hide scroll-smooth">
        <div className="flex gap-8 min-w-max justify-between">
          {categoryIcons.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => navigate(`/search?category=${name}`)}
              className="flex flex-col items-center gap-2 group md:w-24 w-16"
            >
              <div className="w-12 h-12 rounded-full bg-base-100 flex items-center justify-center text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">{name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryIcons;