import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LMS Portal
              </span>
              {' '}© {new Date().getFullYear()}
            </p>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span>Learning Management System</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Built with MERN Stack</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
