import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import routes from '../../constants/routes';
import LoadingAnimation from '../../components/Shared/LoadingAnimation';
import ProductCard from '../../components/Cards/ProductCard';
import { useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaStar, FaBox } from 'react-icons/fa';

const ProfileSection = ({ profileData, isOwnProfile, products }) => {
  // Calculate average rating across all products
  const averageRating = products.length > 0
    ? (products.reduce((sum, product) => {
        const productRating = product.ratings.length > 0
          ? product.ratings.reduce((rSum, r) => rSum + r.rating, 0) / product.ratings.length
          : 0;
        return sum + productRating;
      }, 0) / products.length).toFixed(1)
    : 'No ratings';

  // Calculate total number of ratings
  const totalRatings = products.reduce((sum, product) => sum + product.ratings.length, 0);

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <div className="flex flex-col gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="avatar">
              <div className="w-40 h-40 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={profileData?.profile?.profilePhoto || "https://static-00.iconduck.com/assets.00/user-avatar-happy-icon-2048x2048-ssmbv1ou.png"}
                  alt="Profile"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center">{profileData?.profile?.fullName}</h1>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-4">
            <div className="stats stats-vertical lg:stats-horizontal  w-full">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaUser className="text-2xl" />
                </div>
                <div className="stat-title">Username</div>
                <div className="stat-value text-lg">{profileData?.username}</div>
              </div>

              {isOwnProfile && (
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <FaEnvelope className="text-2xl" />
                  </div>
                  <div className="stat-title">Email</div>
                  <div className="stat-value text-lg">{profileData?.email}</div>
                </div>
              )}

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaStar className="text-2xl text-yellow-400" />
                </div>
                <div className="stat-title">Average Rating</div>
                <div className="stat-value text-lg flex items-center gap-2">
                  {averageRating}
                  <span className="text-sm text-gray-500">({totalRatings} reviews)</span>
                </div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaBox className="text-2xl" />
                </div>
                <div className="stat-title">Products</div>
                <div className="stat-value text-lg">{products.length}</div>
              </div>
            </div>

            {profileData?.profile?.bio && (
              <div className="bg-base-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">About</h3>
                <p>{profileData.profile.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
  }, [id]);

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
        routes.product.getSellerProductsById(id)
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
      <ProfileSection 
        profileData={profileData} 
        isOwnProfile={isOwnProfile} 
        products={products} 
      />
      
      {/* Products Section */}
      <div className="mt-8">
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