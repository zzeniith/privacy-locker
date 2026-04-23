from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_routes import router as auth_router
from routes.file_routes import router as file_router

app = FastAPI(title="Privacy Locker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "https://privacy-locker-tau.vercel.app",
    "https://privacy-locker-git-main-shriyan2319-7690s-projects.vercel.app",
    "https://privacy-locker-gexs623id-shriyan3id-shriyan2319-7690s-projects.vercel.app",
    "https://privacy-locker-1ur3ntsoi-shriyan2319-7690s-projects.vercel.app",
    "https://privacy-locker-94q7xz3au-shriyan2319-7690s-projects.vercel.app",
    "https://.*\.vercel\.app",  
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(file_router)

@app.get("/")
def root():
    return {"message": "Privacy Locker API is running"}