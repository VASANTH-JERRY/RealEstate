import React from "react"
import { Link, useParams } from "react-router-dom"
import {Swiper} from "swiper/react"
import SwiperCore from "swiper"
import {SwiperSlide} from "swiper/react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Armchair, Bath, BathIcon, Bed, CircleParking, Locate, MapPin } from "lucide-react"
import { FaChair } from "react-icons/fa"
import ContactLandlord from "../components/ContactLandlord"


const Listing = () =>
{
    SwiperCore.use([Navigation])
    const params = useParams();
    const lid = params.lid;

    const [listing,setListing] = React.useState(null);
    const [loading,setLoading] = React.useState(false);
    const [contact,setContact] = React.useState(false);

    const {currentUser} = useSelector((state)=>state.user)

    console.log("currentUser " + currentUser.email)


    console.log("listing" + listing)
    const handleFetchListings = async() =>
    {
        try {
            setLoading(true)
            const res = await fetch(`/api/listing/get-single-listing/${lid}`)

            const data = await res.json();
            console.log("DAta")
            console.log(data)

            if(!res.ok)
            {
                toast.error("Something is wrong in fetching listing")
                setLoading(false)
            }

            setListing(data);
            setLoading(false);
        } catch (error) {
            toast.error("Something went wrong")
            setLoading(false)
        }
    }
    React.useEffect(()=>
    {
        handleFetchListings();
    },[])
    return(
        <main className="mt-10 px-2">
                <Swiper
                    spaceBetween={30}
                    centeredSlides={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    pagination={{
                    clickable: true,
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="mySwiper" >

                        {
                            listing && listing.imageUrls.length > 0 && listing.imageUrls.map((url)=>
                            (
                                <SwiperSlide key={url}>
                                    <img src={url} alt="Listing Images" className="h-[550px] w-full" />
                                </SwiperSlide>
                            )
                            )
                        }
            
                </Swiper>
            <section className="max-w-4xl mb-8 mx-auto flex flex-col gap-4 px-2">
                <div className="flex ">
                    <p className="text-3xl font-medium">
                        {listing?.name} - ${listing?.regularPrice}
                    </p>
                </div>
                <p className="flex gap-2 items-center text-xl">
                    <MapPin size={20} className="text-green-600" />
                    {listing?.address}
                </p>
                <div className=" flex gap-4 items-center">
                    <button className="bg-red-700  py-1 rounded-md text-white flex-nowrap px-10 sm:px-20">
                        {
                            listing?.type == "rent" ? "For Rent" : "For Sale"
                        }
                    </button>
                    {
                        listing?.discountPrice > 0 &&
                            <button className="bg-green-700  py-1 rounded-md text-white px-10 sm:px-20">
                                ${listing?.discountPrice}
                            </button>
                    }
                </div>
                <p><span className="text-xl font-medium">
                Description - 
                </span> {listing?.description}</p>

                <ul className="text-green-800 flex items-center gap-x-8 font-medium text-lg flex-wrap">
                    <li className="flex items-center gap-x-1">
                        <Bed size={20} />
                        {listing?.bedrooms} Beds
                    </li>
                    <li className="flex items-center gap-x-1">
                        <BathIcon size={20} />
                        {listing?.bathrooms} Baths
                    </li>
                    <li className="flex items-center gap-x-1">
                        <CircleParking size={20} />
                        {listing?.parking ? "Parking" : "No Parking"}
                    </li>
                    <li className="flex items-center gap-x-1">
                        <FaChair size={20} />
                        {listing?.furnished ? "Furnished" :"Not Furnished"}
                    </li>
                </ul>
            <div>
                {
                    currentUser._id !== listing?.useRef && !contact &&
                <button onClick={()=>setContact(true)}
                
                className=" w-full mt-4 rounded-lg p-2 text-white bg-slate-800 uppercase">
                    Contact LandLord
                </button>
                }
            </div>
            {
                contact && <ContactLandlord listing={listing} />
            }
            </section>
        </main>
    )
}

export default Listing;