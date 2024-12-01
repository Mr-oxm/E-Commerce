import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { useShoppingCart } from '../../context/ShoppingCartContext';

const ShippingForm = ({ user, selectedAddress, setSelectedAddress, addressError, selectedPhone, setSelectedPhone, phoneError }) => {
  const { selectedAddressIndex, setSelectedAddressIndex, selectedPhoneIndex, setSelectedPhoneIndex } = useShoppingCart();

  const handleAddressChange = (index) => {
    setSelectedAddressIndex(index);
    setSelectedAddress(user.profile.addresses[index]?.value || '');
  };

  const handlePhoneChange = (index) => {
    setSelectedPhoneIndex(index);
    setSelectedPhone(user.profile.phoneNumbers[index]?.value || '');
  };

  return (
    <>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Shipping Address</span>
        </label>
        
        {user?.profile?.addresses?.length > 0 ? (
          <select 
            className={`select select-bordered w-full ${addressError ? 'select-error' : ''}`}
            value={selectedAddressIndex}
            onChange={(e) => handleAddressChange(e.target.value)}
          >
            <option value="">Select an address</option>
            {user.profile.addresses.map((address, index) => (
              <option key={index} value={index}>
                {address.label}: {address.value}
              </option>
            ))}
          </select>
        ) : (
          <Link to="/settings" className="btn btn-primary btn-sm">
            <FaCog className="mr-2" /> Add Address
          </Link>
        )}
        
        {addressError && (
          <label className="label">
            <span className="label-text-alt text-error">{addressError}</span>
          </label>
        )}
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-semibold">Contact Phone</span>
        </label>
        
        {user?.profile?.phoneNumbers?.length > 0 ? (
          <select 
            className={`select select-bordered w-full ${phoneError ? 'select-error' : ''}`}
            value={selectedPhoneIndex}
            onChange={(e) => handlePhoneChange(e.target.value)}
          >
            <option value="">Select a phone number</option>
            {user.profile.phoneNumbers.map((phone, index) => (
              <option key={index} value={index}>
                {phone.label}: {phone.value}
              </option>
            ))}
          </select>
        ) : (
          <Link to="/settings" className="btn btn-primary btn-sm">
            <FaCog className="mr-2" /> Add Phone
          </Link>
        )}
        
        {phoneError && (
          <label className="label">
            <span className="label-text-alt text-error">{phoneError}</span>
          </label>
        )}
      </div>
    </>
  );
};

export default ShippingForm;
