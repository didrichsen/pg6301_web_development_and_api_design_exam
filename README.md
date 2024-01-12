# **Introduction**

This is a practical exam designed to assess your mastery of the technologies and concepts covered in the course: React, Express, MongoDB, Heroku, Jest, OpenId Connect, and Web Sockets. The practical nature of the exam means that you will be evaluated based on what you create and how it functions, rather than theoretical knowledge you have acquired. To demonstrate this, you are required to build an application where users can communicate in a chatroom. The learning objectives that the exam aims to demonstrate are as follows:

1. Create an app using Parcel, Express, Concurrently, Prettier, and Jest.
2. Set up a functional React app with React Router, handling loading state, and error handling.
3. Establish a functional Express app, including Express Routes in a separate file.
4. Implement communication between the client and server using GET, PUT, and POST, including error handling.
5. Deployment to Heroku.
6. Storage, retrieval, and updating of data in MongoDB.
7. Login with OpenId Connect (both Google and Microsoft Entra ID).
8. Implement Websockets.
9. Achieve test coverage between 50-70%.
   
The exam will assess your ability to execute these tasks, showcasing your practical skills in applying the mentioned technologies and concepts.

## Task Description

You are tasked with implementing a web-based chat solution with user profiles. 

When a user visits the website, 
they should be presented with an introduction to the site and the option to log in using at least two identity providers. 
You can use Google, Microsoft Entra ID, or implement Facebook or Github if you prefer. 

Once logged in, a user should be able to chat with other users and view previous chat messages.

## **Solution** 

Link to heroku deployment: https://exam-web-dev-and-api-design-7ff1a0be6f3c.herokuapp.com/

Link to github: https://github.com/didrichsen/Kristiania-WebDevAndAPI-Exam-PG301

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

Frontend has simulation- and snapshot tests.

Backend tests are using a test-database, so create a .env file with the following:

MONGODB:<<"Your connection string">>.

Tests can be run from root folder with the command: "npm test".
