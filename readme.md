# Youtube Video Sharing App

## 1. Introduction:

<!-- A brief overview of the project, its purpose, and key features. -->

Youtube Video Sharing app is a platform to help users watch and share funny videos to others.

### **Key features:**

- Authentication
- View list and watch video
- Reaction video
- Share video
- Manage shared video (Change to public/private)
- Notification

## 2. Prerequisites:

### **Frontend**

- React Typescript
- TailwindCSS: help build UI fast
- Vite: help build assets quickly
- React Router Dom
- React Redux

### **BE: Firebase:**

**Why Firebase?**

I have used firebase to build many of my small and medium applications, I like it because it is quite simple to use, fast speed, free hosting and cheap cost. This app requires some modules that need realtime, so I decided to choose firebase as the backend for this app.

**Services used:**

- Firestore: for real-time databases.
- Authentication: for the authentication flow.
- Hosting: Deploy to Firebase web hosting.

## 3. Installation & Configuration:

- Instal [Node.js](https://nodejs.org/en): 14.18+ (Vite requires Node.js version 14.18+)
- Clone source:
  ```
  git clone https://github.com/cvthang56th2/youtube-video-sharing
  ```
- cd to cloned folder, install dependencies by running command:
  ```
  npm install
  ```
- Config environment variables:

  - Duplicate a .env.sample and rename to .env.local
    ![env setup](readme\images\env-setup.png)
  - [Get Youtube API Key](https://developers.google.com/youtube/registering_an_application) add add too env file.
  - Get Firebase configs: go to [Firebase Console](https://firebase.google.com/console), create new app and copy config add to env file:
    ![Firebase console](readme\images\firebase-console.png)
    ![Firebase configs](readme\images\firebase-configs.png)

- After setup all configs, start dev:
  ```
  npm run dev
  ```

## 4. Database Setup:

- Go to Firebase console, choose your app.
- Setup Authentication: Authentication > Sign-in method: Add email provider.
  ![Enable email authentication](readme\images\firebase-authentication.png)
- Setup Firestore database:

  - Update document rules, of course we need more complexible rules, but this app just a demo so I will rules like this:
    ![Firestore rules](readme\images\firestore-rules.png)
  - Create collections: [users](/src/types/User.ts), [videos](/src/types/Video.ts), [notifications](/src/types/Notification.ts) with fields as defined specified in `src/types/<collection>.ts`.
    ![Firestore Collections](readme\images\firestore-collections.png)

- Backend - firebase will used as services and located in the directory `/src/firebase`
  ![Firebase folder](readme\images\firebase-folder.png)

## 5. Indexes

Cloud Firestore ensures query performance by requiring an index for every query. The indexes required for the most basic queries are automatically created. This app need an composite index:

**Notifications index**

| fields       | order     |
| ------------ | --------- |
| notSeenUsers | Arrays    |
| authorId     | Ascending |
| name         | Ascending |

![Firestore indexes](readme\images\firestore-indexes.png)

## 6. Running the Application, and tests:

- To start dev:
  ```
  npm run dev
  ```
- To run tests:

  This source has Unit test functions in utils, Unit test React Components.

  Test folder is located in `/src/__tests__`
  ![test folder](readme\images\test-folder.png)

  - Run test:

  ```
  npm run test
  ```

  ![run test](readme\images\run-test.png)

  - Run test and get Coverage result:

  ```
  npm run coverage
  ```

  ![Coverage](readme\images\coverage.png)

  I know I definitely have to write more test cases to make coverage page "greener"

## 7. Deployment:

This app is being deployed on firebase hosting using [Firebase CLI](https://firebase.google.com/docs/cli#install-cli-windows).

To deploy to firebase run these steps:

- Setup according to [Firebase hosting instructions](https://firebase.google.com/docs/hosting)
- Build project:
  ```
  npm run build
  ```
- Deploy to firebase hosting
  ```
  firebase deploy
  ```

## 8. Usage:

### **View video**

When you enter the app for the first time, you can see a list of videos shared by you or others.
![List video](readme\images\usage\list-video.png)
You can search for videos by video name or author name:
![Search video](readme\images\usage\search-video.png)
To watch the video, just click on the video box, the lightbox video will show and the youtube embedded iframe will autoplay:
![Popup video](readme\images\usage\popup-video.png)
If you want to see the author's shared video, just click on the author's email:
![user videos](readme\images\usage\user-videos.png.png)

### **Reaction video**

**You need to login to do this action.**
If you are not logged in, when you click the like or dislike button, the application will display a warning to warn you to log in and open the login dialog.
![Login alert](readme\images\usage\login-alert.png)
![Login dialog](readme\images\usage\login-dialog.png)
If you don't have an account, you can click "Don't have an account? Register now." to switch to the registration form.
![Register form](readme\images\usage\register-form.png)
After logged in, you can react to the video by clicking the like or dislike button. If you want to revert your reaction just click on the selected react button.
![reaction video](readme\images\usage\reaction-video.png)

### **Share video**

To share a new video/movie, click the share movie button or open the [Share Video](https://video-sharing-391023.web.app/share-video) link
![Share video](readme\images\usage\share-video.png)

If you are not logged in, you will see this screen:
![share video not logged in](readme\images\usage\share-video-not-logged-in.png)

Enter youtube video link and click Share button

The system will check your video link

If it is not valid, the application will display a warning with the message: "Link video not valid.".
![video-share-failed](readme\images\usage\video-share-failed.png)
If the video link is valid, the app will show an alert with the message "Success!" and system will take video data (title, description, thumbnail) from Youtube and save it in database.

After that, redirect you to your shared video's page. By default, the video will have a status of Public.
![video-share-success](readme\images\usage\video-share-success.png)
![user-shared videos](readme\images\usage\user-shared-videos.png)

### **Notification**

After a user shares a new video/movie, other users will receive a real-time notification, which is displayed in the Notifications dialog box.
![Notification dialog](readme\images\usage\notification-dialog.png)
After watch video and wanting to check the notification has been read, user can click Checked button, the message will disappear.
![No notifications](readme\images\usage\no-notifications.png)

### **Manage shared video**

Go to your shared video page by clicking My Video button

To change the video to Private/Public, click Change to Private/Public in the video box, click Yes on the confirmation dialog.
![change-status](readme\images\usage\change-status.png)

After this action, all unseen user notifications about this video will disappear if we switch to Private or will be visible again if we switch to Public.

## Logout

To logout, click to Logout button and click Yes on the confirmation dialog.
![logout](readme\images\usage\logout.png)

## 9. Troubleshooting:

- Make sure your Node.js version must be 14.18+
- You have setup valid Youtube API Key and Firebase configuration
