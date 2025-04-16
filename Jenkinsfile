pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/abdessalamzarrouk/ecom-nosql'
            }
        }
        
        stage('Build Services') {
            steps {
                sh 'docker compose up --build'
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f kubernetes/'
            }
        }
    }
}
