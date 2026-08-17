import { Clock, Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import React, { useState } from "react";

const main = () => {
  return (
    <>
      <div className="w-full h-auto mt-4 lg:mt-0 lg:h-[80vh] flex justify-center items-center">
        <div className="container px-2 md:px-6">
          <h2 className="text-center text-[20px] sm:text-5xl md:text-6xl font-bold mb-5 sm:mb-20 bg-gradient-to-r from-orange-400 to-yellow-500 text-transparent bg-clip-text">
            Help & Support
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-12 max-w-4xl mx-auto">
            {/* Phone Card */}
            <div className="group bg-white border-none shadow-lg hover:shadow-xl rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-2">
              <div className="flex flex-col items-center p-6 sm:p-8 space-y-4 sm:space-y-5">
                <div className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 group-hover:from-orange-200 group-hover:to-yellow-200 transition-colors duration-300">
                  <Phone className="h-8 sm:h-10 w-8 sm:w-10 text-orange-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900">
                  Phone
                </h3>
                <a
                  href="tel:+918955558282"
                  className="text-lg sm:text-xl text-gray-600 hover:text-mustard transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-orange-400 after:left-0 after:-bottom-1 after:transition-all group-hover:after:w-full"
                >
                  +91-8955558282
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="group bg-white border-none shadow-lg hover:shadow-xl rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-2">
              <div className="flex flex-col items-center p-6 sm:p-8 space-y-4 sm:space-y-5">
                <div className="p-3 sm:p-4 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 group-hover:from-orange-200 group-hover:to-yellow-200 transition-colors duration-300">
                  <Mail className="h-8 sm:h-10 w-8 sm:w-10 text-orange-400 group-hover:text-orange-500 transition-colors" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900">
                  Email
                </h3>
                <a
                  href="mailto:info@skart-express.com"
                  className="text-lg sm:text-xl text-gray-600 hover:text-mustard transition-colors relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-orange-400 after:left-0 after:-bottom-1 after:transition-all group-hover:after:w-full"
                >
                  info@skart-express.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default main;
