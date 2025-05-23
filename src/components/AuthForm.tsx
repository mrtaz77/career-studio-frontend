import * as React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Loader2, Facebook } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode: () => void;
  onSuccess?: () => void;
}

const AuthForm = ({ mode, onToggleMode, onSuccess }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const { login, signup, loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        await signup(formData.email, formData.password, formData.name);
        onToggleMode(); // Switch to login after successful signup
      }
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }

    console.log('Form submitted with:', formData);
    // In a real app, you'd connect this to your authentication system
  };

  const handleGoogleLogin = async () => {
    setIsSocialLoading('google');
    try {
      await loginWithGoogle();
      navigate('/dashboard');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Google authentication error:', error);
    } finally {
      setIsSocialLoading(null);
    }
  };

  // const handleFacebookLogin = async () => {
  //   setIsSocialLoading("facebook");
  //   try {
  //     await loginWithFacebook();
  //     navigate("/dashboard");
  //     if (onSuccess) {
  //       onSuccess();
  //     }
  //   } catch (error) {
  //     console.error("Facebook authentication error:", error);
  //   } finally {
  //     setIsSocialLoading(null);
  //   }
  // };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === 'login' ? 'Log in to your account' : 'Create your account'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full"
            disabled={isSubmitting}
          />
        </div>

        {mode === 'login' && (
          <div className="text-right">
            <a href="#" className="text-sm text-jobathon-600 hover:underline">
              Forgot password?
            </a>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-jobathon-600 hover:bg-jobathon-700 py-6"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === 'login' ? 'Signing in...' : 'Signing up...'}
            </>
          ) : mode === 'login' ? (
            'Sign in'
          ) : (
            'Sign up'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={onToggleMode}
            className="ml-1 text-jobathon-600 hover:underline focus:outline-none"
            disabled={isSubmitting || isSocialLoading !== null}
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6   ">
          <Button
            // variant="outline"
            className="w-full  #28A745 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white  transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg "
            disabled={isSubmitting || isSocialLoading !== null}
            onClick={handleGoogleLogin}
          >
            {isSocialLoading === 'google' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {/* <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
    <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
  </svg> */}
                <img
                  alt="Google Icon"
                  loading="lazy"
                  width="24"
                  height="24"
                  decoding="async"
                  data-nimg="1"
                  className="register_googleIcon_fvh_0"
                  src="public\icons8-google.svg"
                />
                Sign in with Google
              </>
            )}
          </Button>
          {/* <Button 
            variant="outline" 
            className="w-full" 
            disabled={isSubmitting || isSocialLoading !== null}
            onClick={handleFacebookLogin}
          >
            {isSocialLoading === "facebook" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Facebook className="h-5 w-5 mr-2 text-[#1877F2]" />
                Facebook
              </>
            )}
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
