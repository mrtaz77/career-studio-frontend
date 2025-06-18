import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Briefcase, User, LogOut } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useEffect } from 'react';
import { addUser, removeUser } from '../utils/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //const user = useSelector((store) => store.authenticate)
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
        dispatch(addUser({ uid: uid, email: email, displayName: displayName }));
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
              <p className="font-medium">{userDummy.name}</p>
              <p className="text-gray-500">{userDummy.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-jobathon-100 flex items-center justify-center text-jobathon-700 font-medium">
              {userDummy.name.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-14 w-14 rounded-full bg-jobathon-100 flex items-center justify-center text-jobathon-700 text-xl font-medium">
                    {userDummy.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{userDummy.name}</h3>
                    <p className="text-sm text-gray-500">{userDummy.email}</p>
                  </div>
                </div>
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
                  variant={activeTab === 'portfolio' ? 'default' : 'ghost'}
                  className={`w-full justify-start mb-1 ${activeTab === 'portfolio' ? 'bg-jobathon-600' : ''}`}
                  onClick={() => setActiveTab('portfolio')}
                >
                  <Briefcase size={18} className="mr-2" />
                  Portfolio
                </Button>
              </nav>

              <div className="p-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut size={18} className="mr-2" />
                  Log out
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="cv">Smart CV</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Welcome back, {userDummy.name.split(' ')[0]}</CardTitle>

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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="border border-gray-200 rounded-lg p-4 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">Professional Resume</h3>
                          <p className="text-sm text-gray-500 mb-3">Last edited 5 days ago</p>
                          <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">
                            Resume Preview
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <Button className="flex-1 bg-jobathon-600 hover:bg-jobathon-700">
                            Edit
                          </Button>
                          <Button variant="outline" className="flex-1">
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="border border-dashed border-gray-200 rounded-lg p-4 flex items-center justify-center">
                        <div className="text-center">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-500"
                            >
                              <path d="M12 5v14M5 12h14"></path>
                            </svg>
                          </div>
                          <h3 className="font-medium mb-1">Create New Resume</h3>
                          <p className="text-sm text-gray-500">
                            Start from scratch or use a template
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">Create New CV</Button>
                  </CardContent>
                </Card>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="border border-gray-200 rounded-lg p-4 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">My Portfolio</h3>
                          <p className="text-sm text-gray-500 mb-3">Published • 3 projects</p>
                          <div className="h-32 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">
                            Portfolio Preview
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <Button className="flex-1 bg-jobathon-600 hover:bg-jobathon-700">
                            Edit
                          </Button>
                          <Button variant="outline" className="flex-1">
                            View
                          </Button>
                        </div>
                      </div>

                      <div className="border border-dashed border-gray-200 rounded-lg p-4 flex items-center justify-center">
                        <div className="text-center">
                          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-500"
                            >
                              <path d="M12 5v14M5 12h14"></path>
                            </svg>
                          </div>
                          <h3 className="font-medium mb-1">Add Project</h3>
                          <p className="text-sm text-gray-500">Showcase your best work</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">Create New Portfolio</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
