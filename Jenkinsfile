pipeline {
    agent any

    environment {
        DOCKER_TAG = "${BUILD_NUMBER}"
        DOCKERHUB_USER = "vijay1304"
        PATH = "/Users/vijay/.docker/bin:/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin"
        KUBECONFIG = "/Users/vijay/.kube/config"
        NO_PROXY = "registry-1.docker.io,docker.io"
        no_proxy = "registry-1.docker.io,docker.io"

    }

    stages {
        stage('Git Clone') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/vijayrajput1351/ecom.git'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerlogin',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                docker build -t ${DOCKERHUB_USER}/frontend-h:${DOCKER_TAG} ./frontend
                docker build -t ${DOCKERHUB_USER}/api-h:${DOCKER_TAG} ./api-gateway
                docker build -t ${DOCKERHUB_USER}/user-h:${DOCKER_TAG} ./user-service
                docker build -t ${DOCKERHUB_USER}/product-h:${DOCKER_TAG} ./product-service
                docker build -t ${DOCKERHUB_USER}/order-h:${DOCKER_TAG} ./order-service
                docker build -t ${DOCKERHUB_USER}/payment-h:${DOCKER_TAG} ./payment-service
                '''
            }
        }

        stage('Push Docker Images') {
            steps {
                sh '''
                docker push ${DOCKERHUB_USER}/frontend-h:${DOCKER_TAG}
                docker push ${DOCKERHUB_USER}/api-h:${DOCKER_TAG}
                docker push ${DOCKERHUB_USER}/user-h:${DOCKER_TAG}
                docker push ${DOCKERHUB_USER}/product-h:${DOCKER_TAG}
                docker push ${DOCKERHUB_USER}/order-h:${DOCKER_TAG}
                docker push ${DOCKERHUB_USER}/payment-h:${DOCKER_TAG}
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl set image deployment/frontend-deployment frontend=${DOCKERHUB_USER}/frontend-h:${DOCKER_TAG} -n ecom
                kubectl set image deployment/api-deployment api=${DOCKERHUB_USER}/api-h:${DOCKER_TAG} -n ecom
                kubectl set image deployment/user-deployment user=${DOCKERHUB_USER}/user-h:${DOCKER_TAG} -n ecom
                kubectl set image deployment/product-deployment product=${DOCKERHUB_USER}/product-h:${DOCKER_TAG} -n ecom
                kubectl set image deployment/order-deployment order=${DOCKERHUB_USER}/order-h:${DOCKER_TAG} -n ecom
                kubectl set image deployment/payment-deployment payment=${DOCKERHUB_USER}/payment-h:${DOCKER_TAG} -n ecom
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                kubectl rollout status deployment/frontend-deployment -n ecom
                kubectl rollout status deployment/api-deployment -n ecom
                kubectl rollout status deployment/user-deployment -n ecom
                kubectl rollout status deployment/product-deployment -n ecom
                kubectl rollout status deployment/order-deployment -n ecom
                kubectl rollout status deployment/payment-deployment -n ecom
                '''
            }
        }
    }

    post {
        success {
            echo '✅ All images pushed and deployments updated successfully!'
        }
        failure {
            echo '❌ Pipeline Failed!'
        }
    }
}