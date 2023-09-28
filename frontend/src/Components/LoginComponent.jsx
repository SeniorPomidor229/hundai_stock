import { useState } from "react"
import instanse from "../api/axios";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const encodedCredentials = window.btoa(unescape(encodeURIComponent((`${login}:${password}`))));
            console.log(encodedCredentials)
            await instanse
                .get("", {
                    headers: { "Authorization": `Basic ${encodedCredentials}` }
                })
                .then((res) => {
                    localStorage.setItem("auth", encodedCredentials);
                    navigate("/table")
                })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="login-screen-wrapper">
            <h1>STOCK LIST "HYUNDAI"</h1>
            <h3>Дата последнего обновления: 2023-09-27 13:37:07</h3>
            <div className="login-wrapper">
                <input type="text" value={login} onChange={event => { setLogin(event.target.value) }} placeholder="login" />
                <p className={`${login.trim().length === 0 ? "required__visible" : "required"}`}>Заполните поле</p>
                <input type="password" value={password} onChange={event => { setPassword(event.target.value) }} placeholder="password" />
                <p className={`${password.trim().length === 0 ? "required__visible" : "required"}`}>Заполните поле</p>
                <button onClick={() => { handleLogin() }} className="login-button">Войти</button>
                <p className="">Вы не правильно ввели данные</p>
            </div>
        </div>
    )
}

export default LoginScreen