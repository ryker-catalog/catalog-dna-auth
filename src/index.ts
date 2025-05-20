import { createAuth0Client } from '@auth0/auth0-spa-js';

const init = async () => {
  ///////////////Create Auth0 client
  const client = await createAuth0Client({
    clientId: '4CqRLH3KK9xw54bDu8aYcgLSgeA3bku6', //cleintID from auth0
    domain: 'dev-bjajppuyg4p1ypcj.us.auth0.com',//domain from auth0
    authorizationParams: {
      redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/services', //Redirect URL after login
    },
  });

  console.log(client)

  ///////////////Get buttons
  const logoutButton = document.getElementById('logout-button');
  const loginButton = document.getElementById('login-button');
  const signUpButton = document.getElementById('signup-button');

  const contactStorageButtonActive = document.getElementById('contact-storage-button-active') as HTMLButtonElement;
  const contactStorageButtonInactive = document.getElementById('contact-storage-button-inactive') as HTMLButtonElement;
  const contactComputingButtonActive = document.getElementById('contact-computing-button-active') as HTMLButtonElement;
  const contactComputingButtonInactive = document.getElementById('contact-computing-button-inactive') as HTMLButtonElement;

  const contactStoragePopup = document.getElementById('contact-storage-popup');
  const contactComputingPopup = document.getElementById('contact-computing-popup');

  ///////////////Redirect after login logic
  const url = new URLSearchParams(window.location.search);
  const code = url.get('code');

  if (code) {
    if (!loginButton || !logoutButton || !signUpButton || !contactStorageButtonActive || !contactStorageButtonInactive || !contactComputingButtonActive || !contactComputingButtonInactive || !contactStoragePopup || !contactComputingPopup) {
      console.log("button(s) missing")
    }
    else {
      // console.log("redirected after login")
      const { appState } = await client.handleRedirectCallback();
      const user = await client.getUser();
      // console.log(user)
      const originButtonClicked = appState?.originButtonClicked
      console.log("info:")
      console.log(originButtonClicked)
      if (originButtonClicked == 'contactStorage') {
        contactStoragePopup.style.display = 'flex'
      }
      if (originButtonClicked == 'contactComputing') {
        contactComputingPopup.style.display = 'flex'
      }
      history.replaceState({}, document.title, window.location.origin + window.location.pathname);
    }
  }

  /////////User Logged-in status
  const isLoggedIn = await client.isAuthenticated();

  ////////////Button show/hide logic
  const showButtons = function () {
    if (!loginButton || !logoutButton || !signUpButton || !contactStorageButtonActive || !contactStorageButtonInactive || !contactComputingButtonActive || !contactComputingButtonInactive) return;

    if (isLoggedIn) {
      loginButton.style.display = "none"
      logoutButton.style.display = "inline-block"
      signUpButton.style.display = "none"

      contactStorageButtonActive.style.display = "block";
      contactComputingButtonActive.style.display = "block";

      contactStorageButtonInactive.style.display = "none";
      contactComputingButtonInactive.style.display = "none";
    }
    else if (!isLoggedIn) {
      loginButton.style.display = "inline-block"
      logoutButton.style.display = "none"
      signUpButton.style.display = "inline-block"

      contactStorageButtonActive.style.display = "none";
      contactComputingButtonActive.style.display = "none";

      contactStorageButtonInactive.style.display = "block";
      contactComputingButtonInactive.style.display = "block";
    }
  }

  showButtons()


  /////////////Event listeners on webflow page buttons
  window.Webflow ||= [];
  window.Webflow.push(() => {

    if (!loginButton || !logoutButton || !signUpButton || !contactStorageButtonInactive || !contactComputingButtonInactive) return;

    loginButton.addEventListener('click', async (e) => {
      (await client).loginWithRedirect(
        {
          appState: {
            originButtonClicked: 'login',
            custom_param2: 'value2',
          },
        }
      );
    });

    logoutButton.addEventListener('click', async () => {
      (await client).logout({
        logoutParams: {
          returnTo: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/services'
        }
      });
    });

    signUpButton.addEventListener('click', async (e) => {
      console.log("signup clicked")
    })

    if (!isLoggedIn) {
      contactStorageButtonInactive.addEventListener('click', async (e) => {
        (await client).loginWithRedirect(
          {
            appState: {
              originButtonClicked: 'contactStorage',
              custom_param2: 'value2',
            },
          }
        );
      })

      contactComputingButtonInactive.addEventListener('click', async (e) => {
        (await client).loginWithRedirect(
          {
            appState: {
              originButtonClicked: 'contactComputing',
              custom_param2: 'value2',
            },
          }
        );
      })
    }
  });
};

//////////Initialize
init();