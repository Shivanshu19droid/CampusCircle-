const Footer = () => {
  return (
    <footer className="text-center py-5 text-sm text-gray-500 border-t bg-gray-50 tracking-wide">
      © {new Date().getFullYear()} <span className="text-indigo-600 font-medium">CampusCircle</span>. All rights reserved.
    </footer>
  );
};

export default Footer;

