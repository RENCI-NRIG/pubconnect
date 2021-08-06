# Pubconnect



## Installation & Run

### Clone Project
Fork and clone the repo from Github.
```
git clone https://github.com/RENCI-NRIG/pubconnect.git
```

### Install Docker Compose
Run the following commands to install the current stable release of Docker Compose.

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

```

Set the permissions to make the binary executable:
sudo chmod +x /usr/local/bin/docker-compose
```

#### Notes for Mac User
If you are a Mac user, you might need to install Docker Desktop, which is available at
```
https://hub.docker.com/editions/community/docker-ce-desktop-mac
```


### Start Service
After installing you can easily get project setup and running by using Docker-Compose. By this, you will only need one line command to get two services(frontend, backend) running.

Change to your the cloned directory and then use

```
docker-compose up
```

If both frontend and backend are compiled successfully, you should be able to see the system running Port 80.

### Dev Mode
This project also has a production ready-to-deploy version. You are able to access by
```
docker-compose -f docker-compose.dev.yml up --build
```

### Stop Service
Use the following code to stop service.
```
docker-compose down
```

## Built With

- [Node](https://nodejs.org/) - The backend language used
- [Express](https://expressjs.com/) - The NodeJS framework used
- [React](https://reactjs.org/) - Reactive frontend framework built by Facebook
- [Material UI](https://material-ui.com/) - Material Design used
