import React from "react"
import { Link } from "react-router-dom";
import {Swiper} from "swiper/react"
import SwiperCore from "swiper"
import {SwiperSlide} from "swiper/react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import ListingCard from "../components/ListingCard";

const Home = () =>
{
    const [offerListings ,setOfferListings] = React.useState([]);
    const [rentListings, setRentListings] = React.useState([]);
    const [saleListings,setSaleListings] = React.useState([]);

    console.log(offerListings)
    React.useEffect(()=>
    {
        const fetchOfferListings = async() =>
            {
                try {
                    const res = await fetch("/api/listing/search?offer=true&limit=4")
                    const data = await res.json();

                    if(!res.ok)
                    {
                        return
                    }
                    setOfferListings(data)
                    fetchRentListings();
                } catch (error) {
                    console.log(error)
                }
            } 

        const fetchRentListings = async() =>
        {
            try {
                const res = await fetch("/api/listing/search?type=rent&limit=4");
                const data = await res.json()
                if(!res.ok)
                    {
                        return
                    }
                setRentListings(data)
                fetchSaleListings()
            } catch (error) {
                console.log(error)
            }
        }
        const fetchSaleListings = async() =>
        {
            try {
                const res = await fetch("/api/listing/search?type=sale&limit=4")
                const data = await res.json()
                if(!res.ok)
                    {
                        return
                    }
                setSaleListings(data)
            } catch (error) {
                
            }
        }

        fetchOfferListings()
    },[])
    return(
        <main>
            <div className="flex flex-col gap-y-7 p-28 px-3 max-w-6xl mx-auto ">
                <p className="text-6xl font-bold text-slate-700  ">Find your next <span className="text-slate-500">perfect</span> 
                <br />
                place with ease</p>
                <div className="text-slate-400 text-sm">
                    <p>Vasan Estate will help you find your home fast,easy and comfortable.</p>
                    <p>Our expert support are always available.</p>
                </div>
                <Link className="text-sm font-medium text-blue-800">Lets Start Now...</Link>
            </div>
            <div>
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
                            offerListings && offerListings?.length > 0 && offerListings?.map((url)=>
                            (
                                <SwiperSlide key={url}>
                                    <img src={url.imageUrls[0]}  />
                                </SwiperSlide>
                            )
                            )
                        }
            
                </Swiper>
            </div>
            <div className="max-w-6xl flex flex-col mx-auto mt-7 p-3 gap-y-8">
                {
                    offerListings && offerListings.length>0 &&
                    (
                        <div className="">
                            <div className="">
                                <h2 className="text-2xl text-slate-700 font-semibold">Recent Offers</h2>
                                <Link className="text-sm text-gray-400 text-blue-700 hover:underline" to={"/search?offer=true"} >Show more offers</Link>
                            </div>
                            <div className="flex flex-wrap">
                            {
                                offerListings.map((listing)=>
                                (
                                    <ListingCard listing={listing} key={listing} />
                                ))
                            }
                            </div>
                        </div>
                    )
                }
                {
                    rentListings && rentListings.length>0 &&
                    (
                        <div className="">
                            <div className="">
                                <h2 className="text-2xl text-slate-700 font-semibold">Recent Places in Rent</h2>
                                <Link className="text-sm text-gray-400 text-blue-700 hover:underline" to={"/search?type=rent"} >Show more offers</Link>
                            </div>
                            <div className="flex flex-wrap">
                            {
                                rentListings.map((listing)=>
                                (
                                    <ListingCard listing={listing} key={listing} />
                                ))
                            }
                            </div>
                        </div>
                    )
                }
                {
                    saleListings && saleListings.length>0 &&
                    (
                        <div className="">
                            <div className="">
                                <h2 className="text-2xl text-slate-700 font-semibold">Recent Places to Sale</h2>
                                <Link className="text-sm text-gray-400 text-blue-700 hover:underline" to={"/search?type=sale"} >Show more offers</Link>
                            </div>
                            <div className="flex flex-wrap">
                            {
                                saleListings.map((listing)=>
                                (
                                    <ListingCard listing={listing} key={listing} />
                                ))
                            }
                            </div>
                        </div>
                    )
                }
            </div>
        </main>
    )
}

export default Home;