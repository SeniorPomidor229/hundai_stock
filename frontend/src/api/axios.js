import axios from "axios"

const baseUrl = "http://127.0.0.1:8000/"

const instanse = axios.create({
    baseURL: `${baseUrl}`,
});


export default instanse;