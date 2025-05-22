import { createAuth0Client, User } from '@auth0/auth0-spa-js';

const init = async () => {
  ///////////////Create Auth0 client
  const client = await createAuth0Client({
    clientId: '4CqRLH3KK9xw54bDu8aYcgLSgeA3bku6', //cleintID from auth0
    domain: 'dev-bjajppuyg4p1ypcj.us.auth0.com',//domain from auth0
    authorizationParams: {
      redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/services', //Redirect URL after login
    },
  });

  console.log("Auth0 Client:")
  console.log(client)

  const user = await client.getUser();

  ///////////////Get buttons
  const signUpButton = document.getElementById('signup-button');
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');

  const loggedInUsername = document.getElementById('logged-in-username');

  const contactStorageButtonActive = document.getElementById('contact-storage-button-active') as HTMLButtonElement;
  const contactStorageButtonInactive = document.getElementById('contact-storage-button-inactive') as HTMLButtonElement;
  const contactComputingButtonActive = document.getElementById('contact-computing-button-active') as HTMLButtonElement;
  const contactComputingButtonInactive = document.getElementById('contact-computing-button-inactive') as HTMLButtonElement;

  const contactStoragePopup = document.getElementById('contact-storage-popup');
  const contactComputingPopup = document.getElementById('contact-computing-popup');

  const contactStorageEmail = document.getElementById('email-3') as HTMLInputElement
  const contactComputingEmail = document.getElementById('email-4') as HTMLInputElement

  ///////////////Redirect after login logic
  const url = new URLSearchParams(window.location.search);
  const code = url.get('code');

  if (code) {
    if (!loginButton || !logoutButton || !signUpButton || !loggedInUsername || !contactStorageButtonActive || !contactStorageButtonInactive || !contactComputingButtonActive || !contactComputingButtonInactive || !contactStoragePopup || !contactComputingPopup) {
      console.log("button(s) missing")
    }
    else {
      const { appState } = await client.handleRedirectCallback();
      // const user = await client.getUser();

      if (user) {
        console.log("metadata")
        console.log(user.user_metadata)
        const username = user.name ? user.name : ""
        loggedInUsername.textContent = username
      }

      const originButtonClicked = appState?.originButtonClicked
      if (originButtonClicked == 'contactStorage' && user) {
        contactStoragePopup.style.display = 'flex'
        contactStorageEmail.value = user.email ? user.email : ""
      }
      if (originButtonClicked == 'contactComputing' && user) {
        contactComputingPopup.style.display = 'flex'
        contactComputingEmail.value = user.email ? user.email : ""

      }
      history.replaceState({}, document.title, window.location.origin + window.location.pathname);
    }
  }

  /////////User Logged-in status
  const isLoggedIn = await client.isAuthenticated();

  ////////////Button show/hide logic
  const showButtons = function () {
    if (!loginButton || !logoutButton || !signUpButton || !loggedInUsername || !contactStorageButtonActive || !contactStorageButtonInactive || !contactComputingButtonActive || !contactComputingButtonInactive) return;

    if (isLoggedIn) {

      console.log("current user in show buttons")
      console.log(user)

      loginButton.style.display = "none"
      logoutButton.style.display = "inline-block"
      signUpButton.style.display = "none"

      loggedInUsername.style.display = 'inline-block'

      contactStorageButtonActive.style.display = "block";
      contactComputingButtonActive.style.display = "block";

      contactStorageButtonInactive.style.display = "none";
      contactComputingButtonInactive.style.display = "none";
    }
    else if (!isLoggedIn) {
      loginButton.style.display = "inline-block"
      logoutButton.style.display = "none"
      signUpButton.style.display = "inline-block"

      loggedInUsername.style.display = 'none'

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

    if (!loginButton || !logoutButton || !signUpButton || !contactStorageButtonActive || !contactStorageButtonInactive || !contactComputingButtonActive || !contactComputingButtonInactive) return;

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
      (await client).loginWithRedirect(
        {
          authorizationParams: {
            screen_hint: "signup"
          },
          appState: {
            originButtonClicked: 'signup',
            custom_param2: 'value2',
          },
        }
      );
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

    if (isLoggedIn) {
      contactStorageButtonActive.addEventListener('click', async (e) => {
        if (contactStoragePopup && currentUser && currentUser.email) {
          contactStoragePopup.style.display = 'flex'
          contactStorageEmail.value = currentUser.email ? currentUser.email : ""
        }
      })

      contactComputingButtonActive.addEventListener('click', async (e) => {
        if (contactComputingPopup && currentUser && currentUser.email) {
          contactComputingPopup.style.display = 'flex'
          contactComputingEmail.value = currentUser.email ? currentUser.email : ""
        }
      })
    }
  });
};

//////////Initialize
init();