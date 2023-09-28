import { useState } from "react"
import instanse from "../api/axios";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const [hendled, setHendled] = useState(false);
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        setHendled(true);
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
            setIsError(true)
            console.log(error)
        }
    }

    return (
        <div className="login-screen-wrapper">
            <h1>STOCK LIST "HYUNDAI"</h1>
            <h3>Дата последнего обновления: 2023-09-27 13:37:07</h3>
            <div className="login-wrapper">
                <input className="input" type="text" value={login} onChange={event => { setLogin(event.target.value) }} placeholder="login" />
                <p className={`${(hendled || login.trim().length === 0) ? "required__visible" : "required"}`}>Заполните поле</p>

                <input className="input" type="password" value={password} onChange={event => { setPassword(event.target.value) }} placeholder="password" />
                <p className={`${(hendled || password.trim().length === 0) ? "required__visible" : "required"}`}>Заполните поле</p>
                
                <button disabled={(password.trim().length === 0 || login.trim().length === 0)} onClick={() => { handleLogin() }} className="button login-button">Войти</button>

                <p className={`${(isError) ? "required__visible" : "required"}`}>Вы не правильно ввели данные</p>
            </div>
        </div>
    )
}

export default LoginScreen