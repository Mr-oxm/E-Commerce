import { BsArrowRight } from 'react-icons/bs';
import { FaShoppingBag } from 'react-icons/fa';

const HeroBanner = () => {
  return (
    <div className="hero min-h-[500px] bg-base-200 rounded-xl mb-8">
      <div className="hero-content flex-col lg:flex-row-reverse items-center">
        <div className="lg:w-1/2 items-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/1280px-EBay_logo.svg.png" 
            className="max-w-sm rounded-lg mx-auto"
            alt="Shopping Banner"
          />
        </div>
        <div className="lg:w-1/2">
          <h1 className="text-5xl font-bold">Shop With Confidence!</h1>
          <p className="py-6">
            Discover our amazing collection of products at unbeatable prices. 
            Quality meets affordability in our carefully curated selection.
          </p>
          <div className="flex gap-4">
            <button className="btn btn-primary">
              Shop Now <FaShoppingBag className="ml-2" />
            </button>
            <button className="btn btn-outline">
              Explore More <BsArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
