export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} <span className="text-red-500">Smart</span><span className="text-cyan-500">Wave</span> Cards. Crafted by <span className="italic text-cyan-500">ExBeyond Inc</span>. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <nav className="flex space-x-4">
              <a 
                href="/privacy" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Terms of Service
              </a>
              <a 
                href="/contact" 
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
} 