
![](https://seranet.atlassian.net/wiki/download/attachments/2016837636/Initiative.png?version=1&modificationDate=1602528450070&cacheVersion=1&api=v2 "Carecare > Ennoble-X Case Study - Initiative > Initiative.png")

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

Technologies:

-   NodeJs/[Koa 2](https://koajs.com/)
    
-   MongoDB
    
-   Docker Containers
    

Database Design:

_Users_

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

_Genders_

{
  _id: ObjectId,
  gender: String,
}

_Roles_

{
  _id: ObjectId,
  role: String,
  permission:[]
}

  
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
