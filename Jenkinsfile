pipeline {
    agent any
        triggers {
        pollSCM('H/5 * * * *') // Polls every 15 minutes
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/firas-0/ecom-nosql.git'
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
