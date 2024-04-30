
# User Management Stytem

This project is a Node.js application for managing users, using Mongodb as a database, and redis for implement cache Stytem.


## Run Locally

Clone the project

```bash
  git clone https://github.com/Anikroy7/user_management_server.git
```

Go to the project directory

```bash
  cd user_management_server
```

Install dependencies

```bash
  npm install
```

```bash
  docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 -e REDIS_ARGS="--requirepass Anik@1199 redis/redis-stack:latest
```

Start the server

```bash
  npm start
```


## Environment Variables

`DB_USER`
`DB_PASS`

`PORT`

`ACCESS_TOKEN`

`REDIS_EXPIRE_KEY`

`ADMIN_KEY`


[Api Documentation](https://documenter.getpostman.com/view/28713434/2sA3BuXUYs#0c7c0a92-6f37-4fa1-b695-898727559e1a)


## Running Tests

To run tests, run the following command

```bash
  npm test
```


## Authors

- [@Anikroy7](https://github.com/anikroy7)


    
