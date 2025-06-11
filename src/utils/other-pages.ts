import { Auth0Client, User } from "@auth0/auth0-spa-js";

export const initOtherPages = async (client: Auth0Client, user: User | undefined, currentUrl: string) => {
    ///////////////Get buttons
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

    ///////////////Redirect after login logic
    const url = new URLSearchParams(window.location.search);
    const code = url.get('code');

    if (code) {
        if (!loginButton || !logoutButton) {
            console.log("button(s) missing")
        }
        else {
            const { appState } = await client.handleRedirectCallback();
            user = await client.getUser();

            if (user) {
                console.log("metadata")
                console.log(user.user_metadata)
            }

            history.replaceState({}, document.title, window.location.origin + window.location.pathname);
        }
    }

    /////////User Logged-in status
    const isLoggedIn = await client.isAuthenticated();

    ////////////Button show/hide logic
    const showButtons = function () {
        if (!loginButton || !logoutButton) return;

        if (isLoggedIn) {

            // console.log("current user in show buttons")
            // console.log(user)

            loginButton.style.display = "none"
            logoutButton.style.display = "inline-block"
        }
        else if (!isLoggedIn) {
            loginButton.style.display = "inline-block"
            logoutButton.style.display = "none"
        }
    }

    showButtons()


    /////////////Event listeners on webflow page buttons
    window.Webflow ||= [];
    window.Webflow.push(() => {

        if (!loginButton || !logoutButton) return;

        loginButton.addEventListener('click', async (e) => {
            (await client).loginWithRedirect(
                {
                    authorizationParams: {
                        redirect_uri: currentUrl, //Redirect URL after login
                    },
                    appState: {
                        originButtonClicked: 'login',
                    },
                }
            );
        });

        logoutButton.addEventListener('click', async () => {
            (await client).logout({
                logoutParams: {
                    returnTo: currentUrl
                }
            });
        });
    });
}