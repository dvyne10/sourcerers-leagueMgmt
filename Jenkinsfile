pipeline {
    agent {
        docker {
            image 'node:lts-bullseye-slim' 
            args '-p 3000:3000' 
        }
    }

    stages {
        stage('Prepare') {
            steps {
                // Install Yarn globally inside the Docker container
                sh 'npm install -g yarn'
            }
        }
       stage('Build') {
            steps {
                dir('frontend'){
                    echo 'Building....'
                    sh 'npm install' 
                    sh 'npm run build' 
                }
               
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}