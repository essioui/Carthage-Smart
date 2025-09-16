import { FaLinkedin, FaFacebook, FaMedium } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-1 px-8 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">

        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">Carthage Smart</h2>
        </div>

        <div className="flex space-x-6">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer">
            <FaLinkedin className="w-6 h-6 text-blue-600 hover:text-blue-500 transition duration-300" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FaFacebook className="w-6 h-6 text-blue-800 hover:text-blue-600 transition duration-300" />
          </a>
          <a href="https://medium.com" target="_blank" rel="noreferrer">
            <FaMedium className="w-6 h-6 text-gray-400 hover:text-gray-200 transition duration-300" />
          </a>
        </div>

        <div className="text-center md:text-right">
          <h3 className="font-semibold mb-1">Contact Us</h3>
          <p className="text-sm">info@carthagesmart.com</p>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-400">
        © 2025 Carthage Smart. All rights reserved.
      </div>
    </footer>
  );
}
