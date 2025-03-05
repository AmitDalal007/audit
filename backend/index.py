from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from datetime import datetime

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

@app.get("/get-checklist/{mq_identifier}")
async def get_checklist(mq_identifier: int):
    checklists = list(collection.find({"MQ_Identifier": mq_identifier}, {"_id": 0}))
    if mq_identifier == 3 and not checklists:
        february_data = list(collection.find({"MQ_Identifier": 2}, {"_id": 0}))
        for item in february_data:
            unique_id = item["Unique_ID"]
            new_unique_id = unique_id.replace("M02", "M03")
            march_item = {
                **item,
                "Unique_ID": new_unique_id,
                "MQ_Identifier": 3,
                "Maker_Compliance_Status": "",
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
            collection.insert_one(march_item)

        checklists = list(collection.find({"MQ_Identifier": 3}, {"_id": 0}))

    return checklists

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