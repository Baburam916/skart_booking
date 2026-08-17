import React, { useState, useEffect } from "react";
import Table from "../../../base-components/Table";
import { FormInput, FormLabel } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import Button from "../../../base-components/Button";
import {
  downloadBookingSummaryApi,
  getBookingSummaryApi,
  getCountryApi,
  getCurrencyApi,
  productTypesApi,
} from "../../../AllServices/config.service";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import CommonPagination from "../Pagination";
import {
  convertJSONtoCSV,
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
  const [totalData, setTotalData] = useState({
    pickup_bookings: 0,
    pickup_invoices: 0,
    pickedup_bookings: 0,
    pickedup_invoices: 0,
    heldup_bookings: 0,
    heldup_invoices: 0,
  });
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
      const response = await getBookingSummaryApi(
        "booking",
        franchiseeId,
        startDate,
        endDate,
        page - 1,
        20
      );

      if (response?.status == 200) {
        if (response?.data?.data?.length > 0) {
          setBookingData(response?.data?.data);
          setTotalPages(Math.ceil(Number(response?.data?.count) / 20));

          const data = response?.data?.data?.reduce(
            (acc, curr) => {
              acc.pickup_bookings += Number(curr?.booked);
              acc.pickup_invoices += Number(curr?.booked_value);
              acc.pickedup_bookings += Number(curr?.picked_up);
              acc.pickedup_invoices += Number(curr?.picked_up_value);
              acc.heldup_bookings += Number(curr?.held);
              acc.heldup_invoices += Number(curr?.held_value);
              return acc;
            },
            {
              pickup_bookings: 0,
              pickup_invoices: 0,
              pickedup_bookings: 0,
              pickedup_invoices: 0,
              heldup_bookings: 0,
              heldup_invoices: 0,
            }
          );

          setTotalData(data);
        } else {
          setBookingData([]);
          showAlert("No Data Found", "warning");
        }
      } else if (response?.status == 204) {
        setBookingData([]);
        showAlert("No Data Found", "warning");
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
      setSpinner(false);
      return showAlert("Please select start date", "warning");
    }
    if (!toDate) {
      setSpinner(false);
      return showAlert("Please select end date", "warning");
    }
    setExportSpinner(true);
    try {
      const res = await downloadBookingSummaryApi(
        "booking",
        franchiseeId,
        startDate,
        endDate
      );
      if (res?.status == 200) {
        if (res?.data?.data?.length > 0) {
          convertJSONtoCSV(
            formatData(res?.data?.data),
            `Booking_summary_${getTodayDate()}.csv`
          );
        } else {
          convertJSONtoCSV(
            formatData([]),
            `Booking_summary_${getTodayDate()}.csv`
          );
        }
      } else if (res?.status == 204) {
        convertJSONtoCSV(
          formatData([]),
          `Booking_summary_${getTodayDate()}.csv`
        );
        showAlert("No Data Found", "warning");
      } else {
        convertJSONtoCSV(
          formatData([]),
          `Booking_summary_${getTodayDate()}.csv`
        );
      }
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setExportSpinner(false);
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
      "Sr. No.": `${index + 1}.`,
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
        data?.remarks || "-",
      Reference: data?.order_referenceno || "",
    }));
  };

  useEffect(() => {
    getCountryData();
    getProductData();
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data));
  }, []);

  useEffect(() => {
    getData();
  }, [page]);

  return (
    <div className="w-full max-w-8xl mx-auto p-3 px-2 lg:p-6 lg:px-10 mt-2  lg:mt-8  bg-white rounded-lg shadow-lg z-[0] relative">
      <div className="grid  sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-5  items-end gap-2 lg:gap-8 w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold ">Booking Summary </h1>
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
            className="w-full  bg-mustard text-white"
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
            className="w-full bg-green-500 text-white"
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
                <Table.Th className="whitespace-wrap border" rowSpan={2}>
                  SERVICE PROVIDER
                </Table.Th>
                <Table.Th className="whitespace-wrap border" colSpan={2}>
                  PICKUP TO BE SCHEDULED
                </Table.Th>
                <Table.Th className="whitespace-wrap border" colSpan={2}>
                  {" "}
                  PICKED UP
                </Table.Th>
                <Table.Th className="whitespace-wrap border" colSpan={2}>
                  HELDUP
                </Table.Th>
                <Table.Th className="whitespace-wrap border" colSpan={2}>
                  TOTAL
                </Table.Th>
              </Table.Tr>
              <Table.Tr className="text-center text-white">
                <Table.Th className="whitespace-wrap border">
                  BOOKINGS(NO.)
                </Table.Th>
                <Table.Th className="whitespace-wrap border">
                  INVOICE VALUE{" "}
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
                <Table.Th className="whitespace-wrap border">
                  BOOKINGS(NO.)
                </Table.Th>
                <Table.Th className="whitespace-wrap border">
                  INVOICE VALUE{" "}
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
                <Table.Th className="whitespace-wrap border">
                  BOOKINGS(NO.)
                </Table.Th>
                <Table.Th className="whitespace-wrap border">
                  INVOICE VALUE{" "}
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
                <Table.Th className="whitespace-wrap border">
                  BOOKINGS(NO.)
                </Table.Th>
                <Table.Th className="whitespace-wrap border">
                  INVOICE VALUE{" "}
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
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {bookingData?.map((data, index) => (
                <Table.Tr
                  key={index}
                  className={`text-right intro-x capitalize `}
                >
                  <Table.Td className="border text-left">
                    {productTypes.find(
                      (item) => item.product_id == data?.courier_id
                    )?.product_name || "-"}
                  </Table.Td>
                  <Table.Td className="border">{data?.booked}</Table.Td>
                  <Table.Td className="border text-right">
                    {indianFormat(data?.booked_value)}
                  </Table.Td>
                  <Table.Td className="border">{data?.picked_up}</Table.Td>

                  <Table.Td className="border text-right">
                    {indianFormat(data?.picked_up_value)}
                  </Table.Td>
                  <Table.Td className="border">{data?.held}</Table.Td>

                  <Table.Td className="border text-right">
                    {indianFormat(data?.held_value)}
                  </Table.Td>
                  <Table.Td className="border">
                    {Number(
                      Number(
                        Number(data?.booked || 0) +
                          Number(data?.picked_up || 0) +
                          Number(data?.held || 0)
                      ).toFixed(2)
                    )}
                  </Table.Td>
                  <Table.Td className="border text-right">
                    {indianFormat(
                      Number(
                        Number(data?.booked_value || 0) +
                          Number(data?.picked_up_value || 0) +
                          Number(data?.held_value || 0)
                      )
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
              <Table.Tr
                className={`text-right intro-x capitalize font-bold text-base`}
              >
                <Table.Td className="border text-left">Total</Table.Td>
                <Table.Td className="border">
                  {Number(totalData?.pickup_bookings)}
                </Table.Td>
                <Table.Td className="border text-right">
                  {indianFormat(totalData?.pickup_invoices)}
                </Table.Td>
                <Table.Td className="border">
                  {Number(totalData?.pickedup_bookings)}
                </Table.Td>
                <Table.Td className="border text-right">
                  {indianFormat(totalData?.pickedup_invoices)}
                </Table.Td>
                <Table.Td className="border">
                  {Number(totalData?.heldup_bookings)}
                </Table.Td>
                <Table.Td className="border text-right">
                  {indianFormat(totalData?.heldup_invoices)}
                </Table.Td>
                <Table.Td className="border">
                  {Number(
                    Number(totalData?.pickup_bookings) +
                      Number(totalData?.pickedup_bookings) +
                      Number(totalData?.heldup_bookings)
                  )}
                </Table.Td>
                <Table.Td className="border text-right">
                  {indianFormat(
                    Number(
                      Number(totalData?.pickup_invoices) +
                        Number(totalData?.pickedup_invoices) +
                        Number(totalData?.heldup_invoices)
                    )
                  )}
                </Table.Td>
              </Table.Tr>
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
