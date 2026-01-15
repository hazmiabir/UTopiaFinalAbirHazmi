pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS' // Configurez dans Manage Jenkins → Tools
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
                    echo Node version:
                    node --version
                    echo npm version:
                    npm --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('TestPlaywright') {
                    bat '''
                        echo Installing npm dependencies...
                        npm ci
                    '''
                }
            }
        }
        
        stage('Install Playwright Browsers') {
            steps {
                dir('TestPlaywright') {
                    bat '''
                        echo Installing Playwright browsers...
                        npx playwright install --with-deps
                    '''
                }
            }
        }
        
        stage('Run Playwright Tests') {
            steps {
                dir('TestPlaywright') {
                    bat '''
                        echo Running Playwright tests...
                        npx playwright test --reporter=html
                    '''
                }
            }
        }
        
        stage('Archive Test Results') {
            steps {
                dir('TestPlaywright') {
                    // Archive HTML report
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Test Report'
                    ])
                    
                    // Archive test results (if using JUnit reporter)
                    junit allowEmptyResults: true, 
                          testResults: 'test-results/*.xml'
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'All tests passed!'
        }
        failure {
            echo 'Tests failed! Check the report.'
        }
    }
}