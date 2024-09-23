import React, { useEffect, useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../firebase";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/slices/userSlice.js";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import {Link} from "react-router-dom"


const Profile = () => {
    const { currentUser,loading,error } = useSelector((state) => state.user);
    const fileref = useRef(null);
    const [file, setFile] = useState(null);
    const [filePerc, setFilePerc] = useState(0);
    const [isUploadError, setIsUploadError] = useState(false);
    const [listings,setListings] = useState([])
    const [listingError,setListingError] = useState(false)
    const [formData, setFormData] = useState({});

    const dispatch = useDispatch();



    // console.log(currentUser)
    // console.log(file);
    // console.log(formData);
    // console.log(filePerc);

    useEffect(() => {
        if (file) {
            handleFileChange(file);
        }
    }, [file]);

    const handleInputChange = async(e) =>
    {
        setFormData({...formData,[e.target.id] : e.target.value})
    }

    const handleSubmit = async(e) =>
    {
        e.preventDefault()
        try {
            dispatch(updateUserStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(formData)
            })

            const data = await res.json();

            if(!res.ok)
            {
                dispatch(updateUserFailure(data.error))
                return;
            }

            dispatch(updateUserSuccess(data))

        } catch (error) {
            dispatch(updateUserFailure(error.message))
        }
    }
    const handleDeleteUser = async() =>
    {
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`,{
                method:'DELETE'

            })
            const data = await res.json()

            if(!res.ok)
            {
                dispatch(deleteUserFailure(data.error))
                return
            }

            dispatch(deleteUserSuccess())

        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }
    const handleSignOut = async() =>
    {
        try {
            dispatch(signOutUserStart())
            const res = await fetch("/api/auth/signout",{
                method:"POST"
            })
            const data = await res.json()

            if(!res.ok)
            {
                dispatch(signOutUserFailure(data.error))
                return;
            }

            dispatch(signOutUserSuccess())
        } catch (error) {
            dispatch(signOutUserFailure(error.message))
        }
    }
    const handleFileChange = (file) => {
        if (!file) return;
        
        const storage = getStorage(app);
        const filename = new Date().getTime() + file.name;
        const storageref = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageref, file);

        uploadTask.on(
            "state_changed", 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            }, 
            (error) => {
                setIsUploadError(true);
                console.error(error);
            }, 
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadUrl) => {
                        setFormData({ ...formData, avatar: downloadUrl });
                    })
                    .catch((error) => {
                        setIsUploadError(true);
                        console.error("Error fetching download URL:", error);
                    });
            }
        );
    };

    const handlegetListings = async() =>
    {
        console.log("AAAA")
        try {

            console.log("date")
            const res = await fetch(`/api/listing/get-listing/${currentUser._id}`)

            const data = await res.json();

            // if(!res.ok)
            // {
            //     setListingError(true)
            //     return;
            // }

            console.log("response data")

            console.log(data)
            setListings(data)
            console.log("Listing data" + listings)
            setListingError(false)
        } catch (error) {
            toast.error("Something Went Wrong")
            console.error(error)
        }
    }

    const handleDeleteListing = async(listingId) =>
    {

        try {
            const res = await fetch(`/api/listing/delete/${listingId}`,
                {
                    method:"DELETE"
                }
            )

            const data = await res.json();

            if(!res.ok)
                return;

            console.log(data.message)
            // const updatedRes = await fetch(`/api/listing/get-listing/${currentUser._id}`)

            // const updatedData = await updatedRes.json();

            // setListings((prev)=>
            
            //     prev.filter(listing=>listing._id !== listingId)
            // )

            // listings.map((dat)=>console.log(dat))

         console.log('Deletion message' + data.message)
        // Update the listings state after deleting
        setListings((prev) => prev.filter((listing) => listing._id !== listingId));

        toast.success("Listing Deleted Successfully");


        // Log the updated listings array
        console.log("Updated listings:", listings); // Log the entire listings array
        } catch (error) {
            toast.error("Something Went Wrong")
            console.log(error)
        }
    }

    return (
        <main className="max-w-lg p-3 mx-auto">
            <h1 className="text-3xl font-medium text-center mb-5">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileref}
                    hidden
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <img
                    src={formData.avatar || currentUser.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full bg-slate-500 mx-auto mb-4"
                    onClick={() => fileref.current.click()}
                />
                {
                    isUploadError ? <span className="text-red-400 text-sm text-center">Error in File Upload</span> :
                    filePerc > 0 && filePerc < 100 ? <span className="text-slate-600 text-sm text-center">{`Image uploading ${filePerc}%`}</span> :
                    filePerc == 100 ? <span className="text-green-400 text-sm text-center">Image uploaded Successfully!</span> : ""
                }
                <input
                    type="text"
                    placeholder="userName"
                    className="font-normal border p-3 rounded-lg"
                    id="userName"
                    defaultValue={currentUser.userName}
                    onChange={handleInputChange}
                    
                />
                <input
                    type="text"
                    placeholder="Email"
                    className="font-normal border p-3 rounded-lg"
                    id="email"
                    defaultValue={currentUser.email}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="font-normal border p-3 rounded-lg"
                    id="password"
                    onChange={handleInputChange}
                />
                <button
                    type="submit"
                    className="rounded-lg p-3 bg-green-700 text-white font-normal hover:bg-green-600"
                >
                    {loading ? "Loading..." : "Update"}
                </button>
            </form>
            <div className="flex justify-between p-1">
                <span className="text-red-500 font-medium cursor-pointer" onClick={handleSignOut}>SignOut</span>
                <span className="text-red-500 font-medium cursor-pointer"  onClick={handleDeleteUser}>DeleteUser</span>
            </div>
            <p className="text-red-400 self-center">{error?error:""} </p>
            <Link to={"/create-listing"}>
            <button className="p-3 w-full bg-blue-800 rounded-lg text-white hover:bg-blue-500">Create Listing</button>
            </Link>

            <button className="p-3 w-full border border-green-500 text-green-500 rounded-lg mt-4" onClick={handlegetListings} type="button">Show Listing</button>

           {
            listingError && <p className="text-red-500 text-sm">Something went wrong </p>
           }

            <div className="flex flex-col gap-4 ">
                    {
                        listings && listings.length >0 && listings.map((list)=>
                        (
                            <div key={list._id} className="flex flex-row justify-between items-center gap-4 border shadow-md rounded-md p-2">
                                <img src={list.imageUrls[0]} alt="House image" className="h-16 w-16 rounded-md" />
                                <p className="text-lg flex-1 ">{list.name}</p>
                                <div className="flex flex-col items-center">
                                    <button className="text-red-600 text-md uppercase" onClick={() => handleDeleteListing(list._id)} type="button">Delete</button>
                                   <Link to={`/update-listing/${list._id}`}>
                                    <button className="text-green-400 text-md uppercase">Edit</button>
                                   </Link>
                                </div>
                            </div>
                        )
                        )
                    }
            </div>
        </main>
    );
};

export default Profile;
