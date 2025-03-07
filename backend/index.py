from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from datetime import datetime, timedelta
import re
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.security import APIKeyHeader

oauth2_scheme = APIKeyHeader(name="Authorization", auto_error=True)

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

client = MongoClient("mongodb://localhost:27017/")
db = client["audit_db"]
collection = db["audit_checklists"]
user_collection = db["users"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class ChecklistItem(BaseModel):
    Unique_ID: str
    FY: int
    Module_ID: str
    Frequency: str
    MQ_Identifier: int
    Domain: str
    Area: str
    Checklist_Name: str
    Checklist_ID: str
    CheckList_Serial_No: str
    Visibility: str
    Maker_Compliance_Status: str
    Maker_Comment: str
    Maker_Date: str
    Evidence: str
    Checker_Compliance_Status: str
    Checker_Comment: str
    Checker_Date: str
    Reviewer_Compliance_Status: str
    Reviewer_Comment: str
    Reviewer_Date: str

# User Model
class User(BaseModel):
    email: str
    password: str
    role: str

# JWT Token Model
class Token(BaseModel):
    access_token: str
    token_type: str

# Helper function to verify password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Helper function to create access token
def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    if not token.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")

    token = token.split("Bearer ")[1]  # Remove "Bearer " prefix

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        role = payload.get("role")

        user = user_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return {"email": email, "role": role}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def generate_new_unique_id(unique_id: str, old_mq: int, new_mq: int) -> str:
    old_month_str = f"M{old_mq:02d}"
    new_month_str = f"M{new_mq:02d}"
    return re.sub(old_month_str, new_month_str, unique_id)

def clean_mongo_data(data):
    for item in data:
        if "_id" in item:
            item["_id"] = str(item["_id"])
    return data

# User Registration
@app.post("/register/")
async def register(user: User):
    existing_user = user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    user_collection.insert_one({
        "email": user.email,
        "password": hashed_password,
        "role": user.role
    })
    return {"message": "User registered successfully"}

# User Login
@app.post("/login/")
async def login(user: User):
    db_user = user_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if user.role != db_user["role"]:
        raise HTTPException(status_code=403, detail="Unauthorized role selection")

    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}


@app.get("/get-checklist/{mq_identifier}")
async def get_checklist(mq_identifier: int, user: dict = Depends(get_current_user)):
    checklists = list(collection.find({"MQ_Identifier": mq_identifier}))

    if checklists:
        return clean_mongo_data(checklists)

    previous_mq = mq_identifier - 1
    previous_data = list(collection.find({"MQ_Identifier": previous_mq}))

    if not previous_data:
        return []

    new_checklists = []
    for item in previous_data:
        new_unique_id = generate_new_unique_id(item["Unique_ID"], previous_mq, mq_identifier)
        new_item = {
            **item,
            "Unique_ID": new_unique_id,
            "MQ_Identifier": mq_identifier,
            "Maker_Compliance_Status": "Non-Compliant",
            "Maker_Comment": "",
            "Maker_Date": "",
            "Evidence": "",
            "Checker_Compliance_Status": "",
            "Checker_Comment": "",
            "Checker_Date": "",
            "Reviewer_Compliance_Status": "",
            "Reviewer_Comment": "",
            "Reviewer_Date": "",
        }
        
        new_item.pop("_id", None)
        collection.insert_one(new_item)
        new_checklists.append(new_item)

    return clean_mongo_data(new_checklists)

@app.post("/submit-checklist/")
async def submit_checklist(item: ChecklistItem):
    item_dict = item.dict()
    item_dict["Maker_Date"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    collection.insert_one(item_dict)
    return {"message": "Checklist submitted successfully"}

@app.put("/update-checklist/{unique_id}")
async def update_checklist(unique_id: str, item: ChecklistItem):
    item_dict = item.dict()
    collection.update_one({"Unique_ID": unique_id}, {"$set": item_dict})
    return {"message": "Checklist updated successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)