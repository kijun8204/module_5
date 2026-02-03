from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ExampleCreate(BaseModel):
    name: str
    description: str | None = None


class ExampleResponse(BaseModel):
    id: int
    name: str
    description: str | None
    created_at: datetime
    updated_at: datetime | None

    model_config = ConfigDict(from_attributes=True)
