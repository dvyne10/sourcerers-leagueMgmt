pipeline {
    agent {
         docker {
            image 'node'
        }
    }

    stages {
        stage('Build') {
            steps {
                echo 'building....'
                sh 'npm install'
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