build-docker:
	docker build -t plavy/faceanalyzer-frontend:$(VERSION) -f Dockerfile .

deploy: build-docker
	docker push plavy/faceanalyzer-frontend:$(VERSION)
	kubectl apply -n faceanalyzer -f manifest.yaml
	kubectl set image -n faceanalyzer deployment/faceanalyzer-frontend faceanalyzer-frontend=plavy/faceanalyzer-frontend:$(VERSION)
