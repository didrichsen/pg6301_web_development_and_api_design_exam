# **Introduction**

This is an exam project for the course PG6301 - Web Development and API Design at Kristiana University College.

The technologies that have been taught throughout this course are React, Node.js, Express, MongoDB, Websockets, Google OAuth and Microsoft Entra ID.
A more detailed description of the exam can be read in the file "PG6301 eksamen 2023(Norwegian).pdf".

The exam got graded with an A.

## Project description

The project is an application where you can create chatrooms with different subjects. Chatrooms can be
created by registered users. They can be private or public. Public chatrooms can be joined by
anyone. Private chatrooms can only be joined if you are whitelisted.

Link to heroku deployment:https://exam-web-dev-and-api-design-7ff1a0be6f3c.herokuapp.com/

Link to github:https://github.com/didrichsen/Kristiania-WebDevAndAPI-Exam-PG301

## **How to run**

- Clone the project
- Create a .env file in root folder with the following:
  - MONGODB=<<"Your connection string">>
  - CLIENT_ID_GOOGLE=<<"Your google client id">>
  - OPEN_ID_CONFIGURATION_GOOGLE= https://accounts.google.com/.well-known/openid-configuration
  - CLIENT_ID_MICROSOFT=<<"Your microsoft client id">>
  - OPEN_ID_CONFIGURATION_MICROSOFT=https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration
  - COOKIE_SECRET=<<"Your cookie secret">>
- Run npm install in root folder

## **Functional Requirements**

1. [x] Anonymous users shouldn't see chat logs, but can log in to see.
2. [x] Users should be able to log in.
   - Users can log in with Google or Microsoft Entra ID.
3. [x] A logged-in user should be able to see profile information (userinfo from google).
   - When a user logs in, they will see their name and email fetched from google or microsoft.
   - The user has the option to change their name and update their bio, but not their email.
   - The updated name will be saved in the database and the user will see the updated name and/or bio.
4. [x] A logged-in user should see chat messages.
   - A logged-in user will see chatrooms, both private and public.
   - Users can enter a chatroom that's either public og a private chatroom where they have been invited.
   - Users can then see old and new messages.
5. [x] Messages should be stored in MongoDB.
   - Messages are stored in MongoDB when sent within a chatroom.
   - Websockets are used to send messages in real time, so you can chat with other members of the chatroom.
   - Websockets are also used when a chatroom is created, so users can see newly created chatrooms in real time.
     - When viewing chatrooms, there is a live feed that broadcasts newly created chatrooms. These messages are not meant to be stored in DB.
6. [x] Messages should contain name of sender from identity provider.
   - When a user sends a message, name is stored. The name has been fetched from google or microsoft.
   - NOTE: If a users choose to change their name, then the new name will represent the user, not the name fetched from google or microsoft.
7. [x] When a users sign in, messages shall be fetched from database.
8. [x] Logged-in users can create chatroom. Chatroom needs to be specified when sending messages.
   - Like explained earlier, so can users create private and public chatrooms.
   - Regarding selecting a chatroom when sending messages, this is solved by users having to enter a chatroom. Either public or private (If whitelisted).
9. [x] The system shall make sure that no chatroom with the same name/title can be created.
   - When a user creates a chatroom, there is a list with chatroom titles. If the title already exists, the submit button will be disabled.
10. [x] The user that created the chatroom can change title and description.
    - This can be done by the user when they enter the chatroom they created. They will have the option to activate "edit mode".
11. [x] Users can update their name and bio. Use can also see other users.
    - User can change their bio and name under profile.
    - Users can browse through other users under "Browse Users".
      - Here they can use "next profile" and "previous profile" to browse user profiles.
12. [x] Users can change name and bio.
    - When a user changes name, old messages will be updated with new name.
13. [x] Users shall stay logged in when refreshing the page.
14. [x] Errors from server shall be displayed nicely to user with the option of trying again.
    - When an error occurs, the user will be presented with an error message.
    - The user will also have the chance to click a button that refreshes the page.
    - This is implemented through the component "HandleError.jsx".

## **Testing**

There are implemented both frontend and backend tests.

Frontend have simulation- and snapshot tests.

Backend tests are using a test-database, so create a .env file with the following:

MONGODB:<<"Your connection string">>.

Tests can be run from root folder with the command: "npm test".
