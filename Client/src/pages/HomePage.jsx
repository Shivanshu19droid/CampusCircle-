import HomeLayout from "../layouts/HomeLayouts.jsx";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const user = useSelector((state) => state.auth.data);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const navigate = useNavigate();


  useEffect(() => {
    console.log(user);
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

 return (

!isLoggedIn ? (

  /* ================= LANDING PAGE ================= */
  <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">

    <div className="max-w-7xl mx-auto px-6 py-16">

      {/* HERO */}
      <div className="text-center mb-20">

        <h1 className="text-5xl md:text-6xl font-bold text-indigo-900">
          CampusCircle
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mt-4 max-w-2xl mx-auto">
          Your campus at your fingertips — connect with students, discover opportunities,
          join communities, and stay updated with everything happening around you.
        </p>

        {/* PRIMARY ACTION */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">

          <button
            onClick={() => navigate("/register")}
            className="px-10 py-4 text-lg font-semibold bg-indigo-900 text-white rounded-xl shadow-lg hover:bg-indigo-800 hover:shadow-xl transition"
          >
            Join CampusCircle
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-10 py-4 text-lg font-semibold border-2 border-indigo-900 text-indigo-900 rounded-xl hover:bg-indigo-50 transition"
          >
            Log In
          </button>

        </div>

      </div>

      {/* FEATURE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">

        {/* Communities */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-lg transition">

          <div className="text-indigo-900 text-xl font-semibold mb-3">
            Communities
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Join clubs, student groups, and discussions happening across campus.
          </p>

          <img
            src="/images/communities.jpg"
            alt="Communities"
            className="w-full h-44 object-cover rounded-lg"
          />

        </div>

        {/* Events */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-lg transition">

          <div className="text-indigo-900 text-xl font-semibold mb-3">
            Events
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Discover hackathons, workshops, seminars, and meetups happening on campus.
          </p>

          <img
            src="/images/events.jpg"
            alt="Events"
            className="w-full h-44 object-cover rounded-lg"
          />

        </div>

        {/* Opportunities */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-lg transition">

          <div className="text-indigo-900 text-xl font-semibold mb-3">
            Opportunities
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Find internships, competitions, scholarships, and career opportunities.
          </p>

          <img
            src="/images/opportunities.jpg"
            alt="Opportunities"
            className="w-full h-44 object-cover rounded-lg"
          />

        </div>

      </div>

      {/* VALUE STRIP */}
      <div className="grid md:grid-cols-3 gap-8 text-center">

        <div className="p-6 bg-white rounded-xl border border-slate-200">
          <h3 className="font-semibold text-indigo-900 mb-2">
            Stay Connected
          </h3>
          <p className="text-sm text-slate-600">
            Keep track of what’s happening across student communities.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200">
          <h3 className="font-semibold text-indigo-900 mb-2">
            Discover Opportunities
          </h3>
          <p className="text-sm text-slate-600">
            Access internships, competitions, and campus announcements.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-slate-200">
          <h3 className="font-semibold text-indigo-900 mb-2">
            Build Your Network
          </h3>
          <p className="text-sm text-slate-600">
            Connect with students, alumni, and peers across your campus.
          </p>
        </div>

      </div>

    </div>

  </div>

) : (

  /* ================= LOGGED IN DASHBOARD ================= */
  <HomeLayout>

    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* HERO */}
      <div className="text-center mb-16">

        <h1 className="text-5xl font-bold text-indigo-900">
          CampusCircle
        </h1>

        <p className="text-lg text-slate-500 mt-3">
          Your campus at your fingertips
        </p>

      </div>

      {/* Welcome */}
      <div className="text-center mb-12">

        <h2 className="text-3xl font-semibold text-slate-800">
          Welcome back, {user?.fullName || "Student"} 👋
        </h2>

        <p className="text-slate-500 mt-2">
          What would you like to explore today?
        </p>

      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Communities */}
        <div
          onClick={() => navigate("/communities")}
          className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-3">
            Communities
          </h3>
          <p className="text-sm text-slate-600">
            Join conversations and collaborate with students.
          </p>
        </div>

        {/* Events */}
        <div
          onClick={() => navigate("/events")}
          className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-3">
            Events
          </h3>
          <p className="text-sm text-slate-600">
            Discover hackathons, workshops, and campus meetups.
          </p>
        </div>

        {/* Opportunities */}
        <div
          onClick={() => navigate("/opportunities")}
          className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
        >
          <h3 className="text-xl font-semibold text-slate-800 mb-3">
            Opportunities
          </h3>
          <p className="text-sm text-slate-600">
            Find internships, jobs, and competitions.
          </p>
        </div>

      </div>

    </div>

  </HomeLayout>

)

);
};

export default Home;
