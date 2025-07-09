import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCallback } from 'react';
interface UserProfile {
  username: string;
  full_name: string;
  email: string;
  img: string;
  address: string;
  phone: string;
  updated_at: string;
}

interface UserProfileViewProps {
  onEdit: () => void;
}

export const UserProfileView = ({ onEdit }: UserProfileViewProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchUserProfile = useCallback(
    async (retryCount = 0) => {
      if (!currentUser) return;
      setLoading(true);

      try {
        const idToken = await currentUser.getIdToken();
        const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          setProfile(profileData);
          setLoading(false);
        } else if (response.status === 404 && retryCount < 2) {
          // Profile not created yet, wait and retry
          //  console.log(`Profile not found, waiting for backend to create user... Retry ${retryCount + 1}/2`);
          setTimeout(() => {
            fetchUserProfile(retryCount + 1);
          }, 3000); // Wait 3 seconds for backend to create user
          return; // Don't set loading false, keep loading during retry
        } else {
          setLoading(false);
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        if (retryCount < 2) {
          // Auto-retry once more for network issues
          //console.log(`Network error, retrying... Attempt ${retryCount + 1}/2`);
          setTimeout(() => {
            fetchUserProfile(retryCount + 1);
          }, 3000);
          return; // Don't set loading false, keep loading during retry
        }

        // Only show error after retries
        setLoading(false);
        // toast({
        //   title: 'Error',
        //   description: 'Failed to load profile information.',
        //   variant: 'destructive',
        // });
      }
    },
    [API_BASE_URL, currentUser, toast]
  );

  useEffect(() => {
    // Initial load
    fetchUserProfile();

    // Listen for profile updates from the dialog
    const handleProfileUpdate = () => fetchUserProfile();
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, [fetchUserProfile]);

  // const fetchUserProfile = useCallback(async () => {
  //   if (!currentUser) return;
  //   setLoading(true);

  //   try {
  //     const idToken = await currentUser?.getIdToken();
  //     const res = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${idToken}`,
  //       },
  //     });
  //     console.log('Fetching user profile:', res);
  //     if (!res.ok) throw new Error('Fetch failed');
  //     const data: UserProfile = await res.json();
  //     setProfile(data);
  //   } catch (err) {
  //     console.error(err);
  //     toast({
  //       title: 'Error',
  //       description: 'Could not load profile.',
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [API_BASE_URL, currentUser, toast]);

  // useEffect(() => {
  //   // 1) initial load
  //   fetchUserProfile();

  //   // 2) listen for our global “profileUpdated” event
  //   const handler = () => fetchUserProfile();
  //   window.addEventListener('profileUpdated', handler);

  //   return () => {
  //     window.removeEventListener('profileUpdated', handler);
  //   };
  // }, [fetchUserProfile]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Loading your profile...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Unable to load profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Profile data could not be retrieved.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details and contact information</CardDescription>
          </div>
          <Button onClick={onEdit} size="sm" className="bg-jobathon-600 hover:bg-jobathon-700">
            <Edit size={16} className="mr-1" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-jobathon-100 flex items-center justify-center text-jobathon-700">
                {profile.img ? (
                  <img
                    src={profile.img}
                    alt="Profile"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div>
                <h3 className="font-medium text-lg">{profile.full_name}</h3>
                <p className="text-sm text-gray-500">@{profile.username}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-gray-400" />
                <span className="text-sm">{profile.email}</span>
              </div>

              {profile.phone && (
                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-gray-400" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {profile.address && (
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-gray-400 mt-0.5" />
                <span className="text-sm">{profile.address}</span>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <Calendar size={18} className="text-gray-400" />
              <span className="text-sm">
                Last updated: {new Date(profile.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
