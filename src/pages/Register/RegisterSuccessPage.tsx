import { ArrowLeft } from 'lucide-react';
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import thankyouimage from "../../assets/images/thankyou.gif"
export default function RegisterSuccessPage({gmail}:any) {
  const navigate=useNavigate()
  const location=useLocation()

  return (
    <div className="w-full flex justify-between items-center ">
      <div className="w-[600px] m-auto">
        <div className="mt-3  w-full p-5 bg-white rounded-lg shadow-lg text-center  flex  items-center justify-center flex-wrap">
          <figure className="w-full text-center">
            <img
              alt="Avatar"
              className="w-[100px] m-auto"
              src={thankyouimage}
            />
          </figure>

          <h2 className="md:text-[25px] font-bold text-[#279C21] mb-[7px] w-full text-[20px]">
            {" "}
            Registration Successful!
          </h2>
          <p className="text-[19px] mb-[10px] text-[#515151] mt-[3px] w-full">
            Thank you for registering as our customer!
          </p>

          <div className="bg-[#FFFAEF] border border-[#FFE5A9] rounded-lg py-2 px-3 mt-2 inline-block mb-2 ">
            <p className="text-[16px] ">
              We've sent an activation link to your email{" "}
              <b>
                {" "}
                {/* <Link
                  to={`mailto:${location?.state?.gmail}`}
                  target="_blank"
                  className="hover:text-mustard"
                > */}
         
                  {location?.state?.gmail || "N.A"}
                {/* </Link> */}
              </b>
            </p>
          </div>

          <p className="w-full text-[17px] mb-[10px] text-[#515151] mt-[12px] leading-[23px]">
            Please check your inbox and click the activation link to complete
            your registration and access your dashboard for Book your Shipment.
          </p>

          <style>
            {`
          @keyframes gradient-animate {
            0% {
              background-position: 0%;
            }
            100% {
              background-position: 400%;
            }
          }
        `}
          </style>
          <div className="mt-3">
            <button
              className="
          
     flex items-center  bg-mustard px-6 py-2 font-lg rounded-lg text-white font-bold mb-4 uppercase  relative overflow-hidden btnAnimation


          
          bg-[linear-gradient(90deg,#ffbe3a,#efb847,#f0cf1d,#efb847)]
          bg-[length:700%_700%]
          transition-all duration-300
          hover:bg-[#353535]
        "
              style={{
                animation: "gradient-animate 8s linear infinite",
              }}
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-[19px] mr-2" /> Back Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
