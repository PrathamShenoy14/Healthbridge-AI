from pydantic import BaseModel
from typing import Optional, List

class PersonalInfo(BaseModel):
    age: Optional[str] = "NA"
    gender: Optional[str] = "NA"
    address: Optional[str] = "NA"
    contact: Optional[str] = "NA"
    conditions: Optional[str] = "NA"
    surgeries: Optional[str] = "NA"
    allergies: Optional[str] = "NA"
    medications: Optional[List[str]] = None
