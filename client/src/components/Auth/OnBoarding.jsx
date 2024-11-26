import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const OnBoarding = () => {
  const { user, updateUserProfile, needsOnboarding } = useContext(AuthContext);
  const [fullName, setFullName] = useState(user?.profile?.fullName || '');
  const [address, setAddress] = useState(user?.profile?.address || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.profile?.phoneNumber || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  if(!user || !needsOnboarding){
    navigate('/');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const needsOnboarding = await updateUserProfile({
        'profile.fullName': fullName,
        'profile.address': address,
        'profile.phoneNumber': phoneNumber,
        'profile.bio': bio
      });
      if (!needsOnboarding) {
        navigate('/')
      }
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
      {error && (
        <div className="text-red-500 bg-red-100 p-2 rounded">
          {error}
        </div>
      )}
      <div className='flex flex-col gap-2 items-center p-4'>
        <h1 className='text-4xl font-bold text-center'>User Profile</h1>
      </div>
      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" required  />
      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address"  />
      <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number"  />
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio"/>
      <button type="submit" className='btn btn-primary'>Update Profile</button>
    </form>
  );
};

export default OnBoarding