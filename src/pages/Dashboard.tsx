import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Briefcase,
  User,
  LogOut,
  Trash2,
  CalendarDays,
  Search,
  BarChart2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { addUser, removeUser } from '../utils/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../utils/store';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';

import { ProfileCompletionDialog } from '@/components/ProfileCompletionDialog';
import { UserProfileView } from '@/components/UserProfileView';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Award, School } from 'lucide-react';
import { CertificatesView } from '@/components/CertificatesView';
import { EducationView } from '@/components/EducationView';
import CVAnalyzer from '@/components/CVAnalyzer';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser, logout } = useAuth();

  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showCreateCVDialog, setShowCreateCVDialog] = useState(false);
  const [cvType, setCVType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [cvList, setCvList] = useState([]);
  const [cvListLoading, setCvListLoading] = useState(false);
  const [cvListError, setCvListError] = useState('');
  const [otherUserList, setOtherUserList] = useState([]);
  const [otherUserListLoading, setOtherUserListLoading] = useState(false);
  const [otherUserListError, setOtherUserListError] = useState('');

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [cvToDelete, setCvToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Portfolio states
  const [portfolioList, setPortfolioList] = useState([]);
  const [portfolioListLoading, setPortfolioListLoading] = useState(false);
  const [portfolioListError, setPortfolioListError] = useState('');
  const [showDeletePortfolioDialog, setShowDeletePortfolioDialog] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [isDeletingPortfolio, setIsDeletingPortfolio] = useState(false);

  const [cvTemplate, setCVTemplate] = useState('1'); // 1 for Basic, 2 for Classic

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCvList, setFilteredCvList] = useState([]);

  // Add a new state for file upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleOpenCreateCVDialog = () => setShowCreateCVDialog(true);
  const handleCloseCreateCVDialog = () => setShowCreateCVDialog(false);

  const handleDeleteCV = (cv) => {
    setCvToDelete(cv);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!cvToDelete) return;

    setIsDeleting(true);
    try {
      if (!currentUser) {
        alert('You must be logged in to delete a CV.');
        setIsDeleting(false);
        return;
      }
      const idToken = await currentUser.getIdToken();
      if (!idToken) {
        alert('Failed to get authentication token.');
        setIsDeleting(false);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/cv/${cvToDelete.cv_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server error:', errorText);
        alert('Failed to delete CV: ' + errorText);
        setIsDeleting(false);
        return;
      }
      // Remove the deleted CV from both lists
      const updatedCvList = cvList.filter((cv) => cv.cv_id !== cvToDelete.cv_id);
      setCvList(updatedCvList);
      setFilteredCvList(filteredCvList.filter((cv) => cv.cv_id !== cvToDelete.cv_id));
      setShowDeleteDialog(false);
      setCvToDelete(null);
    } catch (err) {
      console.error('Error deleting CV:', err);
      alert('Error deleting CV');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setCvToDelete(null);
  };

  // Portfolio handlers
  const handleDeletePortfolio = (portfolio) => {
    setPortfolioToDelete(portfolio);
    setShowDeletePortfolioDialog(true);
  };

  const handleConfirmDeletePortfolio = async () => {
    if (!portfolioToDelete) return;

    setIsDeletingPortfolio(true);
    try {
      if (!currentUser) {
        alert('You must be logged in to delete a portfolio.');
        setIsDeletingPortfolio(false);
        return;
      }
      const idToken = await currentUser.getIdToken();
      if (!idToken) {
        alert('Failed to get authentication token.');
        setIsDeletingPortfolio(false);
        return;
      }
      const res = await fetch(
        `${API_BASE_URL}/api/v1/portfolio/unpublish/${portfolioToDelete.portfolio_id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      if (!res.ok) {
        const errorText = await res.text();
        alert('Failed to delete portfolio: ' + errorText);
        setIsDeletingPortfolio(false);
        return;
      }
      // Remove the deleted portfolio from the list
      setPortfolioList(
        portfolioList.filter(
          (portfolio) => portfolio.portfolio_id !== portfolioToDelete.portfolio_id
        )
      );

      setShowDeletePortfolioDialog(false);
      setPortfolioToDelete(null);
      toast.success('Portfolio deleted successfully.');
    } catch (err) {
      alert('Error deleting portfolio');
    } finally {
      setIsDeletingPortfolio(false);
    }
  };

  const handleCancelDeletePortfolio = () => {
    setShowDeletePortfolioDialog(false);
    setPortfolioToDelete(null);
  };

  const handleCreateCVApi = async () => {
    setIsCreating(true);

    const payload = { type: cvType, template: parseInt(cvTemplate, 10) };
    console.log('Sending create CV request:', payload);

    try {
      if (!currentUser) {
        alert('You must be logged in to create a CV.');
        setIsCreating(false);
        return;
      }
      const idToken = await currentUser.getIdToken();
      if (!idToken) {
        alert('Failed to get authentication token.');
        setIsCreating(false);
        return;
      }
      const res = await fetch(`${API_BASE_URL}/api/v1/cv/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Server error:', errorText);
        alert('Failed to create CV: ' + errorText);
        setIsCreating(false);
        return;
      }
      const data = await res.json();
      // console.log('Create CV response:', data);
      if (data.cv_id) {
        setShowCreateCVDialog(false);
        navigate(`/cv-builder?cv_id=${data.cv_id}`);
      } else {
        alert('Failed to create CV: ' + (data.detail || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error creating CV:', err);
      alert('Error creating CV');
    } finally {
      setIsCreating(false);
    }
  };

  // Check if profile is complete
  // useEffect(() => {
  //   const profileData = localStorage.getItem('userProfile');
  //   if (!profileData && currentUser) {
  //     // Show profile completion dialog for new users
  //     // const timer = setTimeout(() => {
  //     //   setShowProfileDialog(true);
  //     // }, 2000); // Show after 2 seconds

  //    // return () => clearTimeout(timer);
  //   }
  // }, [currentUser]);

  // Mock user data - in real app, this would come from the profile data
  const getUser = () => {
    const profileData = localStorage.getItem('userProfile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      return {
        name: profile.fullName || currentUser?.displayName || 'User',
        email: currentUser?.email || 'user@example.com',
        role: profile.jobTitle || 'Professional',
        joined: 'April 2023',
      };
    }
    return {
      name: currentUser?.displayName || 'User',
      email: currentUser?.email || 'user@example.com',
      role: 'Professional',
      joined: 'April 2023',
    };
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const user = useSelector((state: RootState) => state.authenticate);

  const downloadCV = () => {
    const cvData = localStorage.getItem('cvData');
    if (!cvData) {
      // Create default CV if none exists
      const defaultCV = {
        personalInfo: {
          name: user.name,
          email: user.email,
          phone: '',
          address: '',
        },
        summary: 'Professional with experience in various fields.',
        experience: [],
        education: [],
        skills: [],
      };

      const cvHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>CV - ${defaultCV.personalInfo.name}</title>
            <style>
              body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${defaultCV.personalInfo.name}</h1>
              <p>${defaultCV.personalInfo.email}</p>
            </div>
            <div class="section">
              <h2>Professional Summary</h2>
              <p>${defaultCV.summary}</p>
            </div>
          </body>
        </html>
      `;

      const blob = new Blob([cvHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV-${defaultCV.personalInfo.name}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    const cv = JSON.parse(cvData);
    const cvHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CV - ${cv.personalInfo.name}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .section { margin: 20px 0; }
            .section h2 { color: #333; border-bottom: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${cv.personalInfo.name}</h1>
            <p>${cv.personalInfo.email} | ${cv.personalInfo.phone}</p>
            <p>${cv.personalInfo.address}</p>
          </div>
          <div class="section">
            <h2>Professional Summary</h2>
            <p>${cv.summary}</p>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([cvHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV-${cv.personalInfo.name || 'Resume'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditProfile = () => {
    setShowProfileDialog(true);
  };

  const handleCreateCV = () => {
    navigate('/cv-builder');
  };

  // Mock user data
  const userDummy = {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'Product Designer',
    joined: 'April 2023',
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const { uid, email, displayName } = user;
        //dispatch(setShowGptSearch())
        dispatch(addUser({ uid: uid, email: email, name: displayName }));
        navigate('/dashboard');

        // ...
      } else {
        // User is signed out
        //dispatch(setShowGptSearch())
        dispatch(removeUser());
        navigate('/');
        // ...
      }
    });
  }, []);

  // Fetch CV list when Smart CV tab is active
  useEffect(() => {
    const fetchCvList = async () => {
      if (activeTab !== 'cv') return;
      setCvListLoading(true);
      setCvListError('');
      try {
        if (!currentUser) {
          setCvListError('You must be logged in to view your CVs.');
          setCvListLoading(false);
          return;
        }
        const idToken = await currentUser.getIdToken();
        if (!idToken) {
          setCvListError('Failed to get authentication token.');
          setCvListLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE_URL}/api/v1/cv/list`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          const errorText = await res.text();
          setCvListError('Failed to fetch CVs: ' + errorText);
          setCvListLoading(false);
          return;
        }
        const data = await res.json();
        setCvList(data);
        setFilteredCvList(data); // Initialize filtered list with all CVs
      } catch (err) {
        setCvListError('Error fetching CVs');
      } finally {
        setCvListLoading(false);
      }
    };
    fetchCvList();
  }, [activeTab, currentUser]);

  // Fetch Portfolio list when Portfolio tab is active
  useEffect(() => {
    const fetchPortfolioList = async () => {
      if (activeTab !== 'portfolio') return;
      setPortfolioListLoading(true);
      setPortfolioListError('');
      try {
        if (!currentUser) {
          setPortfolioListError('You must be logged in to view your portfolios.');
          setPortfolioListLoading(false);
          return;
        }
        const idToken = await currentUser.getIdToken();
        if (!idToken) {
          setPortfolioListError('Failed to get authentication token.');
          setPortfolioListLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE_URL}/api/v1/portfolio/list`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          const errorText = await res.text();
          setPortfolioListError('Failed to fetch portfolios: ' + errorText);
          setPortfolioListLoading(false);
          return;
        }
        const data = await res.json();
        setPortfolioList(data);
      } catch (err) {
        setPortfolioListError('Error fetching portfolios');
      } finally {
        setPortfolioListLoading(false);
      }
    };
    fetchPortfolioList();
  }, [activeTab, currentUser]);

  // Filter CVs based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If search is empty, show all CVs
      setFilteredCvList(cvList);
    } else {
      // Filter CVs by title (case-insensitive)
      const filtered = cvList.filter((cv) =>
        cv.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCvList(filtered);
    }
  }, [searchQuery, cvList]);

  // Fetch other users when "others" tab is active
  useEffect(() => {
    const fetchOtherUsers = async () => {
      if (activeTab !== 'others') return;
      setOtherUserListLoading(true);
      setOtherUserListError('');
      try {
        if (!currentUser) {
          setOtherUserListError('You must be logged in to view others.');
          setOtherUserListLoading(false);
          return;
        }
        const idToken = await currentUser.getIdToken();
        if (!idToken) {
          setOtherUserListError('Failed to get authentication token.');
          setOtherUserListLoading(false);
          return;
        }
        const res = await fetch(`${API_BASE_URL}/api/v1/users/others`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          const errorText = await res.text();
          setOtherUserListError('Failed to fetch other users: ' + errorText);
          setOtherUserListLoading(false);
          return;
        }
        const data = await res.json();
        setOtherUserList(data);
      } catch (err) {
        console.error('Error fetching other users:', err);
        setOtherUserListError('Error fetching other users');
      } finally {
        setOtherUserListLoading(false);
      }
    };
    fetchOtherUsers();
  }, [activeTab, currentUser]); // Added dependency array

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };

  // Handler for file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-jobathon-700 font-display font-bold text-2xl">Career Studio</span>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-right">
              <p className="font-medium">{user?.name}</p>
            </div>
            {/* <div className="h-10 w-10 rounded-full bg-jobathon-100 flex items-center justify-center text-jobathon-700 font-medium">
              {user?.name?.charAt(0)}
            </div> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback className="bg-jobathon-100 text-jobathon-600 font-medium">
                    {user?.name
                      ? user?.name.charAt(0).toUpperCase()
                      : user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name || 'User'}</span>
                    <span className="text-xs text-gray-500 font-normal">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="hover:bg-slate-300">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                {/* <div className="flex items-center space-x-3">
                  <div className="h-14 w-14 rounded-full bg-jobathon-100 flex items-center justify-center text-jobathon-700 text-xl font-medium">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div> */}
              </div>

              <nav className="p-2">
                <Button
                  variant={activeTab === 'overview' ? 'default' : 'ghost'}
                  className={`w-full justify-start mb-1 ${activeTab === 'overview' ? 'bg-jobathon-600' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <User size={18} className="mr-2" />
                  Overview
                </Button>

                <Button
                  variant={activeTab === 'cv' ? 'default' : 'ghost'}
                  className={`w-full justify-start mb-1 ${activeTab === 'cv' ? 'bg-jobathon-600' : ''}`}
                  onClick={() => setActiveTab('cv')}
                >
                  <FileText size={18} className="mr-2" />
                  Smart CV
                </Button>
                <Button
                  variant={activeTab === 'education' ? 'default' : 'ghost'}
                  className={`w-full justify-start mb-1 ${activeTab === 'education' ? 'bg-jobathon-600' : ''}`}
                  onClick={() => setActiveTab('education')}
                >
                  <School size={18} className="mr-2" />
                  Education
                </Button>

                <Button
                  variant={activeTab === 'certificates' ? 'default' : 'ghost'}
                  className={`w-full justify-start mb-1 ${activeTab === 'certificates' ? 'bg-jobathon-600' : ''}`}
                  onClick={() => setActiveTab('certificates')}
                >
                  <Award size={18} className="mr-2" />
                  Certificates
                </Button>
                {/* --- New CV Analyzer Section --- */}
                <Button
                  variant={activeTab === 'analyzer' ? 'default' : 'ghost'}
                  className={`w-full justify-start mb-1 ${activeTab === 'analyzer' ? 'bg-jobathon-600' : ''}`}
                  onClick={() => setActiveTab('analyzer')}
                >
                  <BarChart2 size={18} className="mr-2" />
                  CV Analyzer
                </Button>
                {/* --- End New Section --- */}
                <Button
                  variant={activeTab === 'others' ? 'default' : 'ghost'}
                  className={`w-full justify-start mb-1 ${activeTab === 'others' ? 'bg-jobathon-600' : ''}`}
                  onClick={() => setActiveTab('others')}
                >
                  <Award size={18} className="mr-2" />
                  Others
                </Button>
                <Button
                  variant={activeTab === 'portfolio' ? 'default' : 'ghost'}
                  className={`w-full justify-start mb-1 ${activeTab === 'portfolio' ? 'bg-jobathon-600' : ''}`}
                  onClick={() => setActiveTab('portfolio')}
                >
                  <Briefcase size={18} className="mr-2" />
                  Portfolio
                </Button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="cv">Smart CV</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              </TabsList> */}

              <TabsContent value="overview">
                <div className="grid gap-6">
                  {/* User Profile Section */}
                  {user && <UserProfileView onEdit={handleEditProfile} />}
                  <Card>
                    <CardHeader>
                      <CardTitle>Welcome back, {user?.name?.split(' ')[0]}</CardTitle>

                      <CardDescription>
                        Here is an overview of your job search progress.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-jobathon-50 p-6 rounded-lg">
                          <h4 className="text-lg font-medium mb-1">CV Completion</h4>
                          <div className="text-3xl font-bold text-jobathon-700">75%</div>
                          <p className="text-sm text-gray-500 mt-2">
                            Add more projects to reach 100%
                          </p>
                        </div>
                        <div className="bg-jobathon-50 p-6 rounded-lg">
                          <h4 className="text-lg font-medium mb-1">Portfolio Views</h4>
                          <div className="text-3xl font-bold text-jobathon-700">24</div>
                          <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
                        </div>
                        <div className="bg-jobathon-50 p-6 rounded-lg">
                          <h4 className="text-lg font-medium mb-1">Applications</h4>
                          <div className="text-3xl font-bold text-jobathon-700">3</div>
                          <p className="text-sm text-gray-500 mt-2">2 awaiting response</p>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                          <div className="flex items-center p-3 bg-gray-50 rounded-md">
                            <div className="mr-4 h-10 w-10 flex items-center justify-center bg-jobathon-100 rounded-full text-jobathon-600">
                              <FileText size={18} />
                            </div>
                            <div>
                              <p className="font-medium">Updated your CV</p>
                              <p className="text-sm text-gray-500">2 days ago</p>
                            </div>
                          </div>
                          <div className="flex items-center p-3 bg-gray-50 rounded-md">
                            <div className="mr-4 h-10 w-10 flex items-center justify-center bg-accent-100 rounded-full text-accent-600">
                              <Briefcase size={18} />
                            </div>
                            <div>
                              <p className="font-medium">Added new portfolio project</p>
                              <p className="text-sm text-gray-500">5 days ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="cv">
                <Card>
                  <CardHeader>
                    <CardTitle>Smart CV Builder</CardTitle>
                    <CardDescription>Create and manage your professional resumes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Search CVs by title..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          className="pl-10 pr-10"
                        />
                        {searchQuery && (
                          <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            x
                          </button>
                        )}
                      </div>
                      {searchQuery && (
                        <p className="text-sm text-gray-500 mt-2">
                          {filteredCvList.length} CV(s) found for &quot;{searchQuery}&quot;
                        </p>
                      )}
                    </div>

                    {/* CV List Table */}
                    {cvListLoading ? (
                      <div className="py-8 text-center">Loading CVs...</div>
                    ) : cvListError ? (
                      <div className="py-8 text-center text-red-500">{cvListError}</div>
                    ) : cvList.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                        <div className="mb-4">
                          <FileText size={48} className="mx-auto text-blue-200" />
                        </div>
                        <div className="text-xl font-semibold mb-2">No CVs yet</div>
                        <div className="mb-6 text-gray-400 max-w-md mx-auto">
                          You haven’t created any CVs yet. Click the button below to get started and
                          build your professional resume in seconds!
                        </div>
                        <Button className="px-8 py-3 text-lg" onClick={handleOpenCreateCVDialog}>
                          <span className="font-semibold">Create Your First CV</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                        {filteredCvList.map((cv) => (
                          <div
                            key={cv.cv_id}
                            className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-200 p-6 relative group hover:from-blue-50 hover:to-white hover:border-blue-300 min-h-[200px]"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold text-gray-800 truncate max-w-[70%]">
                                {cv.title}
                              </h3>
                              <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${cv.template === 1 ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}
                              >
                                {cv.template === 1 ? 'Basic' : 'Classic'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                              Version: <span className="font-medium">{cv.version_number}</span>
                            </div>
                            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                              <CalendarDays size={14} className="inline-block mr-1 text-blue-300" />
                              Created: {formatDate(cv.created_at)}
                            </div>
                            <div className="text-xs text-gray-400 mb-4 flex items-center gap-1">
                              <CalendarDays size={14} className="inline-block mr-1 text-blue-300" />
                              Updated: {formatDate(cv.updated_at)}
                            </div>
                            <div className="flex space-x-2 absolute bottom-4 right-4 opacity-90 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow"
                                onClick={() => navigate(`/cv-builder?cv_id=${cv.cv_id}`)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="shadow"
                                onClick={() => handleDeleteCV(cv)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Create New CV Button and Dialog remain unchanged */}
                    <Button className="w-full" onClick={handleOpenCreateCVDialog}>
                      Create New CV
                    </Button>
                    <Dialog open={showCreateCVDialog} onOpenChange={setShowCreateCVDialog}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New CV</DialogTitle>
                          <DialogDescription>
                            Select the type of CV you want to create. Template is set to Basic.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="my-4">
                          <label htmlFor="cv-type" className="block mb-2 font-medium">
                            CV Type
                          </label>
                          <select
                            id="cv-type"
                            className="w-full border rounded px-3 py-2"
                            value={cvType}
                            onChange={(e) => setCVType(e.target.value)}
                          >
                            <option value="">Select type</option>
                            <option value="academic">Academic</option>
                            <option value="industry">Industry</option>
                            <option value="general">General</option>
                          </select>
                        </div>
                        <div className="my-2">
                          <label className="block mb-2 font-medium">Template</label>
                          <select
                            id="cv-template"
                            className="w-full border rounded px-3 py-2"
                            value={cvTemplate}
                            onChange={(e) => setCVTemplate(e.target.value)}
                          >
                            <option value="1">Basic</option>
                            <option value="2">Classic</option>
                          </select>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleCreateCVApi} disabled={!cvType || isCreating}>
                            {isCreating ? 'Creating...' : 'Create'}
                          </Button>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="education">
                <EducationView />
              </TabsContent>

              <TabsContent value="analyzer">
                <CVAnalyzer />
              </TabsContent>

              <TabsContent value="others">
                <Card>
                  <CardHeader>
                    <CardTitle>Connect With Others</CardTitle>
                    <CardDescription>Explore other user profiles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Other profile List Table */}
                    {otherUserListLoading ? (
                      <div className="py-8 text-center">Loading users...</div>
                    ) : otherUserListError ? (
                      <div className="py-8 text-center text-red-500">{otherUserListError}</div>
                    ) : otherUserList.length === 0 ? (
                      <div className="py-8 text-center text-gray-500">No users found</div>
                    ) : (
                      <div className="overflow-x-auto mb-6">
                        <table className="min-w-full border text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-4 py-2 border">Username</th>
                              <th className="px-4 py-2 border">Job Title</th>
                              <th className="px-4 py-2 border">Company Name</th>
                              <th className="px-4 py-2 border">Start Date</th>
                              <th className="px-4 py-2 border">End Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {otherUserList.map((profile, index) => (
                              <tr key={index} className="border-b">
                                <td className="px-4 py-2 border">{profile.username}</td>
                                <td className="px-4 py-2 border">{profile.job_title}</td>
                                <td className="px-4 py-2 border">{profile.company_name}</td>
                                <td className="px-4 py-2 border">{profile.start_date}</td>
                                <td className="px-4 py-2 border">{profile.end_date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="certificates">
                <CertificatesView />
              </TabsContent>

              <TabsContent value="portfolio">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Builder</CardTitle>
                    <CardDescription>
                      Showcase your work and projects to potential employers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Portfolio List Table */}
                    {portfolioListLoading ? (
                      <div className="py-8 text-center">Loading portfolios...</div>
                    ) : portfolioListError ? (
                      <div className="py-8 text-center text-red-500">{portfolioListError}</div>
                    ) : portfolioList.length === 0 ? (
                      <div className="py-8 text-center text-gray-500">
                        No portfolios found. Create your first portfolio!
                      </div>
                    ) : (
                      <div className="overflow-x-auto mb-6">
                        <table className="min-w-full border text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="px-4 py-2 border">Title</th>
                              <th className="px-4 py-2 border">Description</th>
                              <th className="px-4 py-2 border">Status</th>
                              <th className="px-4 py-2 border">Created At</th>
                              <th className="px-4 py-2 border">Updated At</th>
                              <th className="px-4 py-2 border">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {portfolioList
                              .filter((portfolio) => portfolio.is_public)
                              .map((portfolio) => (
                                <tr key={portfolio.portfolio_id} className="border-b">
                                  <td className="px-4 py-2 border">{portfolio.title}</td>
                                  <td className="px-4 py-2 border">
                                    {portfolio.description || 'No description'}
                                  </td>
                                  <td className="px-4 py-2 border">
                                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                      Published
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 border">
                                    {new Date(portfolio.created_at).toLocaleString()}
                                  </td>
                                  <td className="px-4 py-2 border">
                                    {new Date(portfolio.updated_at).toLocaleString()}
                                  </td>
                                  <td className="px-4 py-2 border">
                                    <div className="flex space-x-2">
                                      <Link
                                        to={`/portfolio/builder/${portfolio.portfolio_id}`}
                                        className="flex-1"
                                      >
                                        <Button
                                          size="sm"
                                          className="w-full bg-jobathon-600 hover:bg-jobathon-700"
                                        >
                                          Edit
                                        </Button>
                                      </Link>
                                      {/* <Link to="/portfolio" className="flex-1">
            <Button size="sm" variant="outline" className="w-full">
              View
            </Button>
          </Link> */}
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleDeletePortfolio(portfolio)}
                                      >
                                        <Trash2 size={16} />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Create New Portfolio Button */}
                    <Link to="/portfolio" className="w-full">
                      <Button className="w-full">Create New Portfolio</Button>
                    </Link>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <ProfileCompletionDialog
        open={showProfileDialog}
        onClose={() => setShowProfileDialog(false)}
        currentUser={currentUser}
      />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your CV.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeletePortfolioDialog} onOpenChange={setShowDeletePortfolioDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDeletePortfolio}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeletePortfolio}
              disabled={isDeletingPortfolio}
            >
              {isDeletingPortfolio ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
