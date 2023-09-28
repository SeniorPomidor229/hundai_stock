import { useNavigate } from "react-router-dom"

const LogoPiece = () => {
    const navigate = useNavigate();

    const handleExit = () => {
        localStorage.removeItem("auth");
        navigate("/")
    }

    return (
        <div className="logo-piece">
            <img src="/logo.jpeg" alt="logo" />
            <button onClick={() => {handleExit()}} >Выйти</button>
        </div>
    )
}

export default LogoPiece