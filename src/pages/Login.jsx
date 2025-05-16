import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '../components/ui';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../context/AuthContext';
import LoginImage from '../assets/login.svg';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const { login, isLoading, error, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Xóa lỗi khi người dùng bắt đầu nhập
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Gọi login method từ AuthContext (sử dụng repository bên trong)
      const response = await login(formData);
      console.log('Login successful:', response);
      // Navigation sẽ được xử lý bởi useEffect
    } catch (err) {
      console.error('Login failed:', err);
      // Error đã được xử lý trong AuthContext
    }
  };

  return (
    <AuthLayout>
      <div className='flex flex-row items-center justify-center h-screen w-full'>
        {/* Left side - can be used for branding, image, etc. */}
        <div className="w-1/2 h-full bg-[#3F8CFF] flex items-center justify-center">
          <div className="p-[100px] flex items-center justify-center w-full">
              <img src={LoginImage} alt="login" className="w-full" />
            
          </div>
        </div>
        
        {/* Right side - login form */}
        <div className="w-1/2 h-full flex items-center justify-center">
          <div className="max-w-md w-full p-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Sign in to HRM
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                name="email"
                label="Email address"
                value={formData.email}
                onChange={handleChange}
                error={formErrors.email}
                required
                autoComplete="email"
              />

              <Input
                type="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
                required
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isLoading}
              >
                Log in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login; 