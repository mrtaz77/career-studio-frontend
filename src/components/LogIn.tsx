import { BACK_IMG_URL } from '../lib/utils.ts';
import { useState, useRef } from 'react';
//import { validate } from "../utils/validate"
//import { auth } from "../utils/firebase"

import { useNavigate } from 'react-router-dom';

const LogIn = () => {
  //const navigate = useNavigate()
  const [isSignIn, setIsSignIn] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);
  // const dispatch = useDispatch()

  //const items=useSelector(store=>store.authenticate.items);
  //console.log("slice",items)
  const toggleSignIn = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div>
      {/* <Header /> */}
      <div
        style={{
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.8) 100%), url(${BACK_IMG_URL})`,
          height: '100vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="flex justify-center items-center "
      >
        {/* Additional content can go here */}
        <div className="flex flex-col w-3/12 absolute">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className=" my-60  p-12 bg-black/70 rounded shadow-lg bg-gradient-to-br"
          >
            <p className="text-3xl text-white my-4">{isSignIn ? 'Sign In' : 'Sign Up'}</p>
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
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </button>
            <div className="text-white content-center">
              <span className="ml-28">Or</span>
            </div>

            <p className="text-white cursor-pointer" onClick={toggleSignIn}>
              {isSignIn ? 'New to MovieGpt48 ? Sign Up' : 'Already registered? Sign In'}
            </p>
          </form>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  );
};

export default LogIn;
