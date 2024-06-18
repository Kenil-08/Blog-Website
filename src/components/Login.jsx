import React, { useState } from 'react';
import authService from '../appwrite/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Logo, Input, Button } from './index';
import { useDispatch } from 'react-redux';
import { login as authLogin } from '../features/authSlice';
import { useForm } from 'react-hook-form';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm();

  const login = async (data) => {
    setError('');
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin(userData));
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className='flex items-center justify-center p-10'>
      <div className='mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border'>
        <div className='flex justify-end'>
          <button
            onClick={handleGoBack}
            className='text-gray-500 hover:text-gray-700 focus:outline-none'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>
        <div className='mb-2 flex justify-center'>
          <span className='inline-block w-full max-w-[100px]'>
            <Logo width='100%' />
          </span>
        </div>
        <h2 className='text-center text-2xl font-bold leading-tight'>Sign in to your account</h2>
        <p className='mt-2 text-center text-base text-black/60'>
          Don&apos;t have any account?&nbsp;
          <Link
            to='/signup'
            className='font-medium text-primary transition-all duration-200 hover:underline'
          >
            Sign Up
          </Link>
        </p>
        {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
        <form onSubmit={handleSubmit(login)} className='mt-8'>
          <div className='space-y-5'>
            <Input
              label='Email: '
              placeholder='Enter your email'
              type='email'
              {...register('email', {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    'Email address must be a valid address',
                },
              })}
            />
            <Input
              label='Password: '
              type='password'
              placeholder='Enter your password'
              {...register('password', {
                required: true,
              })}
            />
            <Button type='submit' className='w-full'>
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
