import { FaShoppingBag } from 'react-icons/fa';

const HeroBanner = ({ onShopNowClick }) => {
  return (
    <div className="hero card h-[calc(100vh-66px-50px)] relative mb-8 overflow-hidden">
        <div 
            className="absolute inset-0 bg-cover bg-center hue-rotate-180"
            style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1519642918688-7e43b19245d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80")',
            }}
        />
        <div 
        className="absolute inset-0 bg-gradient-to-r from-base-200 to-transparent"
        />
      
        <div className="hero-content flex-col lg:flex-row-reverse items-center relative z-10">
            <div className="w-full lg:w-1/2 items-center">
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/EBay_logo.svg/1280px-EBay_logo.svg.png"
                className="w-full max-w-sm mx-auto object-cover"
                alt="Shopping Experience"
            />
            </div>
            <div className="w-full lg:w-1/2 text-content text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Shop With Confidence!
            </h1>
            <p className="py-4 lg:py-6 text-base lg:text-lg text-content">
                Discover our amazing collection of products at unbeatable prices. 
                Quality meets affordability in our carefully curated selection.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
                <button className="btn btn-primary" onClick={onShopNowClick}>
                <FaShoppingBag className="mr-2" /> Shop Now 
                </button>
            </div>
            </div>
        </div>
    </div>
  );
};

export default HeroBanner;
