from fastapi import FastAPI, Query, HTTPException, Depends, status
from pydantic import BaseModel
from pymongo import MongoClient
from datetime import datetime
import pandas as pd
from fastapi.responses import FileResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from io import BytesIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBasic()


def authenticate_user(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = "admin"
    correct_password = "admin"

    if credentials.username != correct_username or credentials.password != correct_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )

    return credentials.username


client = MongoClient("mongodb://127.0.0.1:27017")
db = client["hundai"]
collection = db["items"]


class ItemBase(BaseModel):
    N: str
    Клиент: str
    Марка: str
    Модель: str
    Надстройка: str
    Про_во: str
    ID: str
    VIN: str
    VIN_KZ: str
    Статус_ОП: str
    Статус_движение: str
    Статус_производство: str
    Статус_ОП_Движ: str
    Статус_ОП_Произодство: str
    Обновить_Статус: str
    Ремонт_производство: str
    Хранение_ОП: str
    Стоимость_по_прайсу: float
    Скидка_Дилера: float
    Скидка_Дистрибьютора: float
    Маржа_Дилера_процент: float
    Маржа_Дилера_доллар: float
    Финансирование: str
    Стоимость_за_ед_по_контракту: float
    Дата_ДКП: datetime
    Оплата_по_ДКП: str
    Остаток_по_оплате: float
    Срок_оплаты: datetime
    Срок_постановки: datetime
    Осталось_дней: int
    Дата_реализации: datetime
    Квота: str
    Статус_квоты: str
    Продажа_от_НТА_НСТК: str
    Дата_квотирования: datetime
    Срок_квотирования: int
    Осталось_Дней_в_квоте: int
    Примечания_НТА_Производство: str
    Примечания_НТА_Сопровождения: str
    Примечание_НСТК: str
    CT_KZ: str
    Утиль_сбор: str
    Дата_таможенной_очистки: datetime
    Оплата_производителю: str
    Дата_оплаты_произв: datetime
    Условие_оплаты_призв: str
    Срок_заморозки_ДС: datetime
    Номер_партии: str
    Номер_ДТ_ИМ77: str

    class Config:
        protected_namespaces = ()


class ItemCreate(ItemBase):
    pass


class Item(ItemBase):
    _id: str

    class Config:
        validate_default = True


@app.get("/")
async def check_auth(username: str = Depends(authenticate_user)):
    return True


@app.post("/items/", response_model=Item)
async def create_item(item: ItemCreate, username: str = Depends(authenticate_user)):
    item_dict = item.dict()
    result = collection.insert_one(item_dict)
    item = Item(id=str(result.inserted_id), **item_dict)
    return item


@app.get("/items/", response_model=dict)
async def list_items(skip: int = Query(0, description="Skip the first N items"),
                     limit: int = Query(
                         10, description="Limit the number of items returned"),
                     username: str = Depends(authenticate_user)):
    total_count = collection.count_documents({})
    items = collection.find().skip(skip).limit(limit)
    item_list = []
    for item in items:
        item["_id"] = str(item["_id"])
        item_list.append(Item(**item).dict())
    return {
        "total_count": total_count,
        "items": item_list,
    }


@app.get("/export/items/")
async def export_items(username: str = Depends(authenticate_user)):

    response_headers = {
        "Content-Disposition": f"attachment; filename=items",
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }

    items = collection.find()
    item_list = [item for item in items if '_id' in item]

    df = pd.DataFrame(item_list)
    excel_writer = BytesIO()

    with pd.ExcelWriter(excel_writer, engine="openpyxl") as writer:
            df.to_excel(writer, sheet_name="data")

    excel_content = excel_writer.getvalue()
    excel_writer.close()
    return Response(content=excel_content, headers=response_headers)


@app.put("/items/{N}", response_model=Item)
async def update_item(N: str, item: ItemCreate, username: str = Depends(authenticate_user)):
    existing_item = collection.find_one({"N": N})
    if existing_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    item_dict = item.dict()
    collection.update_one({"N": N}, {"$set": item_dict})
    updated_item = Item(id=N, **item_dict)
    return updated_item


@app.delete("/items/{N}", response_model=Item)
async def delete_item(N: str, username: str = Depends(authenticate_user)):
    existing_item = collection.find_one({"N": N})
    if existing_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    collection.delete_one({"N": N})
    deleted_item = Item(**existing_item)
    return deleted_item
