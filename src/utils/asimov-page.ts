import { Auth0Client, User } from "@auth0/auth0-spa-js";

export const initAsimovPage = async (client: Auth0Client, user: User | undefined, currentUrl: string) => {
    ///////////////Get buttons
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

    const contactAsimovName = document.getElementById('contact-asimov-name') as HTMLInputElement
    const contactAsimovEmail = document.getElementById('contact-asimov-email') as HTMLInputElement

    const contactAsimovButtonActive = document.getElementById('contact-asimov-button-active') as HTMLButtonElement;
    const contactAsimovButtonInactive = document.getElementById('contact-asimov-button-inactive') as HTMLButtonElement;
    const contactAsimovPopup = document.getElementById('contact-asimov-popup');



    ///////////////Redirect after login logic
    const url = new URLSearchParams(window.location.search);
    const code = url.get('code');

    if (code) {
        if (!loginButton || !logoutButton || !contactAsimovButtonActive || !contactAsimovButtonInactive || !contactAsimovPopup) {
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
            if (originButtonClicked == 'contactAsimov' && user) {
                contactAsimovPopup.style.display = 'flex'
                contactAsimovName.value = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : ""
                contactAsimovEmail.value = user.email ? user.email : ""
            }
            history.replaceState({}, document.title, window.location.origin + window.location.pathname);
        }
    }

    /////////User Logged-in status
    const isLoggedIn = await client.isAuthenticated();

    ////////////Button show/hide logic
    const showButtons = function () {
        if (!loginButton || !logoutButton || !contactAsimovButtonActive || !contactAsimovButtonInactive) return;

        if (isLoggedIn) {

            // console.log("current user in show buttons")
            // console.log(user)

            loginButton.style.display = "none"
            logoutButton.style.display = "inline-block"

            contactAsimovButtonActive.style.display = "block";

            contactAsimovButtonInactive.style.display = "none";
        }
        else if (!isLoggedIn) {
            loginButton.style.display = "inline-block"
            logoutButton.style.display = "none"

            contactAsimovButtonActive.style.display = "none";

            contactAsimovButtonInactive.style.display = "block";
        }
    }

    showButtons()


    /////////////Event listeners on webflow page buttons
    window.Webflow ||= [];
    window.Webflow.push(() => {

        if (!loginButton || !logoutButton || !contactAsimovButtonActive || !contactAsimovButtonInactive) return;

        loginButton.addEventListener('click', async (e) => {
            (await client).loginWithRedirect(
                {
                    authorizationParams: {
                        redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/asimovpress', //Redirect URL after login
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
                    returnTo: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/asimovpress'
                }
            });
        });

        if (!isLoggedIn) {
            contactAsimovButtonInactive.addEventListener('click', async (e) => {
                (await client).loginWithRedirect(
                    {
                        authorizationParams: {
                            redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/asimovpress', //Redirect URL after login
                        },
                        appState: {
                            originButtonClicked: 'contactAsimov',
                        },
                    }
                );
            })
        }

        if (isLoggedIn) {
            contactAsimovButtonActive.addEventListener('click', async (e) => {
                if (contactAsimovPopup && user && user.email) {
                    contactAsimovPopup.style.display = 'flex'
                    contactAsimovName.value = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : ""
                    contactAsimovEmail.value = user.email ? user.email : ""
                }
            })
        }
    });
}