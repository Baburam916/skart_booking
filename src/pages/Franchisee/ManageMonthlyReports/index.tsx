import React, { useState, useEffect } from "react";
import Table from "../../../base-components/Table";
import { FormInput, FormLabel } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import Button from "../../../base-components/Button";
import {
  dispatchStatusCodeApi,
  downloadBookingSummaryApi,
  getCountryApi,
  getCurrencyApi,
  getMonthlyReportsApi,
  productTypesApi,
} from "../../../AllServices/config.service";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import CommonPagination from "../Pagination";
import {
  convertJSONtoCSV,
  downloadAttachment,
  formatDate,
  get90DaysBeforeDate,
  getCurrentDate,
  getTodayDate,
  indianFormat,
} from "../../../utils";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";

const Index: React.FC = () => {
  const {
    franchiseeId,
    franchiseeName,
    franchiseeCode,
    currencyId,
    isOverseas,
  } = useFranchisee();
  const [bookingData, setBookingData] = useState([]);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const [offset, setOffset] = useState(0);
  const [fromDate, setFromDate] = useState(get90DaysBeforeDate());
  const [toDate, setToDate] = useState(getCurrentDate());
  const [spinner, setSpinner] = useState(false);
  const [exportSpinner, setExportSpinner] = useState(false);
  const [countryData, setCountryData] = useState([]);
  const [dispatchData, setDispatchData] = useState([]);
  const [currencyData, setCurrencyData] = useState([]);

  const handlePagechange = (e: number) => {
    setPage(e);
    setOffset(e - 1);
  };

  const getData = async () => {
    const startDate = fromDate;
    const endDate = toDate;
    if (!fromDate) {
      setSpinner(false);
      return showAlert("Please select start date", "warning");
    }
    if (!toDate) {
      setSpinner(false);
      return showAlert("Please select end date", "warning");
    }
    try {
      setIsLoading(true);
      const response = await getMonthlyReportsApi(
        "booking",
        franchiseeId,
        startDate,
        endDate,
        page - 1,
        20
      );
      if (response?.data?.status == 200) {
        if (response?.data?.data?.length > 0) {
          setBookingData(response?.data?.data);
          setTotalPages(Math.ceil(Number(response?.data?.count) / 20));
        } else {
          setBookingData([]);
          showAlert("No Data Found", "warning");
        }
      } else {
        setBookingData([]);
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setIsLoading(false);
      setSpinner(false);
    }
  };

  const downloadData = async () => {
    const startDate = fromDate;
    const endDate = toDate;
    if (!fromDate) {
      return showAlert("Please select start date", "warning");
    }
    if (!toDate) {
      return showAlert("Please select end date", "warning");
    }
    try {
      setExportSpinner(true);
      const res = await downloadBookingSummaryApi(
        "booking",
        franchiseeId,
        startDate,
        endDate
      );
      if (res?.status == 200) {
        if (res?.data?.data?.length > 0) {
          convertJSONtoCSV(
            formatData(res?.data?.data || []),
            `Booking_monthly_report_${getTodayDate()}.csv`
          );
        } else {
          showAlert("No Data Found", "warning");
        }
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "warning"
        );
      }
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setExportSpinner(false);
    }
  };

  const getDispatchStatusData = async () => {
    try {
      const response: any = await dispatchStatusCodeApi();

      if (response?.status == 200) {
        setDispatchData(response?.data?.data);
      } else {
        setDispatchData([]);
      }
    } catch (err: any) {
      showAlert(err?.message, "error");
    }
  };

  const getCountryData = async () => {
    try {
      const response: any = await getCountryApi();
      if (response?.status == 200) {
        setCountryData(response?.data?.data);
      } else {
        setCountryData([]);
      }
    } catch (err: any) {
      showAlert(err?.message, "error");
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

  const formatData = (data: any) => {
    if (!(data?.length > 0)) {
      showAlert("No data available for download", "warning");
      return;
    }
    return data?.map((data: any, index: number) => ({
      "Booking Date": formatDate(data?.booking_date) || "-",
      "Vendor Name":
        productTypes.find((item) => item.product_id == data?.courier_id)
          ?.product_name || "-",
      Airwaybill: data?.airwaybilno || "-",
      "Skyways Airwaybill": data?.skyway_airwaybilno || "-",
      "Franchisee Code": franchiseeCode || "-",
      "Franchisee Name": franchiseeName || "-",
      "Consignee Name": data?.consignee_name || "-",
      "Consignee No.": data?.mobile_no || "-",
      "Product Description": data?.product_description || "-",
      "Actual Weight": data?.chargeable_weight || "-",
      Quantity: data?.number_of_pieces || "-",
      "Shipment Purpose": "",
      "Product Value": data?.product_value || "-",
      "Collectable Value": "0",
      Total: data?.total_amount || "-",
      "Pickup Date": formatDate(data?.updated_date) || "",
      "Client Code": data?.shipper_code || "-",
      "Client Name": data?.shipper_name || "-",
      "Delivery Address": data?.delivery_address || "-",
      "Delivery Pincode": data?.international_zipcode || "-",
      "Delivery State": data?.state || "-",
      "Country Name":
        countryData?.find(
          (elem) => elem?.country_id == data?.delivery_country_id
        )?.country_name || "-",
      Status:
        dispatchData?.find(
          (elem) => elem?.status_code == data?.dispatch_status_code
        )?.status || "-",
      Reference: data?.order_referenceno || "",
    }));
  };

  useEffect(() => {
    getDispatchStatusData();
    getCountryData();
    getProductData();
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data));
  }, []);

  useEffect(() => {
    getData();
  }, [page]);

  return (
    <div className="w-full max-w-8xl mx-auto mt-8 mb-16 p-8 md:p-10 lg:p-12 bg-white rounded-lg shadow-lg z-[0] relative">
      <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-5  items-end gap-8 w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold ">Invoice</h1>
        </div>
        <div className="w-full">
          <FormLabel htmlFor="modal-form-5">
            START DATE <span className="text-red-500">*</span>
          </FormLabel>
          <FormInput
            id="modal-form-5"
            type="date"
            value={fromDate}
            max={toDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>{" "}
        <div className="w-full">
          <FormLabel htmlFor="modal-form-5">
            END DATE <span className="text-red-500">*</span>
          </FormLabel>
          <FormInput
            id="modal-form-5"
            type="date"
            value={toDate}
            min={fromDate}
            max={getCurrentDate()}
            onChange={(e) => {
              setToDate(e.target.value);
            }}
          />
        </div>
        <div className="flex w-full items-end">
          <Button
            className=" w-full bg-mustard text-white"
            disabled={spinner || (!fromDate && !toDate)}
            onClick={() => {
              setSpinner(true);
              getData();
            }}
          >
            <Lucide
              icon="Search"
              className="w-4 h-4 mr-2 text-white stroke-2.5"
            />
            Search
            {spinner && (
              <LoadingIcon
                icon="puff"
                color="white"
                className="w-5 h-5 ml-2 stroke-2.5 text-white"
              />
            )}
          </Button>
        </div>
        <div className="w-full">
          <Button
            className="w-full  bg-green-500 text-white"
            disabled={exportSpinner || (!fromDate && !toDate)}
            onClick={downloadData}
          >
            <Lucide
              icon="Download"
              className="w-4 h-4 mr-2 text-white stroke-2.5"
            />{" "}
            Export CSV
            {exportSpinner && (
              <LoadingIcon
                icon="puff"
                color="white"
                className="w-5 h-5 ml-2 stroke-2.5 text-white"
              />
            )}
          </Button>
        </div>
      </div>

      <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

      {bookingData?.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="table table-text-small mb-0 border">
            <Table.Thead className="thead-primary table-sorting bg-mustard">
              <Table.Tr className="text-center text-white">
                <Table.Th className="whitespace-nowrap border">
                  BOOKING DATE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  VENDOR NAME
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  AWB No. (Reference No.)
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  Skart AWB No.
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  Destination
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">D/S</Table.Th>
                <Table.Th className="whitespace-nowrap border">PKG</Table.Th>
                <Table.Th className="whitespace-nowrap border">WEIGHT</Table.Th>
                <Table.Th className="whitespace-nowrap border">STATUS</Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  AMOUNT{" "}
                  {isOverseas && currencyId
                    ? `(${
                        (
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                      })`
                    : "(₹)"}
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  FSC{" "}
                  {isOverseas && currencyId
                    ? `(${
                        (
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                      })`
                    : "(₹)"}
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  OTHER{" "}
                  {isOverseas && currencyId
                    ? `(${
                        (
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                      })`
                    : "(₹)"}
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  SUB TOTAL{" "}
                  {isOverseas && currencyId
                    ? `(${
                        (
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                      })`
                    : "(₹)"}
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  GST{" "}
                  {isOverseas && currencyId
                    ? `(${
                        (
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                      })`
                    : "(₹)"}
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  TOTAL{" "}
                  {isOverseas && currencyId
                    ? `(${
                        (
                          currencyData?.find(
                            (item) => item?.id == currencyId
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                      })`
                    : "(₹)"}
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  AWB LABEL
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  PROFORMA INVOICE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  SHIPPER INVOICE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  AUTHORITY
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {bookingData?.map((data, index) => (
                <Table.Tr
                  key={index}
                  className={`text-LEFT intro-x capitalize`}
                >
                  <Table.Td className="border whitespace-nowrap">
                    {formatDate(data?.booking_date)}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {productTypes.find(
                      (item) => item.product_id == data?.courier_id
                    )?.product_name || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.airwaybilno || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.skyway_airwaybilno || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.consignee_data?.city} (
                    {countryData?.find(
                      (elem) => elem?.country_id == data?.delivery_country_id
                    )?.country_name || "N.A."}
                    )
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.booking_shipment_type_id == 1
                      ? "Non-Document"
                      : data?.booking_shipment_type_id == 2
                      ? "Document"
                      : data?.booking_shipment_type_id == 4
                      ? "Commercial"
                      : "N.A." || "N.A."}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap text-right">
                    {data?.number_of_pieces}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap text-right">
                    {data?.chargeable_weight}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {dispatchData?.find(
                      (elem) => elem?.status_code == data?.dispatch_status_code
                    )?.status || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap text-right">
                    {data?.selling_data?.base_amount
                      ? indianFormat(data?.selling_data?.base_amount)
                      : "0.00"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap text-right">
                    {data?.selling_data?.fsc_amount
                      ? indianFormat(data?.selling_data?.fsc_amount)
                      : "0.00"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap text-right">
                    {data?.selling_data?.other_amount
                      ? indianFormat(data?.selling_data?.other_amount)
                      : "0.00"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap text-right">
                    {data?.selling_data?.sub_amount
                      ? indianFormat(data?.selling_data?.sub_amount)
                      : "0.00"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap text-right">
                    {data?.selling_data?.gst
                      ? indianFormat(data?.selling_data?.gst)
                      : "0.00"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap text-right">
                    {data?.selling_data?.total_amount
                      ? indianFormat(data?.selling_data?.total_amount)
                      : "0.00"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.awb_lebel && data?.awb_lebel !== "null" ? (
                      <Button
                        variant="linkedin"
                        size="sm"
                        className="h-8 whitespace-nowrap"
                        onClick={() =>
                          downloadAttachment(
                            data?.awb_lebel,
                            `Dispatch_Label_${data?.airwaybilno}`
                          )
                        }
                      >
                        AWB Label
                      </Button>
                    ) : (
                      "N.A."
                    )}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.invoice_url && data?.invoice_url != "null" ? (
                      <Button
                        size="sm"
                        className="h-8 whitespace-nowrap bg-mustard text-white"
                        onClick={() =>
                          downloadAttachment(
                            data?.invoice_url,
                            `invoice_${data?.airwaybilno}`
                          )
                        }
                      >
                        Invoice
                      </Button>
                    ) : (
                      "N.A."
                    )}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.shipper_invoice &&
                    data?.shipper_invoice != "null" ? (
                      <Button
                        size="sm"
                        className="h-8 whitespace-nowrap bg-mustard text-white"
                        onClick={() =>
                          downloadAttachment(
                            data?.shipper_invoice,
                            `shipper_invoice_${data?.airwaybilno}`
                          )
                        }
                      >
                        Shipper Invoice
                      </Button>
                    ) : (
                      "N.A."
                    )}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.auth_letter && data?.auth_letter != "null" ? (
                      <Button
                        variant="linkedin"
                        size="sm"
                        className="h-8 whitespace-nowrap"
                        onClick={() =>
                          downloadAttachment(
                            data?.auth_letter,
                            `Authority_Letter_${data?.airwaybilno}`
                          )
                        }
                      >
                        Authority Letter
                      </Button>
                    ) : (
                      "N.A."
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      ) : isLoading ? (
        <LoadingIcon icon="tail-spin" className="block m-auto w-[4%] " />
      ) : (
        <p className="text-gray-400 text-center">No Data Found!</p>
      )}

      {/* BEGIN: Pagination */}
      {bookingData?.length > 0 && (
        <CommonPagination
          totalpages={totalpages}
          onPageChange={handlePagechange}
          page={page}
        />
      )}
      {/* END: Pagination */}
    </div>
  );
};

export default Index;
