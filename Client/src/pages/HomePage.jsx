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
    <div className="flex justify-center items-center mt-10 px-4">
      
      <div className="w-full max-w-3xl bg-white rounded-[24px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:scale-[1.01] transition-transform duration-200 text-center">
        
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Welcome to CampusCircle 🎓
        </h1>

        <p className="text-gray-600 leading-relaxed">
          Stay connected with your campus, discover opportunities, and grow your
          campus network — all in one place.
        </p>

      </div>

    </div>
  </HomeLayout>
);

};



export default Home;
