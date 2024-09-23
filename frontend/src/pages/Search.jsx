import React from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast";
import ListingCard from "../components/ListingCard";


const Search = () =>
{
    const navigate = useNavigate();
    const [listing,setListing] = React.useState([])
    const [showMore,setShowMore] = React.useState(false)
    const [searchData , setSearchData] = React.useState(
        {
            searchTerm:"",
            type:"all",
            parking:false,
            furnished:false,
            offer:false,
            sort:"createdAt",
            order:"desc",
        }
    )

    console.log(searchData)
    console.log("Listing")
    console.log(listing)

    React.useEffect(()=>
    {
        const urlParams = new URLSearchParams(location.search)
        const searchTermUrl = urlParams.get("searchTerm")
        const typeUrl = urlParams.get("type")
        const parkingUrl = urlParams.get("parking")
        const furnishedUrl = urlParams.get("furnished")
        const offerUrl = urlParams.get("offer")
        const sortUrl = urlParams.get("sort")
        const orderUrl = urlParams.get("order")

        if(searchTermUrl || typeUrl || parkingUrl || furnishedUrl || offerUrl || sortUrl || orderUrl)
        {
            setSearchData(
                {
                    searchTerm:searchTermUrl || "",
                    type:typeUrl|| "all",
                    parking:parkingUrl === "true" ? true : false,
                    furnished:furnishedUrl === "true" ? true : false,
                    offer:offerUrl === "true" ? true : false,
                    sort:sortUrl || "createdAt",
                    order:orderUrl || "desc"
                }
            )
        }

        const handleSearchListings = async() =>
        {
            try {
                const searchQuery = urlParams.toString()   
                const res = await fetch(`api/listing/search?${searchQuery}`)
                const data = await res.json()

                if(!res.ok)
                {
                    toast.error("Something wrong in fetching data")
                    return;
                }
                setListing(data)
                toast.success("data Fetched Successfully")
                
            } catch (error) {
                toast.error("Something wrong in fetching data")
                console.log(error.message)
            }
        }

        handleSearchListings();
    },[location.search])
    const handleChange = (e) =>
    {
        if(e.target.id === "all" || e.target.id === "rent" || e.target.id === "sale")
        {
            setSearchData({...searchData,type:e.target.id})
        }
        if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer")
        {
            setSearchData({...searchData,[e.target.id]:e.target.checked || e.target.checked === "true" ?true:false})
        }
        if(e.target.id === "searchTerm")
        {
            setSearchData({...searchData,searchTerm:e.target.value})
        }
        if(e.target.id === "sort_order")
        {
            const sort = e.target.value.split('_')[0] || "createdAt";
            const order = e.target.value.split('_')[1] || "desc";

            setSearchData({...searchData,sort,order})
        }
    }

    const handleSubmit = () =>
    {
        const urlParams = new URLSearchParams()
        urlParams.set("searchTerm",searchData.searchTerm)
        urlParams.set("type",searchData.type)
        urlParams.set("furnished",searchData.furnished)
        urlParams.set("parking",searchData.parking)
        urlParams.set("offer",searchData.offer)
        urlParams.set("sort",searchData.sort)
        urlParams.set("order",searchData.order)
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }

    const onShowMoreClick = async () => {
        const numberOfListings = listing.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/search?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
          setShowMore(false);
        }
        setListings([...listing, ...data]);
      };
    return(
        <main className="flex flex-col md:flex-row ">
            <div className=" p-7 flex flex-col gap-8 border-r md:min-h-screen  ">
                <div className="flex items-center gap-x-2 ">
                    <label htmlFor="search-box" className="whitespace-nowrap text-lg">Search Term :</label>
                    <input name="search-box" placeholder="Enter the Search Term" className="rounded-md bg-slate-50 p-3 w-full"  id="searchTerm" value={searchData.searchTerm} onChange={handleChange}  />
                </div>
                <div className="flex items-center gap-x-3 flex-wrap">
                    <p className="text-lg font-normal">Type: </p>
                    <div className="flex items-center gap-x-2">
                        <input type="checkbox" id="all" className="h-5 w-5" checked={searchData.type === "all"}  onChange={handleChange} />
                        <label>Rent & Sale</label>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <input type="checkbox" id="rent" className="h-5 w-5" checked={searchData.type === 'rent'} onChange={handleChange} />
                        <label>Rent</label>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <input type="checkbox" id="sale" className="h-5 w-5" checked={searchData.type === "sale"} onChange={handleChange} />
                        <label>Sale</label>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <input type="checkbox" id="offer" className="h-5 w-5" checked={searchData.offer} onChange={handleChange}/>
                        <label>Offer</label>
                    </div>
                </div>
                <div className="flex items-center gap-x-3 flex-wrap">
                    <p className="text-lg font-normal">Amenities: </p>
                    <div className="flex items-center gap-x-2">
                        <input type="checkbox" id="parking" className="h-5 w-5" checked={searchData.parking} onChange={handleChange} />
                        <label>Parking</label>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <input type="checkbox" id="furnished" className="h-5 w-5" checked={searchData.furnished} onChange={handleChange} />
                        <label>Furnished</label>
                    </div>
                </div>
                <div className="flex items-center gap-x-3">
                    <label htmlFor="sort">Sort: </label>
                    <select className="p-3 bg-slate-50 rounded-md " defaultValue={"cretedAt_desc"} id="sort_order" onChange={handleChange}>
                        <option value="regularPrice_desc" >Price high to low</option>
                        <option value="regularPrice_asc" >Price low to high</option>
                        <option value="createdAt_desc" >Latest</option>
                        <option value="createdAt_asc" >Oldest</option>
                    </select>
                </div>
                <button onClick={handleSubmit} className="bg-slate-800 p-2 rounded-md text-white text-lg">Search</button>
            </div>
            <div className="flex-1 pt-4">
                <h1 className="text-2xl p-3 font-medium text-slate-800">Listing Results :</h1>
                {
                    listing.length == 0 &&
                    <p className="tex-xl text-slate-700 font-normal mt-4 ml-4 ">No Listings Found!!</p>   
                }
                <div className="p-4 flex flex-wrap gap-x-2">

                {
                     listing && listing.map((listing)=>
                    (
                       
                            <ListingCard key={listing._id} listing={listing} /> 
                    ))  
                }
                </div>
                {showMore &&

                    <p className="text-green-600 underline text-sm" onClick={onShowMoreClick}>ShowMore</p>
                }
            </div>
        </main>
    )
}

export default Search;