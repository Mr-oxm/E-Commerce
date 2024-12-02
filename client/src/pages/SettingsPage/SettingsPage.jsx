import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FiUser, FiPhone, FiMapPin, FiEdit, FiPlus, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import routes from '../../constants/routes';
import { UploadButton } from '../../utils/upload';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
    const { user, updateUserProfile } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [formData, setFormData] = useState({
      'profile.fullName': '',
      'profile.bio': '',
      'profile.addresses': [],
      'profile.phoneNumbers': [],
      'profile.profilePhoto': ''
    });
  
    useEffect(() => {
      if (user) {
        setFormData({
          'profile.fullName': user.profile.fullName || '',
          'profile.bio': user.profile.bio || '',
          'profile.addresses': user.profile.addresses || [],
          'profile.phoneNumbers': user.profile.phoneNumbers || [],
          'profile.profilePhoto': user.profile.profilePhoto || ''
        });
      }
    }, [user]);
  
    const handleAddField = (field) => {
      setFormData(prev => ({
        ...prev,
        [`profile.${field}`]: [...prev[`profile.${field}`], { value: '', label: '' }]
      }));
    };
  
    const handleRemoveField = (field, index) => {
      setFormData(prev => ({
        ...prev,
        [`profile.${field}`]: prev[`profile.${field}`].filter((_, i) => i !== index)
      }));
    };
  
    const handleFieldChange = (field, index, key, value) => {
      setFormData(prev => ({
        ...prev,
        [`profile.${field}`]: prev[`profile.${field}`].map((item, i) => 
          i === index ? { ...item, [key]: value } : item
        )
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await updateUserProfile(formData);
        setMessage({ type: 'success', content: 'Profile updated successfully!' });
      } catch (error) {
        setMessage({ type: 'error', content: error.response?.data?.error || 'Update failed' });
      }
      setLoading(false);
    };
  
    return (
      <div className="container p-6 ">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        {message.content && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
            {message.content}
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-6 card bg-base-100 p-6">
          {/* Profile Photo */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Profile Photo</span>
            </label>
            <div className="flex flex-col md:flex-row gap-4 items-center space-x-4">
              <div className="avatar">
                <div className="w-24 rounded-full">
                  <img src={formData['profile.profilePhoto'] || 'https://static-00.iconduck.com/assets.00/user-avatar-happy-icon-2048x2048-ssmbv1ou.png'} alt="Profile" />
                </div>
              </div>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(response) => {
                  if (response?.[0]?.url) {
                    setFormData(prev => ({
                      ...prev,
                      'profile.profilePhoto': response[0].url,
                    }));
                    setMessage({ type: 'success', content: 'Photo uploaded successfully!' });
                  }
                }}
                config={{mode: "manual"}} 
                onUploadError={(error) => {
                  console.error('Upload error:', error);
                  setMessage({ type: 'error', content: 'Failed to upload photo' });
                }}
              />
            </div>
          </div>
  
          {/* Basic Info */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              type="text"
              value={formData['profile.fullName']}
              onChange={(e) => setFormData({ ...formData, 'profile.fullName': e.target.value })}
              className=""
            />
          </div>
  
          <div className="form-control">
            <label className="label">
              <span className="label-text">Bio</span>
            </label>
            <textarea
              value={formData['profile.bio']}
              onChange={(e) => setFormData({ ...formData, 'profile.bio': e.target.value })}
              className="h-24"
            />
          </div>
          
          <Link to="/change-password" className="btn btn-warning">
            Change Password
          </Link>
  
          {/* Addresses */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Addresses</span>
            </label>
            {formData['profile.addresses'].map((address, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Label (e.g., Home)"
                  value={address.label}
                  onChange={(e) => handleFieldChange('addresses', index, 'label', e.target.value)}
                  className=" w-1/4"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={address.value}
                  onChange={(e) => handleFieldChange('addresses', index, 'value', e.target.value)}
                  className=" flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('addresses', index)}
                  className="btn btn-square btn-error"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField('addresses')}
              className="btn btn-outline btn-sm mt-2"
            >
              <FiPlus className="mr-2" /> Add Address
            </button>
          </div>
  
          {/* Phone Numbers */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Phone Numbers</span>
            </label>
            {formData['profile.phoneNumbers'].map((phone, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Label (e.g., Mobile)"
                  value={phone.label}
                  onChange={(e) => handleFieldChange('phoneNumbers', index, 'label', e.target.value)}
                  className=" w-1/4"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone.value}
                  onChange={(e) => handleFieldChange('phoneNumbers', index, 'value', e.target.value)}
                  className=" flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveField('phoneNumbers', index)}
                  className="btn btn-square btn-error"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddField('phoneNumbers')}
              className="btn btn-outline btn-sm mt-2"
            >
              <FiPlus className="mr-2" /> Add Phone Number
            </button>
          </div>
  
  
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-spinner"></span> : 'Save Changes'}
          </button>
        </form>
      </div>
    );
  };
  
  export default SettingsPage;