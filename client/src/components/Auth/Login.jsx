import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, needsOnboarding } = useContext(AuthContext);
  
  useEffect(() => {
    if (user && !needsOnboarding) {
      navigate('/');
    }else if(user && needsOnboarding){
      navigate('/profile');
    }
  }, [user, needsOnboarding]);

  if(user){
      return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const needsOnboarding = await login(email, password);
      if (needsOnboarding) {
        navigate('/profile');
      } else {
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
        <h1 className='text-4xl font-bold text-center'>Log In</h1>
        <p className='text-center text-sm'>
          <span>Don't have an account? </span>
          <Link to="/signup" className='text-primary'>Sign up</Link>
        </p>
      </div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="input w-full focus:outline-none focus:ring-0 focus:border-primary bg-base-200"/>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="input w-full focus:outline-none focus:ring-0 focus:border-primary bg-base-200"/>
      <button type="submit" className='btn btn-primary'>Log In</button>
    </form>
  );
};

export default Login