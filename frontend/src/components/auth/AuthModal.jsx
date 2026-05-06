import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoMail, IoLockClosed, IoPerson, IoCalendar } from 'react-icons/io5';
import { useAuth } from '@/hooks/useAuth';
import { registerUser, verifyOTP } from '@/lib/api';
import toast from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState('LOGIN'); // LOGIN, REGISTER, VERIFY
  const { userLogin } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '',
    otp: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSwitchView = (newView) => {
    setView(newView);
    setFormData({
      firstName: '',
      lastName: '',
      dob: '',
      email: '',
      password: '',
      otp: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userLogin(formData.email, formData.password);
      toast.success('Logged in successfully');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        email: formData.email,
        password: formData.password
      });
      toast.success('OTP sent to your email');
      setView('VERIFY');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await verifyOTP({ email: formData.email, otp: formData.otp });
      localStorage.setItem('userToken', data.token);
      toast.success('Email verified and logged in');
      window.location.reload(); // Quick way to sync auth state
    } catch (error) {
      toast.error(error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <IoClose size={24} />
          </button>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {view === 'LOGIN' ? 'Welcome Back' : view === 'REGISTER' ? 'Create Account' : 'Verify Email'}
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              {view === 'LOGIN' ? 'Enter your details to access your account.' : 
               view === 'REGISTER' ? 'Sign up to book and manage your travels.' : 
               'Enter the 6-digit code sent to your email.'}
            </p>

            {view === 'LOGIN' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <IoMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none" 
                      placeholder="you@example.com" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" name="password" required value={formData.password} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
                <button 
                  type="submit" disabled={loading}
                  className="w-full py-2.5 bg-[#6366F1] text-white rounded-xl font-medium hover:bg-[#4F46E5] transition-colors disabled:opacity-50 mt-2"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Don't have an account? <button type="button" onClick={() => handleSwitchView('REGISTER')} className="text-[#6366F1] font-medium hover:underline">Sign up</button>
                </p>
              </form>
            )}

            {view === 'REGISTER' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <div className="relative">
                      <IoPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" name="firstName" required value={formData.firstName} onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none text-sm" 
                        placeholder="John" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <div className="relative">
                      <IoPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none text-sm" 
                        placeholder="Doe (Opt)" 
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <div className="relative">
                    <IoCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="date" name="dob" value={formData.dob} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <IoMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none" 
                      placeholder="you@example.com" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" name="password" required minLength="6" value={formData.password} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
                <button 
                  type="submit" disabled={loading}
                  className="w-full py-2.5 bg-[#6366F1] text-white rounded-xl font-medium hover:bg-[#4F46E5] transition-colors disabled:opacity-50 mt-2"
                >
                  {loading ? 'Sending OTP...' : 'Sign Up'}
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  Already have an account? <button type="button" onClick={() => handleSwitchView('LOGIN')} className="text-[#6366F1] font-medium hover:underline">Log in</button>
                </p>
              </form>
            )}

            {view === 'VERIFY' && (
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-digit OTP</label>
                  <input 
                    type="text" name="otp" required maxLength="6" value={formData.otp} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#6366F1] focus:border-transparent outline-none text-center text-xl tracking-widest font-semibold" 
                    placeholder="------" 
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">We sent an OTP to {formData.email}</p>
                </div>
                <button 
                  type="submit" disabled={loading}
                  className="w-full py-2.5 bg-[#6366F1] text-white rounded-xl font-medium hover:bg-[#4F46E5] transition-colors disabled:opacity-50 mt-2"
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
