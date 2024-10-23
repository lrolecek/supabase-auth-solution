# Supabase + Auth

## Environmentální proměnné

Adresu databáze a API klíč nechceme mít nikdy uvedenou v kódu. V kořenové složce projektu si vytvoříme soubor `.env.local`. Ten je přidaný do `.gitignore`, takže se nikdy nepošle do Gitu/GitHubu.

Abychom se na proměnné mohli odkazovat ve front-end kódu, musí začínat na `VITE_`. Takže náš soubor bude obsahovat třeba:
```
VITE_SUPABASE_DB_URL=https://project.supabase.co
VITE_SUPABASE_API_KEY=abc123456
```

## Připojení k databázi v Reactu

Přidáme do projektu  balíček Supabase.
```bash
npm install @supabase/supabase-js
```


### Vytvoříme si soubor s databázovým klientem

Soubor `supabase/supabase-client.js`

```jsx
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_DB_URL,
  import.meta.env.VITE_SUPABASE_API_KEY
);
```

## Základní příklad s hotovou login komponentou

Super jednoduchý příklad z dokumentace:
https://supabase.com/docs/guides/auth/quickstarts/react

My si ale naprogramujeme vlastní.


## Vytvoříme si context a AuthProvider

V kontextu budeme mít uložené údaje o přihlášeném uživateli (a zda vůbec je přihlášený) a také funkce pro přihlášení a odhlášení, aby byly k dispozici v celé aplikaci.

Soubor `context/AuthProvider.jsx`

```jsx
import { createContext, useContext, useState } from "react";

// context
const AuthContext = createContext({});

// hook pro používání kontextu
export const useAuth = () => useContext(AuthContext);

// provider komponenta
const AuthProvider = ({ children }) => {

  // stav, který bude uchovávat informaci o uživateli
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
```

Do provider komponenty zabalíme celou aplikaci v `main.jsx`:
```jsx
<AuthProvider>
  <App />
</AuthProvider>
```

## Registrace uživatele

V komponentě pro registraci `components/Register.jsx`

```jsx
try {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName: 'Karel',
        age: 23,
      }
    }
  });

  if (!error && data) {
    setMsg("Registration Successful. Check your email to confirm your account");
  }
} catch (error) {
  setErrorMsg("Error in Creating Account");
}
```

## Login - přihlášení uživatele

Upravíme `AuthProvider.jsx`:
- přidáme funkci pro login
- funkci přidáme do contextu, abychom ji mohli použít i odjinud
- přidáme useEffect, který bude reagovat na změnu stavu autentifikace
- přidáme stav true/false, zda je uživatel přihlášený

```jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

const login = (email, password) => {
  return supabase.auth.signInWithPassword({ email, password });
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session.user);
        setAuth(true);
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ auth, user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
```

Komponenta `components/Login.jsx` s formulářem pro přihlášení:

```jsx
import { useAuth } from "../context/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    try {
      const {
        data: { user, session },
        error
      } = await login(email, password);
      if (error) {
        console.log(error)
      }
      if (user && session) {
        // přesměrování na stránku po přihlášení
        navigate("/");
      }
    } catch (error) {
      setErrorMsg("Email or Password Incorrect");
    }
  }
}
```

## Odhlášení

Do `AuthProvider.jsx` přidáme funkci pro odhlášení a přidáme ji do contextu.

```jsx
const logout = () => {
  return supabase.auth.signOut();
}
```

```jsx
<AuthContext.Provider value={{ auth, user, login, logout }}>
  {children}
</AuthContext.Provider>
```

A přidáme událost odhlášení i do useEffectu:

```jsx
if (event === "SIGNED_IN") {
  setUser(session.user);
  setAuth(true);
} else if (event === "SIGNED_OUT") {
  setAuth(false);
  setUser(null);
}
```

## Konfigurace routeru

V souboru `main.jsx`

```jsx
<React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      ...
    </AuthProvider>
  </BrowserRouter>
</React.StrictMode>
```

## Stránky jen pro přihlášené uživatele

Mohli bychom do každé stránky přidat test, zda je uživatel přihlášený, ale to je moc práce a je to "nehezké".

Vytvoříme si speciální komponentu `components/AuthRoute.jsx`, do které toto ověření zapouzdříme.

```jsx
import { useAuth } from "../context/AuthProvider";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} replace state={{ path: location.pathname }} />
  );
};

export default AuthRoute;
```

Cesty, které chceme mít jen pro přihlášené, zabalíme do této komponenty.

```jsx
<Routes>
  <Route path="/" element={<App />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route element={<AuthRoute />}>
      <Route path="secret" element={<Secret />} />
    </Route>
    <Route path="register" element={<Register />} />
    <Route path="login" element={<Login />} />
  </Route>
 </Routes>
```

## Reset / změna hesla

Jen zrychleně. Více v dokumentaci.

Postupujeme podobně, jako jsme to udělali s registrací, přihlášením a odhlášením.

```jsx
const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: "http://url"
});
```

`redirectTo` je adresa, kam je uživatel přesměrován, když klikne na potvrzovací odkaz v emailu.

Na cílové adrese pak zobrazíme komponentu, kde uživatel zadá nové heslo a my ho aktualizujeme v databázi.

```jsx
const { data, error } = await supabase.auth.updateUser({ password: 'nove heslo' });
```

## Refresh stránky

Pokud uděláme v prohlížeči refresh stránky, vynuluje se context a applikace "zapomene" přihlášeného uživatele. Supabase má funkci, která nám pomůže obnovit existující session.

Do `AuthProvider` přidejme:
- stav `isLoading`
- efekt, který při startu aplikace načte existující session

```jsx
const [loading, setLoading] = useState(null);
```

```jsx
useEffect(() => {
  setLoading(true);
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    const { user: currentUser } = data;
    setUser(currentUser ?? null);
    setLoading(false);
  };
  getUser();
}, []);
```

A v JSX zobrazme obsah teprve až bude session načtená:
```jsx
<AuthContext.Provider value={{ auth, user, login, logout }}>
  {!loading && children}
</AuthContext.Provider>
```