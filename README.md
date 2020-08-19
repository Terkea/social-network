DEMO: https://social-network-32715.firebaseapp.com/

# Create post

![Create post](./img/create_post.gif)

# Live notifications

![Live notifications](./img/notifications.gif)

# Update profile

![Update profile](./img/update_profile.gif)

# Installation

## Option 1

### > **Docker**

To install it with docker, you only need to run the following command:

#### dev port 3000

```
docker-compose up -d --build
```

#### prod port 80

```
docker-compose -f docker-compose.prod.yaml up -d --build
```

## Option 2

### > **React**

```bash
# Install the node packages
npm install
# Start the App in Development Mode
npm start
```

# Configuration

Replace the environment variables from `.env` and enable authentication with email and password.

### bucket rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

database rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write;
    }
  }
}
```
