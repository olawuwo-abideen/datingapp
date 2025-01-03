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
- **DELETE /profile/**: Delete the user profile.



**Payment and Subscription Endpoints**

- **GET /plan**: Get available plan.
- **GET /plan/current**: Get user current plan.


- **GET /payment/history**: View the user’s payment history for subscriptions and purchases.


**Matchmaking Endpoints**

- **GET /match/discover**:Fetch a list of profiles for the user to swipe through based on filters.
- **POST /match/swipe**: Swipe right (like) or left (pass) on a profile (requires profile ID and swipe direction).
- **GET /match/mutual**: Get a list of users where a mutual match has occurred (both users swiped right).
- **GET /match/check/{userId}**: Check if there’s already a mutual match with a specific user.
- **DELETE /match/{userId}**: Unmatch or remove a connection with a specific user.

**Messaging Endpoints**

- **GET /messages/{matchId}**: Retrieve the chat history between two matched users.
- **POST /messages/{matchId}**: Send a new message to a matched user.
- **GET /messages/unread**: Get the count of unread messages for the current user.
- **PATCH /messages/read/{matchId}**: Mark all messages in a conversation as read.
- **DELETE /messages/{messageId}**: Delete a specific message from a conversation.

**User Preferences and Settings Endpoints**

- **PATCH /preferences**: Update filters (age range, location, gender, interests).
- **POST /preferences/boost**: Activate a profile boost for increased visibility (premium feature).
- **GET /preferences**: Retrieve the current user’s match preferences and filters.
- **PATCH /settings/notifications**: Update notification preferences (match, message, profile boosts).
- **PATCH /settings/privacy**: Update privacy settings (control who can see the user’s profile, hide online status).

**Admin and Moderation Endpoints**

- **GET /admin/reports**: Get a list of reported users or profiles for review.
- **POST /admin/block/{userId}**: Block a user for violating community guidelines.
- **POST /unblock/{userId}**: Unblock a previously blocked user.
- **POST /admin/suspend/{userId}**: Temporarily suspend a user account.
- **GET /admin/users**: Fetch a list of all users (with filters for status like active, suspended, etc.).

**Reporting and Blocking Endpoints**

- **POST /report/user/{userId}**: Report a user for inappropriate behavior (requires report details).
- **POST /report/block/{userId}**: Block a specific user, preventing them from seeing your profile or messaging you.
- **DELETE /report/block/{userId}** : Unblock a previously blocked user.



**Notification Endpoints**

- **GET /notifications**: Retrieve a list of notifications (new matches, messages, etc.).
- **PATCH /notifications/read/{notificationId}**: Mark a notification as read.
- **DELETE /notifications/{notificationId}**: Delete a specific notification.