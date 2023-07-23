pipeline {
    agent any

    stages {
        stage('Prepare'){
            steps{
             sh "npm install -g yarn"
            }
        }
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