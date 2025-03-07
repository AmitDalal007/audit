from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://localhost:27017/")
db = client["audit_db"]
collection = db["audit_checklists"]

data = [
    {
        "Unique_ID": "25M001M02C001",
        "FY": 25,
        "Module_ID": "M001",
        "Frequency": "M",
        "MQ_Identifier": 2,
        "Domain": "HR",
        "Area": "Pre-Hiring",
        "Checklist_Name": "Vendors Checklist name 1",
        "Checklist_ID": "C001",
        "CheckList_Serial_No": "NULL",
        "Visibility": "NULL",
        "Maker_Compliance_Status": "Compliant",
        "Maker_Comment": "NULL",
        "Maker_Date": datetime.strptime("2/16/2025 14:25", "%m/%d/%Y %H:%M"),
        "Evidence": "NULL",
        "Checker_Compliance_Status": "Compliant",
        "Checker_Comment": "NULL",
        "Checker_Date": datetime.strptime("2/16/2025 14:25", "%m/%d/%Y %H:%M"),
        "Reviewer_Compliance_Status": "Compliant",
        "Reviewer_Comment": "NULL",
        "Reviewer_Date": datetime.strptime("2/16/2025 14:25", "%m/%d/%Y %H:%M"),
    },
    {
        "Unique_ID": "25M001M02C002",
        "FY": 25,
        "Module_ID": "M001",
        "Frequency": "M",
        "MQ_Identifier": 2,
        "Domain": "HR",
        "Area": "Post-Hiring",
        "Checklist_Name": "Vendors Checklist name 2",
        "Checklist_ID": "C002",
        "CheckList_Serial_No": "NULL",
        "Visibility": "NULL",
        "Maker_Compliance_Status": "Non-Compliant",
        "Maker_Comment": "NULL",
        "Maker_Date": datetime.strptime("2/16/2025 14:25", "%m/%d/%Y %H:%M"),
        "Evidence": "NULL",
        "Checker_Compliance_Status": "",
        "Checker_Comment": "NULL",
        "Checker_Date": "",
        "Reviewer_Compliance_Status": "",
        "Reviewer_Comment": "NULL",
        "Reviewer_Date": "",
    },
    {
        "Unique_ID": "25M001M02C003",
        "FY": 25,
        "Module_ID": "M001",
        "Frequency": "M",
        "MQ_Identifier": 2,
        "Domain": "Network",
        "Area": "Network Security is proper",
        "Checklist_Name": "Vendors Checklist name 3",
        "Checklist_ID": "C003",
        "CheckList_Serial_No": "NULL",
        "Visibility": "NULL",
        "Maker_Compliance_Status": "Compliant",
        "Maker_Comment": "NULL",
        "Maker_Date": datetime.strptime("2/16/2025 14:25", "%m/%d/%Y %H:%M"),
        "Evidence": "NULL",
        "Checker_Compliance_Status": "Compliant",
        "Checker_Comment": "NULL",
        "Checker_Date": datetime.strptime("2/16/2025 14:25", "%m/%d/%Y %H:%M"),
        "Reviewer_Compliance_Status": "Compliant",
        "Reviewer_Comment": "NULL",
        "Reviewer_Date": datetime.strptime("2/16/2025 14:25", "%m/%d/%Y %H:%M"),
    },
    {
        "Unique_ID": "25M002M02C004",
        "FY": 25,
        "Module_ID": "M002",
        "Frequency": "M",
        "MQ_Identifier": 2,
        "Domain": "Network",
        "Area": "Wirewall",
        "Checklist_Name": "Vendors Checklist name 4",
        "Checklist_ID": "C004",
        "CheckList_Serial_No": "NULL",
        "Visibility": "NULL",
        "Maker_Compliance_Status": "Compliant",
        "Maker_Comment": "NULL",
        "Maker_Date": datetime.strptime("2/16/2025 14:25", "%m/%d/%Y %H:%M"),
        "Evidence": "NULL",
        "Checker_Compliance_Status": "Compliant",
        "Checker_Comment": "NULL",
        "Checker_Date": datetime.strptime("2/16/2025 14:25", "%m/%d/%Y %H:%M"),
        "Reviewer_Compliance_Status": "Compliant",
        "Reviewer_Comment": "NULL",
        "Reviewer_Date": datetime.strptime("2/16/2025 14:25", "%m/%d/%Y %H:%M"),
    },
]

try:
    for item in data:
        item.pop("_id", None)

    collection.insert_many(data)
    print("Data inserted successfully!")
except Exception as e:
    print(f"An error occurred: {e}")
