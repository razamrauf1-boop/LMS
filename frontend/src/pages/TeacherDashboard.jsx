import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Users, FileText, BarChart3, Search, Plus, Edit, Trash2, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/SkeletonLoader';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [resultToDelete, setResultToDelete] = useState(null);
  const [formData, setFormData] = useState({ subject: '', marks: '' });

  useEffect(() => {
    fetchStudents();
    fetchResults();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/students?search=${searchTerm}`);
      setStudents(response.data.students);
    } catch (error) {
      toast.error('Failed to load students');
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      setResultsLoading(true);
      const response = await api.get('/results');
      setResults(response.data.results);
    } catch (error) {
      toast.error('Failed to load results');
      console.error('Error fetching results:', error);
    } finally {
      setResultsLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!loading) fetchStudents();
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleAddResult = (student) => {
    setSelectedStudent(student);
    setFormData({ subject: '', marks: '' });
    setShowModal(true);
  };

  const handleEditResult = (result) => {
    setSelectedStudent(result.student);
    setFormData({ subject: result.subject, marks: result.marks.toString() });
    setShowModal(true);
  };

  const handleSubmitResult = async (e) => {
    e.preventDefault();
    try {
      const marks = parseFloat(formData.marks);
      if (marks < 0 || marks > 100) {
        toast.error('Marks must be between 0 and 100');
        return;
      }

      const existingResult = results.find(
        r => r.student._id === selectedStudent._id && r.subject === formData.subject
      );

      if (existingResult) {
        await api.put(`/results/${existingResult._id}`, {
          marks,
          subject: formData.subject
        });
        toast.success('Result updated successfully');
      } else {
        await api.post('/results', {
          studentId: selectedStudent._id,
          subject: formData.subject,
          marks
        });
        toast.success('Result added successfully');
      }

      setShowModal(false);
      fetchResults();
      setFormData({ subject: '', marks: '' });
      setSelectedStudent(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving result');
    }
  };

  const handleDeleteClick = (result) => {
    setResultToDelete(result);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/results/${resultToDelete._id}`);
      toast.success('Result deleted successfully');
      fetchResults();
      setResultToDelete(null);
    } catch (error) {
      toast.error('Failed to delete result');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const recentResults = results.slice(0, 5);

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
              <h1 className="text-3xl font-bold mb-2">Teacher Dashboard</h1>
              <p className="text-blue-100">Manage students and their results</p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-4">
           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{students.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Results</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{results.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {results.length > 0 
                        ? (results.reduce((sum, r) => sum + r.marks, 0) / results.length).toFixed(1)
                        : '0'
                      }%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            
            <div className="mb-6">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm"
                />
              </div>
            </div>

           
            <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden border border-gray-100">
              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Students</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                    {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
                  </span>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {loading ? (
                  <TableSkeleton rows={5} cols={3} />
                ) : filteredStudents.length === 0 ? (
                  <EmptyState
                    title="No students found"
                    message={searchTerm ? "Try adjusting your search terms" : "No students registered yet"}
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.map((student) => (
                          <tr key={student._id} className="hover:bg-gray-50 transition">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => handleAddResult(student)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-900 font-medium transition"
                              >
                                <Plus className="w-4 h-4" />
                                Add Result
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Results</h2>
                  {results.length > 5 && (
                    <button
                      onClick={() => navigate('/teacher/results')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View All →
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 sm:p-6">
                {resultsLoading ? (
                  <TableSkeleton rows={5} cols={5} />
                ) : recentResults.length === 0 ? (
                  <EmptyState
                    title="No results yet"
                    message="Start adding results for your students"
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                          <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentResults.map((result) => (
                          <tr key={result._id} className="hover:bg-gray-50 transition">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{result.student.name}</div>
                              <div className="text-sm text-gray-500">{result.student.email}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{result.subject}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{result.marks}%</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                result.grade === 'A+' || result.grade === 'A' ? 'bg-green-100 text-green-800' :
                                result.grade === 'B+' || result.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                                result.grade === 'C+' || result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {result.grade}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end gap-3">
                                <button
                                  onClick={() => handleEditResult(result)}
                                  className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition"
                                  title="Edit result"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(result)}
                                  className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition"
                                  title="Delete result"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedStudent(null);
          setFormData({ subject: '', marks: '' });
        }}
        title={formData.subject ? 'Edit Result' : 'Add Result'}
      >
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Student:</p>
          <p className="font-semibold text-gray-900">{selectedStudent?.name}</p>
          <p className="text-xs text-gray-500">{selectedStudent?.email}</p>
        </div>
        <form onSubmit={handleSubmitResult} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., Mathematics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marks (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter marks"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md font-semibold"
            >
              Save Result
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setSelectedStudent(null);
                setFormData({ subject: '', marks: '' });
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      
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

    
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setResultToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Result"
        message={`Are you sure you want to delete the result for ${resultToDelete?.student?.name} in ${resultToDelete?.subject}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default TeacherDashboard;
