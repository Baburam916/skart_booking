import React from "react";
import clsx from "clsx";
import {
  Building,
  MapPin,
  Wallet,
  Map,
  Navigation,
  Locate,
  Landmark,
  CalendarDays,
  File,
  FileText,
  Percent,
  CreditCard,
  List,
  Cross,
} from "lucide-react";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import logoUrl from "../../assets/images/icons/Side_logo.png";
import illustrationUrl from "../../assets/images/icons/Skart-Banner-homepage.png";
import SRAnimation from "../../assets/images/sranimation.png";
import Courier_commercial_icon from "../../assets/images/courier_commercial_icon.png";
import BoxAnimation from "../../assets/images/boxAnimation.png";
import ReceiverIcon from "../../assets/images/receivericon.png";
import SenderInfoIcon from "../../assets/images/senderInfo.png";
import ReceiverInfoIcon from "../../assets/images/receiverInfo.png";
import LoadingIcon from "../../base-components/LoadingIcon";
import { useEffect, useState } from "react";
import {
  consignerDocumentTypesApi,
  getBookingApproval,
  getCountryApi,
  getCurrencyApi,
  getFranchiseeDetailsApi,
  getImportBookingCountApi,
  getShipmentTypesApi,
  gstApplicableApi,
  taxPaymentOptionApi,
} from "../../AllServices/config.service";
import { useAlert } from "../../ContextProvider/AlertContext";
import { useNavigate, useParams } from "react-router-dom";
import CommonModal from "../../components/CommonModal";
import AcceptedPage from "../AcceptedPage";
import RejectedPage from "../RejectedPage";
import LinkExpiredPage from "../LinkExpiredPage";

function BookingApproval() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [franchiseeNames, setFranchiseeNames] = useState([]);
  const [wallet, setWallet] = useState([]);
  const [shipmentType, setShipmentType] = useState<any[]>([]);
  const [currencyData, setCurrencyData] = useState<any[]>([]);
  const [consignerDocTypes, setConsignerDocTypes] = useState<any[]>([]);
  const [gstApplicable, setGstApplicable] = useState<any[]>([]);
  const [taxPaymentOption, setTaxPaymentOption] = useState<any[]>([]);
  const [allBookingData, setAllBookingData] = useState<any>(null);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [originCountry, setOriginCountry] = useState<any | null>(null);
  const [dimensionData, setDimensionData] = useState<any>(null);
  const [otpModal, setOtpModal] = useState(false);
  const [otpModal1, setOtpModal1] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<1 | 2 | null>(null);
  const [approvalLoading, setApprovalLoading] = useState(false);

  const param = useParams();
  const awb = JSON.parse(atob(param?.awb));

  const apiBookingData = async () => {
    try {
      const response: any = await getBookingApproval(awb);

      // console.log(parsedData, "res");
      if (response?.status == 200 || response?.status == 204) {
        const rawData = response?.data?.data?.[0]?.request_data;
        const parsedData =
          typeof rawData === "string" ? JSON.parse(rawData) : rawData;

        const parsedDimensions = parsedData?.shipment_dimensions
          ? JSON.parse(parsedData.shipment_dimensions)
          : null;
        setAllBookingData(parsedData || []);
        setDimensionData(parsedDimensions || []);
        getFranchiseeDetailsApi(response?.data?.data?.[0]?.franchisee_id).then(
          (details) => {
            setFranchiseeNames(details?.data?.data?.[0]?.franchisee_name || []);
            setWallet(details?.data?.data?.[0]?.available_credit_limit || []);
            getCountryApi().then((res) => {
              const countries = res?.data?.data || [];
              setCountryData(countries);
              const matchedCountry = countries.find(
                (country: any) =>
                  Number(country.country_id) ===
                  Number(parsedData?.origin_country_id),
              );

              if (matchedCountry) {
                setOriginCountry(matchedCountry);
              }
            });
          },
        );
      } else {
      }
    } catch (err: any) {
      showAlert(err?.message, "error");
    }
  };

  useEffect(() => {
    if (awb != 1 && awb != 5 && awb != 9) {
      apiBookingData();
    }
  }, []);

  useEffect(() => {
    if (awb != 1 && awb != 5 && awb != 9) {
      getShipmentTypesApi().then((res) => {
        setShipmentType(res?.data?.data);
      });

      getCurrencyApi().then((res) => {
        setCurrencyData(res?.data?.data);
      });

      consignerDocumentTypesApi().then((res) => {
        setConsignerDocTypes(res?.data?.data);
      });

      gstApplicableApi().then((res) => {
        setGstApplicable(res?.data?.data);
      });

      taxPaymentOptionApi().then((res) => {
        setTaxPaymentOption(res?.data?.data);
      });

      getCountryApi().then((res) => {
        setCountryData(res?.data?.data);
      });
    }
  }, []);

  const handleCloseTab = () => {
    window.opener = null;
    window.open("", "_self");
    window.close();
  };

  const submitApproval = async (status: 0 | 1) => {
    try {
      setApprovalLoading(true);
      setApprovalStatus(status === 0 ? 1 : 2);

      const res: any = await getImportBookingCountApi(awb, status);

      if (res?.status === 200) {
        setApprovalStatus(status === 0 ? 1 : 2);
      }
    } catch (error) {
      setApprovalStatus(2);
    } finally {
      setApprovalLoading(false);
    }
  };

  const ModalTitle = (
    <span className="text-lg font-bold">
      {approvalStatus === 1 ? "Approved" : "Rejected"}
    </span>
  );

  const ModalTitle1 = (
    <>
      <span className="text-lg font-bold">Rejected</span>
    </>
  );

  const ModalDescription = (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      {approvalStatus === 1 ? (
        <>
          <Lucide icon="CheckCircle" className="w-14 h-14 text-green-500" />
          <p className="text-lg font-semibold text-green-600">
            Booking has been approved successfully!
          </p>
        </>
      ) : (
        <>
          <Lucide icon="XCircle" className="w-14 h-14 text-red-500" />
          <p className="text-lg font-semibold text-red-600">
            Booking has been rejected!
          </p>
        </>
      )}
    </div>
  );

  const ModalDescription1 = (
    <div className="flex flex-col items-center justify-center py-6">
      <p className="text-lg font-semibold">
        Are you sure you want to reject this booking?
      </p>
    </div>
  );

  const ModalFooter = (
    <div className="flex justify-end">
      <Button
        className="bg-red-500 hover:bg-red-600 text-white"
        onClick={() => {
          setOtpModal(false);
          handleCloseTab();
        }}
      >
        Close
      </Button>
    </div>
  );

  const ModalFooter1 = (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline-secondary"
        onClick={() => {
          setOtpModal1(false);
        }}
      >
        No
      </Button>
      <Button
        className="bg-red-500 hover:bg-red-600 text-white"
        onClick={() => {
          setOtpModal1(false);
          setOtpModal(true);
          submitApproval(1);
        }}
      >
        Yes
      </Button>
    </div>
  );

  // console.log(allBookingData, "allBookingData");

  return (
    <>
      {awb == 1 ? (
        <AcceptedPage />
      ) : awb == 5 ? (
        <RejectedPage />
      ) : awb == 9 ? (
        <LinkExpiredPage />
      ) : awb === "00000" ? (
        <div
          className={clsx([
            "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen md:overflow-hidden bg-primary lg:bg-white dark:bg-darkmode-800 md:dark:bg-darkmode-600",
            "before:hidden before:lg:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
            "after:hidden after:lg:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
          ])}
        >
          <>
            <div className="container relative ">
              <div className="w-full relative  flex-none md:flex items-center h-auto lg:h-screen">
                <div className="w-full relative ">
                  <div className=" grid grid-cols-12 gap-4 ">
                    <div className=" col-span-12 lg:col-span-6">
                      <div className="z-[999] relative ml-[-0px] lg:w-[73%] 2xl:w-[70%] w-[100%]">
                        <>
                          <a
                            href=""
                            className="flex items-center pt-5 -intro-x"
                          >
                            <img
                              alt="Midone Tailwind HTML Admin Template"
                              className="w-[50%]"
                              src={logoUrl}
                              style={{
                                filter: "drop-shadow(5px 5px 5px #222)",
                              }}
                            />
                          </a>
                          <div className="my-auto">
                            <img
                              alt="Midone Tailwind HTML Admin Template"
                              className="w-3/4 -mt-36 -intro-x"
                              src={illustrationUrl}
                            />
                            <div className="mt-7 text-2xl font-medium leading-tight text-white -intro-x">
                              sKart Global Express Pvt Ltd
                            </div>
                            <div className="mt-7 text-md text-white -intro-x text-opacity-70 dark:text-slate-400">
                              sKart Global Express Pvt Ltd is a next-gen
                              tech-driven express and
                              <br /> e-commerce Logistics solution provider.
                            </div>
                          </div>
                        </>
                      </div>
                    </div>
                    <div className=" col-span-12 lg:col-span-6">
                      <div className="lg:w-[450px] w-full ml-[0px] md:ml-[2%]  lg:ml-[11%] 2xl:ml-[20%]">
                        <div className="w-full">
                          <>
                            <div className="bg-white  p-12  px-28  text-center w-full max-w-xl rounded-2xl shadow-xl">
                              <div className="bg-red-500 w-20 h-20 mx-auto mb-5 flex justify-center items-center rounded-full text-3xl font-bold">
                                <Cross className="w-8 h-8 text-white -rotate-45 stroke-2.5" />
                              </div>
                              <h1 className="text-red-500 text-2xl mb-2 font-bold">
                                Action is already performed.
                              </h1>

                              <button
                                className="mt-6 bg-mustard text-white py-3 px-6 rounded-lg font-semibold text-lg transition duration-300"
                                onClick={handleCloseTab}
                              >
                                Continue
                              </button>
                            </div>
                          </>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      ) : (
        <div className="bg-white w-full h-[97vh] p-0 rounded-md overflow-y-auto">
          <div className="min-[600px]:flex justify-between items-center border-b-2 pb-2 m-3">
            <h2 className=" text-xl font-bold text-primary pt-2">
              IS IMPORT BOOKING APPROVAL
            </h2>
            <div className="flex justify-between">{/*  */}</div>
          </div>

          <div className="prePadding">
            <div className="h-[100vh] overflow-x-auto pr-[12px]">
              <div className="flex justify-between px-2">
                <h3 className="text-base text-mustard uppercase font-bold">
                  {franchiseeNames}
                </h3>
                <h3 className="font-bold text-base uppercase">
                  Product :{" "}
                  <span className="text-mustard">
                    {allBookingData?.shipment_charges?.product_name}
                  </span>
                </h3>
              </div>
              <div className="w-full border-1 rounded-xl  px-3 py-3 bg-[#f6f8fb] border-[#e3e3eb] ">
                <div className="grid grid-cols-12 gap-x-1 ">
                  <div className="col-span-12 md:col-span-4">
                    <div>
                      <div className="flex">
                        <span className=" text-sm md:text-sm font-bold">
                          ORIGIN
                        </span>
                      </div>

                      <div className="w-full">
                        <div className="px-1 py-0 border rounded bg-[#FFF4DB] border-[#f5d385] inline-block h-[52px] mr-2">
                          <img
                            src={`https://flagsapi.com/${originCountry?.country_code
                              ? originCountry?.country_code
                              : "No Image"
                              }/flat/32.png`}
                            alt="origin-flag"
                          />
                          <span className="text-sm relative top-[-5px]">
                            ({originCountry?.country_code})
                          </span>
                        </div>
                        <div className="px-2 py-1 border rounded bg-[#FFF4DB] border-[#f5d385] inline-block h-[52px] align-top leading-[20px]">
                          <h1 className="font-medium text-sm md:text-[16px]">
                            {originCountry?.country_name
                              ? originCountry?.country_name
                              : ""}
                          </h1>
                          <p className="">({allBookingData?.origin_pincode})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-4 relative justify-center items-center hidden md:flex">
                    <div className="srTopAnimation relative w-full">
                      <div className="w-full flex justify-between relative top-[4px]">
                        <i className="w-[3px] h-[3px] bg-[#c0c0c0] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[rgb(159,159,159)] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#909090] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#303030] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#303030] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#303030] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#303030] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#303030] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#303030] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#303030] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#303030] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#303030] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#909090] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#9f9f9f] rounded-full block"></i>
                        <i className="w-[3px] h-[3px] bg-[#c0c0c0] rounded-full block"></i>
                      </div>

                      <div className=" w-[200px] flex items-center absolute top-[1px] right-[0px] left-[0px] m-auto">
                        <div className="SRAnimationTop">
                          <img
                            src={SRAnimation}
                            alt="animation_img"
                            className="w-[32px] h-[32px] absolute "
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <div className="md:flex md:justify-end block md:mt-0 mt-2">
                      <div className="">
                        <div className="w-full">
                          <span className="mt-2 text-sm md:text-sm font-bold">
                            DESTINATION
                          </span>
                        </div>

                        <div className="w-full ">
                          <div className="px-1 py-0 border rounded  inline-block h-[52px] mr-2 bg-[#f0fff2] border-[#C7E9CC] ">
                            <img
                              src={
                                allBookingData?.booking_type == 2
                                  ? `https://flagsapi.com/IN/flat/32.png`
                                  : `https://flagsapi.com/${allBookingData?.destination_country_code}/flat/32.png`
                              }
                              alt="destination-flag"
                            />
                            <span className="text-sm relative top-[-5px]">
                              ({allBookingData?.destination_country_code})
                            </span>
                          </div>
                          <div
                            className={`px-2 py-1 border rounded bg-[#f0fff2] border-[#C7E9CC] inline-block h-[52px] leading-[14px] align-top ${Number(allBookingData?.shipment_charges?.oda) > 0
                              ? "border-orange-500"
                              : ""
                              }`}
                          >
                            <h1 className="font-medium text-sm md:text-lg">
                              {allBookingData?.destination_country}
                            </h1>
                            <p
                              className={`${Number(allBookingData?.shipment_charges?.oda) >
                                0
                                ? "text-orange-500"
                                : ""
                                }`}
                            >
                              <Tippy
                                content={`${Number(
                                  allBookingData?.shipment_charges?.oda,
                                ) > 0
                                  ? "ODA might be charged"
                                  : ""
                                  }`}
                                options={{
                                  placement:
                                    Number(
                                      allBookingData?.shipment_charges?.oda,
                                    ) > 0
                                      ? "right"
                                      : "",
                                }}
                              >
                                ({allBookingData?.destination_pincode})
                              </Tippy>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full mt-2 relative">
                <div className="w-full   mb-1 relative bg-[#f6f8fb] rounded-lg pl-2 pr-2 pt-2 pb-[4px]  border border-[#e6f0ff] ">
                  <div className="grid grid-cols-12 gap-x-1 ">
                    <div className="col-span-12 md:col-span-12">
                      <small className="font-bold text-base">
                        Shipment Dimensions
                      </small>
                      <div className="border border-[#EAEAEA] bg-white px-1 py-[3px]  mb-1 rounded-lg leading-[16px]  flex flex-wrap gap-2">
                        {dimensionData &&
                          dimensionData?.map((elem: any, index: any) => {
                            if (!elem?.item_description) return null;
                            return (
                              <div
                                key={index}
                                className={`flex  gap-4 mr-2  items-center justify-between `}
                              >
                                <span className="text-sm flex capitalize bg-slate-200 px-[6px] py-[3px] rounded-lg">
                                  {elem?.item_description}
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                      <div className="border border-[#EAEAEA] bg-white p-[8px] mb-2 rounded-lg leading-[16px] h-[45px]">
                        <small className="text-[12px] text-[#4C4C4C] uppercase">
                          Shipment Type
                        </small>
                        <h3 className="font-bold text-[15px]">
                          {shipmentType?.find(
                            (elem: any) =>
                              elem?.booking_shipment_type_id ==
                              allBookingData?.shipment_type,
                          )?.shipment_type || "N.A."}
                        </h3>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-5">
                      <div className="border border-[#EAEAEA] bg-white p-[4px] mb-2 rounded-lg leading-[16px] h-[45px]">
                        <div className="flex justify-between items-center">
                          <div className="text-[14px] md:px-3 px-1 font-bold text-[#4C4C4C] uppercase">
                            UNITS
                          </div>
                          <div className="flex justify-between gap-1">
                            <div className=" border border-[#EAEAEA] bg-[#f1f1f1] py-[3px] px-[5px] leading-[14px] rounded-[3px]">
                              <small className="block uppercase ">
                                {" "}
                                Length{" "}
                              </small>{" "}
                              <span className="block font-bold">
                                {" "}
                                {allBookingData?.unit?.length_unit}
                              </span>
                            </div>

                            <div className=" border border-[#EAEAEA] bg-[#f1f1f1] py-[3px] px-[5px] leading-[14px] rounded-[3px]">
                              <small className="block uppercase ">
                                {" "}
                                Weight
                              </small>{" "}
                              <span className="block font-bold">
                                {allBookingData?.unit?.weight_unit}
                              </span>
                            </div>
                            <div className=" border border-[#EAEAEA] bg-[#f1f1f1] py-[3px] px-[5px] leading-[14px] rounded-[3px]">
                              <small className="block uppercase ">
                                {" "}
                                Currency{" "}
                              </small>
                              <span className="block font-bold">
                                {" "}
                                {currencyData?.find(
                                  (elem: any) =>
                                    elem?.id == allBookingData?.unit?.currency,
                                )?.currency || "N.A."}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <div className="border border-[#EAEAEA] bg-white p-[8px] mb-2 rounded-lg leading-[16px] h-[45px]">
                        <div className="w-full flex  items-center">
                          <figure className="flex items-center justify-center  border border-[#ACEAA9] relative  mr-1  bg-[#DEF9DB] rounded-full w-[28px] h-[28px] ">
                            <Wallet className="w-[18px] text-[#10670C]" />
                          </figure>
                          <aside className=" pl-1    leading-[10px]">
                            <h2 className=" text-[13px] uppercase text-[#484848]">
                              Wallet
                            </h2>
                            <p className="font-bold text-sm">
                              <span className="mr-1 text-[13px]">
                                {`${(
                                  currencyData?.find(
                                    (item: any) =>
                                      item?.id ==
                                      allBookingData?.unit?.currency,
                                  ) ??
                                  currencyData?.find(
                                    (item: any) => item?.id == 24,
                                  )
                                )?.symbol || " "
                                  }`}
                              </span>
                              {Number(Number(wallet).toFixed(2)).toLocaleString(
                                "en-IN",
                              )}{" "}
                              /-
                            </p>
                          </aside>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full  relative">
                <div className="grid grid-cols-12 gap-3  px-2">
                  <div className="col-span-12 md:col-span-6">
                    <div className="w-full flex  items-center mb-3 mt-2 ">
                      <figure className="flex items-center justify-center  relative top-[5px] mr-1  bg-[#FFEEB4] rounded-full w-[55px] h-[55px] ">
                        <img
                          src={Courier_commercial_icon}
                          alt="Courier_commercial_icon"
                          className="w-[37px] h-[auto]"
                        />
                      </figure>
                      <aside className=" pl-2    leading-[13px]">
                        <h2 className="font-bold text-lg">Sender Details</h2>
                        <p className="uppercase">
                          {allBookingData?.consigner_first_name || "-"}
                        </p>
                      </aside>
                    </div>
                    <div className="senderReDetails border border-[#fae0a5] rounded-[10px] shadow-[0_0px_5px_#edf5ff]   bg-[#FFFCF3]">
                      <div className=" rounded-tl-[10px] rounded-tr-[10px] border-b border-[#FFE099] px-2 py-2  bg-[#FDEFC3] relative">
                        <div className="col-span-12 md:col-span-6">
                          <div className="w-full flex  items-center ">
                            <figure className="flex items-center justify-center  border-r border-[#F4CA6A] relative  mr-1 pr-2  w-[34px]  ">
                              <img
                                src={SenderInfoIcon}
                                alt="SenderInfoIcon"
                                className="w-[45px] "
                              />
                            </figure>
                            <aside className=" pl-1    leading-[13px]">
                              <h2 className=" text-[14px] font-bold uppercase text-[#484848]">
                                {allBookingData?.consigner_mobile_number || (
                                  <>&nbsp;</>
                                )}
                              </h2>
                              <p className=" text-[14px]">
                                {allBookingData?.consigner_email_id || (
                                  <>&nbsp;</>
                                )}
                              </p>
                            </aside>
                          </div>
                        </div>
                      </div>

                      <div className=" px-[0]  m-auto ">
                        <div className="grid grid-cols-12 gap-y-1 ">
                          <div className="col-span-12 md:col-span-6  border-b border-[#FFE8B2] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#F4CA6A] relative  mr-1  bg-[#FFEEC7] rounded-full w-[30px] h-[30px] ">
                                <Building className="w-[18px] text-[#B88100]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  Company Name
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consigner_company_name ||
                                    "-"}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6  border-b border-[#FFE8B2] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#F4CA6A] relative  mr-1  bg-[#FFEEC7] rounded-full w-[30px] h-[30px] ">
                                <Landmark className="w-[18px] text-[#B88100]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  FLAT/HOUSE NO.
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consigner_address_1 || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6  border-b border-[#FFE8B2] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#F4CA6A] relative  mr-1  bg-[#FFEEC7] rounded-full w-[30px] h-[30px] ">
                                <Map className="w-[18px] text-[#B88100]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  STREET/LOCALITY
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consigner_address_2 || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6  border-b border-[#FFE8B2] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#F4CA6A] relative  mr-1  bg-[#FFEEC7] rounded-full w-[30px] h-[30px] ">
                                <MapPin className="w-[18px] text-[#B88100]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  PINCODE
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consigner_pincode ||
                                    "-"}{" "}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6  border-b border-[#FFE8B2] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#F4CA6A] relative  mr-1  bg-[#FFEEC7] rounded-full w-[30px] h-[30px] ">
                                <Navigation className="w-[18px] text-[#B88100]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  City
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consigner_city || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6  border-b border-[#FFE8B2] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#F4CA6A] relative  mr-1  bg-[#FFEEC7] rounded-full w-[30px] h-[30px] ">
                                <Locate className="w-[18px] text-[#B88100]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  State
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consigner_state || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6  border-b border-[#FFE8B2] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#F4CA6A] relative  mr-1  bg-[#FFEEC7] rounded-full w-[30px] h-[30px] ">
                                <File className="w-[18px] text-[#B88100]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  Document Type
                                </h2>
                                <p className="font-bold text-sm">
                                  {consignerDocTypes?.find(
                                    (item: any) =>
                                      item?.id ==
                                      allBookingData?.consigner_doc_type,
                                  )?.value || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6  border-b border-[#FFE8B2] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#F4CA6A] relative  mr-1  bg-[#FFEEC7] rounded-full w-[30px] h-[30px] ">
                                <FileText className="w-[18px] text-[#B88100]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  {consignerDocTypes?.find(
                                    (item: any) =>
                                      item?.id ==
                                      allBookingData?.consigner_doc_type,
                                  )?.value || "Document Number"}
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consigner_gst_number}
                                </p>
                              </aside>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6  border-b border-[#FFE8B2] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#F4CA6A] relative  mr-1  bg-[#FFEEC7] rounded-full w-[30px] h-[30px] ">
                                <CreditCard className="w-[18px] text-[#B88100]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  GST App. on Invoice
                                </h2>
                                <p className="font-bold text-sm">
                                  {gstApplicable?.find(
                                    (item: any) =>
                                      item?.id ==
                                      allBookingData?.consigner_gst_applicable,
                                  )?.value || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6  border-b border-[#FFE8B2] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#F4CA6A] relative  mr-1  bg-[#FFEEC7] rounded-full w-[30px] h-[30px] ">
                                <Percent className="w-[18px] text-[#B88100]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  Tax Payment Option
                                </h2>
                                <p className="font-bold text-sm">
                                  {taxPaymentOption?.find(
                                    (item: any) =>
                                      item?.id ==
                                      allBookingData?.consigner_tax_payment,
                                  )?.value || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <div className="w-full flex  md:justify-end">
                      <div className=" flex  items-center mb-3 mt-2 ">
                        <figure className="flex items-center justify-center  relative top-[5px] mr-1  bg-[#DAF8D9] rounded-full w-[55px] h-[55px] ">
                          <img
                            src={ReceiverIcon}
                            alt="ReceiverIcon"
                            className="w-[37px] h-[auto]"
                          />
                        </figure>
                        <aside className=" pl-2    leading-[13px]">
                          <h2 className="font-bold text-lg">
                            Receiver Details
                          </h2>
                          <p className="uppercase">
                            {allBookingData?.consignee_first_name || "-"}
                          </p>
                        </aside>
                      </div>
                    </div>

                    <div className="senderReDetails border border-[#A2EE9E] rounded-[10px] shadow-[0_0px_5px_#edf5ff]   bg-[#F6FFF5]">
                      <div className=" rounded-tl-[10px] rounded-tr-[10px] border-b border-[#9ADA93] px-2 py-2  bg-[#DEF9DB] relative">
                        <div className="col-span-12 md:col-span-6">
                          <div className="w-full flex  items-center ">
                            <figure className="flex items-center justify-center  border-r border-[#9deac5] relative  mr-1 pr-2  w-[34px]  ">
                              <img
                                src={ReceiverInfoIcon}
                                alt="ReceiverInfoIcon"
                                className="w-[45px] "
                              />
                            </figure>
                            <aside className=" pl-1    leading-[14px]">
                              <h2 className=" text-[14px] font-bold uppercase text-[#484848]">
                                {allBookingData?.consignee_mobile_number || (
                                  <>&nbsp;</>
                                )}
                              </h2>
                              <p className=" text-[14px] ">
                                {allBookingData?.consignee_email_id || (
                                  <>&nbsp;</>
                                )}
                              </p>
                            </aside>
                          </div>
                        </div>
                      </div>

                      <div className=" px-[0]  m-auto ">
                        <div className="grid grid-cols-12 gap-y-1 ">
                          <div className="col-span-12 md:col-span-6   border-b border-[#B0DBAE] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#ACEAA9] relative  mr-1  bg-[#DEF9DB] rounded-full w-[30px] h-[30px] ">
                                <Building className="w-[18px] text-[#4AA345]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  Company Name
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consignee_company_name ||
                                    "-"}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6   border-b border-[#B0DBAE] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#ACEAA9] relative  mr-1  bg-[#DEF9DB] rounded-full w-[30px] h-[30px] ">
                                <Landmark className="w-[18px] text-[#4AA345]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  FLAT/HOUSE NO.
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consignee_address_1 || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6   border-b border-[#B0DBAE] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#ACEAA9] relative  mr-1  bg-[#DEF9DB] rounded-full w-[30px] h-[30px] ">
                                <Map className="w-[18px] text-[#4AA345]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  STREET/LOCALITY
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consignee_address_2 || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6   border-b border-[#B0DBAE] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#ACEAA9] relative  mr-1  bg-[#DEF9DB] rounded-full w-[30px] h-[30px] ">
                                <MapPin className="w-[18px] text-[#4AA345]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  PINCODE
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consignee_pincode ||
                                    "-"}{" "}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6   border-b border-[#B0DBAE] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#ACEAA9] relative  mr-1  bg-[#DEF9DB] rounded-full w-[30px] h-[30px] ">
                                <Navigation className="w-[18px] text-[#4AA345]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  City
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consignee_city || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6   border-b border-[#B0DBAE] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#ACEAA9] relative  mr-1 bg-[#DEF9DB] rounded-full w-[30px] h-[30px] ">
                                <Locate className="w-[18px] text-[#4AA345]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  State
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consignee_state || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6   border-b border-[#B0DBAE] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#ACEAA9] relative  mr-1 bg-[#DEF9DB] rounded-full w-[30px] h-[30px] ">
                                <FileText className="w-[18px] text-[#4AA345]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  Invoice Number
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.booking_invoice_number ||
                                    "-"}
                                </p>
                              </aside>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6   border-b border-[#B0DBAE] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#ACEAA9] relative  mr-1 bg-[#DEF9DB] rounded-full w-[30px] h-[30px] ">
                                <CalendarDays className="w-[18px] text-[#4AA345]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  Invoice Date
                                </h2>
                                <p className="font-bold text-sm">
                                  {/* {allBookingData?.booking_invoice_date || "-"} */}
                                  {allBookingData?.booking_invoice_date
                                    ? new Date(
                                      allBookingData.booking_invoice_date,
                                    )
                                      .toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      })
                                      .replace(/\//g, "-")
                                    : "-"}
                                </p>
                              </aside>
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6   border-b border-[#B0DBAE] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#ACEAA9] relative  mr-1  bg-[#DEF9DB] rounded-full w-[30px] h-[30px] ">
                                <List className="w-[18px] text-[#4AA345]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  Reference Number
                                </h2>
                                <p className="font-bold text-sm">
                                  {allBookingData?.consignee_reference_no ||
                                    "-"}
                                </p>
                              </aside>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6   border-b border-[#B0DBAE] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="senderreceiverAnimation w-[350px]  items-center absolute top-[44px] right-[0px] left-[0px] m-auto hidden md:block">
                  <div className="SRAnimation">
                    <img
                      src={BoxAnimation}
                      alt="boxAnimation"
                      className="w-[24px] h-[24px] absolute "
                    />
                  </div>
                </div>
                <div className="m-3 mt-10">
                  <div className="w-full border-b-[2px] border-gray-200 mb-4"></div>
                  <div className="flex justify-between">
                    <Button
                      className="rounded-lg bg-green-500 hover:bg-green-600 text-white"
                      onClick={() => {
                        setOtpModal(true);
                        setApprovalStatus(1);
                        submitApproval(0);
                      }}
                      disabled={approvalLoading}
                    >
                      {approvalLoading ? <LoadingIcon /> : "Approve"}
                    </Button>
                    <Button
                      className="rounded-lg bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => {
                        setOtpModal1(true);
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {otpModal && (
            <CommonModal
              open={otpModal}
              setOpen={setOtpModal}
              title={ModalTitle}
              description={ModalDescription}
              footer={ModalFooter}
              sticky
              size="md"
            />
          )}

          {otpModal1 && (
            <CommonModal
              open={otpModal1}
              setOpen={setOtpModal1}
              title={ModalTitle1}
              description={ModalDescription1}
              footer={ModalFooter1}
              sticky={true}
              size="md"
            />
          )}
        </div>
      )}
    </>
  );
}

export default BookingApproval;
