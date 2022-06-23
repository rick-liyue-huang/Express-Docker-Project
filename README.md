
## Express-Docker-Project

#### Introduction

#### Rules

1. using the Reg to show the different url for the same page:
```js
app.get('^/$|/index(.html)?', (req, res) => {
	res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
```

2. for some page, we can re-direct to different url with 301 status by default:
```js
app.get('/old-page(.html)?', (req, res) => {
	res.redirect(301, '/new-page'); // 302 by default
});
```

3. for other not yet config page, we should use '*', but put it in the end, but need 'status(404)':
```js
app.get('*', (req, res) => {
	res.status(404);
	if (req.accepts('html')) {
		res.sendFile(path.join(__dirname, 'views', '404.html'));
	}
	else if (req.accepts('json')) {
		res.json({error: '404 not found'})
	}
	else {
		res.type('txt').send('404 not found')
	}
});
```

4. router handler use next() to get the response
```js
app.get('/hello(.html)?',
	(req, res, next) => {
		console.log('attempt to handle hello.html');
		next(); // will go to the next route rule
	},
	(req, res) => {
		res.send('hello world');
	}
)
```

5. the express router middleware is the router handler with 'next' parameters, we can use multiple handlers in one route by putting in  '[]':
```js
app.get('/chain(.html)?', [one, two, three]);
```


#### Middlewares

Should know some built-in and third-part middlewares:
1. `app.use(express.urlencoded({extended: false}))` for C'ontent-type: application/x-www-form-urlencoded' format; 
2. `app.use(express.json())` for response json format;
3. `app.use(express.static(path.join(__dirname, 'public')))` for accessing the public static resources, and also need to note that the public is default as the public resource root path, so the path in xxx.html will be `<link rel="stylesheet" href="css/style.css" />`, and we can get it by visit 'http://localhost:3500/css/style.css';
4. `app.use(cors())` will solve the problem of 'cross-origin-server', but we also can extend the cors middleware by define the whileList:
```js
const whiteList = ['https://www.google.com', 'https://www.your-site.com', 'http://127.0.0.1:3500', 'http://localhost:3500'];
const corsOptions = {
	origin: (origin, callback) => {
		if (whiteList.indexOf(origin) !== -1) {
			callback(null, true) // null for error, and true for 'yes it is same origin'
		} else {
			callback(new Error('Not allowed by CORS'))
		}
	},
	optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
```
5. we also can define the custom middleware, and use `app.use(logger)` to get the info from logEvent;
6. the custom middleware also can add err args to deal with some error page:
```js
const errorHandler = (err, req, res, next) => {
	console.log(err.stack);
	res.status(500).send(err.message);
};
```

#### Router

The router can be acted as the middleware, and the static resource also should be add router path respectively.
```js
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/subdir', express.static(path.join(__dirname, 'public')));
app.use('/subdir', router);

```

The router methods used here include get, post, put and delete, we can put them together,

```js
employeeRouter
	.route('/')
	.get((req, res) => {
		res.json(data.empployees)
	})
	.post((req, res) => {
		res.json({
			'firstname': req.body.firstname,
			'lastname': req.body.lastname
		});
	})
	.put((req, res) => {
		res.json({
			'firstname': req.body.firstname,
			'lastname': req.body.lastname
		});
	})
	.delete((req, res) => {
		res.json({'id': req.body.id})
	});

employeeRouter.route('/:id')
	.get((req, res) => {
		res.json({id: req.params.id})
	})

```

#### MVC pattern

The express frameworks is using MVC patter when 


#### Auth Router

firstly, use MVC pattern to get the login and register controller and router,
secondly, use JWT to store the auth user information, note that: 
1. Access Token: sent as JSON, Client stores in memory, do not store in local storage or cookie;
2. Refresh Token: sent as httpOnly cookie, not accessible via javascript, must have expiry at some time;
3. Access Token: issued at authorization, client uses for API access until expires, verified with middleware, new token issued at refresh token request;
4. Refresh Token: issued at authorization, client uses to request new access token, verified with endpoint and database, must be allowed to expire or logout;


I create secrete key in .env file by taping `require('crypto').randomBytes(64).toString('hex')` and get them.

Authentication: the process of verifying who someone is;
Authorization: the process of verifying what resources a user has access to;
JSON Web Tokens: confirm authentication, allow access to API endpoints, endpoints provide data resources, use authorization header.


JWT again

Refresh Token Rotation: is a change in strategy from the standard refresh token approach, 

when a new access token is issued, a new refresh token is also issued, this does not eliminate the risk, but it does greatly reduce it.
a refresh token can only be used once, if reuse is detected, all refresh tokens are invalidated for the user which will force a new login for authentication.




#### Docker

visit the website 'hub.docker.com' and login to search 'node', 

create custom image by creating 'Dockerfile' file and create five layers for docker image:
```dockerfile
FROM node:16
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 3500
CMD ["nodemon", "server.js"]
```

run `docker build . ` to create docker image, and we can find the five layers, but if we run again, it will be cached without coding change.
run ` docker image ls ` to show the image list. 
run `docker image rm [image id]` to remove the image.
run ` docker build -t node-app-image .` will get the completed image by running `docker image ls`, here '--tag , -t' means Name and optionally a tag in the 'name:tag' format.
after that, run `docker run -d --name node-app node-app-image`, here '--name [docker container name]' and '-d' detach is by default we create a docker container from docker run.
after create docker container, we run `docker ps -a` to show all the containers.

to kill one docker container to run `docker rm node-app -f`
we re-create one docker container by ` docker run -p 3500:3500 -d --name node-app node-app-image`, here '3501:3500' for the traffic port from the outside world, and second 3500 means the actual app run in local.
run `docker exec -it node-app bash` to login the /app directory in container, -it means interactive mode.

create file of '.dockerignore' to ignore some file when creating docker image.

until now, we only create the stale image from local machine!!!

in order to sync the local coding to container coding, we need to add '-v pathtofolderonlocal:pathtofolderoncontainer'

so run ` docker run -v $(pwd):/app -p 3500:3500 -d --name node-app node-app-image`
but also need to modify to 'CMD ["npm", "run", "dev"]' in Dockerfile

now, we already can sync the container files with local files.

here we also add bind mount in developing stage: `docker run -d -p 3500:3500 -v $(pwd):/app -v /app/node_modules --name node-app node-app-image` means do not ignore the node_modules when sync the files.

for some reason, we do not want to modify the files in container, so we run ` docker run -d -p 3500:3500 -v $(pwd):/app:ro -v /app/node_modules --name node-app node-app-image` for read only

WHEN we change the Dockerfile, we need to kill the old image and run the new one.

we also can run ` docker run -d -v $(pwd):/app:ro -v /app/node_modules -p 3500:4000 --env PORT=4000 --name node-app node-app-image`


we can set multiple environment variables by run `docker run -d -v $(pwd):/app:ro -v /app/node_modules --env-file ./.env -p 3500:3500 --name node-app node-app-image`

when run `docker volume ls` we will find multiple volumes, so we can delete them by run `docker volume prune`, we also can delete volume associated with current container by run `docker rm node-app -fv`.

'Docker Compose' is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.

here we create the 'docker-compose.yml' to define the docker compose file, and use it to create the image and container.

run `docker-compose up -d` to create the image and container by 'docker-compose.yml'.
run `docker-compose down -v` to delete the container and volume
run `docker-compose up --build -d` to re-build the image and crete the new container

for the different development and production environment, we separate the docker-compose files
so, we create 'docker-compose.yml', 'docker-compose.dev.yml' and 'docker-compose.prod.yml', and run `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build` for production environment and run `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build` for development environment.

modify the 'Dockerfile' and 'docker-compose*' to ignore the dev-dependencies on production stage.



#### Mongo on Docker

in the file 'Dockerfile', we can create the second service (app) for mongoDB, named 'mongo'. so when we run `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build` we will get two container, and we run `docker exec -it [mongo id] bash` to enter the mongoDB container environment, and then we can run `mongo -u "username" -p "password"` to enter mongoDB coding environment, in which we will create the mongoDB database and data. 

Here has one problem that: when we 'docker down' the service/container, we will lose the data in mongo service, so we need to modify the 'Dockerfile' and add custom volume to store the data, so we will get file of

```dockerfile
version: "3.8"

services:
  # first app only for the web-app
  node-app:
    build: .
    ports:
      - "3500:3500"
    environment:
      - PORT=3500
    env_file:
      - ./.env

  # second app for the mongoDB
  mongo:
    image: mongo
    environment:
      - MONGO_INITDB_ROOT_USERNAME=rickliyuehuang
      - MONGO_INITDB_ROOT_PASSWORD=passwordpassword

#    custom the volume to store the data for re-start the mongo container
    volumes:
      - mongo-db:/data/db

volumes:
  mongo-db: 
```

but remember that: we should delete the container by '-v': `docker-compose -f docker-compose.yml -f docker-compose.dev.yml down`!!!

in order to connect with mongoose, we need to run `docker inspect [mongodb id]` to get the ipaddress, and then we can run `docker logs [node-app id]` to see whether it connects with mongoDB.

In order to connect with the same ip address of mongoDB service, we need to create the custom address, named with the matched service name in Dockerfile 'mongo', so we name as 'mongo': `mongodb://rickliyuehuang:passwordpassword@mongo:27017/?authSource=admin`, thus we do not care the changable mongo service ip address after reboot.
