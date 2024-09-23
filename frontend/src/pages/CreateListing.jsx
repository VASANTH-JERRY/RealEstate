import React, { useReducer, useState } from "react"
import{ getDownloadURL, getStorage, ref, uploadBytesResumable }from "firebase/storage"
import{ app }from "../firebase.js"
import {useSelector} from "react-redux"

const CreateListing = () =>
{
    const [files,setFiles] = useState([])
    const [uploading,setUploading] = useState(false)
    const [loading,setLoading] = useState(false)
    const [error,setError]= useState(false)
    const {currentUser} = useSelector((state)=>state.user)
    const [imageUploadingError,setImageUploadingError] = useState("")
    const [uploadingError,setUploadingError] = useState(false)
    const [formData,setFormdata] = useState(
        {
            imageUrls:[],
            name:"",
            description:"",
            address:"",
            type:"rent",
            bedrooms:1,
            bathrooms:1,
            regularPrice:50,
            discountPrice:0,
            offer:false,
            parking:false,
            furnished:false,
            useRef:""

        }
    )    

    // console.log(formData)

    const handleFileInput = () =>
    {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7)
        {
            setUploading(true);
            setImageUploadingError(false);

            const promises = []

            for(let i = 0; i<files.length ; i++)
            {
                promises.push(storeImagefiles(files[i]))
            }
            Promise.all(promises)
            .then((urls)=>
            {
                setFormdata({...formData,imageUrls:formData.imageUrls.concat(urls)})
                setUploading(false)
                setUploadingError(false)
                setImageUploadingError(false)
            })
            .catch((error)=>
            {
                setImageUploadingError("image upload failed (2MB max per Image)")
                setUploadingError(true)
            })
        }
        else
        {
            setImageUploadingError("You can only upload 6 images per listing and atleast 1")
            setUploadingError(true)
        }
    }

    const storeImagefiles = (file) =>
    {
        return new Promise(
            (resolve,reject) =>
            {
                const storage = getStorage(app);
                const fileName = new Date().getTime() + file.name
                const storageref = ref(storage,fileName)
                const uploadTask = uploadBytesResumable(storageref,file)

                uploadTask.on(
                'state_changed',
                (snapshot) =>
                {
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
                },
                (error) =>
                {
                    reject(error)
                },
                () =>
                {
                    getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadUrl) => resolve(downloadUrl))
                    .catch((error) => reject(error))
                }
                )
            }
        )
    }

    const handleImageDelete = (index) =>
    {
        console.log("index" + index)
        setFormdata({...formData,imageUrls:formData.imageUrls.filter((elem,ind)=>ind!=index)
        })
    }

    const handleChange = (e) =>
    {
        if(e.target.id === "sale" || e.target.id === "rent")
        {
            setFormdata({...formData,
                type:e.target.id
            })
        }

        if(e.target.id === "furnished" || 
            e.target.id === "parking" ||
            e.target.id === "offer")
            {
                setFormdata({...formData,
                    [e.target.id]:e.target.checked
                })
            }

        if(e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea")
        {
            setFormdata({...formData,
                [e.target.id]:e.target.value
            })
        }
    }

    const handleSubmit = async()=>
    {
        try {
            if(formData.imageUrls < 1)
            {
                setError("You have to upload atleast one image")
                return;
            }
            setLoading(true)
            if(+formData.regularPrice < +formData.discountPrice)
            {
                setError("Regular Price must be greater than Discount Price")
                return;
            }
            const res = await fetch("/api/listing/create-listing",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        ...formData,
                        useRef:currentUser._id
                    })
                }
            )

            const data = await res.json()

            if(!res.ok)
            {
                setLoading(false)
                setError(data.error)
            }

            setLoading(false)
            console.log(data)
        } catch (error) {
            console.log(error)
            setError(error.message)
        }
    }

    return(
        <main className="max-w-6xl mx-auto">
            <h1 className="text-3xl text-center font-medium my-6">Create Listing</h1>
            <div className="flex flex-col justify-center gap-8 sm:flex-row ">

            
            <div className="flex flex-col gap-8 px-2 my-4">
                <input 
                    placeholder="Name"
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="p-3 bg-slate-200 rounded-lg " 
                />
                <textarea 
                type="text"
                placeholder="Description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className="p-3 bg-slate-200 rounded-lg "></textarea>

                <input 
                    placeholder="Address"
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="p-3 bg-slate-200 rounded-lg " 
                />
                <div className="flex items-center py-2 flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <input 
                        type="checkbox" 
                        name="sale" 
                        id="sale"
                        checked={formData.type === "sale"}
                        onChange={handleChange}
                        className="h-4 w-4 font-medium" />
                        <label htmlFor="sell" >Sell</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                        type="checkbox" 
                        name="rent" 
                        id="rent"
                        checked={formData.type === "rent"}
                        onChange={handleChange}
                        className="h-4 w-4 font-medium" />
                        <label htmlFor="rent" >Rent</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                        type="checkbox" 
                        name="parkingspot" 
                        id="parking"
                        checked={formData.parking}
                        onChange={handleChange}
                        className="h-4 w-4 font-medium" />
                        <label htmlFor="parkingspot" >Parking Spot</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                        type="checkbox" 
                        name="furnished" 
                        id="furnished"
                        checked={formData.checked}
                        onChange={handleChange}
                        className="h-4 w-4 font-medium" />
                        <label htmlFor="furnished" >Furnished</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input 
                        type="checkbox" 
                        name="offer" 
                        id="offer"
                        checked={formData.offer}
                        onChange={handleChange}
                        className="h-4 w-4 font-medium" />
                        <label htmlFor="offer" >Offer</label>
                    </div>
                </div>
                <div className="flex items-center flex-wrap gap-4">
                    <div className="flex gap-2">
                        <input 
                        type="number" 
                        min={1} 
                        max={10} 
                        name="beds" 
                        id="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        className="bg-slate-200 p-2 rounded-lg"/>
                        <label htmlFor="beds" className="font-normal text-lg">Beds</label>
                    </div>
                    <div className="flex gap-2">
                        <input 
                        type="number" 
                        min={1} max={5} 
                        name="baths" 
                        id="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        className="bg-slate-200 p-2 rounded-lg"/>
                        <label htmlFor="baths" className="font-normal text-lg">Baths</label>
                    </div>
                </div>
                <div className="flex gap-2">
                    <input 
                    type="number"
                    min={50} 
                    max={1000000000}
                    name="regularprice" 
                    id="regularPrice"
                    value={formData.regularPrice}
                    onChange={handleChange}
                    className="bg-slate-200 p-2 rounded-lg"/>


                    <div className="flex flex-col items-center">
                    <label htmlFor="regularprice" className="font-normal text-lg">Regular Price</label>
                    {
                        formData.type === "rent"&&<p className="text-sm ">($/Month)</p>
                    }
                    </div>
                </div>
                {
                    formData.offer && <div className="flex gap-2">
                    <input 
                    type="number" 
                    min={10} 
                    name="discountedprice" 
                    id="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    className="bg-slate-200 p-2 rounded-lg"/>
                    <div>
                    <label htmlFor="discountedprice" className="font-normal text-lg">Discounted Price</label>
                    {
                        formData.type === "rent" && <p className="text-sm">($/Month)</p>
                    } 
                    </div>
                </div>
                }
            </div>
            <div className="flex flex-col px-2 py-4 gap-4">
                <div className="flex items-center">
                    <span className="font-medium text-lg">Images: </span>
                    <p className="text-md">The first image willbe the cover (max 6)</p>
                </div>
                <div className="flex gap-2" >
                    <input type="file" className="border p-4 text-md" accept="image/*" onChange={(e)=>setFiles(e.target.files)} multiple />
                    <button className="p-4 text-green-700 border border-green-700 rounded-sm hover:bg-green-700 hover:text-white " onClick={handleFileInput} >
                        {
                            uploading ? "Uploading..." : "Upload"
                        }
                    </button>
                </div>
                    <p className="text-red-500 text-sm">
                        {
                            imageUploadingError && imageUploadingError
                        }
                    </p>

                    <div>
                        {
                             formData.imageUrls.map((url,index)=>
                                (
                                    <div key={index} className=" flex flex-row justify-between px-3 my-2">
                                        <img src={url} className="w-40 h-20" />
                                        <button className="text-red-500 p-3 rounded-lg hover:text-red-400" onClick={()=>handleImageDelete(index)}>Delete</button>
                                    </div>
                                ))
                        }
                    </div>
                    <p className="text-red-500 text-sm">{error && error}</p>
                <button className="text-lg p-3  bg-slate-700 text-white rounded-lg uppercase hover:bg-slate-600" onClick={handleSubmit}>
                    
                    {
                        loading?"Creating...":"Create Listing"
                    }
                    </button>
            </div>

            </div>
        </main>
    )
}

export default CreateListing;