import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';

const ShippingForm = ({ user, selectedAddress, setSelectedAddress, addressError, selectedPhone, setSelectedPhone, phoneError }) => (
  <>
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text font-semibold">Shipping Address</span>
      </label>
      
      {user?.profile?.addresses?.length > 0 ? (
        <select 
          className={`select select-bordered w-full ${addressError ? 'select-error' : ''}`}
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
        >
          <option value="">Select an address</option>
          {user.profile.addresses.map((address, index) => (
            <option key={index} value={address.value}>
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
          value={selectedPhone}
          onChange={(e) => setSelectedPhone(e.target.value)}
        >
          <option value="">Select a phone number</option>
          {user.profile.phoneNumbers.map((phone, index) => (
            <option key={index} value={phone.value}>
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

export default ShippingForm;
