import React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { User as FirebaseUser } from 'firebase/auth';
import { useEffect } from 'react';

interface ProfileCompletionDialogProps {
  open: boolean;
  onClose: () => void;
  currentUser: FirebaseUser | null;
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ProfileCompletionDialog = ({
  open,
  onClose,
  currentUser,
}: ProfileCompletionDialogProps) => {
  //console.log("ProfileCompletionDialog rendered with currentUser:", currentUser);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;

      try {
        const idToken = await currentUser?.getIdToken();
        // console.log('Fetching user profile with ID token:', idToken);
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
          setFormData({
            full_name: profileData?.full_name || '',
            address: profileData?.address || '',
            contactNumber: profileData?.phone || '',
            jobTitle: profileData?.jobTitle || '',
            company: profileData?.company || '',
          });
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile information.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  // console.log("Fetched profile:", profile);
  //console.log("name:", profile?.full_name);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    address: profile?.address || '',
    contactNumber: profile?.phone || '',
    jobTitle: profile?.jobTitle || '',
    company: profile?.company || '',
  });
  //console.log("formData:", formData);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!currentUser) {
        throw new Error('No user is signed in');
      }

      // 1. Grab the Firebase ID token to authenticate
      const idToken = await currentUser.getIdToken(/* forceRefresh = */ false);
      //console.log("ID Token:", idToken);
      // 2. Build the payload — only include fields the API expects
      const payload: {
        //username?: string | null
        full_name?: string | null;
        img?: string | null;
        address?: string | null;
        phone?: string | null;
      } = {};

      // Only send the keys the user actually filled out:
      //if (formData.username)  payload.username  = formData.username
      if (formData?.full_name) payload.full_name = formData.full_name;
      //if (formData.imgUrl)    payload.img       = formData.imgUrl
      if (formData?.address) payload.address = formData.address;
      if (formData?.contactNumber) payload.phone = formData.contactNumber;

      // 3. Make the PATCH request
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },

        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update profile');
      }
      window.dispatchEvent(new Event('profileUpdated'));

      toast({
        title: 'Profile updated!',
        description: 'Your profile information was saved successfully.',
        variant: 'default',
      });

      onClose();
    } catch (error: unknown) {
      console.error('Profile update error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save profile information.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide additional information to enhance your job search experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData?.full_name}
              onChange={(e) => handleInputChange('full_name', e.target.value)}
              placeholder="Enter user name"
              required
            />
          </div>

          <div>
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              value={formData?.contactNumber}
              onChange={(e) => handleInputChange('contactNumber', e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your address"
              required
            />
          </div>

          <div>
            <Label htmlFor="jobTitle">Current Job Title</Label>
            <Input
              id="jobTitle"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder="e.g., Software Developer"
            />
          </div>

          <div>
            <Label htmlFor="company">Current Company</Label>
            <Input
              id="company"
              value={formData?.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="e.g., Tech Corp"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : 'Complete Profile'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Skip for now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
