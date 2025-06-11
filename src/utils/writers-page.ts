import { Auth0Client, User } from "@auth0/auth0-spa-js";

export const initWritersPage = async (client: Auth0Client, user: User | undefined, currentUrl: string) => {
    ///////////////Get buttons
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

    const buyWriterName = document.getElementById('buy-writer-name') as HTMLInputElement
    const buyWriterPhone = document.getElementById('buy-writer-phone-number') as HTMLInputElement
    const buyWriterEmail = document.getElementById('buy-writer-email') as HTMLInputElement

    const buyGen1WriterButtonActive = document.getElementById('buy-gen1-writer-button-active') as HTMLButtonElement;
    const buyGen1WriterButtonInactive = document.getElementById('buy-gen1-writer-button-inactive') as HTMLButtonElement;
    const buyGen2WriterButtonActive = document.getElementById('buy-gen2-writer-button-active') as HTMLButtonElement;
    const buyGen2WriterButtonInactive = document.getElementById('buy-gen2-writer-button-inactive') as HTMLButtonElement;
    const buyWriterPopup = document.getElementById('buy-writer-popup');



    ///////////////Redirect after login logic
    const url = new URLSearchParams(window.location.search);
    const code = url.get('code');

    if (code) {
        if (!loginButton || !logoutButton || !buyGen1WriterButtonActive || !buyGen1WriterButtonInactive || !buyGen2WriterButtonActive || !buyGen2WriterButtonInactive || !buyWriterPopup) {
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
            if (originButtonClicked == 'buyWriter' && user) {
                buyWriterPopup.style.display = 'flex'
                buyWriterName.value = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : ""
                buyWriterPhone.value = (user.user_metadata && user.user_metadata.phone_number) ? user.user_metadata.phone_number.national_format : ""
                buyWriterEmail.value = user.email ? user.email : ""
            }
            history.replaceState({}, document.title, window.location.origin + window.location.pathname);
        }
    }

    /////////User Logged-in status
    const isLoggedIn = await client.isAuthenticated();

    ////////////Button show/hide logic
    const showButtons = function () {
        if (!loginButton || !logoutButton || !buyGen1WriterButtonActive || !buyGen1WriterButtonInactive || !buyGen2WriterButtonActive || !buyGen2WriterButtonInactive) return;

        if (isLoggedIn) {

            // console.log("current user in show buttons")
            // console.log(user)

            loginButton.style.display = "none"
            logoutButton.style.display = "inline-block"

            buyGen1WriterButtonActive.style.display = "block";
            buyGen2WriterButtonActive.style.display = "block";

            buyGen1WriterButtonInactive.style.display = "none";
            buyGen2WriterButtonInactive.style.display = "none";
        }
        else if (!isLoggedIn) {
            loginButton.style.display = "inline-block"
            logoutButton.style.display = "none"

            buyGen1WriterButtonActive.style.display = "none";
            buyGen2WriterButtonActive.style.display = "none";

            buyGen1WriterButtonInactive.style.display = "block";
            buyGen2WriterButtonInactive.style.display = "block";
        }
    }

    showButtons()


    /////////////Event listeners on webflow page buttons
    window.Webflow ||= [];
    window.Webflow.push(() => {

        if (!loginButton || !logoutButton || !buyGen1WriterButtonActive || !buyGen1WriterButtonInactive || !buyGen2WriterButtonActive || !buyGen2WriterButtonInactive) return;

        loginButton.addEventListener('click', async (e) => {
            (await client).loginWithRedirect(
                {
                    authorizationParams: {
                        redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/dna-writers', //Redirect URL after login
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
                    returnTo: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/dna-writers'
                }
            });
        });

        if (!isLoggedIn) {
            buyGen1WriterButtonInactive.addEventListener('click', async (e) => {
                (await client).loginWithRedirect(
                    {
                        authorizationParams: {
                            redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/dna-writers', //Redirect URL after login
                        },
                        appState: {
                            originButtonClicked: 'buyWriter',
                        },
                    }
                );
            })

            buyGen2WriterButtonInactive.addEventListener('click', async (e) => {
                (await client).loginWithRedirect(
                    {
                        authorizationParams: {
                            redirect_uri: 'https://catalog-4006cd-92548d0ba6-2ad8a3acb4830.webflow.io/dna-writers', //Redirect URL after login
                        },
                        appState: {
                            originButtonClicked: 'buyWriter',
                        },
                    }
                );
            })
        }

        if (isLoggedIn) {
            buyGen1WriterButtonActive.addEventListener('click', async (e) => {
                if (buyWriterPopup && user && user.email) {
                    buyWriterPopup.style.display = 'flex'
                    buyWriterName.value = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : ""
                    buyWriterPhone.value = (user.user_metadata && user.user_metadata.phone_number) ? user.user_metadata.phone_number.national_format : ""
                    buyWriterEmail.value = user.email ? user.email : ""
                }
            })

            buyGen2WriterButtonActive.addEventListener('click', async (e) => {
                if (buyWriterPopup && user && user.email) {
                    buyWriterPopup.style.display = 'flex'
                    buyWriterName.value = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : ""
                    buyWriterPhone.value = (user.user_metadata && user.user_metadata.phone_number) ? user.user_metadata.phone_number.national_format : ""
                    buyWriterEmail.value = user.email ? user.email : ""
                }
            })
        }
    });
}