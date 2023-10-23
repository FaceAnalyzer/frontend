# FaceAnalyzer - Frontend Project

## Run locally

To run the application locally, you will need to have Node >= 14 on your local development machine. 

After cloning the project, navigate inside it and run in terminal:
```
npm install
```
This will make sure all necessary dependencies are installed. If there are any high severity issues or vulnerabilites, run 
```
npm audit fix
```
so all preexisting dependencies are updated to the latest ones.

```
npm start
```

This starts your app in development mode, rebuilding assets on file changes. The application will be run on ```http://localhost:3000```.

The page automatically reloads after editing and saving.



## Git Workflow

### Branches

- **main**: The main branch represents the production-ready code. Deployments are made from this branch.
- **development**: The development branch is the integration branch for feature development. New features are developed and tested here before merging into the main branch.

### Commit Messages

Please follow meaningful commit message conventions for clear version tracking.

Examples of commit messages:
- feat: Add user authentication feature
- fix: Correct API response format
- docs: Update README with Git workflow

This Git workflow ensures a structured approach to feature development, integration, and hotfix management while maintaining a stable production environment.