# GitHub Bio Search

Search GitHub users by their bio descriptions. Built with React, TypeScript, and Tailwind CSS.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your GitHub credentials:
   ```
   VITE_GITHUB_TOKEN=your_github_token
   VITE_GITHUB_CLIENT_ID=your_client_id
   ```

4. For development:
   ```bash
   netlify dev
   ```

## Environment Variables

### Local Development
- `VITE_GITHUB_TOKEN`: GitHub Personal Access Token
- `VITE_GITHUB_CLIENT_ID`: GitHub OAuth App Client ID

### Netlify Deployment
Set these in Netlify environment variables:
- `GITHUB_CLIENT_ID`: OAuth App Client ID
- `GITHUB_CLIENT_SECRET`: OAuth App Client Secret
- `VITE_GITHUB_CLIENT_ID`: Same as GITHUB_CLIENT_ID

## License

MIT