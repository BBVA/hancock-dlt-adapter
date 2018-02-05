blockchainhubNodePipeline{
// ---- DEVELOP ----
      if (env.BRANCH_NAME == 'develop') {

        // NPM Install
        stage("NPM Install"){
          container("node"){
            withCredentials([string(credentialsId: 'NPM_REGISTRY', variable: 'NPM_REGISTRY'),string(credentialsId: 'NPM_REGISTRY_TOKEN', variable: 'NPM_REGISTRY_TOKEN')]){
              sh """
                echo "registry=http://${env.NPM_REGISTRY}/" >> .npmrc
                echo "//${env.NPM_REGISTRY}/:_authToken=\"${env.NPM_REGISTRY_TOKEN}\"" >> .npmrc
                cat .npmrc
                npm install
              """
            }
          }
        }

        // Docker build + push
        docker_shuttle_stage()

        // Deploy
        deploy_shuttle_stage(project: "blockchainhub", environment: "develop")
      }
}