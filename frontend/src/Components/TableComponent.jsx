import { useEffect, useState } from "react";
import { MainAPI } from "../api/MainAPI";

const TableScreen = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(50);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const items = await MainAPI.getItems(0, 10);
            console.log(items)
            setData(items);
        };

        fetchData();
    }, []);


    return (
        <div className="table-wrapper">
            <h1>STOCK LIST "HYUNDAI"</h1>
            <h3>Дата последнего обновления: 2023-09-27 13:37:07</h3>
            <div className="pagination-wrapper">
                <p>Показано {limit} позиций. Всего найдено {total} записей</p>
                <button className="pagin-button">Преведущая</button>
                <button className="pagin-button">Следующая</button>
            </div>

            <div className="table-wrapper">
                <table>
                    <tr>
                    
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default TableScreen;