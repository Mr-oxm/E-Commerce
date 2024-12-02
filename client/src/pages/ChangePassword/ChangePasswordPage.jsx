import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import routes from '../../constants/routes';
import { AuthContext } from '../../context/AuthContext';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', content: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', content: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await axios.put(
        routes.auth.changePassword,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      );

      setMessage({ type: 'success', content: 'Password changed successfully!' });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setTimeout(() => {
        navigate('/settings');
      }, 2000);
    } catch (error) {
      setMessage({
        type: 'error',
        content: error.response?.data?.error || 'Failed to change password',
      });
    }
    setLoading(false);
  };

  return (
    <div className="container p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8">Change Password</h1>

      {message.content && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
          {message.content}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 card bg-base-100 p-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Current Password</span>
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className=""
            required
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">New Password</span>
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className=""
            required
            minLength={6}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Confirm New Password</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className=""
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner"></span> : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
