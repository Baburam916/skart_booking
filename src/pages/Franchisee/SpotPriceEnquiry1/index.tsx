import React, { useState } from "react";
import { FormInput, FormLabel } from "../../../base-components/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAlert } from "../../../ContextProvider/AlertContext";
import CommonSearchableAll from "../../../components/CommonSearchableAll/CommonSearchableAll";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import DocumentUploadModal from "./DocumentUploadModal";
import {
  Upload,
  MapPin,
  Search,
  Building2,
  Globe,
  Check,
  Plane,
} from "lucide-react";


import booking_scooter from "../../../assets/images/booking_scooter.png";
import booking_plane from "../../../assets/images/booking_plane.png";

import sport_truck from "../../../assets/images/sport_truck.png";
import CalculatorExport from "../../../assets/images/calculator_export.png";
import CalculatorImport from "../../../assets/images/calculator_import.png";

axios.defaults.withCredentials = true;

const initialState = {
  import_booking: 1,
  origin_country: "INDIA",
  origin_country_code: "IN",
  origin_country_id: "97",
  origin_pincode: "",
  origin_city: "",
  origin_state: "",
  origin_state_code: "",
  destination_country: "",
  destination_country_code: "",
  destination_country_id: "",
  destination_pincode: "",
  city: "",
  startPoint: "enquiry",
  city_available: 0,
  pincode_available: 0,
};

const intoriginpincodedata = {
  pincode_id: "",
  pincode: "",
};
const intselecteddata = {
  country_name: "",
  country_id: "",
};
const intselecteddata2 = {
  zipcode: "",
  city_area: "",
};
const intselecteddata3 = {
  city_area: "",
  state: "",
  state_code: "",
};

const main = () => {
  const navigate = useNavigate();
  const [docUploadModalOpen, setDocUploadModalOpen] = useState(false);
  const [selectedoriginpincodedata, setSelectedoriginpincodedata] =
    useState<any>(intoriginpincodedata);
  const [selecteddata, setSelecteddata] = useState<any>(intselecteddata);
  const [selecteddata2, setSelecteddata2] = useState<any>(intselecteddata2);
  const [selecteddata3, setSelecteddata3] = useState<any>(intselecteddata3);
  const [spotbooking, setSpotBooking] = useState(initialState);
  const [selecteddataimport, setSelecteddataimport] =
    useState<any>(intselecteddata);
  const [selecteddata2import, setSelecteddata2import] =
    useState<any>(intselecteddata2);
  const [selecteddata3import, setSelecteddata3import] =
    useState<any>(intselecteddata3);
  const [selecteddestinationpincodedata, setSelecteddestinationpincodedata] =
    useState<any>(intoriginpincodedata);

  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState(0);

  const funtohandle = (forwhat?: any, value?: any) => {
    if (forwhat == "zipcode") {
      setSpotBooking((pre: any) => ({
        ...pre,
        destination_pincode: value,
        city: "",
        city_area: "",
        state: localStorage.getItem("code"),
      }));
    } else {
      setSpotBooking((pre: any) => ({
        ...pre,
        city: value,
      }));
    }
  };
  const handleSubmit = () => {
    if (!spotbooking?.destination_pincode) {
      setSpotBooking((pre: any) => ({
        ...pre,
        destination_pincode: selecteddata2?.zipcode || "",
      }));
    }
    if (!spotbooking?.city) {
      setSpotBooking((pre: any) => ({
        ...pre,
        city: selecteddata3?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, "") || "",
      }));
    }

    const errors = {
      origin_pincode: spotbooking?.origin_pincode || "",
      origin_city: spotbooking?.origin_city || "",
      destination_country: spotbooking?.destination_country || "",
      ...(spotbooking?.pincode_available == 1
        ? {
            destination_pincode:
              spotbooking?.destination_pincode || selecteddata2?.zipcode || "",
          }
        : { destination_pincode: "0000" }),
      ...(spotbooking?.city_available == 1
        ? {
            destination_city:
              spotbooking?.city ||
              selecteddata3?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, "") ||
              "",
          }
        : { destination_city: "" }),
    };

    if (spotbooking?.city_available == 0) {
      delete errors?.destination_city;
    }
    if (spotbooking?.pincode_available == 0) {
      delete errors?.destination_pincode;
    }

    for (const [key, value] of Object.entries(errors)) {
      if (!value) {
        showAlert(`${key.replaceAll("_", " ")} is required`, "warning");
        return;
      }
    }

    navigate("/franchisee/spot_pricing/book_courier_franchisee", {
      state: { booking: spotbooking },
    });
  };
  const handleSubmit2 = () => {
    const spotData = { ...spotbooking };
    if (!spotData?.origin_pincode && spotData?.pincode_available == 1) {
      spotData.origin_pincode =
        spotData.import_booking == 2
          ? selecteddata2import?.zipcode
          : spotData.origin_pincode || "0000";
    } else if (!spotData?.origin_pincode && spotData?.pincode_available == 0) {
      spotData.origin_pincode = "0000";
    }
    if (!spotData?.origin_city && spotData?.city_available == 1) {
      spotData.origin_city =
        spotData?.import_booking == 2
          ? selecteddata3import?.city_area
          : spotData?.origin_city || "";
    }

    if (!spotData?.destination_pincode) {
      spotData.destination_pincode =
        selecteddestinationpincodedata?.pincode || "";
    }

    const errors = {
      origin_country: spotData?.origin_country || "",
      ...(spotData?.pincode_available == 1
        ? {
            origin_pincode:
              spotData?.import_booking == 2
                ? selecteddata2import?.zipcode
                : spotData?.origin_pincode || "0000",
          }
        : { origin_pincode: "0000" }),
      ...(spotData?.city_available == 1
        ? {
            origin_city:
              spotData?.import_booking == 2
                ? selecteddata3import?.city_area
                : spotData?.origin_city || "",
          }
        : { origin_city: "" }),

      destination_pincode:
        spotData?.destination_pincode ||
        selecteddestinationpincodedata?.pincode ||
        "",

      destination_city: spotData?.city || "",
    };

    if (spotData?.city_available == 0) {
      delete errors?.origin_city;
    }
    if (spotData?.pincode_available == 0) {
      delete errors?.origin_pincode;
    }

    for (const [key, value] of Object.entries(errors)) {
      if (!value) {
        showAlert(`${key.replaceAll("_", " ")} is required`, "warning");
        return;
      }
    }
    navigate("/franchisee/spot_pricing/book_courier_franchisee", {
      state: { booking: spotData },
    });
  };
  const fun1 = (a: any) => {
    localStorage.setItem("code", a?.country_code);
    setSpotBooking((prev) => ({
      ...prev,
      destination_country: a?.country_name || "",
      destination_country_code: a?.country_code || "",
      destination_country_id: a?.country_id || "",
      city_available: a?.city_avail == 1 ? 1 : 0,
      pincode_available: a?.pincode_avail == 1 ? 1 : 0,
      destination_pincode: a?.pincode_avail == 0 ? "0000" : "",
    }));
  };
  const funtoempty1 = () => {
    setSpotBooking((prev) => ({
      ...prev,
      destination_country: "",
      destination_country_code: "",
      destination_country_id: "",
      city_available: 0,
      pincode_available: 0,
      destination_pincode: "",
    }));
    localStorage.removeItem("code");
    setSelecteddata(intselecteddata);
    setSelecteddata2(intselecteddata2);
    setSelecteddata3(intselecteddata3);
  };
  const fun3 = (a: any) => {
    setSpotBooking((prev: any) => ({
      ...prev,
      destination_pincode: a?.zipcode,
      city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      state:
        a?.state_code?.replaceAll(/[^a-zA-Z0-9 ]/g, "") ||
        localStorage.getItem("code"),
      state_name: a?.state?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
    }));
    setSelecteddata3((pre: any) => ({ ...pre, city_area: a?.city_area }));
  };
  const fun4 = (a: any) => {
    setSpotBooking((prev: any) => ({
      ...prev,
      // destination_pincode: data?.zipcode,
      city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      state:
        a?.state?.replaceAll(/[^a-zA-Z0-9 ]/g, "") ||
        localStorage.getItem("code"),
      state_code: a?.state_code?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
    }));
  };
  const funtoempty4 = () => {
    setSpotBooking((prev: any) => ({
      ...prev,
      city: "",
      state: "",
      state_code: "",
    }));
    setSelecteddata3(intselecteddata3);
  };
  const fun5 = (a: any) => {
    setSpotBooking((prev) => ({
      ...prev,
      origin_pincode: a?.pincode,
      origin_city: a?.city,
      origin_state: a?.state,
      origin_state_code: a?.state_code,
    }));
  };
  const funtoempty5 = () => {
    setSelectedoriginpincodedata(intoriginpincodedata);
    setSpotBooking((prev) => ({
      ...prev,
      origin_pincode: "",
      origin_city: "",
      origin_state: "",
      origin_state_code: "",
    }));
    setSelectedoriginpincodedata(intoriginpincodedata);
  };
  const funtoempty2 = () => {
    setSpotBooking((prev: any) => ({
      ...prev,
      destination_pincode: "",
      city: "",
      state: localStorage.getItem("code") || "",
      state_name: "",
    }));
    setSelecteddata2(intselecteddata2);
    setSelecteddata3(intselecteddata3);
  };

  const fun1import = (a: any) => {
    if (a?.country_id == 97) {
      funtoempty1import();
      setSelecteddataimport(intselecteddata);
      showAlert("Please select another destination country", "warning");
    } else {
      localStorage.setItem("importcode", a?.country_code);
      setSpotBooking((prev) => ({
        ...prev,
        origin_country: a?.country_name || "",
        origin_country_code: a?.country_code || "",
        origin_country_id: a?.country_id || "",
        origin_pincode: a?.pincode_avail == 0 ? "0000" : "",
        city_available: a?.city_avail == 1 ? 1 : 0,
        pincode_available: a?.pincode_avail == 1 ? 1 : 0,
      }));
    }
  };

  const funtoempty1import = () => {
    setSpotBooking((prev) => ({
      ...prev,
      origin_country: "",
      origin_country_code: "",
      origin_country_id: "",
      origin_pincode: "",
      origin_city: "",
      origin_state: "",
      origin_state_code: "",
      city_available: 0,
      pincode_available: 0,
    }));
    setSelecteddataimport(intselecteddata);
    localStorage.removeItem("importcode");
    setSelecteddata2import(intselecteddata2);
    setSelecteddata3import(intselecteddata3);
  };

  const fun2import = (a: any) => {
    setSpotBooking((prev) => ({
      ...prev,
      origin_pincode: a?.zipcode,
      origin_city: a?.city_area,
      origin_state: a?.state,
      origin_state_code: a?.state_code,
    }));

    setSelecteddata3import({
      city_area: a?.city_area || "",
      state: a?.state || "",
      state_code: a?.state_code || "",
    });
  };

  const funtoempty2import = () => {
    setSpotBooking((prev) => ({
      ...prev,
      origin_pincode: "",
      origin_city: "",
      origin_state: "",
      origin_state_code: "",
    }));
    setSelecteddata2import(intselecteddata2);
  };

  const funtohandleimport = (forwhat?: any, value?: any) => {
    if (forwhat == "zipcode") {
      setSpotBooking((pre: any) => ({
        ...pre,
        origin_pincode: value,
        origin_city: "",
        origin_state: localStorage.getItem("importcode"),
      }));
    } else {
      setSpotBooking((pre: any) => ({
        ...pre,
        origin_city: value,
      }));
    }
  };

  const fun3import = (a: any) => {
    setSpotBooking((prev: any) => ({
      ...prev,
      origin_city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      origin_state:
        a?.state?.replaceAll(/[^a-zA-Z0-9 ]/g, "") ||
        localStorage.getItem("importcode"),
      origin_state_code: a?.state_code?.replaceAll(/[^a-zA-Z0-9 ]/g, "") || "",
    }));
  };

  const funtoempty3import = () => {
    setSpotBooking((prev: any) => ({
      ...prev,
      origin_city: "",
      origin_state: "",
      origin_state_code: "",
    }));
    setSelecteddata3import(intselecteddata3);
  };

  const fun4import = (a: any) => {
    setSpotBooking((prev: any) => ({
      ...prev,
      destination_pincode: a?.pincode,
      city: a?.city?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      state: a?.state_code?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      state_name: a?.state?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
    }));
  };

  const funtoempty4import = () => {
    setSpotBooking((prev: any) => ({
      ...prev,
      destination_pincode: "",
      city: "",
      state: "",
      state_name: "",
    }));
  };

  const handlereset = () => {
    setSelecteddata(intselecteddata);
    setSelecteddata2(intselecteddata2);
    setSelecteddata3(intselecteddata3);
    setSelectedoriginpincodedata(intoriginpincodedata);
  };
  const handlereset2 = () => {
    setSelecteddataimport(intselecteddata);
    setSelecteddata2import(intselecteddata2);
    setSelecteddata3import(intselecteddata3);
    setSelecteddestinationpincodedata(intoriginpincodedata);
  };
  return (
    <div className="w-full max-w-2xl mx-auto my-8 bg-white rounded-xl border border-[#e7e8ea]">
      {/* Header */}
      <div className="  flex justify-between relative overflow-hidden items-center gap-3 px-3 sm:px-5 py-2 border-b border-[#e7e8ea] bg-[#F6F8FB] rounded-t-xl bg-[linear-gradient(155deg,_#FFF4E7_0%,_#fff_30%,_#fdfdfd_100%)]">
        <div className="sport_scooteranimate z-[0] "></div>

        <div className="absolute z-[1] h-full bg-[linear-gradient(465deg,_#FFF4E7_0%,_#fff_30%,_transparent_100%)] top-[0px] bottom-[0px]   w-full  left-[0px] "></div>

        <div className="flex items-center shrink-0 relative z-[2]">
          <div className=" bg-[#F9BF38] rounded-lg p-2 flex items-center justify-center">
            <Plane className="text-white w-5 h-5" />
          </div>
          <h2 className="text-sm sm:text-lg font-bold text-slate-700 tracking-widest ml-2">
            SERVICEABILITY
          </h2>
        </div>

        <div className="relative flex-1 min-w-0 h-[40px] hidden sm:block">
          <div className="cloud bookingPlan sportPlane">
            <img src={booking_plane} className="w-[60px]" />
          </div>

          <div className="newServiceTruck">
            <img className="truckAnimation" src={sport_truck} alt="" />
          </div>
        </div>

        {/* START count  */}
        <div className="w-[200px]  hidden">
          <div className="shipmentAccountBoxinn flex justify-between">
            <div className="shipmentAccountBox relative flex-wrap md:flex-nowrap  justify-center  flex flex-col-reverse md:flex-row items-center md:w-[120px] w-[120px]">
              <div className="sacountboxx  ">
                <i>
                  <img src={CalculatorExport} alt="" className="w-[31px] " />
                </i>
              </div>
              <div className="absolute bg-[#f9eedb] text-[#e19007] w-[60px] text-[9px]  text-center font-bold uppercase rounded-[20px] px-[3px] py-[0px] leading-[17px] bottom-[-22px] left-0 right-0">
                Export
              </div>
            </div>

            <div className=" w-full flex items-center relative">
              <div className="  w-full relative"></div>

              <div className=" sportanimation">
                <img
                  src={CalculatorExport}
                  alt=""
                  className="animationBox w-[20px] h-[24px] absolute "
                />
              </div>
            </div>

            <div className="shipmentAccountBox  relative items-center block  justify-center  flex-wrap md:flex md:flex-nowrap  items-center md:w-[120px] w-[120px]">
              <div className="sacountboxx  ">
                <i>
                  <img src={CalculatorImport} alt="" className="w-[31px] " />
                </i>{" "}
              </div>
              <div className="absolute bg-[#E8FDE7] text-[#237D1F] w-[60px] text-[9px]  text-center font-bold uppercase rounded-[20px] px-[3px] py-[0px] leading-[17px] bottom-[-22px] left-0 right-0">
                IMPORT
              </div>
            </div>
          </div>
        </div>
        {/* END count  */}
      </div>

      {/* Tab pills + Upload Document */}
      <div className="flex items-center justify-between px-3 sm:px-5 pt-4 pb-3 ">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pb-3 gap-3 border-b-[2px] border-[#f1f5f9] mb-4">
          <div className="flex gap-1 bg-[#f4f4f4] px-[5px] py-[5px] rounded-lg w-fit">
            <button
              className={`w-full group hover:bg-[#FFC44C] hover:text-white rounded-lg hover:border-[#FFC44C] ${
                activeTab == 0
                  ? " bg-[#FFC44C] flex h-[38px]  border border-[#FFC44C] text-[#fff]  pl-[10px] pr-[12px]  py-[8px] text-[15px]  uppercase font-medium "
                  : "  h-[38px] flex bg-[#F9F9F9] border border-[#fff] text-[#272626]  pl-[10px] pr-[12px]  py-[8px] text-[15px]  uppercase font-medium"
              }`}
              onClick={() => {
                setActiveTab(0);
                setSpotBooking(initialState);
                handlereset();
              }}
            >
              <i className="relative  top-[-2px] mr-[5px]">
                <img
                  src={CalculatorExport}
                  alt=""
                  className={`w-[22px] group-hover:brightness-[5654%] ${
                    activeTab == 0 ? "brightness-[5654%] " : "filter-none"
                  }`}
                />
              </i>
              EXPORT
            </button>
            <button
              className={`w-full group hover:bg-[#FFC44C] rounded-lg hover:text-white hover:border-[#FFC44C] ${
                activeTab == 1
                  ? "ml-[4px] bg-[#FFC44C] flex h-[38px]   border border-[#FFC44C] text-[#fff]  pl-[10px] pr-[12px]  py-[8px] text-[15px]  uppercase font-medium"
                  : "ml-[4px] h-[38px] flex bg-[#F9F9F9] border border-[#fff] text-[#272626]  pl-[10px] pr-[12px]  py-[8px] text-[15px]  uppercase font-medium"
              }`}
              onClick={() => {
                setActiveTab(1);
                setSpotBooking({
                  import_booking: 2,
                  origin_country: "",
                  origin_country_code: "",
                  origin_country_id: "",
                  origin_pincode: "",
                  origin_city: "",
                  origin_state: "",
                  origin_state_code: "",
                  destination_country: "INDIA",
                  destination_country_code: "IN",
                  destination_country_id: "97",
                  destination_pincode: "",
                  city: "",
                  startPoint: "enquiry",
                  city_available: 0,
                  pincode_available: 0,
                });
                handlereset2();
              }}
            >
              <i className="mr-[5px]">
                <img
                  src={CalculatorImport}
                  alt=""
                  className={`w-[22px] group-hover:brightness-[5654%] ${
                    activeTab == 1 ? "brightness-[5654%] " : "filter-none"
                  }`}
                />
              </i>
              IMPORT
            </button>
          </div>

          {/* <button
            onClick={() => setDocUploadModalOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-3 py-[8px] border border-[#ffe8b4] rounded-lg text-[#ecab22] text-xs sm:text-sm font-medium bg-[#fffcf4] hover:bg-[#f0f3f6] hover:text-[#303030] hover:border-[#bfc6cd]  transition-colors w-fit"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button> */}
        </div>
      </div>

      {docUploadModalOpen && (
        <DocumentUploadModal
          open={docUploadModalOpen}
          onClose={() => setDocUploadModalOpen(false)}
        />
      )}

      {/* EXPORT panel */}
      {activeTab === 0 && (
        <div className="px-5 pb-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <FormLabel className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                ORIGIN COUNTRY <span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex items-center border border-slate-200 rounded-lg  h-[38px] cursor-not-allowed">
                <div className=" rounded-l-[9px] flex items-center justify-center px-3 h-full bg-[#f4f6f9] border-r border-[#ececec] flex-shrink-0">
                  <MapPin className="text-slate-400 w-4 h-4" />
                </div>
                <span className="text-sm text-slate-600 px-3">India</span>
              </div>
            </div>
            <div>
              <FormLabel className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                ORIGIN PINCODE <span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex items-center border border-slate-200 rounded-lg h-[38px]">
                <div className="rounded-l-[9px] flex items-center justify-center px-3 h-full bg-[#f4f6f9] border-r border-[#ececec] flex-shrink-0">
                  <Search className="text-slate-400 w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <CommonSearchableAll
                    className="border-0 shadow-none rounded-none focus:ring-0 rounded-r-[10px]"
                    apiEndpoint={`admin/domestic-pincode/`}
                    placeholder={"Search Origin Pincode"}
                    selecteddata={selectedoriginpincodedata}
                    setSelecteddata={setSelectedoriginpincodedata}
                    fun1={fun5}
                    comingselectedname={"pincode"}
                    comingselectedid={"pincode_id"}
                    funtoempty={funtoempty5}
                    directapply={true}
                    zIndex={20}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <FormLabel className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                ORIGIN CITY <span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex items-center border border-slate-200 rounded-lg h-[38px]">
                <div className="rounded-l-[9px] flex items-center justify-center px-3 h-full bg-[#f4f6f9] border-r border-[#ececec] flex-shrink-0">
                  <Building2 className="text-slate-400 w-4 h-4" />
                </div>
                <FormInput
                  value={
                    spotbooking?.origin_pincode ? spotbooking?.origin_city : ""
                  }
                  className="border-0 border-transparent shadow-none rounded-none focus:ring-0 focus:border-transparent flex-1 rounded-r-[10px] h-full"
                  id="origin-city"
                  disabled
                />
              </div>
            </div>
            <div>
              <FormLabel className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                DESTINATION COUNTRY <span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex items-center border border-slate-200 rounded-lg h-[38px]">
                <div className="flex items-center justify-center px-3 h-full bg-[#f4f6f9] border-r border-[#ececec] flex-shrink-0">
                  <Globe className="text-slate-400 w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <CommonSearchableAll
                    className="border-0 shadow-none rounded-none focus:ring-0 rounded-r-[10px]"
                    apiEndpoint={"admin/country"}
                    placeholder={"Search Destination Country"}
                    selecteddata={selecteddata}
                    setSelecteddata={setSelecteddata}
                    fun1={fun1}
                    key1={"country"}
                    comingselectedname={"country_name"}
                    comingselectedid={"country_id"}
                    funtoempty={funtoempty1}
                    zIndex={20}
                  />
                </div>
              </div>
            </div>
          </div>

          {(spotbooking?.pincode_available == 1 ||
            spotbooking?.city_available == 1) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {spotbooking?.pincode_available == 1 && (
                <div>
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase mb-1 block ">
                    DESTINATION PINCODE <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="flex items-center border border-slate-200 rounded-lg h-[38px]">
                    <div className="rounded-l-[9px] flex items-center justify-center px-3 h-full bg-[#f4f6f9] border-r border-[#ececec] flex-shrink-0">
                      <Search className="text-slate-400 w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CommonSearchableAll
                        className="border-0 shadow-none rounded-none focus:ring-0 rounded-r-[10px]"
                        apiEndpoint={`admin/international-pincode?country_code=${spotbooking?.destination_country_code || ""}`}
                        placeholder={"Search Destination Pincode"}
                        selecteddata={selecteddata2}
                        setSelecteddata={setSelecteddata2}
                        fun1={fun3}
                        key1={"zipcode"}
                        comingselectedname={"zipcode"}
                        comingselectedid={"city"}
                        questionmark={true}
                        addcomingname2={"city_area"}
                        addcomingname3={"state"}
                        funtoempty={funtoempty2}
                        zIndex={20}
                        openhandedfun={funtohandle}
                        forwhat="zipcode"
                        enableZipcodeLookup={true}
                        countryName={spotbooking?.destination_country}
                      />
                    </div>
                  </div>
                </div>
              )}
              {spotbooking?.city_available == 1 && (
                <div>
                  <FormLabel className="text-xs font-semibold text-slate-500 uppercase mb-1 block ">
                    DESTINATION CITY <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="flex items-center border border-slate-200 rounded-lg h-[38px]">
                    <div className="rounded-l-[9px] flex items-center justify-center px-3 h-full bg-[#f4f6f9] border-r border-[#ececec] flex-shrink-0">
                      <Building2 className="text-slate-400 w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CommonSearchableAll
                        className="border-0 shadow-none rounded-none focus:ring-0 rounded-r-[10px]"
                        apiEndpoint={`admin/international-pincode?country_code=${spotbooking?.destination_country_code || ""}&zipcode=${spotbooking?.destination_pincode || ""}`}
                        placeholder={"Search Destination City"}
                        selecteddata={selecteddata3}
                        setSelecteddata={setSelecteddata3}
                        fun1={fun4}
                        key1={"city"}
                        comingselectedname={"city_area"}
                        comingselectedid={"city_area"}
                        questionmark={true}
                        funtoempty={funtoempty4}
                        openhandedfun={funtohandle}
                        forwhat="city"
                        enableZipcodeLookup={true}
                        lookupType="city"
                        countryName={spotbooking?.destination_country}
                        lookupZipcode={
                          spotbooking?.pincode_available == 1
                            ? spotbooking?.destination_pincode
                            : "0000"
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-end pt-1">
            <button
              className="px-6 py-2 rounded-lg  bg-[#8F8F8F] text-white font-semibold text-sm hover:bg-[#FFBB1D] transition-colors"
              onClick={() => {
                setSpotBooking(initialState);
                handlereset();
              }}
            >
              Reset
            </button>
            <button
              className="flex items-center gap-2 px-6 py-2 rounded-lg  bg-[#F9BF38] text-white font-semibold text-sm hover:bg-[#FFBB1D] transition-colors"
              onClick={handleSubmit}
            >
              <Check className="w-4 h-4" /> Check
            </button>
          </div>
        </div>
      )}

      {/* IMPORT panel */}
      {activeTab === 1 && (
        <div className="px-5 pb-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <FormLabel className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                ORIGIN COUNTRY <span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex items-center border border-slate-200 rounded-lg h-[38px]">
                <div className="rounded-l-[9px] flex items-center justify-center px-3 h-full bg-[#f4f6f9] border-r border-[#ececec] flex-shrink-0">
                  <Globe className="text-slate-400 w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <CommonSearchableAll
                    className="border-0 shadow-none rounded-none focus:ring-0 rounded-r-[10px]"
                    apiEndpoint={"admin/country"}
                    placeholder={"Search Origin Country"}
                    selecteddata={selecteddataimport}
                    setSelecteddata={setSelecteddataimport}
                    fun1={fun1import}
                    key1={"country"}
                    comingselectedname={"country_name"}
                    comingselectedid={"country_id"}
                    funtoempty={funtoempty1import}
                    zIndex={20}
                  />
                </div>
              </div>
              {selecteddataimport?.country_id == 97 &&
                spotbooking?.import_booking == 2 && (
                  <p className="text-red-500 mt-1 text-xs">
                    Please select another origin country
                  </p>
                )}
            </div>

            {spotbooking?.pincode_available == 1 && (
              <div>
                <FormLabel className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                  ORIGIN PINCODE <span className="text-red-500">*</span>
                </FormLabel>
                <div className="flex items-center border border-slate-200 rounded-lg h-[38px]">
                  <div className="rounded-l-[9px] flex items-center justify-center px-3 h-full bg-[#f4f6f9] border-r border-[#ececec] flex-shrink-0">
                    <Search className="text-slate-400 w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CommonSearchableAll
                      className="border-0 shadow-none rounded-none focus:ring-0 rounded-r-[10px]"
                      apiEndpoint={`admin/international-pincode?country_code=${spotbooking?.origin_country_code || ""}`}
                      placeholder={"Search Origin Pincode"}
                      selecteddata={selecteddata2import}
                      setSelecteddata={setSelecteddata2import}
                      fun1={fun2import}
                      key1={"zipcode"}
                      comingselectedname={"zipcode"}
                      comingselectedid={"city"}
                      questionmark={true}
                      addcomingname2={"city_area"}
                      addcomingname3={"state"}
                      funtoempty={funtoempty2import}
                      zIndex={20}
                      openhandedfun={funtohandleimport}
                      forwhat="zipcode"
                      enableZipcodeLookup={true}
                      countryName={spotbooking?.origin_country}
                    />
                  </div>
                </div>
              </div>
            )}

            {spotbooking?.city_available == 1 && (
              <div>
                <FormLabel className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                  ORIGIN CITY <span className="text-red-500">*</span>
                </FormLabel>
                <div className="flex items-center border border-slate-200 rounded-lg h-[38px]">
                  <div className="rounded-l-[9px] flex items-center justify-center px-3 h-full bg-[#f4f6f9] border-r border-[#ececec] flex-shrink-0">
                    <Building2 className="text-slate-400 w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CommonSearchableAll
                      className="border-0 shadow-none rounded-none focus:ring-0 rounded-r-[10px]"
                      apiEndpoint={`admin/international-pincode?country_code=${spotbooking?.origin_country_code || ""}&zipcode=${spotbooking?.origin_pincode || ""}`}
                      placeholder={"Search Origin City"}
                      selecteddata={selecteddata3import}
                      setSelecteddata={setSelecteddata3import}
                      fun1={fun3import}
                      key1={"city"}
                      comingselectedname={"city_area"}
                      comingselectedid={"city_area"}
                      questionmark={true}
                      funtoempty={funtoempty3import}
                      openhandedfun={funtohandleimport}
                      forwhat="city"
                      zIndex={20}
                      enableZipcodeLookup={true}
                      lookupType="city"
                      countryName={spotbooking?.origin_country}
                      lookupZipcode={
                        spotbooking?.pincode_available == 1
                          ? spotbooking?.origin_pincode
                          : "0000"
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <FormLabel className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                DESTINATION COUNTRY <span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex items-center border border-slate-200 rounded-lg  h-[38px] cursor-not-allowed">
                <div className="rounded-l-[9px] flex items-center justify-center px-3 h-full bg-[#f4f6f9] border-r border-[#ececec] flex-shrink-0">
                  <MapPin className="text-slate-400 w-4 h-4" />
                </div>
                <span className="text-sm text-slate-600 px-3">India</span>
              </div>
            </div>

            <div>
              <FormLabel className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                DESTINATION PINCODE <span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex items-center border border-slate-200 rounded-lg h-[38px]">
                <div className="rounded-l-[9px] flex items-center justify-center px-3 h-full bg-[#f4f6f9] border-r border-[#ececec] flex-shrink-0">
                  <Search className="text-slate-400 w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <CommonSearchableAll
                    className="border-0 shadow-none rounded-none focus:ring-0 rounded-r-[10px]"
                    apiEndpoint={`admin/domestic-pincode/`}
                    placeholder={"Search Destination Pincode"}
                    selecteddata={selecteddestinationpincodedata}
                    setSelecteddata={setSelecteddestinationpincodedata}
                    fun1={fun4import}
                    comingselectedname={"pincode"}
                    comingselectedid={"pincode_id"}
                    funtoempty={funtoempty4import}
                    directapply={true}
                  />
                </div>
              </div>
            </div>

            <div>
              <FormLabel className="text-xs font-semibold text-slate-500 uppercase mb-1 block">
                DESTINATION CITY <span className="text-red-500">*</span>
              </FormLabel>
              <div className="flex items-center border border-slate-200 rounded-lg h-[38px]">
                <div className="rounded-l-[9px] flex items-center justify-center px-3 h-full bg-[#f4f6f9] border-r border-[#ececec] flex-shrink-0">
                  <Building2 className="text-slate-400 w-4 h-4" />
                </div>
                <FormInput
                  value={spotbooking?.city}
                  className="border-0 border-transparent shadow-none rounded-none focus:ring-0 focus:border-transparent flex-1 rounded-r-[10px] h-full"
                  id="destination-city"
                  placeholder="Enter Destination City"
                  onChange={(e) =>
                    setSpotBooking((pre: any) => ({
                      ...pre,
                      city: e.target.value.replace(/[^a-zA-Z0-9 ]/g, ""),
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-1">
            <button
              className="px-6 py-2 rounded-lg  bg-[#F9BF38] text-white font-semibold text-sm hover:bg-[#FFBB1D] transition-colors"
              onClick={() => {
                setSpotBooking({
                  import_booking: 2,
                  origin_country: "",
                  origin_country_code: "",
                  origin_country_id: "",
                  origin_pincode: "",
                  origin_city: "",
                  origin_state: "",
                  origin_state_code: "",
                  destination_country: "INDIA",
                  destination_country_code: "IN",
                  destination_country_id: "97",
                  destination_pincode: "",
                  city: "",
                  startPoint: "enquiry",
                  city_available: 0,
                  pincode_available: 0,
                });
                handlereset2();
              }}
            >
              Reset
            </button>
            <button
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#F9BF38] text-white font-semibold text-sm hover:bg-[#FFBB1D] transition-colors"
              onClick={handleSubmit2}
            >
              <Check className="w-4 h-4" /> Check
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default main;
