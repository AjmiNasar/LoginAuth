from fastapi import Depends, FastAPI, HTTPException, status
from tortoise.contrib.fastapi import register_tortoise
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from fastapi import Form
from models import user_model,userIn_model,User,Token,Token_model,TokenIn_model
from tortoise import Tortoise, fields, run_async


SECRET_KEY = "83daa0256a2289b0fb23693bf1f6034d44396675749244721a2b20e896e11662"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 800

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
async def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

async def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user(username: str) -> Optional[User]:
    user = await User.get_or_none(username=username)
    return user

async def authenticate_user(username: str, password: str, schoolid: str) -> Optional[User]:
    user = await User.get_or_none(username=username)
    if not user:
        return None
    if not await verify_password(password, user.hashed_password):
        return None
    if user.schoolid != schoolid:
        return None
    return user

async def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.get('/')
def index():
    return {'Msg': "read from docs"}


@app.post("/login")
async def login_for_access_token(
    username: str = Form(...), 
    password: str = Form(...), 
    schoolid: str = Form(...),
    disabled: bool = Form(False),  
    access_token: str = Form(None)  
):
    user = await authenticate_user(username, password, schoolid)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect details",
                            headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = await create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    
    user.access_token = access_token
    await user.save()
    
    return {"access_token":access_token,"token_type":"bearer"}
@app.get("/login_det")
async def validusers():
    valid_users = await User.filter(access_token__isnull=False)
    return valid_users

@app.post("/users/")
async def create_user(user: userIn_model):
    # Check if the username already exists
    existing_user = await User.filter(username=user.username).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    
    # Hash the password
    hashed_pwd = await get_password_hash(user.hashed_password)
    
    # Create the user using Tortoise ORM
    created_user = await User.create(
        username=user.username,
        hashed_password=hashed_pwd,
        schoolid=user.schoolid,
        disabled=False
    )
    
    return {"username": created_user.username}

  

@app.get("/users/")
async def get_users():
    users = await User.all()
    return {"users": users}


register_tortoise(
    app,
    db_url="sqlite://database.sqlite3",
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)
