import {createContext, useContext, useEffect} from 'react'
import useFetch from './hooks/useFetch';
import { getCurrentUser } from './database/apiAuth';

const UrlContext = createContext();

function ContextProvider({children}) {

  const {data:user,loading,fn:fetchUser} = useFetch(getCurrentUser);
  const isAuthenticated = user?.role === "authenticated"

  useEffect(()=>{
    fetchUser();
  },[])

  return (
    <UrlContext.Provider value={{user,fetchUser,loading,isAuthenticated}}>
      {children}
    </UrlContext.Provider>
  )
}

export const UrlState = ()=>{
  return useContext(UrlContext)
}

export default ContextProvider
