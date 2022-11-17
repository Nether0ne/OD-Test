# Books/User REST API

## Introduction

This project implements REST API with CRUD functionalities for users and books, built on NodeJS and TypeScript, utilizing Express.js and using Prisma ORM. Some functionalities are tied to the technical requirements.

Features:

- User CRUD
- User JWT Auth
- Book CRUD
- User favorite books
- Prisma schema
- Basic migration

## Quick Start

Make sure that you have `PostgreSQL` service running

```bash
# create env file and fill it in according to the .env.example file
touch .env

# install project dependencies
npm install

# run migrations setup
npx prisma migrate dev

# run build
npm run build

# at last run dev for dev purposes
npm run dev

# or run production
npm run start
```

### Application

Application receives requests on http://localhost:5000/v1.
