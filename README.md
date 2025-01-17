Backend to a Dating App 

Installation

- clone the repository


`git clone git@github.com:olawuwo-abideen/datingapp.git`


- navigate to the folder


`cd datingapp-main.git`

To run the app in development mode

Open a terminal and enter the following command to install all the  modules needed to run the app:

`npm install`


Create a `.env` file with

`DB_HOST=localhost`

`DB_PORT=3306`

`DB_USERNAME=root`

`DB_PASSWORD=password`

`DB_NAME=datingapp`

`PORT=3000`

`JWT_SECRET=secret`

`JWT_EXPIRATION_TIME=216000`

`JWT_RESET_PASSWORD_EXPIRATION_TIME=30000`


Enter the following `npm start` command to Command Line Interface to Start the app

This will start the app and set it up to listen for incoming connections on port 3000. 

Use Postman to test the endpoint

API Endpoints

The following API endpoints are available:

- BaseUrl https://localhost:3000/

**Admin and Moderation Endpoints**

- **DELETE /admin/user/:id**: Delete a user.
- **GET /admin/reports**: Get a list of reported users or profiles for review.
- **POST /admin/suspend/{userId}**: Temporarily suspend a user account.
- **GET /admin/users**: Fetch a list of all users (with filters for status like active, suspended and blocked).

**Authentication Endpoint**

- **POST /auth/signup**: User signup.
- **POST /auth/login**: User login.
- **POST /auth/logout**: User logout.
- **POST /auth/forgot-password**: User forget password.
- **POST /auth/reset-password**: User reset password.

**User Endpoint**

- **GET /user/**:Retrieve the currently authenticated user’s profile.
- **POST user/change-password**: User change password.
- **PUT /user/**: update the user’s profile.
- **PUT /user/profile-image** : Upload or update the user’s profile photo.
- **PUT /user/profile/visibility/**: Set profile visibility to public or private.
- **PUT /user/plan**: Update user plan.
- **GET /user/id**: Get user profile.

**Reporting and Blocking Endpoints**

- **POST /report/user/{userId}**: Report a user for inappropriate behavior (requires report details).
- **GET /report/user/**: Get all user report.
- **POST /report/block/{userId}**: Block a specific user, preventing them from seeing your profile or messaging you.
- **PUT /report/block/{userId}** : Unblock a previously blocked user.
- **GET /report/block/users** : Get a list of blocked user.

**Matchmaking Endpoints**

- **GET /match/discover**:Fetch a list of profiles for the user for match.
- **GET /match/send/:id**:Send match request to a user.
- **Put /match/status/:id**:Update match request(Accept/Rejects).



**Chat Endpoints**

- **GET /chat/{matchId}**: Retrieve the chat history between two matched users.
- **POST /chat/{matchId}**: Send a new message to a matched user.
- **GET /chat/unread**: Get the count of unread messages for the current user.
- **PATCH /chat/read/{matchId}**: Mark all messages in a conversation as read.
- **DELETE /chat/{messageId}**: Delete a specific message from a conversation.


**Notification Endpoints**

- **GET /notifications**: Retrieve a list of notifications (new matches, messages, etc.).
- **PATCH /notifications/read/{notificationId}**: Mark a notification as read.
- **DELETE /notifications/{notificationId}**: Delete a specific notification.