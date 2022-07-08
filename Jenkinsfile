pipeline {
    agent any

    options {
        buildDiscarder(logRotator(numToKeepStr: '1', artifactNumToKeepStr: '1'))
    }

    tools {nodejs "node"}

    stages {
        stage('SonarQube') {
            steps {
                script {
                    sh "npm set registry ${VERDACCIO_URL}"
                    sh "yarn"

//                    sh "npm run test:CI"
//
//                    publishHTML(target: [allowMissing         : false,
//                                         alwaysLinkToLastBuild: false,
//                                         keepAll              : true,
//                                         reportDir            : 'coverage/lcov-report',
//                                         reportFiles          : 'index.html',
//                                         reportName           : 'Code Coverage Report',
//                                         reportTitles         : ''])

                 //   withSonarQubeEnv('SonarQube') {
                   //     sh "npm run sonar-scanner"
                    //}
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    echo "env.BUILD_NUMBER: ${env.BUILD_NUMBER}"
                    sh "docker build --build-arg GIT_COMMIT=${env.GIT_COMMIT} --build-arg VERDACCIO_URL=${VERDACCIO_URL} -t integration-comptable-web ."
                    sh "docker tag integration-comptable-web ${DOCKER_REGISTRY_URL}/integration-comptable-web:${env.BUILD_NUMBER}"
                    sh "docker push ${DOCKER_REGISTRY_URL}/integration-comptable-web:${env.BUILD_NUMBER}"

                    withKubeConfig([credentialsId: 'kubeconfig-integ']) {
                        sh "kubectl set image deployment/integration-comptable-web-deployment integration-comptable-web=${DOCKER_REGISTRY_URL}/integration-comptable-web:${env.BUILD_NUMBER} --record"
                    }
                }
            }
        }
    }
}
