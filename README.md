# FaceAnalyzer - Frontend Project

## Run locally

To run the application locally, you will need to have Node.js >= 14 on your local development machine. During the development of this application, Node.js v18.18.2 was used.

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

## Deployment

### Architecture

FaceAnalyzer frontend is built as a cloud-native app. It is deployed as a 1 container. Container is running Docker image of this repo. It is deployed to a [Kubernetes cluster](https://github.com/FaceAnalyzer/aks-cluster).

The deployment manifest is located in `face-analyzer`. `manifest-production.yaml` is for production environment, while `manifest-staging.yaml` is for staging environment. At this time the only difference is the domain for frontend container, configuration is the same for both environments.

Apart from having Deployment, frontend also has Service and Ingress. This exposes frontend to the Internet. Ingress resource is picked up by Ingress-nginx, that should already be deployed into the cluster

### CI/CD

Frontend repo is supported by CI/CD. We use GitHub Actions that are built-in to GitHub.
The deployment pipeline is straightforward. It has two jobs.
The first job builds a Docker image using the Dockerfile in the repo, and then pushes the Docker image to a Docker registry, in our case DockerHub. This jobs also adds the appropriate production/staging Visage|SDK license to the Docker image. License file is loaded from `VISAGE_SDK_LICENSE` variable that is set as a repository secret in GitHub Actions secrets. Since FaceAnalyzer frontend connects to FaceAnalyzer backend, backend URL should also be set. The URL is set in `.env.production`.
The second job deploys a  Kubernetes YAML manifest to the Kubernetes cluster. Based on this manifest, Kubernetes cluster pulls the right image from the DockerHub.

For CI/CD to work properly, a working Kubernetes cluster is required, including access to the cluster. Learn more on [aks-cluster](https://github.com/FaceAnalyzer/aks-cluster) repo.

E2E tests are located on [e2e-tests](https://github.com/FaceAnalyzer/e2e-tests) repo.

### Makefile

You can also deploy this project manually, without CI/CD. A Makefile is provided in `face-analyzer` directory. Be sure to set the right kubeconfig before deploying, since this uses your local `kubectl`.

Run `make deploy VERSION=<version>` to build the Docker image, push the image, and apply the Kubernetes manifest.
You must set a version.

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
