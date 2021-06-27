import React, { useContext, useState, useEffect } from "react"
import { auth, storage,db } from "../firebase"
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

  function googleSignin() {
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

  function updateName(name_) {
    return currentUser.updateProfile({
      displayName: name_
    })
  }

  function updateBio(bio_) {
    return db.collection("userData").doc(currentUser.uid).set({
      bio: bio_
    }, {merge:true})
  }
  function updateWebsite(website_) {
    return db.collection("userData").doc(currentUser.uid).set({
      website: website_
    }, {merge:true})
  }

  function getUserDocReference(uid) {
    return db.collection("userData").doc(uid).get()
  }
  function getUserPostDocReference(uid) {
    return db.collection("userData").doc(uid).collection("posts").doc().get()
  }

  function updatePhotoURL(newURL) {
    return currentUser.updateProfile({
      photoURL: newURL
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

  function uploadFile(firebaseFilepath, file, metaData) {
    const storageRef = storage.ref();
    return storageRef.child(firebaseFilepath).put(file, metaData);
  }

  function getDownloadURL(firebaseFilepath) {
    const storageRef = storage.ref();
    return storageRef.child(firebaseFilepath).getDownloadURL()
  }

  function updatePostData(uid,docRef,postData) {

    // return docRef.set({postData}, {merge:true})
    return db.collection("userData").doc(uid).collection("posts").doc(docRef.id).set(postData, {merge:true})
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
    updateName,
    uploadFile,
    getDownloadURL,
    updatePhotoURL,
    updateBio,
    updateWebsite,
    getUserDocReference,
    getUserPostDocReference,
    updatePostData
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
