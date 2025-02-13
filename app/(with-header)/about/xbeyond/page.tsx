import { FaLightbulb, FaUsers, FaGlobe } from 'react-icons/fa'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            About <span className="text-cyan-600">ExBeyond Inc</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Transforming business through sustainable, digital AI solutions.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To make business processes easier and more efficient by providing cutting-edge digital solutions that enhance efficiency and sustainability in the modern business world.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To become leading provider of AI solutions for business processes especially in the area of business intelligence and data analytics.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <FaLightbulb className="w-12 h-12 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Innovation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Constantly pushing boundaries to create cutting-edge solutions
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <FaUsers className="w-12 h-12 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Customer Focus
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Putting our users' needs at the heart of everything we do
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <FaGlobe className="w-12 h-12 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sustainability
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Committed to reducing environmental impact through digital solutions
              </p>
            </div>
          </div>
        </div>

        {/* Company Info */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About ExBeyond Inc
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            ExBeyond Inc is a technology company founded by Suresh Menon, Engineer and Supply Chain and projects specialist with 40 years of experience, with the vision of bridging traditional business practices in Supply Chain and Projects with digital innovations, to make business processes easier and more efficient.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Our flagship products, SmartWave and SmartWave AI, represents our commitment to revolutionizing professional networking through sustainable, feature-rich digital business cards. We combine cutting-edge technology with user-friendly design to create solutions that make business connections more efficient and environmentally conscious.
          </p>
        </div>
      </div>
    </div>
  )
}