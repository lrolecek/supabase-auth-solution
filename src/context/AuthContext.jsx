import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../supabase/supabase-client"

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext)


async function login(email, password) {
  return await supabase.auth.signInWithPassword({ email, password })
}

async function logout() {
  return await supabase.auth.signOut()
}

async function register(email, password, firstName, lastName, age) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        firstName,
        lastName,
        age,
      }
    }
  })
}


export function AuthProvider({children}) {
  const [user, setUser] = useState(null)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(
    () => {
      const {data} = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
          setIsAuth(true)
          setUser(session.user)
        }
        if (event === 'SIGNED_OUT') {
          setIsAuth(false)
          setUser(null)
        }
      })

      return () => {
        data.subscription.unsubscribe()
      }
    },
    []
  )



  return (
    <AuthContext.Provider value={{
      user,
      isAuth,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  )

}







