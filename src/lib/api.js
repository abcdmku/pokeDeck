import { createClient } from "@supabase/supabase-js";
import pokemon from 'pokemontcgsdk'

import { 
    REACT_APP_SUPABASE_URL,
    REACT_APP_SUPABASE_KEY,
    POKEMON_TCG_API_KEY
} from "./constants";

export const supabase = createClient(
    REACT_APP_SUPABASE_URL,
    REACT_APP_SUPABASE_KEY
);

pokemon.configure({apiKey: POKEMON_TCG_API_KEY})
export {pokemon};