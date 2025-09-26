import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <div className="relative text-center bg-white overflow-hidden">
        <div className="container mx-auto px-6 py-16 md:py-32">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            Hassle-Free Doctor Appointments, <br className="hidden sm:block" /> Just a Click Away. 👋
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 px-2">
            Find top-rated doctors, check their real-time availability, and book your slot instantly. Welcome to the future of healthcare in India.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-2">
            <Link
              to="/patient"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:-translate-y-1 text-center"
            >
              Book an Appointment Now →
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gray-200 text-blue-600 font-bold rounded-lg shadow-lg hover:bg-gray-300 transition duration-300 text-center"
            >
              Are you a Doctor? Join Us →
            </Link>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission: Simplifying Your Healthcare Journey</h2>
          <p className="text-gray-600 max-w-4xl mx-auto text-base sm:text-lg px-2">
            Tired of busy phone lines and endless waiting? We've reimagined the appointment process. DocConnect removes the uncertainty and frustration, connecting you directly with doctors' schedules so you can book with confidence and ease.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">Features Tailored For You ✨</h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Patients Section */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border-t-4 border-blue-500">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-700">For Our Patients 🤕</h3>
              <ul className="space-y-3 sm:space-y-4 text-gray-600 text-sm sm:text-base">
                <li><span className="font-bold">📅 Find Doctors by Date:</span> Simply pick a date to see all available doctors.</li>
                <li><span className="font-bold">✅ Instant Booking Confirmation:</span> Secure your slot in real-time, 24/7, without a phone call.</li>
                <li><span className="font-bold">💳 Secure & Flexible Payments:</span> Pay online via Stripe or choose to pay offline at the clinic.</li>
                <li><span className="font-bold">🗓️ Manage Your Bookings:</span> View all your appointments in your personal dashboard.</li>
              </ul>
            </div>
            {/* Doctors Section */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border-t-4 border-green-500">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-green-700">For Our Doctors 🩺</h3>
              <ul className="space-y-3 sm:space-y-4 text-gray-600 text-sm sm:text-base">
                <li><span className="font-bold">🗓️ Effortless Schedule Management:</span> Set your daily availability, consultation duration, and total slots.</li>
                <li><span className="font-bold">👨‍⚕️ Professional Profile:</span> Attract patients by showcasing your specialty, bio, and profile picture.</li>
                <li><span className="font-bold">📆 Appointments at a Glance:</span> Access a clear, calendar-based view of all your bookings.</li>
                <li><span className="font-bold">🤖 Automated & Efficient:</span> Our system manages your schedule automatically, letting you focus on patients.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-12">How It Works in 3 Simple Steps</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
            <div className="p-4 sm:p-6">
              <div className="text-4xl sm:text-5xl mb-4">🔍</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">1. Search & Discover</h3>
              <p className="text-gray-600 text-sm sm:text-base">Select a date that works for you and browse through the profiles of available doctors.</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-4xl sm:text-5xl mb-4">👆</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">2. Select Your Slot</h3>
              <p className="text-gray-600 text-sm sm:text-base">Choose a doctor and pick an open time slot from their real-time schedule.</p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="text-4xl sm:text-5xl mb-4">✅</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">3. Confirm & Relax</h3>
              <p className="text-gray-600 text-sm sm:text-base">Confirm your booking by paying online or choosing to pay later. It's that simple!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-blue-600 text-white">
        <div className="container mx-auto px-6 py-16 md:py-20 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">Ready to Experience the Difference?</h2>
          <p className="text-blue-200 text-base sm:text-lg mb-8">Join the growing community of patients and doctors who are making healthcare simpler.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 text-center">
              I'm a Patient, Get Started →
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 transition duration-300 text-center">
              I'm a Doctor, Join the Network →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xl sm:text-2xl font-bold mb-2">DocConnect</p>
          <div className="flex flex-wrap justify-center gap-4 my-4 text-sm sm:text-base">
            <Link to="#" className="hover:text-blue-300">About Us</Link>
            <Link to="#" className="hover:text-blue-300">Contact</Link>
            <Link to="#" className="hover:text-blue-300">Privacy Policy</Link>
            <Link to="#" className="hover:text-blue-300">Terms of Service</Link>
          </div>
          <p className="text-xs sm:text-sm">&copy; {new Date().getFullYear()} DocConnect. All Rights Reserved. Made with ❤️ in India</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
