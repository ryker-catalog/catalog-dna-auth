import { initServicesPage } from '$utils/services-page';
import { createAuth0Client } from '@auth0/auth0-spa-js';

const init = async () => {
  ///////////////Create Auth0 client
  const client = await createAuth0Client({
    clientId: '4CqRLH3KK9xw54bDu8aYcgLSgeA3bku6', //cleintID from auth0
    domain: 'dev-bjajppuyg4p1ypcj.us.auth0.com',//domain from auth0
    authorizationParams: {
      redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io', //Redirect URL after login
    },
  });

  console.log("Auth0 Client:")
  console.log(client)

  let user = await client.getUser();

  let currentUrl = window.location.href

  if (currentUrl == 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/services') {
    initServicesPage(client, user, currentUrl)
  }
  else if (currentUrl == 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/dna-writers') {
    console.log("dna-writers page")
  }
  else if (currentUrl == 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/asimovpress') {
    console.log("asimov page")
  }
  else if (currentUrl == 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/dnablot') {
    console.log("dnablot page")
  }
  else {
    console.log("other page")
  }
};

//////////Initialize
init();