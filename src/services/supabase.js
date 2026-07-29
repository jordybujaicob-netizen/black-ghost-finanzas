import { createClient } from "@supabase/supabase-js";


const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY;


export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);


/*
  Detectamos la recuperación inmediatamente después
  de crear el cliente, antes de que carguen las páginas.
*/

if (
  typeof window !== "undefined" &&
  !window.__BLACKGHOST_AUTH_LISTENER__
) {
  window.__BLACKGHOST_AUTH_LISTENER__ = true;

  supabase.auth.onAuthStateChange(
    (evento, session) => {
      if (
        evento === "PASSWORD_RECOVERY" &&
        session
      ) {
        window.sessionStorage.setItem(
          "blackghost-password-recovery",
          JSON.stringify({
            activo: true,
            creadoEn: Date.now(),
          })
        );
      }

      if (evento === "SIGNED_OUT") {
        window.sessionStorage.removeItem(
          "blackghost-password-recovery"
        );
      }
    }
  );
}