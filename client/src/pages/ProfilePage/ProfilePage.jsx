import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import routes from '../../constants/routes';
import LoadingAnimation from '../../components/Shared/LoadingAnimation';
import ProductCard from '../../components/Cards/ProductCard';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOwnProfile = user?._id === id;

  useEffect(() => {
    fetchProfileData();
    fetchUserProducts();
  }, []);

  const fetchProfileData = async () => {
    if (isOwnProfile) {
      setProfileData(user);
    } else {
      try {
        const response = await axios.get(routes.auth.getUserById(id));
        setProfileData(response.data.data);
      } catch (err) {
        setError('Failed to fetch profile data');
      }
    }
  };

  const fetchUserProducts = async () => {
    try {
      const response = await axios.get(
        isOwnProfile 
          ? routes.product.sellerProducts 
          : routes.product.getSellerProductsById(id)
      );
      setProducts(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  if (loading) return <LoadingAnimation />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Section */}
      <div className="bg-base-200 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src="https://static-00.iconduck.com/assets.00/user-avatar-happy-icon-2048x2048-ssmbv1ou.png"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profileData?.profile?.fullName}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-70">Username</p>
                <p className="font-semibold">{profileData?.username}</p>
              </div>
              {isOwnProfile && (
                <>
                  <div>
                    <p className="text-sm opacity-70">Email</p>
                    <p className="font-semibold">{profileData?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Phone</p>
                    <p className="font-semibold">{profileData?.profile?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Address</p>
                    <p className="font-semibold">{profileData?.profile?.address || 'Not provided'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {isOwnProfile ? 'My Products' : `${profileData?.username}'s Products`}
        </h2>
        {products.length === 0 ? (
          <p className="text-center py-8">No products listed yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;