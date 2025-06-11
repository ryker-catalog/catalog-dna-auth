import { Auth0Client, User } from "@auth0/auth0-spa-js";

export const initDnablotPage = async (client: Auth0Client, user: User | undefined, currentUrl: string) => {
    ///////////////Get buttons
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

    const contactDnablotName = document.getElementById('contact-dnablot-name') as HTMLInputElement
    const contactDnablotEmail = document.getElementById('contact-dnablot-email') as HTMLInputElement

    const contactDnablotButtonActive = document.getElementById('contact-dnablot-button-active') as HTMLButtonElement;
    const contactDnablotButtonInactive = document.getElementById('contact-dnablot-button-inactive') as HTMLButtonElement;
    const contactDnablotPopup = document.getElementById('contact-dnablot-popup');



    ///////////////Redirect after login logic
    const url = new URLSearchParams(window.location.search);
    const code = url.get('code');

    if (code) {
        if (!loginButton || !logoutButton || !contactDnablotButtonActive || !contactDnablotButtonInactive || !contactDnablotPopup) {
            console.log("button(s) missing")
        }
        else {
            const { appState } = await client.handleRedirectCallback();
            user = await client.getUser();

            if (user) {
                console.log("metadata")
                console.log(user.user_metadata)
            }

            const originButtonClicked = appState?.originButtonClicked
            if (originButtonClicked == 'contactDnablot' && user) {
                contactDnablotPopup.style.display = 'flex'
                contactDnablotName.value = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : ""
                contactDnablotEmail.value = user.email ? user.email : ""
            }
            history.replaceState({}, document.title, window.location.origin + window.location.pathname);
        }
    }

    /////////User Logged-in status
    const isLoggedIn = await client.isAuthenticated();

    ////////////Button show/hide logic
    const showButtons = function () {
        if (!loginButton || !logoutButton || !contactDnablotButtonActive || !contactDnablotButtonInactive) return;

        if (isLoggedIn) {

            // console.log("current user in show buttons")
            // console.log(user)

            loginButton.style.display = "none"
            logoutButton.style.display = "inline-block"

            contactDnablotButtonActive.style.display = "block";

            contactDnablotButtonInactive.style.display = "none";
        }
        else if (!isLoggedIn) {
            loginButton.style.display = "inline-block"
            logoutButton.style.display = "none"

            contactDnablotButtonActive.style.display = "none";

            contactDnablotButtonInactive.style.display = "block";
        }
    }

    showButtons()


    /////////////Event listeners on webflow page buttons
    window.Webflow ||= [];
    window.Webflow.push(() => {

        if (!loginButton || !logoutButton || !contactDnablotButtonActive || !contactDnablotButtonInactive) return;

        loginButton.addEventListener('click', async (e) => {
            (await client).loginWithRedirect(
                {
                    authorizationParams: {
                        redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/dnablot', //Redirect URL after login
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
                    returnTo: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/dnablot'
                }
            });
        });

        if (!isLoggedIn) {
            contactDnablotButtonInactive.addEventListener('click', async (e) => {
                (await client).loginWithRedirect(
                    {
                        authorizationParams: {
                            redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/dnablot', //Redirect URL after login
                        },
                        appState: {
                            originButtonClicked: 'contactDnablot',
                        },
                    }
                );
            })
        }

        if (isLoggedIn) {
            contactDnablotButtonActive.addEventListener('click', async (e) => {
                if (contactDnablotPopup && user && user.email) {
                    contactDnablotPopup.style.display = 'flex'
                    contactDnablotName.value = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : ""
                    contactDnablotEmail.value = user.email ? user.email : ""
                }
            })
        }
    });
}