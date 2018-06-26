nodePipeline{

  // ---- DEVELOP ----
  if (env.BRANCH_NAME == 'develop') {

    stage('Install Dependencies'){
      container('node'){
        sh """
          yarn cache clean --force
          yarn install
        """
      }
    }

    stage('Unit tests'){
      container('node'){
        sh """
          yarn run coverage
        """
      }
    }

    docker_shuttle_stage()

    // We dont have test by the moment
    // qa_data_shuttle_stage()

    deploy_shuttle_stage(project: "blockchainhub", environment: "develop", askForConfirmation: false)

  }

  // ---- RELEASE ----
  if (env.BRANCH_NAME =~ 'release/*') {

    docker_shuttle_stage()

    qa_data_shuttle_stage()

    deploy_shuttle_stage(project: "blockchainhub", environment: "qa", askForConfirmation: false)

  }

}