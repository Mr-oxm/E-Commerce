import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UploadButton } from '../../utils/upload';

const OnBoarding = () => {
  const { user, updateUserProfile, needsOnboarding } = useContext(AuthContext);
  const [fullName, setFullName] = useState(user?.profile?.fullName || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [profilePhoto, setProfilePhoto] = useState(user?.profile?.profilePhoto || '');
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
        'profile.bio': bio,
        'profile.profilePhoto': profilePhoto
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
      <div className="form-control">
        <label className="label">
          <span className="label-text">Profile Photo</span>
        </label>
        <div className="flex flex-col md:flex-row gap-4 items-center space-x-4">
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src={profilePhoto || 'https://static-00.iconduck.com/assets.00/user-avatar-happy-icon-2048x2048-ssmbv1ou.png'} alt="Profile" />
            </div>
          </div>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(response) => {
              if (response?.[0]?.url) {
                setProfilePhoto(response[0].url);
              }
            }}
            onUploadError={(error) => {
              console.error('Upload error:', error);
              setError('Failed to upload photo');
            }}
          />
        </div>
      </div>
      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" required  />
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio"/>
      <button type="submit" className='btn btn-primary'>Update Profile</button>
    </form>
  );
};

export default OnBoarding