# 21609-Back-End-CA1
## line 1-5

### install necessary dependencies
express - server\
body-parser for - managing json objects\
cors  - allow cross origin / allow access from all ip addresses\
mongodb - database\
dotenv - .env file\

## line 7-8
create .env file on root folder and insert PORT=yourport and URL=yoururl in separate lines

## line 10-11
create instance of express and mongoclient

## line 13-14
use cors and bodyparser middlewares

## line 19-30
GET request on /
get all routes

##l ine 32-39
GET request on /api
get all objects from the database

## line 41-52
GET request on /api/:id
get specific object using id as parameter 

## line 57-82
POST request on /api
it will check if the required object key:value is not null - return error if null
it will check if the object key:value is already in the database - return error if already exists
create an object from class and sanitize values(convert to lower case and replace space with underscore)
insert object to the database

## line 84-103
PUT request on /api
this will take the object id as part of the body

## line 105-117
DELETE request on /api/:id
delete specific object using id as parameter
it will check if the id exists in the database: return error if not exists

## line 120-135
start listening to api requests

## line 137-155
create a cat class

