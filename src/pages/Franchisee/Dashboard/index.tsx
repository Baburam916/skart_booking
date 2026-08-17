import React, { useEffect, useState } from "react";
import DashboardImage from "../../../assets/images/icons/dashboard.png";
import DigitalDash from "../../../assets/images/icons/digitaldash.jpg";
import availabel_awb from "../../../assets/images/availabel_awb.png";
import unsued_awb from "../../../assets/images/unsued_awb.png";
import under_process_awb from "../../../assets/images/under_process_awb.png";
import arrowdashboard from "../../../assets/images/arrowdashboard.png";
import logonew from "../../../assets/images/logonew.gif";


import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import clsx from "clsx";
import Tippy from "../../../base-components/Tippy";
import AnimatedCounter from "../AnimateCounter";
import { convertJSONtoCSV, getTodayDate } from "../../../utils";
import { bulkAwbData, downloadAWBs } from "../../../AllServices/config.service";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { Link } from "react-router-dom";
import { Upload } from "lucide-react";
import { Download } from "lucide-react";

const main = () => {
  const { showAlert } = useAlert();
  const { franchiseeId, isDirectCust, bulkBooking } = useFranchisee();
  const [awbData, setAWBData] = useState({
    total_awbs: 0,
    used_awbs: 0,
    unused_awbs: 0,
    pending_awbs: 0,
    progress_awbs: 0,
  });
  const [usedAWB, setUsedAWB] = useState([]);
  const [unusedAWB, setUnusedAWB] = useState([]);
  const [loading, setLoading] = useState(false);

  const [downloadSpinner, setDownloadSpinner] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await bulkAwbData(franchiseeId);
      if (res?.status == 200) {
        setAWBData((prev) => ({
          ...prev,
          total_awbs: res?.data?.total_awbs || 0,
          unused_awbs: res?.data?.unused_awbs || 0,
          used_awbs: res?.data?.used_awbs || 0,
          pending_awbs:
            Number(res?.data?.total_awbs || 0) -
            (Number(res?.data?.unused_awbs || 0) +
              Number(res?.data?.used_awbs || 0) +
              Number(res?.data?.pending || 0)) || 0,
          progress_awbs: res?.data?.pending || 0,
        }));
        setUsedAWB(res?.data?.report || []);
        setUnusedAWB(res?.data?.unused || []);
      } else if (res?.status == 204) {
        setAWBData((prev) => ({
          ...prev,
          total_awbs: 0,
          unused_awbs: 0,
          used_awbs: 0,
          pending_awbs: 0,
          progress_awbs: 0,
        }));
        setUsedAWB([]);
        setUnusedAWB([]);
      } else if (res?.status == 404 || res?.response?.status == 404) {
        showAlert("Not Found", "error");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert(error?.message, "error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatData = (data: any) => {
    if (!(data?.length > 0)) {
      showAlert("No data available for download", "warning");
      return;
    }
    return data?.map((item: any, index: number) => ({
      awb_no: item.airwaybill_no || "",
      origin_pin_code: "",
      destination_pin_code: "",
      description: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      invoice_value: "",
      consignee_name: "",
      consignee_address_1: "",
      consignee_address_2: "",
      consignee_phone_no: "",
      consignee_email: "",
      shipper_name: "",
      shipper_address_1: "",
      shipper_address_2: "",
      shipper_phone_no: "",
      shipper_email: "",
      customer_ref_no: "",
      e_way_bill: "",
    }));
  };
  const formatDownloadData = (data: any) => {
    if (!(data?.length > 0)) {
      showAlert("No data available for download", "warning");
      return;
    }
    return data?.map((item: any, index: number) => ({
      awb_no: item?.awb || "",
    }));
  };

  const downloadCSV = async () => {
    setDownloadSpinner(true);
    try {
      const res = await downloadAWBs(franchiseeId, awbData?.pending_awbs || 0);
      if (res?.status == 200) {
        if (res?.data?.data?.length > 0) {
          convertJSONtoCSV(
            formatData(res?.data?.data),
            `Bulk_Booking_Format_${getTodayDate()}.csv`
          );
          getData();
        } else {
          showAlert("AWBs not available", "warning");
        }
      } else if (res?.status == 400 || res?.response?.status == 400) {
        showAlert(res?.response?.data?.message, "warning");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert("Unable to Download CSV", "error");
    } finally {
      setDownloadSpinner(false);
    }
  };

  useEffect(() => {
    if (!isDirectCust) {
      getData();
    }
  }, []);

  return (
    <>
      {isDirectCust ? (
        <div
          className={`w-full max-w-8xl mx-auto mt-4 p-4 bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between`}
        >
          <div className={"w-full flex items-center justify-center "}>
            <img src={DigitalDash} alt="skart_logo" />
          </div>
        </div>
      ) : (
        <>
          {bulkBooking == 1 ? (
            <>
              <div className="flex flex-wrap justify-between gap-4 my-4">
                <div className="flex flex-wrap justify-end gap-4 w-full sm:w-auto">
                  <Button
                    className="text-white bg-mustard w-full sm:w-auto"
                    onClick={downloadCSV}
                  >
                    CSV Format with AWB
                    {downloadSpinner ? (
                      <LoadingIcon
                        icon="puff"
                        color="white"
                        className="w-5 h-5 ml-2"
                      />
                    ) : (
                      <Lucide
                        icon="Download"
                        className="w-4 h-4 stroke-2.5 text-white ml-2"
                      />
                    )}
                  </Button>

                  <Button
                    className="text-white bg-mustard w-full sm:w-auto"
                    onClick={() =>
                      convertJSONtoCSV(
                        formatData([{}]),
                        `Bulk_Booking_Format_${getTodayDate()}.csv`
                      )
                    }
                  >
                    CSV Format without AWB
                    <Lucide
                      icon="Download"
                      className="w-4 h-4 stroke-2.5 text-white ml-2"
                    />
                  </Button>
                </div>

                <div className="flex items-center w-full sm:w-auto">

                  <Link
                    to="/franchisee/upload_bulk_booking"
                    state={{ showForm: 1 }}
                    className="text-white bg-blue-500 w-full sm:w-auto flex items-center justify-center space-x-2 p-2 font-medium rounded-md">
                    Upload Bulk Booking
                    <Upload className=" w-[15px] h-[15px] text-[#fff] ml-2" />
                  </Link>

                </div>
              </div>

              <div className="w-full">
                <div className=" grid grid-cols-12 gap-x-2 ">
                  <div className=" col-span-12 md:col-span-4 mb-2 ">
                    <div className=" relative bg-white rounded-lg border border-[#fff] mb-2  shadow-sm">
                      <div className=" relative flex    w-full px-4 mt-4  ">
                        <figure className="bg-[#FFF5DF] rounded-[8px] p-2 w-[56px]">
                          <img
                            src={availabel_awb}
                            alt="Total AWB"
                            className="w-[37px] h-[39px]"
                          />
                        </figure>
                        <aside className="ml-3">
                          <h2 className="text-lg font-bold">
                            {!awbData?.total_awbs && loading ? (
                              0
                            ) : (
                              <AnimatedCounter
                                value={Number(awbData?.total_awbs) || 0}
                                withDecimal={false}
                              />
                            )}
                          </h2>
                          <p className="text-sm font-[500] uppercase text-[#585858]">
                            Total AWB
                          </p>
                        </aside>
                      </div>

                      <div className=" relative flex  justify-between  w-full px-4 mt-4  p-3 bg-[#F9F5ED] border-t border-[#EEE7D7] rounded-b-[6px]">
                        <p className="text-sm font-[500] uppercase text-[#E4A514] ">
                          Available AWB
                        </p>
                        <h3 className="text-sm font-[500] uppercase text-[#E4A514] flex justify-center items-center">
                          <span>
                            {" "}
                            {loading ? (
                              0
                            ) : (
                              <AnimatedCounter
                                value={Number(awbData?.pending_awbs) || 0}
                                withDecimal={false}
                              />
                            )}{" "}
                          </span>
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className=" col-span-12  md:col-span-4 mb-2 ">
                    <div className=" relative bg-white rounded-lg border border-[#fff] mb-2  shadow-sm">
                      <div className=" relative flex    w-full px-4 mt-4  ">
                        <figure className="bg-[#E1F8E0] rounded-[8px] p-2 w-[56px]">
                          <img
                            src={unsued_awb}
                            alt="Used AWB"
                            className="w-[37px] h-[39px]"
                          />
                        </figure>

                        <aside className="ml-3">
                          <h2 className="text-lg font-bold">
                            {!awbData?.used_awbs && loading ? (
                              0
                            ) : (
                              <AnimatedCounter
                                value={Number(awbData?.used_awbs) || 0}
                                withDecimal={false}
                              />
                            )}
                          </h2>
                          <p className="text-sm font-[500] uppercase text-[#585858]">
                            Used AWB
                          </p>
                        </aside>
                        <Tippy
                          as="div"
                          className="cursor-pointer bg-[#4ed746] border-none p-[2px] w-[28px] h-[28px] rounded-full flex justify-center items-center ml-[8px] absolute top-[0px] right-[12px] hover:bg-[#faca15] hover:text-[#fff]"
                          content="Download Used AWB"
                          onClick={() =>
                            convertJSONtoCSV(
                              formatDownloadData(usedAWB),
                              `Used_AWB_${getTodayDate()}.csv`
                            )
                          }
                        >


                          <Download className="w-[15px] h-[13px]  text-[#fff] stroke-[3] " />
                        </Tippy>

                      </div>

                      <div className=" relative flex  justify-between  w-full px-3 mt-4  py-[9px] bg-[#E2EFE1] border-t border-[#E2EFE1] rounded-b-[6px]">
                        <p className="text-sm font-[500] uppercase text-[#26A91F] ">
                          Unused AWB
                        </p>
                        <h3 className="text-sm font-[500] uppercase text-[#26A91F]  flex items-center ">
                          {" "}
                          <span>
                            {!awbData?.unused_awbs && loading ? (
                              0
                            ) : (
                              <AnimatedCounter
                                value={Number(awbData?.unused_awbs) || 0}
                                withDecimal={false}
                              />
                            )}{" "}
                          </span>

                          <Tippy
                            as="div"
                            className="cursor-pointer bg-[#4ed746] border-none p-[2px] w-[26px] h-[26px] rounded-full flex justify-center items-center ml-[6px] hover:bg-[#faca15] hover:text-[#fff] "
                            content="Download Unused AWB"
                            onClick={() =>
                              convertJSONtoCSV(
                                formatDownloadData(unusedAWB),
                                `Unused_AWB_${getTodayDate()}.csv`
                              )
                            }
                          >

                            <Download className="w-[15px] h-[13px]  text-white stroke-[3]" />
                          </Tippy>

                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className=" col-span-12  md:col-span-4 mb-2 ">
                    <div className=" relative bg-white rounded-lg border border-[#fff] mb-2  shadow-sm">
                      <div className=" relative flex    w-full px-4 mt-4  ">
                        <figure className="bg-[#F1F5F9] rounded-[8px] p-2 w-[56px]">
                          <img
                            src={under_process_awb}
                            alt="Under Process AWB"
                            className="w-[37px] h-[39px]"
                          />
                        </figure>
                        <aside className="ml-3">
                          <h2 className="text-lg font-bold">
                            {!awbData?.progress_awbs && loading ? (
                              0
                            ) : (
                              <AnimatedCounter
                                value={Number(awbData?.progress_awbs) || 0}
                                withDecimal={false}
                              />
                            )}
                          </h2>
                          <p className="text-sm font-[500] uppercase text-[#585858]">
                            Under Process AWB
                          </p>
                        </aside>
                      </div>

                      <div className=" relative flex  justify-between  w-full px-4 mt-4  p-3 bg-[#F8F8F8] border-t border-[#EEEEEE] rounded-b-[6px]">
                        <p className="text-sm font-[500] uppercase text-[#717171] ">
                          Available AWB
                        </p>
                        <h3 className="text-sm font-[500] uppercase text-[#717171]  flex items-center">
                          <span>
                            {" "}
                            {loading ? (
                              0
                            ) : (
                              <AnimatedCounter
                                value={Number(awbData?.pending_awbs) || 0}
                                withDecimal={false}
                              />
                            )}{" "}
                          </span>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <marquee className="my-4 text-red-500 font-bold">
              The bulk booking feature has been disabled by the Skart team.
              Please reach out to them for reactivation.
            </marquee>
          )}

          <div
            className={`mt-3  w-full md:py-8 py-2 px-2 md:px-5 bg-white rounded-lg shadow-lg`}
          >
            <div className=" w-full bloxk  md:flex">
              <div className={" w-full md:w-[30%] "}>



                <div className="pr-0 md:pr-9 ">
                  <figure className="bg-[#f9f5ed] rounded-2xl px-3  py-[20px]  md:py-[70px] text-center">
                    <img alt="Avatar" className="w-[330px] m-auto" src={logonew} />


                  </figure>



                </div>



              </div>
              {
                <div className=" md:w-[70%]  w-full mt-3 md:mt-0  ">
                  <div className=" w-full ">
                    <div className="text-mustard md:text-3xl text-xl uppercase font-bold mb-3">
                      KAVACH Features
                    </div>
                  </div>
                  <div className="text-justify mt-2">
                    <ul className="list-none space-y-2 text-base">
                      <li
                        style={{ "--icon": `url(${arrowdashboard})` }}
                        className="mb-2 pl-[31px] bg-no-repeat bg-[position:4px_4px] bg-[image:var(--icon)] brightness-[2]">
                        <strong className="font-bold text-md">
                          Introducing KAVACH :
                        </strong>{" "}
                        Tired of receiving unexpected additional invoices that
                        eat into your profit margins? With sKart's KAVACH
                        program, you can say goodbye to surprise charges and
                        regain control over your shipping costs.
                      </li>
                      <li
                        style={{ "--icon": `url(${arrowdashboard})` }}
                        className="mb-2 pl-[31px] bg-no-repeat bg-[position:4px_4px] bg-[image:var(--icon)] brightness-[2]">
                        <strong className="font-bold text-md">
                          Coverage of Additional Charges
                        </strong>{" "}
                        KAVACH saves you from additional invoice for additional
                        charges such as Address Correction, AHS Dimension, AHS
                        Packaging, AHS Weight, Elevated Risk, Remote Area
                        Delivery, Restricted Destination, Accessible Dangerous
                        Goods, Admin Charges-Del, Adult Signature, AHS, AHS
                        Freight, AHS Non Stackable, Delivery Charges, Destroy
                        Charges, Handling Charge, Inaccessible Dangerous Goods,
                        Non Conveyable Piece, Oversize Piece, Overweight Piece,
                        RTS Charge, Shipment Preparation, AQIS Charges, Lost
                        Cases Freight & Lost Cases Invoice Value Upto 10K.
                      </li>
                      <li
                        style={{ "--icon": `url(${arrowdashboard})` }}
                        className="mb-2 pl-[31px] bg-no-repeat bg-[position:4px_4px] bg-[image:var(--icon)] brightness-[2]">
                        <strong className="font-bold text-md">Subscription-based Model :{" "}
                        </strong>{" "}
                        The subscription cost is 2% of the freight value plus
                        Fuel surcharge on every courier done. Minimum Period for
                        KAVACH Subscription is 3 Months.
                      </li>
                      <li
                        style={{ "--icon": `url(${arrowdashboard})` }}
                        className="mb-2 pl-[31px] bg-no-repeat bg-[position:4px_4px] bg-[image:var(--icon)] brightness-[2]">
                        <strong className="font-bold text-md">Auto-Renewal with Opt-Out Option :{" "}
                        </strong>{" "}
                        The program auto-renews every three months for
                        convenience, but customers can easily opt out at any
                        time after 3 months.
                      </li>
                      <li
                        style={{ "--icon": `url(${arrowdashboard})` }}
                        className="mb-2 pl-[31px] bg-no-repeat bg-[position:4px_4px] bg-[image:var(--icon)] brightness-[2]">
                        <strong className="font-bold text-md"> Exclusion for Non-Subscribers :{" "}
                        </strong>{" "}
                        Customers who do not subscribe to KAVACH will be
                        invoiced for additional charges as and when incurred.
                      </li>
                      <li
                        style={{ "--icon": `url(${arrowdashboard})` }}
                        className="mb-2 pl-[31px] bg-no-repeat bg-[position:4px_4px] bg-[image:var(--icon)] brightness-[2]">
                        <strong className="font-bold text-md">Rights :{" "}
                        </strong>{" "}
                        sKart reserves the right to make amendments or changes
                        to the program at any point.
                      </li>
                    </ul>
                  </div>
                  {/* <div className="mt-2">
              <FormCheck className="flex items-center">
                <FormCheck.Input
                  id="checkbox-switch-4"
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                  className="mr-2"
                />
                <FormCheck.Label
                  htmlFor="checkbox-switch-4"
                  className="text-sm"
                >
                  <strong>I accept the terms and conditions</strong>
                </FormCheck.Label>
              </FormCheck>
            </div>
            <div className="flex justify-end">
              <Button
                elevated
                rounded
                className=" mr-1 text-white bg-green-400"
                disabled={spinner}
                onClick={activateKavach}
              >
                <Lucide
                  icon="ShieldCheck"
                  className="text-white stroke-2.5 mr-1"
                />
                Activate
                {spinner && (
                  <LoadingIcon
                    icon="puff"
                    color="white"
                    className="w-5 h-5 ml-2 stroke-2.5 text-white"
                  />
                )}
              </Button>
            </div> */}
                </div>
              }
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default main;

// old

// <>
//   {isDirectCust ? (
//     <div
//       className={`w-full max-w-8xl mx-auto mt-4 p-4 bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between`}
//     >
//       <div className={"w-full flex items-center justify-center "}>
//         <img src={DigitalDash} alt="skart_logo" />
//       </div>
//     </div>
//   ) : (
//     <div
//       className={`w-full max-w-8xl mx-auto mt-4 p-8 bg-white rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between`}
//     >
//       <div
//         className={
//           "w-full md:w-2/5 flex items-center justify-center md:block"
//         }
//       >
//         <img src={DashboardImage} alt="skart_logo" />
//       </div>
//       {
//         <div className="w-full md:w-3/5 pb-8 md:pb-0">
//           <div className=" text-center flex justify-center">
//             <div className="mt-4 text-3xl font-semibold text-mustard">
//               KAVACH Features
//             </div>
//           </div>
//           <div className="text-justify mt-2">
//             <ul className="list-none pl-5 space-y-2">
//               <li>
//                 <strong className="text-mustard font-bold text-md">
//                   1) Introducing KAVACH :{" "}
//                 </strong>{" "}
//                 Tired of receiving unexpected additional invoices that eat
//                 into your profit margins? With sKart's KAVACH program, you
//                 can say goodbye to surprise charges and regain control over
//                 your shipping costs.
//               </li>
//               <li>
//                 <strong className="text-mustard font-bold text-md">
//                   2) Coverage of Additional Charges :{" "}
//                 </strong>{" "}
//                 KAVACH saves you from additional invoice for additional
//                 charges such as Remote Area Surcharge, Address Correction,
//                 Residential Address, Elevated Risk, Data Entry, Multiline
//                 Entry, Non-Routine Entry, and AHS Dimension/Weight &
//                 Packaging charges.
//               </li>
//               <li>
//                 <strong className="text-mustard font-bold text-md">
//                   3) Subscription-based Model :{" "}
//                 </strong>{" "}
//                 The subscription cost is 2% of the freight value plus Fuel
//                 surcharge on every courier done. Minimum Period for KAVACH
//                 Subscription is 3 Months.
//               </li>
//               <li>
//                 <strong className="text-mustard font-bold text-md">
//                   4) Auto-Renewal with Opt-Out Option :{" "}
//                 </strong>{" "}
//                 The program auto-renews every three months for convenience,
//                 but customers can easily opt out at any time after 3 months.
//               </li>
//               <li>
//                 <strong className="text-mustard font-bold text-md">
//                   5) Exclusion for Non-Subscribers :{" "}
//                 </strong>{" "}
//                 Customers who do not subscribe to KAVACH will be invoiced
//                 for additional charges as and when incurred.
//               </li>
//               <li>
//                 <strong className="text-mustard font-bold text-md">
//                   6) Rights :{" "}
//                 </strong>{" "}
//                 sKart reserves the right to make amendments or changes to
//                 the program at any point.
//               </li>
//             </ul>
//           </div>
//           {/* <div className="mt-2">
//           <FormCheck className="flex items-center">
//             <FormCheck.Input
//               id="checkbox-switch-4"
//               type="checkbox"
//               checked={accepted}
//               onChange={(e) => setAccepted(e.target.checked)}
//               className="mr-2"
//             />
//             <FormCheck.Label
//               htmlFor="checkbox-switch-4"
//               className="text-sm"
//             >
//               <strong>I accept the terms and conditions</strong>
//             </FormCheck.Label>
//           </FormCheck>
//         </div>
//         <div className="flex justify-end">
//           <Button
//             elevated
//             rounded
//             className=" mr-1 text-white bg-green-400"
//             disabled={spinner}
//             onClick={activateKavach}
//           >
//             <Lucide
//               icon="ShieldCheck"
//               className="text-white stroke-2.5 mr-1"
//             />
//             Activate
//             {spinner && (
//               <LoadingIcon
//                 icon="puff"
//                 color="white"
//                 className="w-5 h-5 ml-2 stroke-2.5 text-white"
//               />
//             )}
//           </Button>
//         </div> */}
//         </div>
//       }
//     </div>
//   )}
// </>;
