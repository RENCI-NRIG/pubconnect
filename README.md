# Pubconnect

## Installation & Run

### TL;DR

Modify `pubconnect.env` environment file as needed (Must also update the `backend/config/db.js` file to match settings)

```env
# environment settings for PubConnect

### UPDATE THESE SETTINGS PRIOR TO PRODUCTION USE ###

# MySQL database
MYSQL_DATABASE=db
MYSQL_USER=pfeffa
MYSQL_PASSWORD=goawayyouevilhackeryou
MYSQL_ROOT_PASSWORD=goawayyouevilhackeryou
MYSQL_HOST_VOLUME=./dbdata

# Nginx
NGINX_HOST_CONFIG_DIR=./nginx
NGINX_HOST_SSL_DIR=./ssl
```

Pull images, build containers, deploy

```console
docker-compose pull
docker-compose --env-file=pubconnect.env build
docker-compose --env-file=pubconnect.env up -d
```

Verify running containers

```console
$ docker-compose ps
   Name                  Command               State                                   Ports
-----------------------------------------------------------------------------------------------------------------------------
pc-adminer    entrypoint.sh docker-php-e ...   Up      0.0.0.0:8080->8080/tcp,:::8080->8080/tcp
pc-backend    npm start                        Up
pc-db         docker-entrypoint.sh mysqld      Up      3306/tcp, 33060/tcp
pc-frontend   /docker-entrypoint.sh ngin ...   Up      80/tcp
pc-nginx      /docker-entrypoint.sh ngin ...   Up      0.0.0.0:443->443/tcp,:::443->443/tcp, 0.0.0.0:80->80/tcp,:::80->80/tcp
```

May require up-to two restarts to fully create initial database... check status of container first

```
$ docker-compose logs backend
Attaching to pc-backend
...                 ^
pc-backend  |
pc-backend  | Error: connect ECONNREFUSED 10.100.1.2:3306
pc-backend  |     at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1097:14)
pc-backend  | [nodemon] app crashed - waiting for file changes before starting...

OR

...
pc-backend  |
pc-backend  | Error: Table 'db.testbed' doesn't exist
pc-backend  |     at Packet.asError (/usr/src/app/node_modules/mysql2/lib/packets/packet.js:712:17)
pc-backend  |     at Query.execute (/usr/src/app/node_modules/mysql2/lib/commands/command.js:28:26)
pc-backend  |     at PoolConnection.handlePacket (/usr/src/app/node_modules/mysql2/lib/connection.js:425:32)
pc-backend  |     at PacketParser.Connection.packetParser.p [as onPacket] (/usr/src/app/node_modules/mysql2/lib/connection.js:75:12)
pc-backend  |     at PacketParser.executeStart (/usr/src/app/node_modules/mysql2/lib/packet_parser.js:75:16)
pc-backend  |     at Socket.Connection.stream.on.data (/usr/src/app/node_modules/mysql2/lib/connection.js:82:25)
pc-backend  |     at Socket.emit (events.js:189:13)
pc-backend  |     at addChunk (_stream_readable.js:284:12)
pc-backend  |     at readableAddChunk (_stream_readable.js:265:11)
pc-backend  |     at Socket.Readable.push (_stream_readable.js:220:10)
pc-backend  | [nodemon] app crashed - waiting for file changes before starting...
```

If an error is observed, restart the backend (may be more than once)

```console
docker-compose restart backend
```

After backend errors are resolved, navigate to the deployed URL and accept the self-signed SSL certificate risk warning. 

- For testing this is: [https://127.0.0.1/](https://127.0.0.1/)

**NOTE**: The Adminer container uses http only and can be found at: [http://127.0.0.1:8080/](http://127.0.0.1:8080/)

- Use credentials as set in `pubconnect.env`

---

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
