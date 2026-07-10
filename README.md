# StateStreet

## Deploying the backend on Koyeb

1. Push this repository to GitHub.
2. Create a new service on Koyeb using the GitHub repository.
3. Set the build command to `npm install`.
4. Set the start command to `node server.js`.
5. Add environment variables:
   - `PORT=8000`
   - `MONGODB_URI=<your-mongodb-connection-string>`
   - `JWT_SECRET=<your-secret>`

## Deploying the frontend on Vercel

1. Import the frontend folder into Vercel.
2. Set the root directory to `frontend`.
3. Add the environment variable:
   - `VITE_API_URL=https://<your-koyeb-app>.koyeb.app/api/v1`
4. Deploy.
