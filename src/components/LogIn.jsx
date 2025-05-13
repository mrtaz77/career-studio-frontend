import React from "react"
//import Header from "./Header"
import { BACK_IMG_URL } from "../lib/utils.ts"
import { useState, useRef } from "react"
//import { validate } from "../utils/validate"
//import { auth } from "../utils/firebase"

import { useNavigate } from "react-router-dom"

// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth"
//import useToggleSignIn from "../utils/useToggleSignIn"
//import { FacebookAuthProvider, signInWithPopup } from "firebase/auth"
//import { provider } from "../utils/firebase"
//import { updateProfile } from "firebase/auth"
//import { useDispatch } from "react-redux"
//import { addUser } from "../utils/authSlice"
//import Footer from "./Footer"
const LogIn = () => {
  //const navigate = useNavigate()
  const [isSignIn, setIsSignIn] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  //const [emptyFieldMessage, setEmptyFieldMessage] = useState("")

  const email = useRef(null)
  const password = useRef(null)
  const name = useRef(null)
  // const dispatch = useDispatch()

  //const items=useSelector(store=>store.authenticate.items);
  //console.log("slice",items)
  const toggleSignIn = () => {
    setIsSignIn(!isSignIn)
  }

  // const handleFacebookClick = () => {
  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       // The signed-in user info.
  //       const user = result.user

  //       // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  //       const credential = FacebookAuthProvider.credentialFromResult(result)
  //       const accessToken = credential.accessToken

  //       // IdP data available using getAdditionalUserInfo(result)
  //       // ...
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code
  //       const errorMessage = error.message
  //       // The email of the user's account used.
  //       const email = error.customData.email
  //       // The AuthCredential type that was used.
  //       const credential = FacebookAuthProvider.credentialFromError(error)

  //       // ...
  //     })
  // }

  // const handleButtonClick = () => {
  //   const message = validate(email.current.value, password.current.value)
  //   // if (
  //   //   email.current.value === "" ||
  //   //   password.current.value === "" ||
  //   //   name.current.value === ""
  //   // )
  //   //setEmptyFieldMessage("Field is empty")
  //   setErrorMessage(message)
  //   // console.log(message)
  //   // console.log("email: ", email, " password: ", password, "name",name)
  //   if (!isSignIn) {
  //     createUserWithEmailAndPassword(
  //       auth,
  //       email.current.value,
  //       password.current.value
  //     )
  //       .then((userCredential) => {
  //         // Signed up
  //         const user = userCredential.user
  //         //console.log("userUPup: ",user," auth.currentUser: ",auth.currentUser)
  //         //console.log("name : ",name.current.value)
  //         if (auth.currentUser)
  //           updateProfile(auth.currentUser, {
  //             displayName: name.current.value,
  //             photoURL: PROFILE_URL,
  //           })
  //             .then(() => {
  //               // Profile updated!
  //               //console.log("userUP: ",user)
  //               const { uid, email, displayName, photoURL } = auth.currentUser
  //               dispatch(
  //                 addUser({
  //                   uid: uid,
  //                   email: email,
  //                   displayName: displayName,
  //                   photoURL: photoURL,
  //                 })
  //               )

  //               //console.log("update profile!")
  //               // ...
  //             })
  //             .catch((error) => {
  //               // An error occurred
  //               // ...
  //             })
  //         //   navigate("/Browse")

  //         // dispatch(
  //         // addItem(user)
  //         // )
  //         // console.log(user)
  //         // ...
  //       })
  //       .catch((error) => {
  //         const errorCode = error.code
  //         const errorMessage = error.message
  //         //console.log(errorCode+errorMessage)
  //         setErrorMessage(errorCode + errorMessage)
  //         // ..
  //       })
  //   } else {
  //     signInWithEmailAndPassword(
  //       auth,
  //       email.current.value,
  //       password.current.value
  //     )
  //       .then((userCredential) => {
  //         // Signed in
  //         const user = userCredential.user

  //         //  navigate("/Browse")

  //         // console.log(user)
  //         // ...
  //       })
  //       .catch((error) => {
  //         const errorCode = error.code
  //         const errorMessage = error.message
  //         setErrorMessage(errorCode + errorMessage)
  //         // console.log(errorCode + errorMessage)
  //       })
  //   }
  // }
  return (
    <div>
      {/* <Header /> */}
      <div
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%), url(${BACK_IMG_URL})`,
          height: "100vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="flex justify-center items-center "
      >
        {/* Additional content can go here */}
        <div className="flex flex-col w-3/12 absolute">
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
            className=" my-60  p-12 bg-black/70 rounded shadow-lg bg-gradient-to-br"
          >
            <p className="text-3xl text-white my-4">
              {isSignIn ? "Sign In" : "Sign Up"}
            </p>
            {!isSignIn && (
              <input
                ref={name}
                type=""
                placeholder="Enter Name"
                className="p-2 my-2 w-full bg-inherit text-white"
              ></input>
            )}
            <input
              ref={email}
              type="email"
              placeholder="Enter Email"
              className="p-2 my-4 w-full bg-inherit text-white"
            ></input>
            <input
              ref={password}
              type="password"
              placeholder="Enter password"
              className="p-2 my-4 w-full bg-inherit text-white"
            ></input>
            <br />
            {/* {<p className="text-red-500 ">{emptyFieldMessage}</p>} */}
            <p className="text-red-500 ">{errorMessage}</p>
            <button
              className="bg-red-600 text-white rounded p-2 my-4 w-full "
              // onClick={handleButtonClick}
            >
              {isSignIn ? "Sign In" : "Sign Up"}
            </button>
            <p className="text-white content-center ">
              <h1 className="ml-28">Or</h1>
            </p>

          
            <p className="text-white cursor-pointer" onClick={toggleSignIn}>
              {isSignIn
                ? "New to MovieGpt48 ? Sign Up"
                : "Already registered? Sign In"}
            </p>
          </form>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  )
}

export default LogIn
