# QuickMess

This project represents a social network application written in node.js.
Database used is mongoDB. 

![Diagram](https://github.com/enaky/QuickMess/blob/master/Documentation/diagrams/diagram.png)

#### Notes
* Passwords are stored encrypted in the database (encryption realised on client side)
* Created users will have a default image according to his genre. Change user avatar functionality is not yet implemented.

#### Functionalities implemented
* Login/ register
* Writing/ deleting posts
* Inbox/ message functionality using sockets
* Search friends/ people
* Request/delete friendships
* View profile

#### Details
Server runs on port 2014.

```http://localhost:2014/```

Passwords coincide with usernames and [images names](https://github.com/enaky/QuickMess/tree/master/QuickMessApp/public/images).

#### Some users:
- enaki
- pikachu
- bucefal
- bunny
- ricardo
- pedro


## Steps to run this project
1. Make sure you have [node.js](https://nodejs.org/en/) installed
2. Install [mongoDb](https://docs.mongodb.com/manual/administration/install-community/)
3. Install [mongoDb Compass](https://www.mongodb.com/products/compass) in order to visualize and load data. After installed:
    * Create a database called quickMess
    * Create a collection called users and load data from [users.json](https://github.com/enaky/QuickMess/blob/master/Documentation/exported_database/users.json)
    * Create a collection called chats and load data from [chats.json](https://github.com/enaky/QuickMess/blob/master/Documentation/exported_database/chats.json)
3. Change directory to QuickMessApp
2. Run the following commands:
    * ```npm install``` in order to install the dependencies this project relies on.
    * ```bower install``` in order to install the dependencies to the client  (moment and crypto-js).
    * ```node app.js``` in order to start the project
    
## Screenshots
### Login Page
![Login Page](https://github.com/enaky/QuickMess/blob/master/Documentation/screenshots/login_page.png)

### Register Page
![Register Page](https://github.com/enaky/QuickMess/blob/master/Documentation/screenshots/register_page.png)

### Home Page
![Home Page](https://github.com/enaky/QuickMess/blob/master/Documentation/screenshots/home_page.png)

### Inbox Page
![Inbox Page](https://github.com/enaky/QuickMess/blob/master/Documentation/screenshots/inbox_page.png)

### Friends Page
![Friends Page](https://github.com/enaky/QuickMess/blob/master/Documentation/screenshots/friends_page.png)

### Discover Page
![Discover Page](https://github.com/enaky/QuickMess/blob/master/Documentation/screenshots/discover_page.png)

### View-Profile Page
![View-Profile Page](https://github.com/enaky/QuickMess/blob/master/Documentation/screenshots/view_profile_page.png)


