from core.db import files_collection

async def create_file(title:str, description:str, url:str):
    existing = await files_collection.find_one({"title": title})
    if existing:
        return {"error": "Title already exists"}
    await files_collection.insert_one({"title":title, "description":description, "url":url})
    return {"success": True, "message": "File created successfully"}

async def get_all_files():
    files = await files_collection.find({}).to_list(length=None)
    return [
        {
            "id": str(file["_id"]),
            "title": file["title"],
            "description": file["description"],
            "url": file["url"],
        }
        for file in files
    ]