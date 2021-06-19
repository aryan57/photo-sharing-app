import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"
import firebase from "firebase/app"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function googleSignin(email, password) {
    return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }
  function updateName(name) {
    return currentUser.updateProfile({
      displayName: name
    })
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  function sendEmailVerification() {
    return currentUser.sendEmailVerification()
  }
  function deleteUser() {
    return currentUser.delete()
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    googleSignin,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    sendEmailVerification,
    deleteUser,
    updateName
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
