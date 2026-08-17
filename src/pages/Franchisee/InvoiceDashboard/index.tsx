import React, { useEffect, useState } from "react";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";
import clsx from "clsx";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import Table from "../../../base-components/Table";
import {
  getBAInvoiceDataApi,
  getBilledOutstandingApi,
  getCurrencyApi,
  getInvoiceDataApi,
  getSoftCreditApi,
  getUnbilledOutstandingApi,
  getUnbilledReportsApi,
  productTypesApi,
} from "../../../AllServices/config.service";
import LoadingIcon from "../../../base-components/LoadingIcon";
import {
  convertJSONtoCSV,
  convertJSONtoXLSX,
  downloadAttachment,
  formatDate,
  getTodayDate,
  indianFormat,
  indianFormat2,
} from "../../../utils";
import CommonPagination from "../Pagination";
import AnimatedCounter from "../AnimateCounter";
import CommonModal from "../../../components/CommonModal";
import Button from "../../../base-components/Button";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { FcMoneyTransfer } from "react-icons/fc";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";




import creadtICON from "../../../assets/images/creadt_report.png";
import creditlimitICON from "../../../assets/images/credit_limit.png";
import available_clICON from "../../../assets/images/available_credit_imit.png";
import invoice_arrowICON from "../../../assets/images/invoice_arrow.png";
import total_outstandingICON from "../../../assets/images/total_outstanding.png";

import billed_outstandingICON from "../../../assets/images/billed_outstanding.png";
import unbilled_outstandingICON from "../../../assets/images/unbilled_outstanding.png";
import { ExportToXLSX } from "../../../components/ExportToXLSX/ExportToXLSX";







const index = () => {
  const {
    franchiseeId,
    franchiseeName,
    availableCreditLimit,
    creditLimit,
    wallet,
    currencyId,
    isOverseas,
  } = useFranchisee();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [billedAmount, setBilledAmount] = useState<number>(0);
  const [unBilledAmount, setUnBilledAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [invoiceLoading, setInvoiceLoading] = useState<boolean>(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const [UnbilledData, setUnBilledData] = useState([]);
  const [downloadData, setDownloadData] = useState([])
  const [totalAmount, setTotalAmount] = useState(0);
  const [productTypes, setProductTypes] = useState([]);
  const [softCrData, setSoftCrData] = useState([]);
  const [softCreditTotal, setSoftCreditTotal] = useState(0);
  const [downloadSpinner, setDownloadSpinner] = useState({
    index: "",
    status: false,
  });
  const { showAlert } = useAlert();
  const [currencyData, setCurrencyData] = useState([]);

  const handlePagechange = (page: number) => {
    setPage(page);
  };

  const getData = async () => {
    setLoading(true);
    try {
      const res = await getBilledOutstandingApi(franchiseeId);
      const res1 = await getUnbilledOutstandingApi(franchiseeId);

      if (res?.status == 200) {
        setBilledAmount(Number(res?.data?.billed_outstandig));
      } else {
        setBilledAmount(0);
      }

      if (res1?.data?.status == 200) {
        setUnBilledAmount(Number(res1?.data?.total_amount));
      } else {
        setUnBilledAmount(0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getUnbilledReportData = async () => {
    try {
      const res = await getUnbilledReportsApi(franchiseeId);
      if (res?.data?.status == 200) {
        setUnBilledData(res?.data?.data);
        const total = res?.data?.data?.reduce(
          (acc: any, curr: any) => Number(acc) + Number(curr?.total_amount),
          0
        );
        setTotalAmount(total);
        const mappedData =
          res?.data?.data?.map((item: any) => ({
            airwaybill_no: item?.airwaybilno || "",
            date: formatDate(item?.booking_date || ""),
            amount: indianFormat2(Number(item?.total_amount || 0) || 0, isOverseas),
            vendor: productTypes.find((p: any) => p.product_id == item?.courier_id)?.product_name || "",
          })) || [];
        setDownloadData(mappedData || []);
      } else if (res?.status == 204) {
        setUnBilledData([]);
      } else {
        setUnBilledData([]);
      }
    } catch (error) { }
  };

  //   const getUnbilledReportData = async () => {
  //   try {
  //     const res = await getUnbilledReportsApi(franchiseeId);

  //     if (res?.status == 200) {
  //       const apiData = res?.data?.data;
  //       setUnBilledData(apiData);

  //       const total = apiData.reduce(
  //         (acc: number, curr: any) => acc + Number(curr?.total_amount || 0),
  //         0
  //       );
  //       setTotalAmount(total);
  //     // console.log("API raw responseHHHHHHHHHHHHH:", apiData);
  //       const mappedData = apiData?.map((item: any) => ({
  //         airwaybill_no: item?.airwaybilno || "",
  //         date: formatDate(item?.booking_date || ""),
  //         amount: Number(item?.total_amount)||0,
  //         vendor: productTypes.find((p: any) => p.product_id == item?.courier_id)?.product_name || "",
  //       }));
  //       console.log(mappedData, "mappedData");
  //       setDownloadData(mappedData);
  //     } else {
  //       setUnBilledData([]);
  //       setDownloadData([]);
  //     }
  //   } catch (error) {
  //     console.error("Unbilled report error:", error);
  //   }
  // };


  const handledownload = (data: any) => {
    if (!data || data.length === 0) {
      showAlert("No data available for download", "warning");
      return;
    }
    ExportToXLSX({
      tableData: data,
      leftAlignColumns: [
        "AIRWAYBILL NO",
        "VENDOR"
      ],
      centerAlignColumns: [
        "DATE",
      ],
      rightAlignColumns: [
        "AMOUNT"
      ],
      fileName: "Unbilled_Transactions"
    });
  };




  const getInvoiceData = async () => {
    setInvoiceLoading(true);
    try {
      const res = await getBAInvoiceDataApi(page - 1, 20, franchiseeId);
      if (res?.status == 200) {
        setInvoiceData(res?.data?.data);
        setTotalPages(res.data.pages || 0);
      } else if (res?.status == 204) {
        setInvoiceData([]);
        setTotalPages(0);
      } else {
        setInvoiceData([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const getProductData = async () => {
    try {
      const response: any = await productTypesApi();
      if (response?.status == 200) {
        setProductTypes(response?.data?.data);
      } else {
        setProductTypes([]);
      }
    } catch (err: any) {
      showAlert(err?.message, "error");
    }
  };
  const getSoftCreditData = async () => {
    try {
      const response: any = await getSoftCreditApi(franchiseeId);
      if (response?.status == 200) {
        setSoftCrData(response?.data || {});
        const total = response?.data?.data_list?.reduce(
          (acc: any, curr: any) => Number(acc) + Number(curr?.credit_amount),
          0
        );
        setSoftCreditTotal(total || 0);
      } else {
        setSoftCrData({});
      }
    } catch (err: any) {
      showAlert(err?.message, "error");
    }
  };

  const formatData = (data: any) => {
    if (!(data?.length > 0)) {
      showAlert("No data available for download", "warning");
      return;
    }
    return data?.map((data: any, index: number) => ({
      Airwaybill: data?.airwaybilno || "N.A.",
      Date: formatDate(data?.booking_date) || "N.A.",
      Amount: indianFormat(data?.total_amount) || "N.A.",
      Vendor:
        productTypes.find((item) => item.product_id == data?.courier_id)
          ?.product_name || "N.A.",
      "Franchisee Name": franchiseeName || "N.A.",
      Status: "Unbilled",
    }));
  };
  const formatData2 = (data: any) => {
    if (!(data?.length > 0)) {
      showAlert("No data available for download", "warning");
      return;
    }
    return data?.map((data: any, index: number) => ({
      airway_bill_no: data?.airway_bill_no || "N.A.",
      booking_date: formatDate(data?.booking_date).split(",")[0] || "N.A.",
      credit_amount: indianFormat2(Number(data?.credit_amount || 0) || 0, isOverseas),
      approved_date: formatDate(data?.approved_date).split(",")[0] || "N.A.",
    }));
  };

  const handledownload2 = () => {
    const formatted = formatData2(softCrData?.data_list);

    if (!formatted) return;

    ExportToXLSX({
      tableData: formatted,
      leftAlignColumns: ["AIRWAY BILL NO"],
      centerAlignColumns: ["BOOKING DATE", "APPROVED DATE"],
      rightAlignColumns: ["CREDIT AMOUNT"],
      fileName: "Temporary_Credit_Report"
    });
  };

  const downloadExcel = async (invoiceNo: any) => {
    try {
      const res = await getInvoiceDataApi(invoiceNo);
      if (res?.status == 200) {
        convertJSONtoXLSX(
          res?.data?.data,
          `Invoice_Summary_${getTodayDate()}.xlsx`
        );
      } else if (res?.status == 204) {
        showAlert("No Data Available", "warning");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch {
      showAlert("Something went wrong", "error");
    } finally {
      setDownloadSpinner({ index: "", status: false });
    }
  };

  const ModalDescription = (
    <>
      {UnbilledData?.length > 0 ? (
        <div className="overflow-x-auto overflow-y-auto h-[40vh]">
          <Table className="table table-text-small mb-0 border">
            <Table.Thead
              variant="dark"
              className="thead-primary table-sorting bg-mustard"
            >
              <Table.Tr className="text-center ">
                <Table.Th className="whitespace-nowrap border">SR.NO.</Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  AIRWAYBILL NO
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">DATE</Table.Th>
                <Table.Th className="whitespace-nowrap border">AMOUNT (₹)</Table.Th>
                <Table.Th className="whitespace-nowrap border">VENDOR</Table.Th>
                {/* <Table.Th className="whitespace-nowrap border">STATUS</Table.Th> */}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {UnbilledData?.map((data, index) => (
                <Table.Tr
                  key={index}
                  className={`text-left intro-x ${index % 2 === 1 ? "bg-yellow-50" : ""
                    } hover:bg-yellow-100`}
                >
                  <Table.Td className="border whitespace-nowrap">
                    {index + 1}.
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.airwaybilno || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {formatDate(data?.booking_date) || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap text-right">
                    {indianFormat(Number(data?.total_amount)) || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {productTypes.find(
                      (item) => item.product_id == data?.courier_id
                    )?.product_name || "-"}
                  </Table.Td>
                  {/* <Table.Td className="border whitespace-nowrap">
                    Unbilled
                  </Table.Td> */}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      ) : (
        <p className="text-gray-400 text-center">No Data Found!</p>
      )}

      {UnbilledData?.length > 0 && (
        <div className="flex justify-center p-2 shadow-lg rounded items-center mt-2 border border-gray-200 w-full col-span-12">
          <span className="font-medium text-black mr-2">Total Amount (₹) : </span>
          <span>{indianFormat(totalAmount)}</span>
        </div>
      )}
    </>
  );

  const ModalDescription2 = (
    <>
      {softCrData?.data_list?.length > 0 ? (
        <div className="overflow-x-auto overflow-y-auto h-[40vh]">
          <Table className="table table-text-small mb-0 border">
            <Table.Thead
              variant="dark"
              className="thead-primary table-sorting bg-mustard"
            >
              <Table.Tr className="text-center ">
                <Table.Th className="whitespace-nowrap border">
                  SR. NO.
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  AIRWAY BILL NO
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  CREDIT AMOUNT
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  APPROVAL DATE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  BOOKING DATE
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody className="text-center">
              {softCrData?.data_list?.map((item: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td className="border">{index + 1}</Table.Td>
                  <Table.Td className="border">
                    {item?.airway_bill_no || ""}
                  </Table.Td>
                  <Table.Td className="border">
                    {item?.credit_amount || 0}
                  </Table.Td>
                  <Table.Td className="border">
                    {formatDate(item?.approved_date)?.split(",")[0] || ""}
                  </Table.Td>
                  <Table.Td className="border">
                    {formatDate(item?.booking_date)?.split(",")[0] || ""}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      ) : (
        <p className="text-gray-400 text-center">No Data Found!</p>
      )}
      <div>
        {softCrData?.data_list?.length > 0 && (
          <div className="flex justify-center p-2 shadow-lg rounded items-center mt-2 border border-gray-200 w-full col-span-12">
            <span className="font-medium text-black mr-2">Total Amount : </span>
            <span>{indianFormat(softCreditTotal)}</span>
          </div>
        )}
      </div>
    </>
  );

  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    if (productTypes.length > 0) {
      getUnbilledReportData();
    }
  }, [productTypes]);

  useEffect(() => {
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data));
    getData();
    // getProductData();
    getSoftCreditData();
    // getUnbilledReportData();
  }, []);

  useEffect(() => {
    getInvoiceData();
  }, [page]);

  return (
    <>

      <div className="mt-3  w-full pt-4  px-3 bg-white rounded-lg ">
        <div className="grid grid-cols-12 gap-[7px] w-full ">
          <div className="col-span-12 lg:col-span-2">
            <div className=" relative w-full pt-0 lg:pt-3">
              <h2 className=" relative  font-bold text-lg text-[#464646] leading-[21px] inline-block">
                {" "}
                INVOICE <br className="hidden lg:inline-block" /> DASHBOARD
                <style>
                  {`
      @keyframes leftRight {
        0%, 100% {
          transform: translateX(0);
        }
        50% {
          transform: translateX(5px);
        }
      }

      .animate-left-right {
        animation: leftRight 1.5s ease-in-out infinite;
      }
    `}
                </style>
                <i className="absolute right-[-30px] top-[-14px] hidden lg:block animate-left-right">
                  <img src={invoice_arrowICON} alt="" />
                </i>
              </h2>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-10">
            <div className="grid grid-cols-12 gap-[10px] w-full">

              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <div
                // onClick={() => {
                //   if (softCrData?.data_list?.length > 0) {
                //     setOpen(true);
                //   } else {
                //     showAlert("No Data Found!", "warning");
                //     setOpen(false);
                //   }
                // }}
                >

                  <div className="w-full  border-[#D4DCE4] border overflow-hidden relative   rounded-lg p-1 mb-3   bg-gradient-to-t from-[#fff] via-[#fff] to-[#F4F4F6] min-h-[75px] group hover:bg-gradient-to-t hover:from-[#fff] hover:via-[#fff] hover:to-[#fefbf4]  hover:border-[#fbe3ad]">
                    <div className=" border-[#E5E5E5] border-b w-full flex px-1 pb-1 pt-[2px] items-center group-hover:border-[#fdf2da]">
                      <i>
                        <img src={creadtICON} alt="" />
                      </i>
                      <h2 className="text-[#34773B] text-[15px] font-medium ml-2 uppercase leading-[20px] group-hover:text-[#c48d13]">
                        Temporary Credit
                      </h2>
                    </div>


                    <div className="flex justify-between w-full px-1 pt-2 pb-1 items-center">
                      <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">
                        <span className="">
                          {isOverseas && currencyId
                            ? `(${(
                              currencyData?.find(
                                (item) => item?.id == currencyId
                              ) ?? currencyData?.find((item) => item?.id == 24)
                            )?.symbol || " "
                            })`
                            : "₹"}{" "}
                          {indianFormat(Number(softCrData?.total_credit_amount || 0))}
                        </span>




                      </div>

                      <div className="inline-block">
                        <div className="ml-auto bg-[#ecd58a]  relative p-[1px] overflow-hidden rounded-[80px] border border-[#ecb913] before:content-[''] before:z-0 before:absolute before:top-1/2 before:left-1/2 before:w-[99999px] before:h-[99999px] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)] before:bg-no-repeat before:bg-[0_0] before:animate-[rotate_4s_linear_infinite] after:content-[''] after:absolute after:z-[-1] after:left-[3px] after:top-[3px] after:w-[calc(100%-6px)] after:h-[calc(100%-6px)] after:bg-white after:rounded-[57px] hover:bg-[#e8e8e8] hover:border-[#d0d0d0] hover:before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)]">

                          {softCrData?.data_list?.length > 0 && (
                            <button onClick={() => {
                              if (softCrData?.data_list?.length > 0) {
                                setOpen(true);
                              } else {
                                showAlert("No Data Found!", "warning");
                                setOpen(false);
                              }
                            }} className=" bg-[linear-gradient(0deg,#fbd479_0%,#a06f00_100%)] border-[1px] border-[#bb9414] relative z-10 duration-200 inline-flex items-center justify-center cursor-pointer text-[#fff] text-[12px] font-bold py-[0px] px-[10px] rounded-[80px] transition uppercase hover:bg-[linear-gradient(0deg,#fdfdfd_0%,#a6a6a6_100%)] hover:text-[#303030] hover:border-[#c2c2c2]">
                              Transactions
                            </button>
                          )}
                        </div>
                      </div>

                      {/* <div className="inline-block">
                      <div className="ml-auto bg-[#ecd58a]  relative p-[1px] overflow-hidden rounded-[80px] border border-[#ecb913] before:content-[''] before:z-0 before:absolute before:top-1/2 before:left-1/2 before:w-[99999px] before:h-[99999px] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)] before:bg-no-repeat before:bg-[0_0] before:animate-[rotate_4s_linear_infinite] after:content-[''] after:absolute after:z-[-1] after:left-[3px] after:top-[3px] after:w-[calc(100%-6px)] after:h-[calc(100%-6px)] after:bg-white after:rounded-[57px] hover:bg-[#e8e8e8] hover:border-[#d0d0d0] hover:before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)]">
                        <button className=" bg-[linear-gradient(0deg,#fbd479_0%,#a06f00_100%)] border-[1px] border-[#bb9414] relative z-10 duration-200 inline-flex items-center justify-center cursor-pointer text-[#fff] text-[12px] font-bold py-[0px] px-[10px] rounded-[80px] transition uppercase hover:bg-[linear-gradient(0deg,#fdfdfd_0%,#a6a6a6_100%)] hover:text-[#303030] hover:border-[#c2c2c2]">
                          Report
                        </button>
                      </div>
                    </div> */}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <div className="w-full  border-[#D4DCE4] border   rounded-lg p-1 mb-3   bg-gradient-to-t from-[#fff] via-[#fff] to-[#F4F4F6] min-h-[75px] group hover:bg-gradient-to-t hover:from-[#fff] hover:via-[#fff] hover:to-[#fefbf4]  hover:border-[#fbe3ad]">
                  <div className=" border-[#E5E5E5] border-b w-full flex px-1 pb-1 pt-[2px] items-center group-hover:border-[#fdf2da]">
                    <i>
                      <img src={creditlimitICON} alt="" />
                    </i>
                    <h2 className="text-[#8E6E23] text-[15px] font-medium ml-2 uppercase leading-[20px] group-hover:text-[#c48d13]">
                      Credit Limit
                    </h2>
                  </div>

                  <div className="flex justify-between w-full px-1 pt-2 pb-1 items-center">
                    <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">

                      <span className="">
                        {isOverseas && currencyId
                          ? `(${(
                            currencyData?.find(
                              (item) => item?.id == currencyId
                            ) ?? currencyData?.find((item) => item?.id == 24)
                          )?.symbol || " "
                          })`
                          : "₹"}{" "}
                        {indianFormat(wallet)}
                      </span>

                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <div className="w-full  border-[#D4DCE4] border   rounded-lg p-1 mb-3   bg-gradient-to-t from-[#fff] via-[#fff] to-[#F4F4F6] min-h-[75px] group hover:bg-gradient-to-t hover:from-[#fff] hover:via-[#fff] hover:to-[#fefbf4]  hover:border-[#fbe3ad]">
                  <div className=" border-[#E5E5E5] border-b w-full flex px-1 pb-1 pt-[2px] items-center group-hover:border-[#fdf2da]">
                    <i>
                      <img src={available_clICON} alt="" />
                    </i>
                    <h2 className="text-[#3B5977] text-[15px] font-medium ml-2 uppercase leading-[20px] group-hover:text-[#c48d13]">
                      Available Credit Limit
                    </h2>
                  </div>

                  <div className="flex justify-between w-full px-1 pt-2 pb-1 items-center">
                    <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">
                      <span className="">
                        {isOverseas && currencyId
                          ? `(${(
                            currencyData?.find(
                              (item) => item?.id == currencyId
                            ) ?? currencyData?.find((item) => item?.id == 24)
                          )?.symbol || " "
                          })`
                          : "₹"}{" "}
                        {indianFormat(availableCreditLimit)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="min-[730px]:flex justify-between border-b-2 mb-2 mt-5 w-full pb-2 ">
        <div className=" min:[550px]:flex items-center justify-center">
          <span className={`mr-auto text-2xl text-primary font-bold `}>
            INVOICE DASHBOARD
          </span>
        </div>
        <div className="min:[550px]:flex">
          <div className="flex md:items-center flex-col md:flex-row">
           
            <div
              className="flex items-center bg-gray-100 p-2 rounded-lg shadow-sm mx-2 cursor-pointer"
              onClick={() => {
                if (softCrData?.data_list?.length > 0) {
                  setOpen(true);
                } else {
                  showAlert("No Data Found!", "warning");
                  setOpen(false);
                }
              }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                <Lucide icon="CreditCard" className="text-green-400" />
              </div>
              <div className="ml-4 text-center">
                <span className="block font-bold text-2xl text-green-600">
                  {indianFormat(Number(softCrData?.total_credit_amount || 0))}{" "}
                  {isOverseas && currencyId
                    ? `(${(
                      currencyData?.find(
                        (item) => item?.id == currencyId
                      ) ?? currencyData?.find((item) => item?.id == 24)
                    )?.symbol || " "
                    })`
                    : "₹"}
                </span>
                <h2 className="text-gray-700">Temp Credit</h2>
              </div>
            </div>


            <div className="w-px h-12 bg-gray-300 mx-4 hidden md:block"></div>
            <div className="flex items-center bg-gray-100 p-2 rounded-lg shadow-sm mx-2">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                <Lucide icon="Landmark" className="text-green-400" />
              </div>
              <div className="ml-4 text-center">
                <span className="block font-bold text-2xl text-green-600">
                  {indianFormat(wallet)}{" "}
                  {isOverseas && currencyId
                    ? `(${(
                      currencyData?.find(
                        (item) => item?.id == currencyId
                      ) ?? currencyData?.find((item) => item?.id == 24)
                    )?.symbol || " "
                    })`
                    : "₹"}
                </span>
                <h2 className="text-gray-700">Credit Limit</h2>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-300 mx-4 hidden md:block"></div>
            <div className="flex items-center bg-gray-100 p-2 rounded-lg shadow-sm mx-2">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                <p className="text-green-400 text-2xl">
                  {isOverseas && currencyId
                    ? `${(
                      currencyData?.find(
                        (item) => item?.id == currencyId
                      ) ?? currencyData?.find((item) => item?.id == 24)
                    )?.symbol || " "
                    }`
                    : "₹"}
                </p>
              </div>
              <div className="ml-4 text-center">
                <span className="block font-bold text-2xl text-green-600">
                  {indianFormat(availableCreditLimit)}{" "}
                  {isOverseas && currencyId
                    ? `(${(
                      currencyData?.find(
                        (item) => item?.id == currencyId
                      ) ?? currencyData?.find((item) => item?.id == 24)
                    )?.symbol || " "
                    })`
                    : "₹"}
                </span>
                <h2 className="text-gray-700">Available Credit Limit</h2>
              </div>
            </div>
          </div>
        </div>
      </div> */}










      <div className="  w-full pt-4 ">
        <div className="grid grid-cols-12 gap-[7px] w-full">
          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <div className="w-full  border-[#D4DCE4] border   rounded-lg p-1 mb-3   bg-gradient-to-t from-[#fff] via-[#fff] to-[#F4F4F6] min-h-[80px] group hover:bg-gradient-to-t hover:from-[#fff] hover:via-[#fff] hover:to-[#fefbf4]  hover:border-[#fbe3ad]">
              <div className=" border-[#E5E5E5] border-b w-full flex px-1 pb-1 pt-[2px] items-center group-hover:border-[#fdf2da] min-h-[33px]">
                <i>
                  <img src={total_outstandingICON} alt="" />
                </i>
                <h2 className="text-[#515151] text-[16px] font-medium ml-2 uppercase leading-[20px] group-hover:text-[#c48d13]">
                  Total Outstanding
                </h2>
              </div>

              <div className="flex justify-between w-full px-1 pt-2 pb-1 items-center">
                <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">

                  {/* {loading ? (
                    <span>
                      {isOverseas && currencyId
                        ? `${(
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                        }`
                        : "₹"}{" "}
                      {Number(0)?.toFixed(2)}
                    </span>
                  ) : (
                    <span className="flex ">
                      {isOverseas && currencyId
                        ? `${(
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                        }`
                        : "₹"}{" "}
                      <AnimatedCounter
                        value={Number(billedAmount) + Number(unBilledAmount)}
                      />
                    </span>
                  )} */}

                  {loading ? (
                    <span className="text-gray-400 text-sm animate-pulse">
                      Loading...
                    </span>
                  ) : (
                    <span className="flex">
                      {isOverseas && currencyId
                        ? `${(
                          currencyData?.find((item) => item?.id == currencyId) ??
                          currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "}`
                        : "₹"}{" "}
                      <AnimatedCounter
                        value={Number(billedAmount) + Number(unBilledAmount)}
                      />
                    </span>
                  )}

                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <div className="w-full  border-[#D4DCE4] border   rounded-lg p-1 mb-3   bg-gradient-to-t from-[#fff] via-[#fff] to-[#F4F4F6] min-h-[80px] group hover:bg-gradient-to-t hover:from-[#fff] hover:via-[#fff] hover:to-[#fefbf4]  hover:border-[#fbe3ad]">
              <div className=" border-[#E5E5E5] border-b w-full flex px-1 pb-1 pt-[2px] items-center group-hover:border-[#fdf2da] min-h-[33px]">
                <i>
                  <img src={billed_outstandingICON} alt="" />
                </i>
                <h2 className="text-[#515151] text-[16px] font-medium ml-2 uppercase leading-[20px] group-hover:text-[#c48d13]">
                  Billed Outstanding
                </h2>
              </div>

              <div className="flex justify-between w-full px-1 pt-2 pb-1 items-center">
                <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">
                  {/* {billedAmount ? (
                    <span className="flex">
                      {isOverseas && currencyId
                        ? `${(
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                        }`
                        : "₹"}{" "}
                      <AnimatedCounter value={billedAmount} />
                    </span>
                  ) : (
                    <>
                      {isOverseas && currencyId
                        ? `${(
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                        }`
                        : "₹"}{" "}
                      {Number(0)?.toFixed(2)}
                    </>
                  )} */}

                  {loading ? (
                    <span className="text-gray-400 text-sm animate-pulse">
                      Loading...
                    </span>
                  ) : billedAmount ? (
                    <span className="flex">
                      {isOverseas && currencyId
                        ? `${(
                          currencyData?.find((item) => item?.id == currencyId) ??
                          currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "}`
                        : "₹"}{" "}
                      <AnimatedCounter value={billedAmount} />
                    </span>
                  ) : (
                    <span>
                      {isOverseas && currencyId
                        ? `${(
                          currencyData?.find((item) => item?.id == currencyId) ??
                          currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "}`
                        : "₹"}{" "}
                      0.00
                    </span>
                  )}
                </div>

                <div className="inline-block">


                  <div className="flex">

                    {billedAmount > 0 && !loading ? (
                      <div
                        className="
    ml-auto bg-[#ecd58a] paybtnn relative p-[1px] inline-block overflow-hidden 
    rounded-[80px] border border-[#ecb913]

    before:content-[''] before:z-0 before:absolute 
    before:top-1/2 before:left-1/2
    before:w-[99999px] before:h-[99999px]
    before:-translate-x-1/2 before:-translate-y-1/2
    before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)]
    before:bg-no-repeat before:bg-[0_0]
    before:animate-[rotate_4s_linear_infinite]

    after:content-[''] after:absolute after:z-[-1]
    after:left-[3px] after:top-[3px]
    after:w-[calc(100%-6px)] after:h-[calc(100%-6px)]
    after:bg-white after:rounded-[57px]

    hover:bg-[#e8e8e8]
    hover:border-[#d0d0d0]
    hover:before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)]
  "
                      >
                        <Link to="/franchisee/franchisee_wallet_recharge">
                          <Button
                            className="
        bg-[linear-gradient(0deg,#fbd479_0%,#a06f00_100%)]
        border-[2px] border-[#bb9414]
        relative z-10 duration-200 inline-flex items-center justify-center cursor-pointer
        text-[#fff] text-[12px] font-bold py-[0px] px-[6px]
        rounded-[80px] transition uppercase

        hover:bg-yellow-250
        hover:bg-[linear-gradient(0deg,#fdfdfd_0%,#a6a6a6_100%)]
        hover:text-[#303030] hover:border-[#c2c2c2]
      "
                          >
                            PAY NOW{" "}
                            <i className="bg-[#fff] rounded-full p-[1px] w-[15px] h-[15px] ml-[5px] mt-[-1px]">
                              <ArrowRight className="w-[13px] h-[13px] text-[#bb9414]" />
                            </i>
                          </Button>
                        </Link>
                      </div>
                    ) : null}
                  </div>













                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-4">
            <div className="w-full  border-[#D4DCE4] border   rounded-lg p-1 mb-3   bg-gradient-to-t from-[#fff] via-[#fff] to-[#F4F4F6] min-h-[80px] group hover:bg-gradient-to-t hover:from-[#fff] hover:via-[#fff] hover:to-[#fefbf4]  hover:border-[#fbe3ad]">
              <div className=" border-[#E5E5E5] border-b w-full flex px-1 pb-1 pt-[2px] items-center group-hover:border-[#fdf2da] min-h-[33px]">
                <i>
                  <img src={unbilled_outstandingICON} alt="" />
                </i>
                <h2 className="text-[#515151] text-[16px] font-medium ml-2 uppercase leading-[20px] group-hover:text-[#c48d13]">
                  Unbilled Outstanding
                </h2>
              </div>

              <div className="flex justify-between w-full px-1 pt-2 pb-1 items-center">
                <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">
                  {/* {unBilledAmount ? (
                    <span className="flex">
                      {isOverseas && currencyId
                        ? `${(
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                        }`
                        : "₹"}{" "}
                      <AnimatedCounter value={unBilledAmount} />
                    </span>
                  ) : (
                    <>
                      {isOverseas && currencyId
                        ? `${(
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                        }`
                        : "₹"}{" "}
                      {Number(0)?.toFixed(2)}
                    </>
                  )} */}

                  {loading ? (
                    <span className="text-gray-400 text-sm animate-pulse">
                      Loading...
                    </span>
                  ) : unBilledAmount ? (
                    <span className="flex">
                      {isOverseas && currencyId
                        ? `${(
                          currencyData?.find((item) => item?.id == currencyId) ??
                          currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "}`
                        : "₹"}{" "}
                      <AnimatedCounter value={unBilledAmount} />
                    </span>
                  ) : (
                    <span>
                      {isOverseas && currencyId
                        ? `${(
                          currencyData?.find((item) => item?.id == currencyId) ??
                          currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "}`
                        : "₹"}{" "}
                      0.00
                    </span>
                  )}
                </div>

                <div className="inline-block">
                  <div className="ml-auto bg-[#ecd58a]  relative p-[1px] overflow-hidden rounded-[80px] border border-[#ecb913] before:content-[''] before:z-0 before:absolute before:top-1/2 before:left-1/2 before:w-[99999px] before:h-[99999px] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)] before:bg-no-repeat before:bg-[0_0] before:animate-[rotate_4s_linear_infinite] after:content-[''] after:absolute after:z-[-1] after:left-[3px] after:top-[3px] after:w-[calc(100%-6px)] after:h-[calc(100%-6px)] after:bg-white after:rounded-[57px] hover:bg-[#e8e8e8] hover:border-[#d0d0d0] hover:before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)]">


                    <button onClick={() => setOpenModal(true)} className=" bg-[linear-gradient(0deg,#fbd479_0%,#a06f00_100%)] border-[1px] border-[#bb9414] relative z-10 duration-200 inline-flex items-center justify-center cursor-pointer text-[#fff] text-[12px] font-bold py-[0px] px-[10px] rounded-[80px] transition uppercase hover:bg-[linear-gradient(0deg,#fdfdfd_0%,#a6a6a6_100%)] hover:text-[#303030] hover:border-[#c2c2c2]">
                      Transactions
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>














      <div className="grid min-[730px]:grid-cols-3  gap-6 mt-5 hidden">
        <div className="col-span-1 ">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
            ])}
          >
            <div className="p-5 box">
              <div className="flex">
                <Lucide
                  icon="FileText"
                  className="w-[28px] h-[28px] text-danger"
                />
                <div className="ml-auto">
                  <Tippy
                    as="div"
                    className="bg-danger p-[10px] flex rounded-full text-white text-xs  items-center font-medium"
                    content="Total Outstanding"
                  >
                    {/* <Lucide icon="ChevronUp" className="w-4 h-4 ml-0.5" /> */}
                  </Tippy>
                </div>
              </div>
              <div className="mt-6 text-3xl font-medium leading-8">
                {loading ? (
                  <span>
                    {isOverseas && currencyId
                      ? `${(
                        currencyData?.find(
                          (item) => item?.id == currencyId
                        ) ?? currencyData?.find((item) => item?.id == 24)
                      )?.symbol || " "
                      }`
                      : "₹"}{" "}
                    {Number(0)?.toFixed(2)}
                  </span>
                ) : (
                  <span className="flex gap-2">
                    {isOverseas && currencyId
                      ? `${(
                        currencyData?.find(
                          (item) => item?.id == currencyId
                        ) ?? currencyData?.find((item) => item?.id == 24)
                      )?.symbol || " "
                      }`
                      : "₹"}{" "}
                    <AnimatedCounter
                      value={Number(billedAmount) + Number(unBilledAmount)}
                    />
                  </span>
                )}
              </div>
              <div className="mt-1 text-base text-slate-500">
                Total Outstanding
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1  ">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
            ])}
          >
            <div className="p-5 box">
              <div className="flex">
                <Lucide
                  icon="CreditCard"
                  className="w-[28px] h-[28px] text-pending"
                />
                {billedAmount > 0 ? (
                  <div
                    className="
    ml-auto bg-[#ecd58a] paybtnn relative p-[1px] inline-block overflow-hidden 
    rounded-[80px] border border-[#ecb913]

    before:content-[''] before:z-0 before:absolute 
    before:top-1/2 before:left-1/2
    before:w-[99999px] before:h-[99999px]
    before:-translate-x-1/2 before:-translate-y-1/2
    before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)]
    before:bg-no-repeat before:bg-[0_0]
    before:animate-[rotate_4s_linear_infinite]

    after:content-[''] after:absolute after:z-[-1]
    after:left-[3px] after:top-[3px]
    after:w-[calc(100%-6px)] after:h-[calc(100%-6px)]
    after:bg-white after:rounded-[57px]

    hover:bg-[#e8e8e8]
    hover:border-[#d0d0d0]
    hover:before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)]
  "
                  >
                    <Link to="/franchisee/franchisee_wallet_recharge">
                      <Button
                        className="
        bg-[linear-gradient(0deg,#fbd479_0%,#a06f00_100%)]
        border-[2px] border-[#bb9414]
        relative z-10 duration-200 inline-flex items-center justify-center cursor-pointer
        text-[#fff] text-[13px] font-bold py-[4px] px-[10px]
        rounded-[80px] transition uppercase

        hover:bg-yellow-250
        hover:bg-[linear-gradient(0deg,#fdfdfd_0%,#a6a6a6_100%)]
        hover:text-[#303030] hover:border-[#c2c2c2]
      "
                      >
                        PAY NOW{" "}
                        <i className="bg-[#fff] rounded-full p-[1px] w-[18px] h-[18px] ml-[5px]">
                          <ArrowRight className="w-[15px] h-[15px] text-[#bb9414]" />
                        </i>
                      </Button>
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className="mt-6 text-3xl font-medium leading-8">
                {billedAmount ? (
                  <span className="flex gap-2">
                    {isOverseas && currencyId
                      ? `${(
                        currencyData?.find(
                          (item) => item?.id == currencyId
                        ) ?? currencyData?.find((item) => item?.id == 24)
                      )?.symbol || " "
                      }`
                      : "₹"}{" "}
                    <AnimatedCounter value={billedAmount} />
                  </span>
                ) : (
                  <>
                    {isOverseas && currencyId
                      ? `${(
                        currencyData?.find(
                          (item) => item?.id == currencyId
                        ) ?? currencyData?.find((item) => item?.id == 24)
                      )?.symbol || " "
                      }`
                      : "₹"}{" "}
                    {Number(0)?.toFixed(2)}
                  </>
                )}
              </div>
              <div className="mt-1 text-base text-slate-500">
                Billed Outstanding
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 ">
          <div
            className={clsx([
              "relative zoom-in",
              "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70 cursor-pointer",
            ])}
          >
            <div className="p-5 box" onClick={() => setOpenModal(true)}>
              <div className="flex">
                <Lucide
                  icon="Clipboard"
                  className="w-[28px] h-[28px] text-success"
                />
                <div className="ml-auto">
                  <Tippy
                    as="div"
                    className="cursor-pointer bg-success p-[10px] flex rounded-full text-red text-xs  items-center font-medium"
                    content="Unbilled outstanding"
                  >
                    {/* 12% <Lucide icon="ChevronUp" className="w-4 h-4 ml-0.5" /> */}
                  </Tippy>
                </div>
              </div>
              <div className="mt-6 text-3xl font-medium leading-8">
                {unBilledAmount ? (
                  <span className="flex gap-2">
                    {isOverseas && currencyId
                      ? `${(
                        currencyData?.find(
                          (item) => item?.id == currencyId
                        ) ?? currencyData?.find((item) => item?.id == 24)
                      )?.symbol || " "
                      }`
                      : "₹"}{" "}
                    <AnimatedCounter value={unBilledAmount} />
                  </span>
                ) : (
                  <>
                    {isOverseas && currencyId
                      ? `${(
                        currencyData?.find(
                          (item) => item?.id == currencyId
                        ) ?? currencyData?.find((item) => item?.id == 24)
                      )?.symbol || " "
                      }`
                      : "₹"}{" "}
                    {Number(0)?.toFixed(2)}
                  </>
                )}
              </div>
              <div className="mt-1 text-base text-slate-500">
                Unbilled Outstanding
              </div>
            </div>
          </div>
        </div>
      </div>




      <div className="mt-0">
        <h2 className="font-bold text-lg">INVOICE LISTING</h2>
      </div>

      <div className="mt-2  w-full py-3  px-3 bg-white rounded-lg shadow-lg">
        {invoiceData?.length > 0 ? (
          <div className="flex mb-2 gap-2 overflow-auto">
            <div className="px-5 py-2 rounded-xl bg-blue-200 mt-1">
              ADDITIONAL
            </div>

            <div className="px-5 py-2 rounded-xl bg-yellow-100 mt-1">
              CREDIT NOTE
            </div>

            <div className="px-5 py-2 rounded-xl bg-purple-200 mt-1">
              DEBIT NOTE
            </div>
            <div className="px-5 py-2 rounded-xl bg-red-300 mt-1">VOID</div>
          </div>
        ) : (
          <></>
        )}

        {invoiceData?.length > 0 ? (
          <div className="overflow-auto">
            <Table className="table table-text-small mb-0 border">
              <Table.Thead
                variant="dark"
                className="thead-primary table-sorting bg-mustard"
              >
                <Table.Tr className="text-center ">
                  <Table.Th className="whitespace-nowrap border">SR.NO.</Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    INVOICE NO.
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-center">
                    INVOICE DATE
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    INVOICE AMOUNT{" "}
                    {isOverseas && currencyId
                      ? `(${(
                        currencyData?.find(
                          (item) => item?.id == currencyId
                        ) ?? currencyData?.find((item) => item?.id == 24)
                      )?.symbol || " "
                      })`
                      : "(₹)"}
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    DOCUMENT
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    INVOICE SUMMARY
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody className="text-left">
                {invoiceData?.map((item?: any, index: number) => (
                  <Table.Tr
                    key={index}
                    className={`${item?.is_void === 1
                      ? "bg-red-300"
                      : item?.inv_type === 2
                        ? "bg-yellow-100"
                        : item?.inv_type === 3
                          ? "bg-blue-200"
                          : item?.inv_type === 4
                            ? "bg-purple-200"
                            : ""
                      }`}
                  >
                    <Table.Td className="text-right border">
                      {(page - 1) * 20 + 1 + index}.
                    </Table.Td>
                    <Table.Td className="text-left border">
                      {`${item?.bill_no}  (${item?.invoice_type == 4 ? "Cargo" : "Courier"
                        })`}
                    </Table.Td>
                    <Table.Td className="border text-center">
                      {item.invoice_date}
                    </Table.Td>
                    <Table.Td className="text-right border">
                      {item?.total_grandtotal}
                    </Table.Td>
                    <Table.Td className="">
                      <Lucide
                        icon="File"
                        className="cursor-pointer h-5 block text-center w-[100%]"
                        onClick={() =>
                          downloadAttachment(
                            isOverseas == 1
                              ? item?.currency_invoice_pdf
                              : item?.invoice_pdf || item?.invoice_pdf,
                            "invoice"
                          )
                        }
                      />
                    </Table.Td>
                    <Table.Td className="text-center ">
                      <Button
                        className="p-2 text-white "
                        variant="success"
                        onClick={() => {
                          setDownloadSpinner({ index: index, status: true });
                          downloadExcel(item?.bill_id);
                        }}
                      >
                        <Lucide icon="Download" className="mr-2" /> Download
                        {downloadSpinner?.status &&
                          index == downloadSpinner?.index && (
                            <LoadingIcon
                              icon="puff"
                              color="white"
                              className="w-5 h-5 ml-2 stroke-2.5 text-white"
                            />
                          )}
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        ) : invoiceLoading ? (
          <LoadingIcon icon="tail-spin" className="block m-auto w-[4%] " />
        ) : (
          <div className="mt-4">
            <p className="text-gray-400 text-center">No Data Found!</p>
          </div>
        )}

        {invoiceData?.length > 0 && (
          <CommonPagination
            totalpages={totalpages}
            onPageChange={handlePagechange}
            page={page}
          />
        )}

        {openModal && (
          <CommonModal
            open={openModal}
            setOpen={setOpenModal}
            title={"Unbilled Transactions"}
            description={ModalDescription}
            footer={
              <>
                {UnbilledData?.length > 0 && (
                  <div>
                    <Button
                      onClick={() => {

                        handledownload(downloadData || [])
                      }}
                      className="p-2 text-white"
                      variant="success"
                    >
                      <Lucide icon="Download" className="mr-2" /> Download
                    </Button>
                  </div>
                )}
              </>
            }
            gridColumns={1}
            size={"xl"}
          />
        )}

        {open && (
          <CommonModal
            open={open}
            setOpen={setOpen}
            title={"Temporary Credit Report"}
            description={ModalDescription2}
            footer={
              <>
                {softCrData?.data_list?.length > 0 && (
                  <div>
                    <Button
                      // onClick={() => {
                      // const formatted = formatData2(softCrData?.data_list);
                      // if (formatted) {
                      //   convertJSONtoCSV(
                      //     formatted,
                      //     `Temporary_Credit_Report_${getTodayDate()}.csv`
                      //   );
                      // }
                      // }}
                      onClick={() => handledownload2()}
                      className="p-2 text-white"
                      variant="success"
                    >
                      <Lucide icon="Download" className="mr-2" /> Download
                    </Button>
                  </div>
                )}
              </>

            }
            gridColumns={1}
            size={"xl"}
          />

        )}
      </div>
    </>
  );
};

export default index;