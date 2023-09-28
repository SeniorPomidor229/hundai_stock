import { useEffect, useState } from "react";
import DataTable, { defaultThemes } from 'react-data-table-component';
import { MainAPI } from "../api/MainAPI";
import { CustomModal } from "./Modal";
import Checkbox from 'rc-checkbox';

import { AiOutlineFileExcel, AiOutlinePlus, AiOutlineTable } from 'react-icons/ai';

const customStyles = {
    table: {
        style: {
            minHeight: "80vh",
        }
    },
    headRow: {
        style: {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: defaultThemes.default.divider.default,
        },
    },
    headCells: {
        style: {
            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
            },
        },
    },
    cells: {
        style: {
            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
            },
        },
    },
};

const paginationPerPage = 10;

const init = {
    "N": "",
    "Клиент": "",
    "Марка": "",
    "Модель": "",
    "Надстройка": "",
    "Про_во": "",
    "ID": "",
    "VIN": "",
    "VIN_KZ": "",
    "Статус_ОП": "",
    "Статус_движение": "",
    "Статус_производство": "",
    "Статус_ОП_Движ": "",
    "Статус_ОП_Произодство": "",
    "Обновить_Статус": "",
    "Ремонт_производство": "",
    "Хранение_ОП": "",
    "Стоимость_по_прайсу": 0,
    "Скидка_Дилера": 0,
    "Скидка_Дистрибьютора": 0,
    "Маржа_Дилера_процент": 0,
    "Маржа_Дилера_доллар": 0,
    "Финансирование": "",
    "Стоимость_за_ед_по_контракту": 0,
    "Дата_ДКП": "2023-09-28T13:45:27.222Z",
    "Оплата_по_ДКП": "",
    "Остаток_по_оплате": 0,
    "Срок_оплаты": "2023-09-28T13:45:27.222Z",
    "Срок_постановки": "2023-09-28T13:45:27.222Z",
    "Осталось_дней": 0,
    "Дата_реализации": "2023-09-28T13:45:27.222Z",
    "Квота": "",
    "Статус_квоты": "",
    "Продажа_от_НТА_НСТК": "",
    "Дата_квотирования": "2023-09-28T13:45:27.222Z",
    "Срок_квотирования": 0,
    "Осталось_Дней_в_квоте": 0,
    "Примечания_НТА_Производство": "",
    "Примечания_НТА_Сопровождения": "",
    "Примечание_НСТК": "",
    "CT_KZ": "",
    "Утиль_сбор": "",
    "Дата_таможенной_очистки": "2023-09-28T13:45:27.222Z",
    "Оплата_производителю": "",
    "Дата_оплаты_произв": "2023-09-28T13:45:27.222Z",
    "Условие_оплаты_призв": "",
    "Срок_заморозки_ДС": "2023-09-28T13:45:27.222Z",
    "Номер_партии": "",
    "Номер_ДТ_ИМ77": ""
}

const TableScreen = () => {
    const [skip, setSkip] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [tableData, setTableData] = useState([]);
    const [tableCols, setTableCols] = useState([]);

    const [filtredTableCols, setFiltredTableCols] = useState([]);

    const [selected, setSelected] = useState([]);

    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const [dataAdd, setDataAdd] = useState(init);

    const handleData = (obj) => {
        setDataAdd({ ...dataAdd, ...obj })
    }

    const handleModal = () => {
        setShow(!show)
    }

    const handleAddModal = () => {
        setShowAdd(!showAdd);
        setDataAdd(init);
    }


    useEffect(() => {
        MainAPI.getItems(((skip - 1) * paginationPerPage), paginationPerPage).then(res => {
            const items = res?.items ?? [];

            const resultArray = [];

            if (items.length > 0) {
                for (const key in items[0]) {
                    if (Object.hasOwnProperty.call(items[0], key)) {
                        resultArray.push({
                            name: key,
                            selector: row => row[key],
                            sortable: true,
                        });

                    }
                }

                if (tableCols.length > 0) {
                    setFiltredTableCols(resultArray.filter(r => selected.includes(r.name)));
                } else {
                    setTableCols(resultArray);
                    setFiltredTableCols(resultArray);
                }

                setTableData(items);

                const total_count = Math.ceil((res?.total_count ?? 0) / paginationPerPage);
                setTotalPage(total_count);
            }
        })
    }, [skip, selected]);

    useEffect(() => {
        if (selected.length === 0) {
            setSelected(tableCols.map(r => r?.name))
        }
    }, [tableCols])

    const handleChenge = (id) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(sel => sel !== id))
        } else {
            setSelected([...selected, id])
        }
    }

    const hendleReset = () => {
        setFiltredTableCols(tableCols);
        setSelected(tableCols.map(r => r?.name))
        handleModal();
    }

    const handleAdd = () => {
        MainAPI.SetItem(dataAdd).then(res => {
            console.log("🚀 ~ file: TableComponent.jsx:182 ~ MainAPI.SetItem ~ res:", res)
        })
    }

    const hendleExport = () => {
        MainAPI.Export().then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'items.xlsx'; // Указываем имя файла
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
    }

    return (
        <>
            <div className="screen-wrapper">
                <div className="table-wrapper">

                    <div className="table_header">
                        <h1>STOCK LIST "HYUNDAI"</h1>
                        <h3>Дата последнего обновления: 100103-09-107 13:37:07</h3>
                    </div>

                    <DataTable
                        columns={filtredTableCols}
                        data={tableData}
                        customStyles={customStyles}

                        pagination
                        paginationServer
                        paginationPerPage={paginationPerPage}
                        paginationTotalRows={totalPage * paginationPerPage}
                        onChangePage={(p, t) => { setSkip(p) }}
                        paginationComponentOptions={{ noRowsPerPage: true }}
                        fixedHeader
                        fixedHeaderScrollHeight="75vh"
                    />
                </div>
            </div>
            <CustomModal show={show} setShow={setShow} onClick={hendleReset} title="По умолчанию">
                {
                    (tableCols ?? []).map((col, index) => {
                        return (
                            <label key={`checkbox-${col?.name}-${index}`}>
                                <Checkbox
                                    value={col?.name}
                                    className="my-checkbox"
                                    defaultChecked={selected.includes(col?.name ?? "")}
                                    onChange={(e) => handleChenge(e.target.value)}
                                />
                                &nbsp; {col?.name}
                            </label>
                        )
                    })
                }

            </CustomModal>

            <CustomModal show={showAdd} setShow={setShowAdd} onClick={() => handleAdd()} title="Сохранить">
                <label>
                    N &nbsp;
                    <input value={dataAdd.N} onChange={(e) => handleData({ N: e.target.value })} type="text" />
                </label>
                <label>
                    Клиент &nbsp;
                    <input value={dataAdd.Клиент} onChange={(e) => handleData({ Клиент: e.target.value })} type="text" />
                </label>
                <label>
                    Марка &nbsp;
                    <input value={dataAdd.Марка} onChange={(e) => handleData({ Марка: e.target.value })} type="text" />
                </label>
                <label>
                    Модель &nbsp;
                    <input value={dataAdd.Модель} onChange={(e) => handleData({ Модель: e.target.value })} type="text" />
                </label>
                <label>
                    Надстройка &nbsp;
                    <input value={dataAdd.Надстройка} onChange={(e) => handleData({ Надстройка: e.target.value })} type="text" />
                </label>
                <label>
                    Про_во &nbsp;
                    <input value={dataAdd.Про_во} onChange={(e) => handleData({ Про_во: e.target.value })} type="text" />
                </label>
                <label>
                    ID &nbsp;
                    <input value={dataAdd.ID} onChange={(e) => handleData({ ID: e.target.value })} type="text" />
                </label>
                <label>
                    VIN &nbsp;
                    <input value={dataAdd.VIN} onChange={(e) => handleData({ VIN: e.target.value })} type="text" />
                </label>
                <label>
                    VIN_KZ &nbsp;
                    <input value={dataAdd.VIN_KZ} onChange={(e) => handleData({ VIN_KZ: e.target.value })} type="text" />
                </label>
                <label>
                    Статус_ОП &nbsp;
                    <input value={dataAdd.Статус_ОП} onChange={(e) => handleData({ Статус_ОП: e.target.value })} type="text" />
                </label>
                <label>
                    Статус_движение &nbsp;
                    <input value={dataAdd.Статус_движение} onChange={(e) => handleData({ Статус_движение: e.target.value })} type="text" />
                </label>
                <label>
                    Статус_производство &nbsp;
                    <input value={dataAdd.Статус_производство} onChange={(e) => handleData({ Статус_производство: e.target.value })} type="text" />
                </label>
                <label>
                    Статус_ОП_Движ &nbsp;
                    <input value={dataAdd.Статус_ОП_Движ} onChange={(e) => handleData({ Статус_ОП_Движ: e.target.value })} type="text" />
                </label>
                <label>
                    Статус_ОП_Произодство &nbsp;
                    <input value={dataAdd.Статус_ОП_Произодство} onChange={(e) => handleData({ Статус_ОП_Произодство: e.target.value })} type="text" />
                </label>
                <label>
                    Обновить_Статус &nbsp;
                    <input value={dataAdd.Обновить_Статус} onChange={(e) => handleData({ Обновить_Статус: e.target.value })} type="text" />
                </label>
                <label>
                    Ремонт_производство &nbsp;
                    <input value={dataAdd.Ремонт_производство} onChange={(e) => handleData({ Ремонт_производство: e.target.value })} type="text" />
                </label>
                <label>
                    Хранение_ОП &nbsp;
                    <input value={dataAdd.Хранение_ОП} onChange={(e) => handleData({ Хранение_ОП: e.target.value })} type="number" />
                </label>
                <label>
                    Стоимость_по_прайсу &nbsp;
                    <input value={dataAdd.Стоимость_по_прайсу} onChange={(e) => handleData({ Стоимость_по_прайсу: e.target.value })} type="number" />
                </label>
                <label>
                    Скидка_Дилера &nbsp;
                    <input value={dataAdd.Скидка_Дилера} onChange={(e) => handleData({ Скидка_Дилера: e.target.value })} type="number" />
                </label>
                <label>
                    Скидка_Дистрибьютора &nbsp;
                    <input value={dataAdd.Скидка_Дистрибьютора} onChange={(e) => handleData({ Скидка_Дистрибьютора: e.target.value })} type="number" />
                </label>
                <label>
                    Маржа_Дилера_процент &nbsp;
                    <input value={dataAdd.Маржа_Дилера_процент} onChange={(e) => handleData({ Маржа_Дилера_процент: e.target.value })} type="number" />
                </label>
                <label>
                    Маржа_Дилера_доллар &nbsp;
                    <input value={dataAdd.Маржа_Дилера_доллар} onChange={(e) => handleData({ Маржа_Дилера_доллар: e.target.value })} type="number" />
                </label>
                <label>
                    Финансирование &nbsp;
                    <input value={dataAdd.Финансирование} onChange={(e) => handleData({ Финансирование: e.target.value })} type="text" />
                </label>
                <label>
                    Стоимость_за_ед_по_контракту &nbsp;
                    <input value={dataAdd.Стоимость_за_ед_по_контракту} onChange={(e) => handleData({ Стоимость_за_ед_по_контракту: e.target.value })} type="number" />
                </label>
                <label>
                    Дата_ДКП &nbsp;
                    <input value={dataAdd.Дата_ДКП} onChange={(e) => handleData({ Дата_ДКП: e.target.value })} type="datetime-local" />
                </label>
                <label>
                    Оплата_по_ДКП &nbsp;
                    <input value={dataAdd.Оплата_по_ДКП} onChange={(e) => handleData({ Оплата_по_ДКП: e.target.value })} type="text" />
                </label>
                <label>
                    Остаток_по_оплате &nbsp;
                    <input value={dataAdd.Остаток_по_оплате} onChange={(e) => handleData({ Остаток_по_оплате: e.target.value })} type="number" />
                </label>
                <label>
                    Срок_оплаты &nbsp;
                    <input value={dataAdd.Срок_оплаты} onChange={(e) => handleData({ Срок_оплаты: e.target.value })} type="datetime-local" />
                </label>
                <label>
                    Срок_постановки &nbsp;
                    <input value={dataAdd.Срок_постановки} onChange={(e) => handleData({ Срок_постановки: e.target.value })} type="datetime-local" />
                </label>
                <label>
                    Осталось_дней &nbsp;
                    <input value={dataAdd.Осталось_дней} onChange={(e) => handleData({ Осталось_дней: e.target.value })} type="number" />
                </label>
                <label>
                    Дата_реализации &nbsp;
                    <input value={dataAdd.Дата_реализации} onChange={(e) => handleData({ Дата_реализации: e.target.value })} type="datetime-local" />
                </label>
                <label>
                    Квота &nbsp;
                    <input value={dataAdd.Квота} onChange={(e) => handleData({ Квота: e.target.value })} type="text" />
                </label>
                <label>
                    Статус_квоты &nbsp;
                    <input value={dataAdd.Статус_квоты} onChange={(e) => handleData({ Статус_квоты: e.target.value })} type="text" />
                </label>
                <label>
                    Продажа_от_НТА_НСТК &nbsp;
                    <input value={dataAdd.Продажа_от_НТА_НСТК} onChange={(e) => handleData({ Продажа_от_НТА_НСТК: e.target.value })} type="text" />
                </label>
                <label>
                    Дата_квотирования &nbsp;
                    <input value={dataAdd.Дата_квотирования} onChange={(e) => handleData({ Дата_квотирования: e.target.value })} type="datetime-local" />
                </label>
                <label>
                    Срок_квотирования &nbsp;
                    <input value={dataAdd.Срок_квотирования} onChange={(e) => handleData({ Срок_квотирования: e.target.value })} type="number" />
                </label>
                <label>
                    Осталось_Дней_в_квоте &nbsp;
                    <input value={dataAdd.Осталось_Дней_в_квоте} onChange={(e) => handleData({ Осталось_Дней_в_квоте: e.target.value })} type="number" />
                </label>
                <label>
                    Примечания_НТА_Производство &nbsp;
                    <input value={dataAdd.Примечания_НТА_Производство} onChange={(e) => handleData({ Примечания_НТА_Производство: e.target.value })} type="text" />
                </label>
                <label>
                    Примечания_НТА_Сопровождения &nbsp;
                    <input value={dataAdd.Примечания_НТА_Сопровождения} onChange={(e) => handleData({ Примечания_НТА_Сопровождения: e.target.value })} type="text" />
                </label>
                <label>
                    Примечание_НСТК &nbsp;
                    <input value={dataAdd.Примечание_НСТК} onChange={(e) => handleData({ Примечание_НСТК: e.target.value })} type="text" />
                </label>
                <label>
                    CT_KZ &nbsp;
                    <input value={dataAdd.CT_KZ} onChange={(e) => handleData({ CT_KZ: e.target.value })} type="text" />
                </label>
                <label>
                    Утиль_сбор &nbsp;
                    <input value={dataAdd.Утиль_сбор} onChange={(e) => handleData({ Утиль_сбор: e.target.value })} type="text" />
                </label>
                <label>
                    Дата_таможенной_очистки &nbsp;
                    <input value={dataAdd.Дата_таможенной_очистки} onChange={(e) => handleData({ Дата_таможенной_очистки: e.target.value })} type="datetime-local" />
                </label>
                <label>
                    Оплата_производителю &nbsp;
                    <input value={dataAdd.Оплата_производителю} onChange={(e) => handleData({ Оплата_производителю: e.target.value })} type="text" />
                </label>
                <label>
                    Дата_оплаты_произв &nbsp;
                    <input value={dataAdd.Дата_оплаты_произв} onChange={(e) => handleData({ Дата_оплаты_произв: e.target.value })} type="datetime-local" />
                </label>
                <label>
                    Условие_оплаты_призв &nbsp;
                    <input value={dataAdd.Условие_оплаты_призв} onChange={(e) => handleData({ Условие_оплаты_призв: e.target.value })} type="text" />
                </label>
                <label>
                    Срок_заморозки_ДС &nbsp;
                    <input value={dataAdd.Срок_заморозки_ДС} onChange={(e) => handleData({ Срок_заморозки_ДС: e.target.value })} type="datetime-local" />
                </label>
                <label>
                    Номер_партии &nbsp;
                    <input value={dataAdd.Номер_партии} onChange={(e) => handleData({ Номер_партии: e.target.value })} type="text" />
                </label>
                <label>
                    Номер_ДТ_ИМ77 &nbsp;
                    <input value={dataAdd.Номер_ДТ_ИМ77} onChange={(e) => handleData({ Номер_ДТ_ИМ77: e.target.value })} type="text" />
                </label>
            </CustomModal>

            <div className="btn_management_wrapp">
                <div onClick={() => handleModal()} className="btn_management">
                    <AiOutlineTable size={40} />
                </div>
                <div onClick={() => handleAddModal()} className="btn_management">
                    <AiOutlinePlus size={40} />
                </div>
                <div onClick={() => hendleExport()} className="btn_management">
                    <AiOutlineFileExcel size={40} />
                </div>
            </div>
        </>
    )
}

export default TableScreen;