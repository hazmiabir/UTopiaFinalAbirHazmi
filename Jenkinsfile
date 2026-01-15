pipeline {
    agent any
    
    environment {
        PATH = "C:\\Program Files\\nodejs;${env.PATH}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/hazmiabir/UTopiaFinalAbirHazmi.git'
            }
        }
        
        stage('Verify Environment') {
            steps {
                bat '''
                    echo ================================
                    echo Checking Node and npm versions
                    echo ================================
                    node --version
                    npm --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('TestPlaywright') {
                    bat '''
                        echo ================================
                        echo Installing npm dependencies
                        echo ================================
                        npm ci
                    '''
                }
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                dir('TestPlaywright') {
                    bat '''
                        echo ================================
                        echo Installing Playwright browsers
                        echo ================================
                        npx playwright install --with-deps
                    '''
                }
            }
        }
        
        stage('Run Playwright Tests') {
            steps {
                dir('TestPlaywright') {
                    bat '''
                        echo ================================
                        echo Running Playwright tests
                        echo ================================
                        npx playwright test --reporter=html
                    '''
                }
            }
        }
        
        stage('Archive Test Results') {
            steps {
                dir('TestPlaywright') {
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Test Report'
                    ])
                    
                    archiveArtifacts artifacts: 'test-results/**/*', 
                                     allowEmptyArchive: true
                }
            }
        }
    }
    
    post {
        always {
            echo '================================'
            echo 'Pipeline finished.'
            echo '================================'
        }
        success {
            echo 'SUCCESS: All tests passed!'
        }
        failure {
            echo 'FAILURE: Tests failed! Check the report.'
        }
    }
}