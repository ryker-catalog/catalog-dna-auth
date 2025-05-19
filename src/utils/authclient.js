import { createAuth0Client } from '@auth0/auth0-spa-js';

//with async/await
const auth0 = await createAuth0Client({
    domain: '<AUTH0_DOMAIN>',
    clientId: '<AUTH0_CLIENT_ID>',
    authorizationParams: {
        redirect_uri: '<MY_CALLBACK_URL>'
    }
});