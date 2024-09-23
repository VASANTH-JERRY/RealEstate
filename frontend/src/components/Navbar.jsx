import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";
const Navbar= () =>
{
    const {currentUser} = useSelector((state)=>state.user)
    const [searchText,setSearchText] = React.useState("")
    const navigate = useNavigate();

    console.log("SearchText"+ searchText)

    const handleSubmit =(e) =>
    {
        e.preventDefault();
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("searchTerm",searchText);
        const searchQuery = searchParams.toString();
        navigate(`/search?${searchQuery}`)
    }

    React.useEffect(()=>
    {
        const searchParamss = new URLSearchParams(location.search)
        const searchURL = searchParamss.get("searchTerm")
        if(searchURL)
        {
            setSearchText(searchURL)
        }
    },[location.search])

    return(
        <div className="bg-slate-200 shadow-md">

        
        <div className=" mx-auto p-4 max-w-6xl flex items-center justify-between">
            <Link to={"/"}>
            <div>
                <span className="text-slate-500">Vasan</span>
                <span className="text-slate-750">Estate</span>
            </div>
            </Link>
            <form className="p-2 rounded-lg bg-slate-50 flex items-center">
                <input placeholder="Search..." className="w-52 text-sm bg-transparent focus:outline-none" value={searchText} onChange={(e)=>setSearchText(e.target.value)} />
                <button type="submit">
                 <Search size={18} className="text-slate-600" onClick={handleSubmit} />
                </button>
            </form>
            <div className="flex items-center gap-x-4">
                <p className="hidden sm:inline text-slate-700 hover:text-rose-700 hover:cursor-pointer">Home</p>
                <Link to={"/about"}>
                    <p className="hidden sm:inline text-slate-700 hover:text-rose-700 hover:cursor-pointer">About</p>
                </Link>
                <Link to={"/profile"}>
                {
                    currentUser ? <p className="text-slate-700 hover:text-rose-700 hover:cursor-pointer">profile</p>
                    : <p className="text-slate-700 hover:text-rose-700 hover:cursor-pointer">Sign In</p>

                }
                </Link>
            </div>
        </div>

        </div>
    )
}

export default Navbar;