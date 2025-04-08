import { useNavigate } from "react-router-dom";

const logout = () =>{
    const navigate = useNavigate()
    navigate("/")
}

export default logout