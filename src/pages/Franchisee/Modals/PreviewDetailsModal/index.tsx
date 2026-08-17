import {
  Building,
  MapPin,
  Pencil,
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
} from "lucide-react";
import { Dialog } from "../../../../base-components/Headless";
import Button from "../../../../base-components/Button";
import Lucide from "../../../../base-components/Lucide";
import Tippy from "../../../../base-components/Tippy";

import SRAnimation from "../../../../assets/images/sranimation.png";
import Courier_commercial_icon from "../../../../assets/images/courier_commercial_icon.png";
import BoxAnimation from "../../../../assets/images/boxAnimation.png";
import ReceiverIcon from "../../../../assets/images/receivericon.png";
import SenderInfoIcon from "../../../../assets/images/senderInfo.png";
import ReceiverInfoIcon from "../../../../assets/images/receiverInfo.png";

import { useFranchisee } from "../../../../ContextProvider/FranchiseeContext";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import { useEffect, useState } from "react";
import {
  consignerDocumentTypesApi,
  gstApplicableApi,
  taxPaymentOptionApi,
} from "../../../../AllServices/config.service";
import { checkObjLength } from "../../../../utils";

interface PreviewDetailsModalProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  senderData: any;
  receiverData: any;
  openSenderModal: () => void;
  openReceiverModal: () => void;
  bookShipment: () => void;
  increaseCounter: () => void;
  dimensionData: any;
  shipmentTypes: any;
  currencyData: any;
  spinner: any;
  shipmentResponse: any;
}

const PreviewDetailsModal: React.FC<PreviewDetailsModalProps> = ({
  open,
  onClose,
  booking,
  senderData,
  receiverData,
  openSenderModal,
  openReceiverModal,
  bookShipment,
  increaseCounter,
  dimensionData = [],
  shipmentTypes = [],
  currencyData = [],
  spinner,
  shipmentResponse,
}) => {
  const { franchiseeName, availableCreditLimit, currencyId, isOverseas } =
    useFranchisee();
  const [consignerDocTypes, setConsignerDocTypes] = useState([]);
  const [gstApplicable, setGstApplicable] = useState([]);
  const [taxPaymentOption, setTaxPaymentOption] = useState([]);

  useEffect(() => {
    consignerDocumentTypesApi().then((res) =>
      setConsignerDocTypes(res?.data?.data || []),
    );
    gstApplicableApi().then((res) => setGstApplicable(res?.data?.data || []));
    taxPaymentOptionApi().then((res) => setTaxPaymentOption(res?.data?.data));
  }, []);

  return (
    <Dialog staticBackdrop open={open} onClose={onClose} size="xl">
      <Dialog.Panel className="senderRecievermODAL">
        <Dialog.Title className="flex justify-between">
          <h2 className="mr-auto text-base font-medium">Preview Details</h2>
          <Lucide
            icon="XCircle"
            className="w-5 h-5 cursor-pointer"
            onClick={onClose}
          />
        </Dialog.Title>
        <Dialog.Description className="prePadding">
          <div className="scrollvd overflow-x-auto   pr-[12px]">
            <div className="flex justify-between px-2">
              <h3 className="text-base text-mustard uppercase font-bold">
                {franchiseeName}
              </h3>
              <h3 className="font-bold text-base uppercase">
                Product :{" "}
                <span className="text-mustard">
                  {booking?.shipment_charges?.product_name}
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
                          src={`https://flagsapi.com/${
                            booking?.origin_country_code
                              ? booking?.origin_country_code
                              : "IN"
                          }/flat/32.png`}
                          alt="origin-flag"
                        />
                        <span className="text-sm relative top-[-5px]">
                          ({booking?.origin_country_code})
                        </span>
                      </div>
                      <div className="px-2 py-1 border rounded bg-[#FFF4DB] border-[#f5d385] inline-block h-[52px] align-top leading-[20px]">
                        <h1 className="font-medium text-sm md:text-[16px]">
                          {booking?.origin_country
                            ? booking?.origin_country
                            : "INDIA"}
                        </h1>
                        <p className="">({booking?.origin_pincode})</p>
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
                              booking?.booking_type == 2
                                ? `https://flagsapi.com/IN/flat/32.png`
                                : `https://flagsapi.com/${booking?.destination_country_code}/flat/32.png`
                            }
                            alt="destination-flag"
                          />
                          <span className="text-sm relative top-[-5px]">
                            ({booking?.destination_country_code})
                          </span>
                        </div>
                        <div
                          className={`px-2 py-1 border rounded bg-[#f0fff2] border-[#C7E9CC] inline-block h-[52px] leading-[14px] align-top ${
                            Number(booking?.shipment_charges?.oda) > 0
                              ? "border-orange-500"
                              : ""
                          }`}
                        >
                          <h1 className="font-medium text-sm md:text-lg">
                            {booking?.destination_country}
                          </h1>
                          <p
                            className={`${
                              Number(booking?.shipment_charges?.oda) > 0
                                ? "text-orange-500"
                                : ""
                            }`}
                          >
                            <Tippy
                              content={`${
                                Number(booking?.shipment_charges?.oda) > 0
                                  ? "ODA might be charged"
                                  : ""
                              }`}
                              options={{
                                placement:
                                  Number(booking?.shipment_charges?.oda) > 0
                                    ? "right"
                                    : "",
                              }}
                            >
                              ({booking?.destination_pincode})
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
                        {shipmentTypes?.find(
                          (elem: any) =>
                            elem?.booking_shipment_type_id ==
                            booking?.shipment_type,
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
                            <small className="block uppercase "> Length </small>{" "}
                            <span className="block font-bold">
                              {" "}
                              {booking?.unit?.length_unit}
                            </span>
                          </div>

                          <div className=" border border-[#EAEAEA] bg-[#f1f1f1] py-[3px] px-[5px] leading-[14px] rounded-[3px]">
                            <small className="block uppercase "> Weight</small>{" "}
                            <span className="block font-bold">
                              {booking?.unit?.weight_unit}
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
                                  elem?.id == booking?.unit?.currency,
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
                              {isOverseas && currencyId
                                ? `${
                                    (
                                      currencyData?.find(
                                        (item: any) => item?.id == currencyId,
                                      ) ??
                                      currencyData?.find(
                                        (item: any) => item?.id == 24,
                                      )
                                    )?.symbol || " "
                                  }`
                                : "₹"}
                            </span>
                            {Number(
                              Number(availableCreditLimit).toFixed(2),
                            ).toLocaleString("en-IN")}{" "}
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
                  {checkObjLength(senderData) > 0 ||
                  checkObjLength(receiverData) > 0 ? (
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
                          {senderData?.consigner_first_name || "-"}
                        </p>
                      </aside>
                    </div>
                  ) : null}
                  {checkObjLength(senderData) > 0 ||
                  checkObjLength(receiverData) > 0 ? (
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
                                {senderData?.consigner_mobile_number || (
                                  <>&nbsp;</>
                                )}
                              </h2>
                              <p className=" text-[14px]">
                                {senderData?.consigner_email_id || <>&nbsp;</>}
                              </p>
                            </aside>
                          </div>
                        </div>

                        <div className="absolute top-[8px] right-[10px]">
                          <div className="w-[25px] h-[25px] rounded-full bg-[#fff] shadow-[0_0_1px_1px_#0000001a] animate-pulse-custom justify-center items-center flex hover:bg-[#F0BC11]">
                            <button
                              onClick={() => {
                                openSenderModal(true);
                                onClose();
                              }}
                            >
                              <Pencil className="w-[14px] text-[#A17F10] hover:text-[#fff]" />
                            </button>
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
                                  {senderData?.consigner_company_name || "-"}
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
                                  {senderData?.consigner_address_1 || "-"}
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
                                  {senderData?.consigner_address_2 || "-"}
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
                                  {senderData?.consigner_pincode || "-"}{" "}
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
                                  {senderData?.consigner_city || "-"}
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
                                  {senderData?.consigner_state || "-"}
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
                                      senderData?.consigner_doc_type,
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
                                      senderData?.consigner_doc_type,
                                  )?.value || "Document Number"}
                                </h2>
                                <p className="font-bold text-sm">
                                  {senderData?.consigner_gst_number}
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
                                      senderData?.consigner_gst_applicable,
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
                                      senderData?.consigner_tax_payment,
                                  )?.value || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="col-span-12 md:col-span-6">
                  {checkObjLength(senderData) > 0 ||
                  checkObjLength(receiverData) > 0 ? (
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
                            {receiverData?.consignee_first_name || "-"}
                          </p>
                        </aside>
                      </div>
                    </div>
                  ) : null}

                  {checkObjLength(senderData) > 0 ||
                  checkObjLength(receiverData) > 0 ? (
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
                                {receiverData?.consignee_mobile_number || (
                                  <>&nbsp;</>
                                )}
                              </h2>
                              <p className=" text-[14px] ">
                                {receiverData?.consignee_email_id || (
                                  <>&nbsp;</>
                                )}
                              </p>
                            </aside>
                          </div>
                        </div>

                        <div className="absolute top-[8px] right-[10px]">
                          <div className="w-[25px] h-[25px] rounded-full bg-[#fff] shadow-[0_0_1px_1px_#0000001a] animate-pulse-custom justify-center items-center flex hover:bg-[#14830F]">
                            <button
                              onClick={() => {
                                openReceiverModal(true);
                                onClose();
                              }}
                            >
                              <Pencil className="w-[14px] text-[#14830F] hover:text-[#fff]" />
                            </button>
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
                                  {receiverData?.consignee_company_name || "-"}
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
                                  {receiverData?.consignee_address_1 || "-"}
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
                                  {receiverData?.consignee_address_2 || "-"}
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
                                  {receiverData?.consignee_pincode || "-"}{" "}
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
                                  {receiverData?.consignee_city || "-"}
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
                                  {receiverData?.consignee_state || "-"}
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
                                  {receiverData?.booking_invoice_number || "-"}
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
                                  {receiverData?.booking_invoice_date || "-"}
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
                                  {receiverData?.consignee_reference_no || "-"}
                                </p>
                              </aside>
                            </div>
                          </div>
                          <div className="col-span-12 md:col-span-6   border-b border-[#B0DBAE] [&:last-child]:border-none md:[&:nth-last-child(2)]:border-none">
                            {/* <div className="w-full flex  items-center py-2 px-2 ">
                              <figure className="flex items-center justify-center  border border-[#ACEAA9] relative  mr-1  bg-[#DEF9DB] rounded-full w-[30px] h-[30px] ">
                                <Navigation className="w-[18px] text-[#4AA345]" />
                              </figure>
                              <aside className=" pl-1    leading-[10px]">
                                <h2 className=" text-[13px] uppercase text-[#484848]">
                                  Reference Number
                                </h2>
                                <p className="font-bold text-sm">{receiverData?.consignee_reference_no || "-"}</p>
                              </aside>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
              {checkObjLength(senderData) > 0 ||
              checkObjLength(receiverData) > 0 ? (
                <div className="senderreceiverAnimation w-[350px]  items-center absolute top-[44px] right-[0px] left-[0px] m-auto hidden md:block">
                  <div className="SRAnimation">
                    <img
                      src={BoxAnimation}
                      alt="boxAnimation"
                      className="w-[24px] h-[24px] absolute "
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Dialog.Description>
        <Dialog.Footer>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              className=" bg-primary border-none text-white"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="button"
              className=" bg-mustard border-none text-white"
              onClick={() => {
                increaseCounter();
                bookShipment(1);
                onClose();
              }}
              disabled={
                spinner ||
                shipmentResponse?.airwaybilno ||
                checkObjLength(senderData) == 0 ||
                checkObjLength(receiverData) == 0
              }
            >
              Save Draft{" "}
              {spinner && (
                <LoadingIcon
                  icon="puff"
                  color="white"
                  className="w-5 h-5 ml-2 stroke-2.5 text-white"
                />
              )}
            </Button>
            <Button
              type="button"
              className=" bg-mustard border-none text-white"
              onClick={() => {
                bookShipment("");
                onClose();
              }}
              disabled={
                !senderData?.consigner_mobile_number ||
                !senderData?.consigner_company_name ||
                !senderData?.consigner_first_name ||
                !senderData?.consigner_address_1 ||
                !senderData?.consigner_address_2 ||
                !senderData?.consigner_city ||
                !senderData?.consigner_state ||
                !senderData?.consigner_pincode ||
                !senderData?.pickup_required ||
                !receiverData?.consignee_mobile_number ||
                !receiverData?.consignee_company_name ||
                !receiverData?.consignee_first_name ||
                !receiverData?.consignee_address_1 ||
                !receiverData?.consignee_address_2 ||
                !receiverData?.consignee_city ||
                !receiverData?.consignee_state ||
                !receiverData?.consignee_pincode ||
                spinner ||
                shipmentResponse?.airwaybilno ||
                (checkObjLength(senderData) == 0 &&
                  checkObjLength(receiverData) == 0) ||
                (booking?.courier_code?.includes("fedex") &&
                  booking?.import_booking == "1" &&
                  !booking?.kyc_details) ||
                (booking?.booking_type == "1" &&
                  !booking.consigner_gst_number) ||
                (booking?.booking_type == "1" && !booking.consignee_email_id) ||
                (booking?.booking_type == "1" && !booking.consigner_email_id) ||
                (booking?.booking_type == "1" &&
                  booking?.shipment_type !== "2" &&
                  booking?.import_booking == "1" &&
                  !booking?.kyc_details) ||
                  (booking?.import_booking == "2" &&
                  booking?.import_booking_type != "2" &&
                  !booking?.kyc_details) ||
                (booking?.courier_code?.includes("emirates") &&
                  !booking?.is_residential)
              }
            >
              Final Booking
            </Button>
          </div>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default PreviewDetailsModal;
