import React, { useEffect, useState } from "react";
import Tracker from "./tracker";
import Lucide from "../../../base-components/Lucide";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { FormInput, FormLabel } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import { useAlert } from "../../../ContextProvider/AlertContext";
import {
  allProductTypesApi,
  getCountryApi,
  getFranchiseeDetailsApi,
  getTrackingApi,
} from "../../../AllServices/config.service";
import { convertUTCtoIST } from "../../../utils";
import { useLocation } from "react-router-dom";
function Main() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [searchvalue, setSearchvalue] = useState<string>(
    queryParams.get("awb") || ""
  );
  const [alldata, setAlldata] = useState<any>({});
  const [answer, setAnswer] = useState<string>("");
  const [trackerdata, setTrackerdata] = useState<Array<any>>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [courier_name, setCourer_name] = useState<any>("");
  const [franchisee_name, setFranchisee_name] = useState<string>("");
  const [cancelledData, setCancelledData] = useState<Array<any>>([]);
  const { showAlert } = useAlert();
  const [countryData, setCountryData] = useState([]);
  const [livelocationloading, setLiveLocationloading] =
    useState<boolean>(false);

  const fetchData = async () => {
    if (searchvalue) {
      try {
        setSearchLoading(true);
        const response = await getTrackingApi(searchvalue);

        if (
          response?.status == 200 &&
          response?.data?.pickup_data?.courier_id
        ) {
          setAlldata(response?.data);
          const newData =
            response?.data?.airwaybills &&
            response?.data?.airwaybills
              ?.split(",")
              ?.filter(
                (ele) =>
                  !ele?.includes(response?.data?.pickup_data?.airwaybilno)
              );
          setCancelledData(newData || []);

          if (Array.isArray(response?.data?.data)) {
            const events = response?.data?.data;
            const statusArray = response?.data?.status_to_show;

            if (response?.data?.pickup_data?.is_domestic == 2) {
              const filteredEvents =
                events?.filter((event: any) =>
                  statusArray?.includes(event?.status_code)
                ) || [];
              setTrackerdata(
                filteredEvents?.sort(
                  (a, b) => new Date(b?.date) - new Date(a?.date)
                ) || []
              );
            } else {
              setTrackerdata(
                events?.sort((a, b) => new Date(b?.date) - new Date(a?.date)) ||
                  []
              );
            }
          } else {
            setTrackerdata([]);
          }

          const courierdata = await allProductTypesApi(
            response?.data?.pickup_data?.courier_id
          );
          if (courierdata?.status == 200) {
            setCourer_name(courierdata?.data?.data[0]?.product_name || "");
          }
          const franchiseedata = await getFranchiseeDetailsApi(
            response.data?.pickup_data?.pickup_franchisee_id
          );
          if (franchiseedata?.status == 200) {
            // setShowdetails((pre:any)=>({...pre,franchisee_name:franchiseedata?.data?.data[0]?.fran}))

            setFranchisee_name(
              franchiseedata?.data?.data[0]?.franchisee_name || ""
            );
          }
          setAnswer("");
        } else if (
          response?.status == 204 ||
          !response?.data?.pickup_data?.courier_id
        ) {
          setAlldata({});
          showAlert("Data Not found", "warning");
        }
      } catch (err: any) {
        showAlert(err.message, "error");
      } finally {
        setSearchLoading(false);
      }
    } else {
      showAlert("Please provide Awb No.", "warning");
    }
  };

  // Modal title
  // const ModalTitle = (
  //   <>
  //     <h2 className="mr-auto text-base font-medium">
  //       {forWhat == 1
  //         ? "Consignee Details"
  //         : forWhat == 2
  //         ? "Consignor Details"
  //         : forWhat == 3
  //         ? "Shipment Details"
  //         : ""}
  //     </h2>
  //   </>
  // );

  function isObjectEmpty(obj: any) {
    // console.log(Object.keys(obj).length,"checktrueofrals")
    return Object.keys(obj).length === 0;
  }
  // Modal description
  // const ModalDescription = (
  //   <>
  //     <div className="col-span-12 sm:col-span-6 ">
  //       {forWhat == 1 ? (
  //         <div className="grid grid-cols-2 gap-5">
  //           <div>
  //             {" "}
  //             <div className="font-bold">Name : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.consignee_data[0]?.first_name
  //                 ? alldata?.consignee_data[0]?.first_name
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">Company Name : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.consignee_data[0]?.company_name
  //                 ? alldata?.consignee_data[0]?.company_name
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">Contact No. : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.consignee_data[0]?.mobile_no
  //                 ? alldata?.consignee_data[0]?.mobile_no
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">Email : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.consignee_data[0]?.email_id
  //                 ? alldata?.consignee_data[0]?.email_id
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">Address 1 : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.consignee_data[0]?.address1
  //                 ? alldata?.consignee_data[0]?.address1
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">Address 2 : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.consignee_data[0]?.address2
  //                 ? alldata?.consignee_data[0]?.address2
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">City : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 && alldata?.consignee_data[0]?.city
  //                 ? alldata?.consignee_data[0]?.city
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">State : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.consignee_data[0]?.state
  //                 ? alldata?.consignee_data[0]?.state
  //                 : "N.A."}
  //             </span>
  //           </div>

  //           {alldata?.consignee_data[0]?.domestic_pincode && (
  //             <div>
  //               {" "}
  //               <div className="font-bold">Domestic Pincode : </div>
  //               <span className="text-gray-400">
  //                 {isObjectEmpty(alldata) == 0 &&
  //                 alldata?.consignee_data[0]?.domestic_pincode
  //                   ? alldata?.consignee_data[0]?.domestic_pincode
  //                   : "N.A."}
  //               </span>
  //             </div>
  //           )}

  //           {alldata?.consignee_data[0]?.international_zipcode && (
  //             <div>
  //               {" "}
  //               <div className="font-bold">International Zipcode : </div>
  //               <span className="text-gray-400">
  //                 {isObjectEmpty(alldata) == 0 &&
  //                 alldata?.consignee_data[0]?.international_zipcode
  //                   ? alldata?.consignee_data[0]?.international_zipcode
  //                   : "N.A."}
  //               </span>
  //             </div>
  //           )}
  //         </div>
  //       ) : forWhat == 2 ? (
  //         <div className="grid grid-cols-2 gap-5">
  //           <div>
  //             {" "}
  //             <div className="font-bold">Name : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.shipper_data &&
  //               alldata?.shipper_data[0]?.shipper_name
  //                 ? alldata?.shipper_data[0]?.shipper_name
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">Company Name : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.shipper_data &&
  //               alldata?.shipper_data[0]?.company_name
  //                 ? alldata?.shipper_data[0]?.company_name
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">Contact No. : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.shipper_data &&
  //               alldata?.shipper_data[0]?.mobile_no
  //                 ? alldata?.shipper_data[0]?.mobile_no
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">Email Id : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.shipper_data &&
  //               alldata?.shipper_data[0]?.email_id
  //                 ? alldata?.shipper_data[0]?.email_id
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">City : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.shipper_data &&
  //               alldata?.shipper_data[0]?.city_name
  //                 ? alldata?.shipper_data[0]?.city_name
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">State : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.shipper_data &&
  //               alldata?.shipper_data[0]?.state
  //                 ? alldata?.shipper_data[0]?.state
  //                 : "N.A."}
  //             </span>
  //           </div>

  //           <div>
  //             {" "}
  //             <div className="font-bold">GST Registered Address : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.shipper_data &&
  //               alldata?.shipper_data[0]?.gst_registered_address
  //                 ? alldata?.shipper_data[0]?.gst_registered_address
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">Address : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.shipper_data &&
  //               alldata?.shipper_data[0]?.street_address
  //                 ? alldata?.shipper_data[0]?.street_address
  //                 : "N.A."}
  //             </span>
  //           </div>

  //           <div>
  //             {" "}
  //             <div className="font-bold">Pincode : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.shipper_data &&
  //               alldata?.shipper_data[0]?.pincode
  //                 ? alldata?.shipper_data[0]?.pincode
  //                 : "N.A."}
  //             </span>
  //           </div>
  //           <div>
  //             {" "}
  //             <div className="font-bold">GSTIN : </div>
  //             <span className="text-gray-400">
  //               {isObjectEmpty(alldata) == 0 &&
  //               alldata?.shipper_data &&
  //               alldata?.shipper_data[0]?.gstin
  //                 ? alldata?.shipper_data[0]?.gstin
  //                 : "N.A."}
  //             </span>
  //           </div>
  //         </div>
  //       ) : forWhat == 3 ? (
  //         <div className="overflow-auto ">
  //           {(isObjectEmpty(alldata) == 0 &&
  //             alldata?.pickup_data &&
  //             alldata?.pickup_data?.booking_shipment_type_id == 1) ||
  //           alldata?.pickup_data?.booking_shipment_type_id == 4 ? (
  //             <Table hover sm>
  //               {/* Table headers */}
  //               <Table.Thead className="bg-mustard text-white border">
  //                 <Table.Tr>
  //                   <Table.Th className="text-center border">Sr.No.</Table.Th>
  //                   <Table.Th className="text-center border whitespace-nowrap ">
  //                     DESCRIPTION
  //                   </Table.Th>
  //                   <Table.Th className="text-center border whitespace-nowrap">
  //                     WEIGHT (Unit)
  //                   </Table.Th>
  //                   <Table.Th className="text-center border whitespace-nowrap">
  //                     LENGTH
  //                   </Table.Th>
  //                   <Table.Th className="text-center border whitespace-nowrap">
  //                     BREADTH
  //                   </Table.Th>
  //                   <Table.Th className="text-center border whitespace-nowrap">
  //                     HEIGHT
  //                   </Table.Th>
  //                   <Table.Th className="text-center border whitespace-nowrap">
  //                     HSN CODE
  //                   </Table.Th>
  //                   <Table.Th className="text-center border whitespace-nowrap">
  //                     QTY.
  //                   </Table.Th>
  //                   <Table.Th className="text-center border whitespace-nowrap">
  //                     VALUE{" "}
  //                     {currencyData &&
  //                       currencyData?.find(
  //                         (ele) => ele?.id == alldata?.pickup_data?.currency_id
  //                       )?.currency && (
  //                         <>
  //                           (
  //                           {
  //                             currencyData?.find(
  //                               (ele) =>
  //                                 ele?.id == alldata?.pickup_data?.currency_id
  //                             )?.currency
  //                           }
  //                           )
  //                         </>
  //                       )}
  //                   </Table.Th>
  //                 </Table.Tr>
  //               </Table.Thead>

  //               {/* Table body */}
  //               <Table.Tbody>
  //                 {isObjectEmpty(alldata) == 0 &&
  //                   alldata?.pickup_item &&
  //                   alldata?.pickup_item?.map((item: any, index: number) => (
  //                     <Table.Tr key={index}>
  //                       <Table.Td className="text-center border">
  //                         {index + 1}.
  //                       </Table.Td>
  //                       <Table.Td className="text-center capitalize border whitespace-nowrap">
  //                         {item?.product_description}
  //                       </Table.Td>
  //                       <Table.Td className="text-center border whitespace-nowrap">
  //                         {Number(item?.weight)?.toFixed(2)} ({" "}
  //                         {alldata?.pickup_data?.weight_unit})
  //                       </Table.Td>
  //                       <Table.Td className="text-center border whitespace-nowrap">
  //                         {item?.length}
  //                       </Table.Td>
  //                       <Table.Td className="text-center border whitespace-nowrap">
  //                         {item?.breadth}
  //                       </Table.Td>
  //                       <Table.Td className="text-center border whitespace-nowrap">
  //                         {item?.height}
  //                       </Table.Td>
  //                       <Table.Td className="text-center border whitespace-nowrap">
  //                         {item?.hsn_code}
  //                       </Table.Td>
  //                       <Table.Td className="text-center border whitespace-nowrap">
  //                         {item?.quantity}
  //                       </Table.Td>
  //                       <Table.Td className="text-center border whitespace-nowrap">
  //                         {item?.value}
  //                       </Table.Td>
  //                     </Table.Tr>
  //                   ))}
  //               </Table.Tbody>
  //             </Table>
  //           ) : (
  //             ""
  //           )}
  //         </div>
  //       ) : (
  //         ""
  //       )}
  //     </div>
  //   </>
  // );

  useEffect(() => {
    if (searchvalue) {
      fetchData();
    }
    // getCurrencyApi()?.then((res) => setCurrencyData(res?.data?.data));
    getCountryApi().then((res) => {
      setCountryData(res?.data?.data);
    });
  }, []);

  return (
    <>
      <div className="w-full max-w-8xl mx-auto mt-8  bg-white rounded-lg shadow-lg ">
        <div className="py-2 px-4">
          <h1 className="text-2xl font-bold text-primary ">TRACKING</h1>
        </div>
        <div className="flex justify-center w-full border-t border-slate-200 dark:border-darkmode-400"></div>
        <div className="flex items-end  p-4 gap-4">
          <div>
            <FormLabel htmlFor="airwaybill" className="text-base">
              AIRWAYBILL NO <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="airwaybill"
              placeholder="Enter Airwaybill No."
              required
              value={searchvalue}
              onChange={(e) => setSearchvalue(e.target.value)}
            />
          </div>

          <div>
            <Button
              className="bg-mustard text-white p-2 w-[150px] "
              onClick={fetchData}
              disabled={searchLoading}
            >
              <Lucide icon="Search" className="w-4 h-4  stroke-2.5 mr-1" />{" "}
              {searchLoading ? "Tracking" : "Track"}
              {searchLoading ? (
                <LoadingIcon
                  icon="three-dots"
                  color="white"
                  className="block m-auto ml-2 w-[20%] "
                />
              ) : (
                ""
              )}
            </Button>
          </div>
        </div>
      </div>
      {answer && !searchLoading && trackerdata?.length < 1 && (
        <div className=" mt-6 bg-white shadow-lg rounded">
          <p className="text-gray-400 text-center">No Data Found!</p>
        </div>
      )}
      {searchLoading ? (
        <LoadingIcon icon="tail-spin" className="block m-auto mt-8 w-[4%] " />
      ) : !isObjectEmpty(alldata) ? (
        <>
          {/* <div className="w-full max-w-8xl mx-auto my-10  bg-white rounded-lg shadow-lg ">
            <div className="py-2 px-4">
              <h1 className="text-2xl font-bold ">Shipment Details</h1>
            </div>
            <div className="flex justify-center w-full border-t border-slate-200 dark:border-darkmode-400 "></div>
            <div className="py-6 mx-6">
              <div
                className={`border  shadow-lg  rounded-lg  ${
                  alldata ? "min-[700px]:h-[280px]" : "min-[700px]:h-[250px]"
                }`}
              >
                <div className="block md:flex justify-center items-center mt-4">
                  <h2 className="text-lg text-center">
                    <b>AWB No. : </b>
                    {isObjectEmpty(alldata) == 0 &&
                    alldata?.pickup_data &&
                    alldata?.pickup_data?.airwaybilno
                      ? alldata?.pickup_data &&
                        alldata?.pickup_data?.airwaybilno
                      : "N.A"}{" "}
                  </h2>
                  <div className=" ml-2">
                    <div className="w-full text-center">
                      <span className="text-xs text-green-500 bg-green-100 py-0.5 px-2 rounded-full">
                        {trackerdata[trackerdata.length - 1]?.status
                          ? trackerdata[trackerdata.length - 1]?.status
                          : "N.A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid min-[710px]:grid-cols-3 my-4 rounded ">
                  <div className="px-4 py-2">
                    <div>
                      {" "}
                      <div className="font-bold ">Skart AWB No. :</div>
                      <span className="font-normal text-primary cursor-pointer">
                        {isObjectEmpty(alldata) == 0 &&
                        alldata?.pickup_data?.skyway_airwaybilno
                          ? alldata?.pickup_data?.skyway_airwaybilno
                          : "N.A"}
                      </span>
                    </div>
                    <div className="mt-4">
                      {" "}
                      <span className="font-bold ">Consignee : </span>
                      <span
                        onClick={() => {
                          setOpenModal(true);

                          setForwhat(1);
                        }}
                        className="font-bold capitalize text-mustard underline underline-offset-4 cursor-pointer"
                      >
                        {isObjectEmpty(alldata) == 0 &&
                        alldata?.consignee_data[0]?.first_name
                          ? alldata?.consignee_data[0]?.first_name
                          : "N.A."}
                      </span>
                    </div>
                    <div>
                      <div className=" mt-4">
                        <span className="font-bold">Consignor : </span>
                        <span
                          onClick={() => {
                            setOpenModal(true);

                            setForwhat(2);
                          }}
                          className="font-bold capitalize text-mustard underline underline-offset-4 cursor-pointer"
                        >
                          {isObjectEmpty(alldata) == 0 &&
                          alldata?.shipper_data &&
                          alldata?.shipper_data[0]?.shipper_name
                            ? alldata?.shipper_data[0]?.shipper_name
                            : "N.A."}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <div className=" ">
                      <div className="font-bold  ">Booking Date :</div>
                      <span className="font-normal text-primary ">
                        {isObjectEmpty(alldata) == 0 && alldata?.pickup_data
                          ? formatDate(alldata?.pickup_data?.booking_date)
                          : "N.A"}
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="font-bold ">Product Type : </span>
                      <span className="font-normal text-primary ">
                        {courier_name ? courier_name : "N.A"}
                      </span>
                    </div>
                    <div className="mt-4 ">
                      <span className="font-bold ">Weight : </span>
                      <span
                        className={`text-mustard capitalize font-bold   ${
                          alldata?.pickup_data?.booking_shipment_type_id == 2
                            ? ""
                            : "cursor-pointer underline underline-offset-4"
                        } `}
                        onClick={() => {
                          if (
                            alldata?.pickup_data?.booking_shipment_type_id != 2
                          ) {
                            setOpenModal(true);
                            setForwhat(3);
                          }
                        }}
                      >
                        {isObjectEmpty(alldata) == 0 && alldata?.pickup_data
                          ? alldata?.pickup_data?.chargeable_weight
                            ? alldata?.pickup_data?.chargeable_weight +
                              alldata?.pickup_data?.weight_unit
                            : "N.A"
                          : ""}{" "}
                        {alldata?.pickup_data?.booking_shipment_type_id == 2 &&
                        alldata.pickup_data.product_description
                          ? `(${alldata.pickup_data.product_description})`
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <div>
                      <div className="font-bold">
                        Business Associate / Direct Party :
                      </div>
                      <span className="font-normal text-primary ">
                        {franchisee_name ? franchisee_name : "N.A."}
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="font-bold">Shipment Type : </span>
                      <span className="font-normal text-primary ">
                        {alldata?.pickup_data?.booking_shipment_type_id == 1
                          ? "Non-Document"
                          : alldata?.pickup_data?.booking_shipment_type_id == 2
                          ? "Document"
                          : alldata?.pickup_data?.booking_shipment_type_id == 4
                          ? "Commercial"
                          : "N.A."}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="m-4">
                  <span className="font-bold">Current Status : </span>
                  <span className="text-sm text-green-500 bg-green-100 py-0.5 px-2 rounded-full">
                    {trackerdata[trackerdata.length - 1]?.status
                      ? trackerdata[trackerdata.length - 1]?.status
                      : "N.A."}
                  </span>
                </div>

                <div>
                  {cancelledData && cancelledData?.length > 0 && (
                    <div>
                      <div className=" mx-4">
                        <span className="font-bold">Cancelled AWBs : </span>
                        <span className="font-bold text-red-500 ">
                          {cancelledData?.join(", ")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center min-[1029px]:mt-0">
                <Tracker
                  data={trackerdata}
                  livelocationloading={livelocationloading}
                />
              </div>
            </div>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-12 bg-white border rounded-lg shadow-lg w-[100%]">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 ring-2 ring-amber-300">
                  <Lucide
                    icon="Search"
                    className="h-6 w-6 text-amber-500 stroke-1.5"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold text-gray-800">AWB No.</p>
                  <p className="text-sm text-gray-500">
                    {isObjectEmpty(alldata) == 0 &&
                    alldata?.pickup_data &&
                    alldata?.pickup_data?.airwaybilno
                      ? alldata?.pickup_data &&
                        alldata?.pickup_data?.airwaybilno
                      : "N.A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 ring-2 ring-amber-300">
                  <Lucide
                    icon="Calendar"
                    className="h-6 w-6 text-amber-500 stroke-1.5"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold text-gray-800">
                    SHIP DATE
                  </p>
                  <p className="text-sm text-gray-500">
                    {isObjectEmpty(alldata) == 0 && alldata?.pickup_data
                      ? convertUTCtoIST(alldata?.pickup_data?.booking_date)
                      : "N.A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 ring-2 ring-amber-300">
                  <Lucide
                    icon="UserCog"
                    className="h-6 w-6 text-amber-500 stroke-1.5"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold text-gray-800">SERVICE</p>
                  <p className="text-sm text-gray-500">
                    {courier_name ? courier_name : "N.A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 ring-2 ring-amber-300">
                  <Lucide
                    icon="Scale"
                    className="h-6 w-6 text-amber-500 stroke-1.5"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold text-gray-800">WEIGHT</p>
                  <p className="text-sm text-gray-500">
                    {isObjectEmpty(alldata) == 0 && alldata?.pickup_data
                      ? alldata?.pickup_data?.chargeable_weight
                        ? alldata?.pickup_data?.chargeable_weight +
                          alldata?.pickup_data?.weight_unit
                        : "N.A"
                      : ""}
                  </p>
                </div>
              </div>

              {alldata?.pickup_data?.booking_shipment_type_id != 2 && (
                <div className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 ring-2 ring-amber-300">
                    <Lucide
                      icon="Box"
                      className="h-6 w-6 text-amber-500 stroke-1.5"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold text-gray-800">
                      NUMBER OF PIECES
                    </p>
                    <p className="text-sm text-gray-500">
                      {alldata?.pickup_item?.reduce(
                        (sum: any, item: any) => sum + item.quantity,
                        0,
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 ring-2 ring-amber-300">
                  <img
                    src={`https://flagsapi.com/${
                      alldata?.pickup_data?.is_domestic == 1
                        ? countryData?.find(
                            (item: any) =>
                              item?.country_id ==
                              alldata?.pickup_data?.delivery_country_id,
                          )?.country_code || ""
                        : "IN"
                    }/flat/32.png`}
                    alt="origin-flag"
                    className="h-6 w-6 rounded-full"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold text-gray-800">
                    DESTINATION
                  </p>
                  <p className="text-sm text-gray-500">
                    {alldata?.pickup_data?.is_domestic == 1
                      ? countryData?.find(
                          (item: any) =>
                            item?.country_id ==
                            alldata?.pickup_data?.delivery_country_id,
                        )?.country_name || ""
                      : "INDIA"}
                  </p>
                </div>
              </div>

              {cancelledData && cancelledData?.length > 0 && (
                <div className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105 col-span-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 ring-2 ring-amber-300">
                    <Lucide
                      icon="Box"
                      className="h-6 w-6 text-amber-500 stroke-1.5"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-lg font-semibold text-gray-800">
                      CANCELLED AWBs
                    </p>
                    <span className="font-bold text-red-500 ">
                      {cancelledData?.join(", ")}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-4 bg-white rounded-lg shadow-md p-4 transition-transform transform hover:scale-105">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 ring-2 ring-amber-300">
                  <Lucide
                    icon="FileText"
                    className="h-6 w-6 text-amber-500 stroke-1.5"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold text-gray-800">
                    Exception
                  </p>
                  <p className="text-sm text-gray-500">
                    {alldata?.data?.find(
                      (item: any) =>
                        item?.status_code == "008" ||
                        item?.status_code == "007",
                    )?.remarks || "N.A"}
                  </p>
                </div>
              </div>
            </div>

            <Tracker
              data={trackerdata}
              livelocationloading={livelocationloading}
            />
          </div>
        </>
      ) : (
        ""
      )}
      {/* {openModal && (
        <CommonModal
          open={openModal}
          setOpen={setOpenModal}
          title={ModalTitle}
          description={ModalDescription}
          sticky={false}
          size={`${forWhat == 3 ? "xl" : "md"}`}
        />
      )} */}
    </>
  );
}

export default Main;
