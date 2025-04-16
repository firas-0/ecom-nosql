pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/abdessalamzarrouk/ecom-nosql'
            }
        }
        triggers{
            pollSCM '*/5 * * * *'
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
