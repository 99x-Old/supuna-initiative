# 99X Initiatives


![](https://raw.githubusercontent.com/99xtechnology/supuna-initiative/dev/diagram.png?token=AAOEUR2IDC3B3OSYF7A67G27SBXV6)

 <table>
 <thead>
 <tr>
 <th>Technology</th>
 <th>Auth</th>
 <th>File</th>
 <th>Gateway</th>
 <th>Initiative</th>
 <th>Kafka</th>
 <th>Notification</th>
 <th>Poster</th>
 <th>Users</th>
 <th>Web</th>
 </tr> 
 <tbody>
 <tr>
 <td>NodeJs/Koa 2</td>
 <td bgcolor="green">YES</td>
 <td>NO</td>
 <td>NO</td>
 <td>YES</td>
 <td>NO</td>
 <td>YES</td>
 <td>NO</td>
 <td>YES</td>
 <td>NO</td>
 </tr>
 <tr>
 <td>PHP/Laravel</td>
 <td>&nbsp;NO</td>
 <td>&nbsp;NO</td>
 <td>&nbsp;NO</td>
 <td>&nbsp;NO</td>
 <td>&nbsp;NO</td>
 <td>YES</td>
 <td>&nbsp;NO</td>
 <td>&nbsp;NO</td>
 </tr>
 <tr>
 <td>Docker Containers</td>
 <td bgcolor="green">&nbsp;YES</td>
 <td>NO</td>
 <td>YES</td>
 <td>YES</td>
 <td>YES</td>
 <td>YES</td>
 <td>YES</td>
 <td>YES</td>
 <td>YES</td>
 </tr>
 <tr>
 <td>MongoDB</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>YES</td>
 <td>NO</td>
 <td>YES</td>
 <td>NO</td>
 <td>YES</td>
 <td>NO</td>
 </tr>
 <tr>
 <td>MariaDB</td>
 <td>NO</td>
 <td>&nbsp;NO</td>
 <td>&nbsp;NO</td>
 <td>&nbsp;NO</td>
 <td>&nbsp;NO</td>
 <td>&nbsp;NO</td>
 <td>&nbsp;NO</td>
 <td>&nbsp;NO</td>
 <td>&nbsp;NO</td>
 </tr>
 <tr>
 <td>Azure Active Directory/OAuth 2</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 </tr>
 <tr>
 <td>Kafka</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>YES</td>
 <td>YES</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 </tr>
 <tr>
 <td><a href="http://Socket.IO">Socket.IO</a></td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>YES</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 </tr>
 <tr>
 <td>Kong</td>
 <td>NO</td>
 <td>NO</td>
 <td>YES</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 </tr>
 <tr>
 <td>ReactJs/Redux</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>YES</td>
 </tr>
 <tr>
 <td>Material-UI</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>YES</td>
 </tr>
 <tr>
 <td>Serverless Framework</td>
 <td>NO</td>
 <td>YES</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 </tr>
 <tr>
 <td>AWS Lambda</td>
 <td>NO</td>
 <td>YES</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 <td>NO</td>
 </tr>
 </tbody>
 </table>
 
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
It also contains user details, user kudos. User service is  the most important service which required by all the other services.

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

  
### Initiative Service

Initiative service used for create initiatives, initiatives years, review cycles, departments, initiatives actions, initiatives meetings, 
so this basically does everything regarding initiatives.

Technologies:

-   NodeJs/[Koa 2](https://koajs.com/)   
-   MongoDB
-   Docker Containers

Database Design:

_Initiatives_
```javascript 
{
    uuid: String,
    name: String,
    description: String,
    department: Schema.Types.ObjectId,
    image: String,
    created_at: { type: Date, default: Date.now },
}
```

_Initiative Action_
```javascript 
{
    uuid: String,
    name: String,
    users: [{
 type: Schema.Types.ObjectId,
 ref: 'InitiativeMemberModel',
    }],
    initiative: Schema.Types.ObjectId,
    year: {
 type: Schema.Types.ObjectId,
 ref: 'InitiativeYearModel', 
    },
    description: String,
    deadline: { type: Date, default: null },
    sub_actions: [String],
    done: Boolean,
    added_by: String,
    created_at: { type: Date, default: Date.now },
}
```
_Initiative Department_

```javascript 
{
    name: String,
    description: String,
    created_at: { type: Date, default: Date.now },
}
```
_Initiative Evaluation Criteria_

```javascript 
{
    criteria: String,
    description: String,
    weight: Number,
    year: Schema.Types.ObjectId,
    added_by: String,
    created_at: { type: Date, default: Date.now },
}
```

_Initiative Kudos_

```javascript 
{
    name: String,
    description: String,
    image: String,
    created_at: { type: Date, default: Date.now },
}
```
_Initiative Meeting_

```javascript 
{
    uuid: String,
    date: Date,
    time: Date,
    initiative: Schema.Types.ObjectId,
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'InitiativeMemberModel',
    }],
    year: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeYearModel', 
    },
    name: String,
    description: String,
    notes: String,
    added_by: String,
    status: {
      type: String,
      enum: ['pending', 'ongoing', 'canceled', 'finished'],
      default: 'pending',
    },
    started_at: { type: Date, default: null },
    finished_at: { type: Date, default: null },
    updated_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
}
```

_Initiative Member_

```javascript 
{
    user: String,
    initiative: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeModel', 
    },
    member_type: {
      type: Schema.Types.ObjectId,
      ref: 'MemberTypeModel', 
    },
    year: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeYearModel', 
    },
    note: String,
    added_by: String,
    created_at: { type: Date, default: Date.now },
}
```

_Initiative Member Kudos_

```javascript 
{
    from: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeMemberModel', 
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeMemberModel', 
    },
    kudos: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeKudosModel', 
    },
    created_at: { type: Date, default: Date.now },
}
```

_Initiative Member Rating_

```javascript 
{
    user: String,
    rated_by: String,
    initiative: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeModel', 
    },
    rate: Number,
    note: String,
    created_at: { type: Date, default: Date.now },
}
```
_Initiative Objective_

```javascript 
{
    initiative: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeModel', 
    },
    year: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeYearModel', 
    },
    objective: String,
    added_by: String,
    created_at: { type: Date, default: Date.now },
}
```
_Initiative Year_

```javascript 
{
    uuid: String,
    name: String,
    duration: {
      from: { type: Date },
      to: { type: Date },
    },
    description: String,
    created_at: { type: Date, default: Date.now },
}
```
_Initiative Review Cycle_

```javascript 
{
    year: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeYearModel', 
    },
    uuid: String,
    title: String,
    description: String,
    duration: {
      from: { type: Date },
      to: { type: Date },
    },
    done: Boolean,
    added_by: String,
    created_at: { type: Date, default: Date.now }
}
```
_Initiative Review Cycle Evaluation Criteria_

```javascript 
{
    cycle: {
 type: Schema.Types.ObjectId,
 ref: 'InitiativeReviewCycleModel', 
    },
    initiative: {
 type: Schema.Types.ObjectId,
 ref: 'InitiativeModel', 
    },
    evaluation_criteria: [{
 criteria: {
     type: Schema.Types.ObjectId,
     ref: 'InitiativeEvaluationCriteria', 
 },
 points: {
     type: Number,
     default: 0,
     min: 0,
     max: 100,
 },
 note: String,
    }],
    created_at: { type: Date, default: Date.now },
}
```
_InitiativeYear Review Cycle Key Contributors_
```javascript 
{
    cycle: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeReviewCycleModel', 
    },
    initiative: {
      type: Schema.Types.ObjectId,
      ref: 'InitiativeModel', 
    },
    contributors: [{
      user: String,
      feedback: String,
    }],
    created_at: { type: Date, default: Date.now },
}
```
_Member Type_
```javascript 
{
    type: String,
    note: String,
    created_at: { type: Date, default: Date.now },
},
```

### Auth Service
![](https://raw.githubusercontent.com/99xtechnology/supuna-initiative/dev/auth.png?token=AAOEUR5BOJOVX6IDMJHDCXS7SL7EQ)

Auth service does all the action related to authentication such as generating oAuth token and validation it. 
Currently, auth service uses Azure active directory to authenticate user to the system.

Technologies:

-   NodeJs/[Koa 2](https://koajs.com/)
-   Docker containers 
-   [Azure Active Directory/OAuth 2](https://azure.microsoft.com/en-us/services/active-directory/)
 

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
