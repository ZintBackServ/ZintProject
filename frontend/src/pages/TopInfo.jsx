import { FaFacebook, FaPhoneAlt, FaInstagramSquare, FaWhatsapp, FaYoutube, FaLinkedin  } from "react-icons/fa";
import { CiMail, CiLocationOn } from "react-icons/ci";
import { RiTelegram2Fill } from "react-icons/ri";

function TopInfo(){
    return(
    <>
        <div >
         <div className="bg-slate-950 text-white">
           <div 
             className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
             <div className="flex flex-wrap gap-x-5 gap-y-2">
                 <a 
                   className="inline-flex items-center gap-2 hover:text-amber-300" 
                   href="tel:+919876543210">
                   <FaPhoneAlt className="h-4 w-4" />+91 98765 43210
                 </a>
                 <a 
                   className="inline-flex items-center gap-2 hover:text-amber-300" href="mailto:info@zinstitute.in">
                   <CiMail className="h-4 w-4" />info@zinstitute.in
                 </a>
                 <a 
                   className="inline-flex items-center gap-2 hover:text-amber-300" href="https://maps.app.goo.gl/FdbSMnBoAM8zCu61A">
                   <CiLocationOn className="h-4 w-4" />Main Campus, Gwalior
                 </a>
                 {/* <span className="inline-flex items-center gap-2">
                    <CiLocationOn className="h-4 w-4" />Main Campus, Gwalior
                 </span> */}
              </div>
              <div className="flex gap-3">
                <a 
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-full border border-white/10 p-2 hover:bg-blue-600" href="https://www.linkedin.com/in/zint-institute-05a4a12a8/">
                  <FaLinkedin className="h-4 w-4" />
                </a>
                <a 
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-full border border-white/10 p-2 hover:bg-red-600" href="https://youtube.com/@zintinstitute?si=hs6oYmKtUX6nuji8">
                  <FaYoutube className="h-4 w-4" />
                </a>
                <a 
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-full border border-white/10 p-2 hover:bg-green-500" href="https://chat.whatsapp.com/BbUHk9fOxCa7Z5aEeNiYna">
                  <FaWhatsapp className="h-4 w-4" />
                </a>
                <a 
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-full border border-white/10 p-2 hover:bg-sky-500" href="https://www.facebook.com/share/1Cwfquebni/">
                  <FaFacebook className="h-4 w-4" />
                </a>
                <a 
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-full border border-white/10 p-2 hover:bg-fuchsia-700" href="https://www.instagram.com/zintinstitute/">
                  <FaInstagramSquare  className="h-4 w-4" />
                </a>
                <a 
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-full border border-white/10 p-2 hover:bg-fuchsia-700" href="https://telegram.org/dl">
                  <RiTelegram2Fill  className="h-4 w-4" />
                </a>
              </div>
            </div>
         </div>
        </div>
    </>
    )
}

export default TopInfo;