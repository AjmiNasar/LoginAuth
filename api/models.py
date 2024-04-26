from tortoise.models import Model
from tortoise import fields
from tortoise.contrib.pydantic import pydantic_model_creator
from pydantic import BaseModel

class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=100, unique=True)
    hashed_password = fields.CharField(max_length=100)
    schoolid = fields.CharField(max_length=100)
    disabled = fields.BooleanField(default=False)
    access_token = fields.CharField(max_length=255, null=True)

class Token(Model):
    
    access_token = fields.CharField(max_length=255)
    token_type = fields.CharField(max_length=50)

class TokenData(Model):
    username = fields.TextField()

class UserInDB(Model):
    username = fields.TextField()
    hashed_password = fields.CharField(max_length=255)
    schoolid = fields.IntField(pk=True)
    disabled = fields.BooleanField(default=False)
    access_token = fields.CharField(max_length=255, null=True)

user_model = pydantic_model_creator(User, name="User")
userIn_model=pydantic_model_creator(User,name="UserIn",exclude_readonly=True)
user_in_db_model = pydantic_model_creator(UserInDB, name="UserInDB")
user_in_db_modelIn = pydantic_model_creator(UserInDB, name="UserInDBIn", exclude_readonly=True)
Token_model = pydantic_model_creator(Token, name="Token")
TokenIn_model = pydantic_model_creator(Token, name="TokenIn",exclude_readonly=True)
TokenData_model = pydantic_model_creator(TokenData, name="TokenDataPydantic")
TokenData_modelIn = pydantic_model_creator(TokenData, name="TokenDataPydanticIn",exclude_readonly=True)