import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function logout (){
    const navigate = useNavigate()
    useEffect(()=>{
        navigate("/")
    },[])
    return <></>
}

export default logout