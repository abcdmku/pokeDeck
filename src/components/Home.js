import { useEffect, useState } from "react";
import RecoverPassword from "./RecoverPassword";

const Home = ({ user }) => {
    const [recoveryToken, setRecoveryToken] = useState(null);

    useEffect(() => {
        /* Recovery url is of the form
         * <SITE_URL>#access_token=x&refresh_token=y&expires_in=z&token_type=bearer&type=recovery
         * Read more on https://supabase.io/docs/reference/javascript/reset-password-email#notes
         */
        let url = window.location.hash;
        let query = url.substr(1);
        let result = {};

        query.split("&").forEach((part) => {
            const item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });

        if (result.type === "recovery") {
            setRecoveryToken(result.access_token);
        }
    }, []);

    return recoveryToken ? (
        <RecoverPassword
            token={recoveryToken}
            setRecoveryToken={setRecoveryToken}
        />
    ) : (
        <div className={"w-screen fixed flex flex-col min-h-screen bg-gray-50"} style={{'background-image': 'url("poke-bg.jpg")', 'background-size': 'cover'}}>
        <div class="container px-4 px-lg-5 text-center text-light " style={{marginTop:'11%'}}>
                <h1 class="mb-1 display-1 fw-bold">Poke Game</h1>
                <h3 class="mb-5"><em>Make your deck and compete again other players</em></h3>
                <a class="btn btn-warning  btn-xl" href="/deck">Build your deck</a>
            </div>
        </div>
    );
};

export default Home;
