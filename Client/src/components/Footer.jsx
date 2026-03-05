const Footer = () => {
  return (
  <footer className="bg-gradient-to-b from-indigo-900 to-[#2E2A8C] text-white mt-16">
    
    {/* Main Footer Content */}
    <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
      
      {/* Brand Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">CampusCircle</h2>
        <p className="text-sm text-white/80 leading-relaxed">
          Connecting Students, Faculty & Alumni.
        </p>
        <p className="text-sm text-white/80 leading-relaxed mt-2">
          Elevating Academic Excellence Through Modern SaaS Solutions.
        </p>
      </div>

      {/* About Us */}
      <div>
        <h3 className="text-sm font-semibold tracking-wider mb-4 uppercase text-white/90">
          About Us
        </h3>
        <ul className="space-y-2 text-sm text-white/80">
          <li className="hover:text-white transition">Our Mission</li>
          <li className="hover:text-white transition">Careers</li>
          <li className="hover:text-white transition">Blog</li>
        </ul>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-sm font-semibold tracking-wider mb-4 uppercase text-white/90">
          Resources
        </h3>
        <ul className="space-y-2 text-sm text-white/80">
          <li className="hover:text-white transition">Documentation</li>
          <li className="hover:text-white transition">Help Center</li>
          <li className="hover:text-white transition">API Status</li>
        </ul>
      </div>

      {/* Support */}
      <div>
        <h3 className="text-sm font-semibold tracking-wider mb-4 uppercase text-white/90">
          Support
        </h3>
        <ul className="space-y-2 text-sm text-white/80">
          <li className="hover:text-white transition">Contact Us</li>
          <li className="hover:text-white transition">Live Chat</li>
          <li className="hover:text-white transition">System Updates</li>
        </ul>
      </div>
    </div>

    {/* Divider */}
    <div className="border-t border-white/20" />

    {/* Bottom Bar */}
    <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-white/80">
      
      <p>
        © {new Date().getFullYear()} CampusCircle. All rights reserved.
      </p>

      <div className="flex items-center gap-5 mt-4 md:mt-0">
        <span className="hover:text-white transition cursor-pointer">Facebook</span>
        <span className="hover:text-white transition cursor-pointer">Twitter</span>
        <span className="hover:text-white transition cursor-pointer">LinkedIn</span>
        <span className="hover:text-white transition cursor-pointer">Instagram</span>
      </div>
    </div>

  </footer>
);
};

export default Footer;

