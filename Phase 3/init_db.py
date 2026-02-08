from sqlmodel import SQLModel
from database.database import sync_engine
from models.task import Task
from models.user import User

def create_db_and_tables():
    SQLModel.metadata.create_all(sync_engine)

if __name__ == "__main__":
    create_db_and_tables()
    print("Database and tables created successfully!")