import React from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"

const ContactLandlord = ({listing}) =>
{
    const [landlord,setLandlord] = React.useState(null)
    const [message,setMessage] = React.useState("")

    // console.log("landlord" + landlord?.email)
    // console.log("message" + message)

    const fetchLandlordData = async() =>
    {
        try {
            const res = await fetch(`/api/user/getUserdata/${listing.useRef}`)

            const data = await res.json();
            if(!res.ok)
            {
                toast.error("Something is wrong in fetching landlord details")
                return;
            }

            setLandlord(data)
        } catch (error) {
            toast.error("Something is wrong in fetching landlord details")
        }
    }

    React.useEffect(()=>{
        fetchLandlordData()
    },[listing.useRef])

    function onChangeMessage(e)
    {
        setMessage(e.target.value)
    }
    return(
        <section className="flex flex-col gap-y-2">
            <p className="font-semibold">
                Contact {" "}
                {landlord?.userName} for {" "} {listing?.name}
            </p>
            <textarea placeholder="Enter your message here...." name="message" id="message" value={message} onChange={onChangeMessage} className="p-2 text-lg w-full bg-slate-200 rounded-md"></textarea>
            <Link to={`mailto:${landlord?.email}?subject=Regarding ${listing?.name}&body=${message}`}
                  className=" block text-white font-medium text-center rounded-md p-2 w-full bg-slate-800" >
                Send Message
            </Link>
        </section>

    )
}

export default ContactLandlord;