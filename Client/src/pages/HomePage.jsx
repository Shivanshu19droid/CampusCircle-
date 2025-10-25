import HomeLayout from "../layouts/HomeLayouts.jsx";
import { useEffect } from "react";
import { useSelector } from "react-redux";

  
const Home = () => {

  const user = useSelector((state) => state.auth.data);

  useEffect(() => {
    console.log(user);
  });

  return (
    <HomeLayout>
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold mb-3 text-gray-800">
          Welcome to CampusCircle 🎓
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Stay connected with your campus, discover opportunities, and grow your
          campus network — all in one place.
        </p>
      </div>
    </HomeLayout>
  );
};



export default Home;
