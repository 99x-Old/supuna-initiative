# 99X Initiatives


![](https://raw.githubusercontent.com/99xtechnology/supuna-initiative/dev/diagram.png?token=AAOEUR2IDC3B3OSYF7A67G27SBXV6 "Carecare > Ennoble-X Case Study - Initiative > Initiative.png")

## Services

-   User
-   Initiative    
-   Auth    
-   Notification    
-   Poster    
-   Web   
-   File   
-   Gateway
    

### User Service

User service stores and does all the action related to users/members. 
It also contains user details, user kudos. User service is  the most important service which require by all the other services.

Technologies:

-   NodeJs/[Koa 2](https://koajs.com/)   
-   MongoDB   
-   Docker Containers
    

Database Design:

_Users_
```javascript 
{
    first_name: String,
    last_name: String,
    bio: String,
    birth: Date,
    email: String,
    mobile: Number,
    gender: Schema.Types.ObjectId,,
    uuid: String,
    created_at: Date,
    updated_at: Date,
}
```
_Gender_
```javascript 
{
    gender: String,
}
```
_Roles_

```javascript 
{
    role: String,
    permission:[]
}
```
_Kudos_

```javascript 
{
    kudos: String,
    description: String,
    uuid: String,
    created_at: { type: Date, default: Date.now },
}
```
_Status_

```javascript 
{
    status: String,
    description: String,
}
```
_User Kudos_

```javascript 
{
    kudos: Schema.Types.ObjectId,
    user: Schema.Types.ObjectId,
    givenBy: Schema.Types.ObjectId,
    reason: String,
    created_at: { type: Date, default: Date.now },
}
```
_User Status_

```javascript 
{
    status: Schema.Types.ObjectId,
    user: Schema.Types.ObjectId,
    reason: String,
    created_at: { type: Date, default: Date.now },
}
```

  
Initiative Service

Initiative service does all the action related to Initiative.

### Auth Service

Auth service does all the action related to authentication such as generating oAuth token and validation it.

### Notification Service

Notification service does all the task related to notification such as user basis notification and system basis notification

Technologies:

-   NodeJs/[Koa 2](https://koajs.com/)
    
-   MongoDB
    
-   Docker containers
    
-   [Kafka](https://kafka.apache.org/)
    
-   [Socket.IO](https://socket.io/)
    

### Gateway Service

Gateway service acting as a reverse proxy routing request from the client to the server. it provides a single entry point to the APIs encapsulating the underlying system architecture.

Technologies:

-   [Kong](https://konghq.com/)
    
-   Docker containers
    

### Poster Service

Poster service handle all the feedbacks (Post, Comments, likes…etc)

### Web Service

Web Service is the web interface which provides web users to access the system.

Technologies:

-   ReactJs
    
-   Redux
    
-   Material-UI
    

### File Service

File service handle all the any cation related to files including cropping/resizing images

Technologies:

-   Serverless Framework
    
-   AWS Lambda
    

### Initiative

Handle all the action regarding initiatives .

_Initiatives_

{
  first_name: String,
  last_name: String,
  bio: String,
  birth: Date,
  email: String,
  mobile: Number,
  gender: {
    type: Schema.Types.ObjectId,
    ref: Gender, 
  },
  uuid: String,
  created_at: Date,
  updated_at: Date,
}
