import React, { useEffect, useState } from 'react';
import AuthContext from './AuthContext';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import auth from '../firbase/firebase.init';


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState([])
    const [loading, setLoading] = useState(true)

   const createUserWithEmail = async (email, password, name) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // ⬇ Update display name
    await updateProfile(result.user, {
      displayName: name,
    });

    return result;
  };

    const signInWithEmail = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth,email,password)
    }

   const signOutUser = () => {
     // Remove token & user data from localStorage
     localStorage.removeItem("token");
     localStorage.removeItem("user");

     // Make user empty
     setUser(null);

     // Optional: you can force refresh if needed
     // window.location.reload();
   };


    useEffect(() => {
       const unsubscribe= onAuthStateChanged(auth, (loggedUser) => {
            setUser(loggedUser)
            setLoading(false)
       })
        
        return () => {
            unsubscribe()
        }
    },[])

    const authInfo = {
        user,
        loading,
        createUserWithEmail,
        signInWithEmail,
        signOutUser,setUser
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;