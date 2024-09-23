import { GoogleAuthProvider,getAuth,signInWithPopup } from "firebase/auth";
import React from "react"
import {app} from "../firebase";
import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../redux/slices/userSlice";


const Oauth = () =>
{
    const dispatch = useDispatch();
    const handleSubmit = async(e) =>
    {
        try
        {  e.preventDefault();
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            
    
            const result  =  await signInWithPopup(auth,provider)
            console.log(result)

            const res = await fetch('/api/auth/google',
                {
                    method:'POST',
                    headers:
                    {
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(
                        {
                            userName: result.user.displayName,
                            email:result.user.email,
                            photo:result.user.photoURL
                        }
                    )    
                }
            )

            const data = await res.json();

            if(!res.ok)
            {
                console.log(data.error)
                dispatch(signInFailure(data.error))
            }
            dispatch(signInSuccess(data))

        
        }
        catch(error)
        {
            console.log(error)
        }
      
    }
    return(
        <div>
            <button onClick={(e)=>handleSubmit(e)} className="p-3 bg-green-700 w-full text-white text-md font-medium rounded-lg hover:bg-green-600 ">Sign in with Google</button>
        </div>
    )
}

export default Oauth;