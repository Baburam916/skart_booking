import React, { useEffect, useState } from "react";
import Table from "../../../base-components/Table";
import { FormInput, FormLabel } from "../../../base-components/Form";
import {
  getCurrencyApi,
  downloadCustomerReport,
  getCustomerReportsApi,
} from "../../../AllServices/config.service";
import { useAlert } from "../../../ContextProvider/AlertContext";
import CommonPagination from "../Pagination";
import { convertJSONtoCSV, getCurrentDate, indianFormat } from "../../../utils";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Button from "../../../base-components/Button";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import Lucide from "../../../base-components/Lucide";

const Index: React.FC = () => {
  const { franchiseeId, currencyId, isOverseas } = useFranchisee();
  const [reportData, setReportData] = useState([]);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const [offset, setOffset] = useState(0);

  const [currencyData, setCurrencyData] = useState([]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

  const [fromDate, setFromDate] = useState(formatDate(lastMonth));
  const [toDate, setToDate] = useState(formatDate(today));
  const [exportSpinner, setExportSpinner] = useState(false);

  const handlePagechange = (e: number) => {
    setPage(e);
    setOffset(e - 1);
  };

  const getData = async () => {
    if (fromDate && toDate) {
      setIsLoading(true);
      try {
        const response = await getCustomerReportsApi(
          "booking",
          franchiseeId,
          fromDate,
          toDate,
          page - 1,
          20
        );

        if (response?.status == 200) {
          if (response?.data?.data?.length > 0) {
            setReportData(response?.data?.data);
            setTotalPages(Math.ceil(response?.data?.count / 20));
          } else {
            setReportData([]);
            showAlert("No Data Found", "warning");
          }
        } else if (response?.response?.data?.status == 500) {
          setReportData([]);
          showAlert(response?.response?.data?.message, "error");
        } else if (response?.status == 204)
          showAlert("No Data Found!", "warning");
        else {
          setReportData([]);
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
      }
    } else {
      setIsLoading(false);
      if (!fromDate) {
        showAlert("Please select start date", "warning");
      }
      if (!toDate) {
        showAlert("Please select end date", "warning");
      }
    }
  };

  const formatData = (data: any) => {
    if (!(data?.length > 0)) {
      showAlert("No data available for download", "warning");
      return;
    }
    return data?.map((data: any, index: number) => ({
      "S.No.": index + 1,
      "First Name": data?.shipper_name,
      "Email Id": data?.email_id,
      "Contact No": data?.mobile_no,
      City: data?.city_name,
      State: data?.state,
      Pincode: data?.pincode,
      "Bookings(No)": data?.booked_count,
      Bookings: data?.booked_value,
    }));
  };

  const downloadData = async () => {
    // const startDate = fromDate;
    // const endDate = toDate;
    if (!fromDate) {
      return showAlert("Please select start date", "warning");
    }
    if (!toDate) {
      return showAlert("Please select end date", "warning");
    }
    try {
      setExportSpinner(true);
      const res = await downloadCustomerReport(
        "booking",
        franchiseeId,
        fromDate,
        toDate
      );
      if (res?.status == 200) {
        if (res?.data?.data?.length > 0) {
          convertJSONtoCSV(
            formatData(res?.data?.data || []),
            `customer_report.csv`
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
  useEffect(() => {
    if (reportData?.length > 0) {
      getData();
    }
  }, [page]);

  useEffect(() => {
    getData();
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data));
  }, []);

  return (
    <div className="w-full max-w-8xl mx-auto p-3 px-2 lg:p-6 lg:px-10 mt-2  lg:mt-8  bg-white rounded-lg shadow-lg z-[0] relative">
      <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-5  items-end gap-2 lg:gap-8 w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold ">Customer Report </h1>
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
            disabled={!fromDate}
            max={getCurrentDate()}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="flex w-full items-end">
          <Button
           
            className="w-full  bg-mustard text-white  rounded-md"
            disabled={isLoading || (!fromDate && !toDate)}
            onClick={getData}
          >
            SUBMIT
            {isLoading && (
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
            disabled={
              reportData?.length < 1 || exportSpinner || (!fromDate && !toDate)
            }
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

      {reportData?.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="table table-text-small mb-0 border">
            <Table.Thead className="thead-primary table-sorting bg-mustard">
              <Table.Tr className="text-center text-white">
                <Table.Th className="whitespace-nowrap border">SR.NO.</Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  FIRST NAME
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  EMAIL ID
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  CONTACT NO
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">CITY</Table.Th>
                <Table.Th className="whitespace-nowrap border">STATE</Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  PINCODE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  BOOKINGS(NO)
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  BOOKINGS{" "}
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
              {reportData?.map((data, index) => (
                <Table.Tr key={index} className={`text-left intro-x `}>
                  <Table.Td className="border text-right">
                    {(page - 1) * 20 + (index + 1)}.
                  </Table.Td>
                  <Table.Td className="border">{data?.shipper_name}</Table.Td>
                  <Table.Td className="border">{data?.email_id}</Table.Td>
                  <Table.Td className="border text-right">
                    {data?.mobile_no}
                  </Table.Td>
                  <Table.Td className="border">{data?.city_name}</Table.Td>
                  <Table.Td className="border">{data?.state}</Table.Td>
                  <Table.Td className="border text-right">
                    {data?.pincode}
                  </Table.Td>
                  <Table.Td className="border text-right">
                    {data?.booked_count}
                  </Table.Td>
                  <Table.Td className="border text-right">
                    {indianFormat(data?.booked_value)}
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
      {reportData?.length > 0 && (
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
