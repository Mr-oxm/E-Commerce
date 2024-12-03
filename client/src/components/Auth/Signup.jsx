import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, needsOnboarding } = useContext(AuthContext);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    if (user && !needsOnboarding) {
      navigate('/');
    }else if(user && needsOnboarding){
      navigate('/onboarding');
    }
  }, [user, needsOnboarding]);

  if(user){
      return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const needsOnboarding = await signup(username, email, password);
      if (needsOnboarding) {
        navigate('/onboarding')
      } else {
        navigate('/')
      }
    } catch (error) {
      setError('Signup failed. Write a valid email and password.');
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
        <h1 className='text-4xl font-bold text-center'>Sign Up</h1>
        <p className='text-center text-sm'>
          <span>Already have an account? </span>
          <Link to="/login" className='text-primary'>Log in</Link>
        </p>
      </div>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required  />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required  />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required  />
      <p className='text-sm text-gray-500'>Minimum 8 characters long and contain numbers, letters and special characters</p>
      <button type="submit" className='btn btn-primary'>Sign Up</button>
    </form>
  );
};

export default Signup;