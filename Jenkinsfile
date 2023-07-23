pipeline {
    agent any

    stages {
       stage('Build') {
            steps {
                echo 'Building....'
                sh 'yarn install' 
                sh 'yarn run build' 
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