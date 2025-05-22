import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';
import AuthForm from '@/components/AuthForm';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const Index = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const toggleAuthMode = () => {
    setAuthMode((prev) => (prev === 'login' ? 'signup' : 'login'));
  };

  const openAuthDialog = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Testimonials />
      </main>
      <Footer />

      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <AuthForm mode={authMode} onToggleMode={toggleAuthMode} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
