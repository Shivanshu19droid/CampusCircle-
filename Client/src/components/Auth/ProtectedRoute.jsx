import { Navigate } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux";

function ProtectedRoutes({children}) {
     
    const navigate = useNavigate();
    const loggedInUser = useSelector((state) => state.auth.data)

    if(!loggedInUser){
        navigate("/login")
    }

    return children
}

export default ProtectedRoutes;