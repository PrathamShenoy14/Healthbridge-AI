from pydantic import BaseModel

class FileCreate(BaseModel):
    title:str
    description:str
    url:str

class FileResponse(BaseModel):
    id: str
    title: str
    description: str
    url: str