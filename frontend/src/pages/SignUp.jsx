import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SignUp = ()=>
{
    const [formData,setFormData] = useState({})
    const [error,setError] = useState("")
    const navigate = useNavigate();
    const inputChange = (e) =>
    {
        setFormData({...formData,[e.target.id]:e.target.value})
    }
    
    const handleSubmit =async(e) =>
    {
        e.preventDefault()
        try {
            const res = await fetch('/api/auth/signup',
                {
                    method:'POST',
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(formData)
                }
                )

                const data = await res.json()

                if(!res.ok) setError(data.error || "Something wrong in signup")

                    if(res.ok)
                        navigate("/")
                return data
        } catch (error) {
            console.log(error)
            setError(error || "Internal server error")
        }
    }
    return(
        <div className="max-w-lg mx-auto my-7">
                <h1 className="font-medium text-center ">Sign Up</h1>
            <form className="flex flex-col p-3 rounded-lg gap-4 my-7" >
                <input type="text" placeholder="Username" className="p-3 bg-slate-100 rounded-lg "  id="userName" onChange={inputChange}/>
                <input type="email" placeholder="Email" className="p-3 bg-slate-100 rounded-lg " id="email" onChange={inputChange} />
                <input type="password" placeholder="Password" className="p-3 bg-slate-100 rounded-lg " id="password" onChange={inputChange} />

                {error && <p className="text-sm font-medium text-red-500 ">{error}</p>}
                <button onClick={handleSubmit} className="p-3 bg-red-700 text-white text-md rounded-lg hover:bg-red-500">Sign Up</button>
            </form>
            <h1 className="text-center text-md mr-3">Have an account?
                <Link to={"/signin"} className="text-md text-blue-500 ml-3 hover:text-violet-700">
                Sign In
                </Link>
            </h1>
        </div>
    )
}

export default SignUp