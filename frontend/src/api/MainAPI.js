import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/"

const instanse = axios.create({
    baseURL: `${baseUrl}`,
});


export const MainAPI = {
    async getItems(skip, limit) {
        return await instanse
            .get(`items/?skip=${skip}&limit=${limit}`, {
                headers: { "Authorization": `Basic ${localStorage.getItem("auth")}` }
            })
            .then((res) => {
                return res.data;
            });
    },
    async SetItem(body) {
        return await instanse
            .post(`items/`, body, {
                headers: { "Authorization": `Basic ${localStorage.getItem("auth")}` }
            })
            .then((res) => {
                return res.data;
            })
    },
    async Export() {
        return await instanse
            .get(`export/items/`, {
                headers: { "Authorization": `Basic ${localStorage.getItem("auth")}`, responseType: "blob" },
            })
            .then((res) => {
                return res.data;
            })
    },
    async UpdateItem(number, body) {
        return await instanse
            .put(`items/${number}`, body)
            .then((res) => {
                return res.data
            })
    },
    async DeleteItem(number) {
        return await instanse
            .delete(`items/${number}`)
            .then((res) => {
                return res.data
            })
    }
}