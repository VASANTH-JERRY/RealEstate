import { MapPin } from "lucide-react";
import React from "react"
import { Link } from "react-router-dom";

const ListingCard = ({listing}) =>
{
    return(
        <div className="shadow-md hover:shadow-lg w-full overflow-hidden p-3 bg-white rounded-lg sm:w-[330px]">
            <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing cover" className="h-[200px] rounded-t-lg w-full object-cover hover:scale-105 transition-scale duration-300"/>
           
            <div className="flex flex-col gap-y-3 p-2">
                <p className="truncate text-lg font-semibold text-slate-700">{listing.name}</p>
                <div className="flex items-center gap-y-2">
                    <MapPin size={17} className="text-green-600" />
                    <p className="text-md font-medium  ">{listing.address}</p>
                </div>
                <p className="text-sm text-gray-700 font-normal line-clamp-2">{listing.description} </p>
                <p className="text-sm text-gray-600 font-normal">
                   $ {
                        listing.offer ? listing.discountPrice.toLocaleString('en-US') :listing.regularPrice.toLocaleString('en-US')
                    }
                </p>
                <div className="flex items-center gap-x-4">
                    <div className=" font-semibold text-sm">
                        {
                            listing.bedrooms > 1 ? `${listing.bedrooms} Beds`:`${listing.bedrooms} Bed`
                        }
                    </div>
                    <div className="font-semibold text-sm">
                    {
                            listing.bathrooms > 1 ? `${listing.bathrooms} Baths`:`${listing.bathrooms} Bath`
                        }
                    </div>
                </div>
            </div>
            </Link>
        </div>
    )
}

export default ListingCard ;