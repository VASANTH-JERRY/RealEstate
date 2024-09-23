import React, { useState } from "react";
import { Link } from "react-router-dom";
import {useDispatch} from "react-redux"
import { signInFailure, signInSuccess } from "../redux/slices/userSlice";
import Oauth from "../components/Oauth";
import { useNavigate } from "react-router-dom";
// import Oauth from "../components/Oauth.js";

const SignIn = ()=>
{
    const [formData,setFormData] = useState({
        email:"",
        password:""
    })

    const [error,setError] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const inputChange = (e) =>
    {
        setFormData({...formData,[e.target.id]:e.target.value})
    }
    
    const handleSubmit =async(e) =>
    {
        e.preventDefault()
        try {
            const res = await fetch('/api/auth/signin',
                {
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(formData)
                }
                )

                const data = await res.json()
                
                if(!res.ok) 
                    {
                        dispatch(signInFailure(data.error))
                    }

                
                dispatch(signInSuccess(data))
                console.log(data)

                navigate("/")
                return data
        } catch (error) {
            console.log(error)
            dispatch(signInFailure(error))
        }
    }
    return(
        <div className="max-w-lg mx-auto my-7">
                <h1 className="font-medium text-center ">Sign In</h1>
            <form className="flex flex-col p-3 rounded-lg gap-4 my-7" >
                <input type="email" placeholder="Email" className="p-3 bg-slate-100 rounded-lg " id="email" value={formData.email} onChange={inputChange}/>
                <input type="password" placeholder="Password" className="p-3 bg-slate-100 rounded-lg " id="password" value={formData.password} onChange={inputChange} />

                {error && <p className="text-sm font-medium text-red-500 ">{error}</p>}

                <button onClick={handleSubmit} className="p-3 bg-red-700 text-white text-md rounded-lg hover:bg-red-500">Sign In</button>
                {/* <Oauth /> */}
                <Oauth />
            </form>
            <h1 className="text-center text-md">Dont have an account?
                <Link to={"/signup"}  className="text-blue-500 text-md ml-3 hover:text-violet-700">
                SignUp
                </Link>
            </h1>
        </div>
    )
}

export default SignIn