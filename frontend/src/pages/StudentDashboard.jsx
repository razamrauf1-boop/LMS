import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { BookOpen, TrendingUp, Award, FileText } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { CardSkeleton, StatsSkeleton, TableSkeleton } from '../components/SkeletonLoader';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchResults();
  }, []);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      const response = await api.get('/profile');
      setProfile(response.data.user);
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Error fetching profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      setResultsLoading(true);
      const response = await api.get('/results/my');
      setResults(response.data.results);
    } catch (error) {
      toast.error('Failed to load results');
      console.error('Error fetching results:', error);
    } finally {
      setResultsLoading(false);
    }
  };

  const calculateAverage = () => {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, result) => sum + result.marks, 0);
    return (total / results.length).toFixed(2);
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'bg-green-100 text-green-800';
    if (grade === 'B+' || grade === 'B') return 'bg-blue-100 text-blue-800';
    if (grade === 'C+' || grade === 'C') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        onMenuClick={() => setSidebarOpen(true)} 
        onLogoutClick={() => setShowLogoutModal(true)}
      />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col lg:pl-64">
        <main className="flex-1">
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold mb-2">Student Dashboard</h1>
              <p className="text-blue-100">View your profile and academic results</p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4">
            
            <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden border border-gray-100">
              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
              </div>
              <div className="p-4 sm:p-6">
                {profileLoading ? (
                  <CardSkeleton />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center space-x-4">
                        {profile?.avatar ? (
                          <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-20 h-20 rounded-full ring-4 ring-blue-100"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-blue-100">
                            {profile?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{profile?.name}</h3>
                          <p className="text-gray-600">{profile?.email}</p>
                          <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                            Student
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-end">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600">{calculateAverage()}%</div>
                        <div className="text-sm text-gray-600 mt-1">Average Score</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

           
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">My Results</h2>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-full">
                    {results.length} {results.length === 1 ? 'Subject' : 'Subjects'}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {resultsLoading ? (
                  <TableSkeleton rows={5} cols={4} />
                ) : results.length === 0 ? (
                  <EmptyState
                    title="No results available"
                    message="Your teacher will add results soon. Check back later!"
                    icon={<FileText className="w-8 h-8 text-gray-400" />}
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {results.map((result) => (
                          <tr key={result._id} className="hover:bg-gray-50 transition">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{result.subject}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-semibold text-gray-900">{result.marks}%</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getGradeColor(result.grade)}`}>
                                {result.grade}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{result.teacher?.name || 'N/A'}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

           
            {results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium opacity-90 mb-1">Total Subjects</div>
                      <div className="text-3xl font-bold">{results.length}</div>
                    </div>
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-black" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium opacity-90 mb-1">Average Score</div>
                      <div className="text-3xl font-bold">{calculateAverage()}%</div>
                    </div>
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-black" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium opacity-90 mb-1">Highest Score</div>
                      <div className="text-3xl font-bold">
                        {Math.max(...results.map(r => r.marks))}%
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-black" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>

      
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        variant="primary"
      />
    </div>
  );
};

export default StudentDashboard;
