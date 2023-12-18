# **Introduction**

This is an application where you can create chatrooms with different subjects. Chatrooms can be
created by registered users. They can be private or public. Public chatrooms can be joined by
anyone. Private chatrooms can only be joined if you are whitelisted.

Link to heroku deployment:https://exam-pg6301-2023-7a7d8664f40e.herokuapp.com/

Link to github classroom:https://github.com/kristiania-pg6301-2023/pg6301eksamen-didrichsen/tree/main

## **Functional Requirements**

1. [x] Anonymous users shouldn't see chat logs, but can log in to see.
2. [x] Users should be able to log in.
   - Users can log in with Google or Microsoft Entra ID.
3. [x] A logged-in user should be able to see profile information (userinfo from google).
   - When a user logs in, they will se their name and email fetched from google or microsoft.
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

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/pgC2zHhI)
