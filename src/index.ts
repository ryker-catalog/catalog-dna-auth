import { initAsimovPage } from '$utils/asimov-page';
import { initDnablotPage } from '$utils/dnablot-page';
import { initOtherPages } from '$utils/other-pages';
import { initServicesPage } from '$utils/services-page';
import { initWritersPage } from '$utils/writers-page';
import { createAuth0Client } from '@auth0/auth0-spa-js';

const init = async () => {
  ///////////////Create Auth0 client
  const client = await createAuth0Client({
    clientId: '4CqRLH3KK9xw54bDu8aYcgLSgeA3bku6', //cleintID from auth0
    domain: 'dev-bjajppuyg4p1ypcj.us.auth0.com',//domain from auth0
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
    authorizationParams: {
      redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io', //Redirect URL after login
    },
  });

  console.log("Auth0 Client:")
  console.log(client)

  let user = await client.getUser();

  let currentUrl = window.location.href

  if (currentUrl.includes('https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/services')) {
    initServicesPage(client, user, currentUrl)
  }
  else if (currentUrl.includes('https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/dna-writers')) {
    initWritersPage(client, user, currentUrl)
  }
  else if (currentUrl.includes('https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/asimovpress')) {
    initAsimovPage(client, user, currentUrl)
  }
  else if (currentUrl.includes('https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/dnablot')) {
    initDnablotPage(client, user, currentUrl)
  }
  else {
    initOtherPages(client, user, currentUrl)
  }
};

//////////Initialize
init();