import { Auth0Client, User } from "@auth0/auth0-spa-js";

export const initServicesPage = async (client: Auth0Client, user: User | undefined, currentUrl: string) => {
    ///////////////Get buttons
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

    const contactStorageButtonActive = document.getElementById('contact-storage-button-active') as HTMLButtonElement;
    const contactStorageButtonInactive = document.getElementById('contact-storage-button-inactive') as HTMLButtonElement;
    const contactComputingButtonActive = document.getElementById('contact-computing-button-active') as HTMLButtonElement;
    const contactComputingButtonInactive = document.getElementById('contact-computing-button-inactive') as HTMLButtonElement;

    const contactStoragePopup = document.getElementById('contact-storage-popup');
    const contactComputingPopup = document.getElementById('contact-computing-popup');

    const contactStorageName = document.getElementById('name-3') as HTMLInputElement
    const contactStoragePhone = document.getElementById('Phone-Number') as HTMLInputElement
    const contactStorageEmail = document.getElementById('email-3') as HTMLInputElement
    const contactComputingName = document.getElementById('name-4') as HTMLInputElement
    const contactComputingPhone = document.getElementById('Phone-Number-2') as HTMLInputElement
    const contactComputingEmail = document.getElementById('email-4') as HTMLInputElement

    ///////////////Redirect after login logic
    const url = new URLSearchParams(window.location.search);
    const code = url.get('code');

    if (code) {
        if (!loginButton || !logoutButton || !contactStorageButtonActive || !contactStorageButtonInactive || !contactComputingButtonActive || !contactComputingButtonInactive || !contactStoragePopup || !contactComputingPopup) {
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
            if (originButtonClicked == 'contactStorage' && user) {
                contactStoragePopup.style.display = 'flex'
                contactStorageName.value = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : ""
                contactStoragePhone.value = (user.user_metadata && user.user_metadata.phone_number) ? user.user_metadata.phone_number.national_format : ""
                contactStorageEmail.value = user.email ? user.email : ""
            }
            if (originButtonClicked == 'contactComputing' && user) {
                contactComputingPopup.style.display = 'flex'
                contactComputingName.value = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : ""
                contactComputingPhone.value = (user.user_metadata && user.user_metadata.phone_number) ? user.user_metadata.phone_number.national_format : ""
                contactComputingEmail.value = user.email ? user.email : ""

            }
            history.replaceState({}, document.title, window.location.origin + window.location.pathname);
        }
    }

    /////////User Logged-in status
    const isLoggedIn = await client.isAuthenticated();

    ////////////Button show/hide logic
    const showButtons = function () {
        if (!loginButton || !logoutButton || !contactStorageButtonActive || !contactStorageButtonInactive || !contactComputingButtonActive || !contactComputingButtonInactive) return;

        if (isLoggedIn) {

            console.log("current user in show buttons")
            console.log(user)

            loginButton.style.display = "none"
            logoutButton.style.display = "inline-block"

            contactStorageButtonActive.style.display = "block";
            contactComputingButtonActive.style.display = "block";

            contactStorageButtonInactive.style.display = "none";
            contactComputingButtonInactive.style.display = "none";
        }
        else if (!isLoggedIn) {
            loginButton.style.display = "inline-block"
            logoutButton.style.display = "none"

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

        if (!loginButton || !logoutButton || !contactStorageButtonActive || !contactStorageButtonInactive || !contactComputingButtonActive || !contactComputingButtonInactive) return;

        loginButton.addEventListener('click', async (e) => {
            console.log("clicked login button");
            (await client).loginWithRedirect(
                {
                    authorizationParams: {
                        redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/services', //Redirect URL after login
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
                    returnTo: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/services'
                }
            });
        });

        if (!isLoggedIn) {
            contactStorageButtonInactive.addEventListener('click', async (e) => {
                (await client).loginWithRedirect(
                    {
                        authorizationParams: {
                            redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/services', //Redirect URL after login
                        },
                        appState: {
                            originButtonClicked: 'contactStorage',
                        },
                    }
                );
            })

            contactComputingButtonInactive.addEventListener('click', async (e) => {
                (await client).loginWithRedirect(
                    {
                        authorizationParams: {
                            redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/services', //Redirect URL after login
                        },
                        appState: {
                            originButtonClicked: 'contactComputing',
                        },
                    }
                );
            })
        }

        if (isLoggedIn) {
            contactStorageButtonActive.addEventListener('click', async (e) => {
                if (contactStoragePopup && user && user.email) {
                    contactStoragePopup.style.display = 'flex'
                    contactStorageName.value = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : ""
                    contactStoragePhone.value = (user.user_metadata && user.user_metadata.phone_number) ? user.user_metadata.phone_number.national_format : ""
                    contactStorageEmail.value = user.email ? user.email : ""
                }
            })

            contactComputingButtonActive.addEventListener('click', async (e) => {
                if (contactComputingPopup && user && user.email) {
                    contactComputingPopup.style.display = 'flex'
                    contactComputingName.value = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : ""
                    contactComputingPhone.value = (user.user_metadata && user.user_metadata.phone_number) ? user.user_metadata.phone_number.national_format : ""
                    contactComputingEmail.value = user.email ? user.email : ""
                }
            })
        }
    });
}