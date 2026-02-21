from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from astro_service import generate_d1_chart
import uvicorn

app = FastAPI(title="AstroRevo Vedic API")

# Add CORS Middleware
# Allow connection from frontend (usually localhost:5173 for Vite)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "*" # Allow all for development ease
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BirthData(BaseModel):
    date: str       # YYYY-MM-DD
    time: str       # HH:MM
    latitude: float
    longitude: float
    timezone: float

@app.get("/")
def read_root():
    return {"status": "AstroRevo API is running"}

@app.post("/generate-d1")
def generate_kundli(data: BirthData):
    try:
        chart = generate_d1_chart(
            data.date,
            data.time,
            data.latitude,
            data.longitude,
            data.timezone
        )
        return chart
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
