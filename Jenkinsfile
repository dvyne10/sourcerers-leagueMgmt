pipeline {
    agent {
        docker {
            image 'node:lts' 
            args '-p 3000:3000' 
        }
    }

    stages {
       stage('Build') {
            steps {
                dir('frontend'){
                    echo 'Building....'
                    sh 'yarn install' 
                    sh 'yarn run build' 
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
                dir('frontend'){
                    echo 'Deploying....'
                    withCredentials([string(credentialsId: 'NETLIFY_AUTH_TOKEN', variable: 'NETLIFY_AUTH_TOKEN')]) {
                        sh '/usr/local/bin/ntl deploy --prod --open'
                    }
                }
            }
        }
    }
}