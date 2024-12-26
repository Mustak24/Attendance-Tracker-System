## For preview
Go or click [https://ex2406.netlify.app](https://ex2406.netlify.app)



## Getting Started

First, copy, clone, or download the repositry then,

then run following commmandes:


```bash
npm install
```
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Setup .env file

- JWT_KEY = ***XYZ
- DB_USERNAME = ***XYZ
- DB_PASSWORD = ***XYZ
- DB_ORGANIZATION_USERNAME_KEY = ***XYZ
- ORGANIZATION_IP = ***XYZ

## APIs Routes

- `Middlewares`
    - connectToDB
    - verifyOrganizationToken
    - verifyUserToken
- `organization`
    - attendences
        - get-info
        - mark-today-all-attendence
        - update-attendace
    - users
        - create-user
        - get-all-info
    - login
    - signup
    - verify-token
- `users`
    - attendence
        - get-today-attendence-status
        - mark-attendence
    - login
    - verify-token

##

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
