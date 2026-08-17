import React, { useEffect, useState } from "react";
import Table from "../../../base-components/Table";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import { Menu } from "../../../base-components/Headless";
import {
  getCurrencyApi,
  getLoggerDataApi,
} from "../../../AllServices/config.service";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import {
  convertJSONtoCSV,
  convertJSONtoXLSX,
  get90DaysBeforeDate,
  getCurrentDate,
  getTodayDate,
  indianFormat,
  useDebounce,
} from "../../../utils";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FormInput, FormLabel } from "../../../base-components/Form";
import CommonPagination from "../Pagination";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";

const main = () => {
  const { franchiseeId, isDirectCust, currencyId, isOverseas } =
    useFranchisee();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [logData, setLogData] = useState([]);
  const [printData, setPrintData] = useState([]);
  const [fromDate, setFromDate] = useState(get90DaysBeforeDate());
  const [toDate, setToDate] = useState(getCurrentDate());
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>();
  const { showAlert } = useAlert();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currencyData, setCurrencyData] = useState([]);

  const handlePagechange = (e: number) => {
    setPage(e);
    setOffset((e - 1) * 20);
  };

  const generatePDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: "landscape",
    });

    const columnWidths = {
      columnName: 50, // Specify the width for the 'columnName' column
      // Add more columns with their respective widths
    };

    // Define columns and rows from JSON data
    const columns = Object.keys(formatData(printData)[0]);
    const rows = formatData(printData)?.map((obj) =>
      columns?.map((col) => obj[col]),
    );

    // Add table using autoTable plugin
    doc.autoTable({
      head: [columns],
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: [239, 184, 71],
      },
    });

    // Save the PDF

    doc.save(
      isDirectCust
        ? `Dr/Cr_Statement_${getTodayDate()}.pdf`
        : `Logger_franchisee_${getTodayDate()}.pdf`,
    );
  };

  const formatDate = (dateString: any) => {
    if (!dateString) {
      return "-";
    }

    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options);
  };

  const formatData = (data: any) => {
    if (!(data?.length > 0)) {
      showAlert("No data available for download", "warning");
      return;
    }
    return data?.map((data: any, index: Number) => ({
      "Sr. No.": `${index + 1}.`,
      Date: formatDate(data?.entry_date) || "-",
      "Transaction Type": data?.entry_type,
      "AWB No.": data?.airwaybilno,
      "Opening Balance": parseFloat(data?.opening_balance).toLocaleString(
        "en-IN",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      ),
      "Dr.":
        data?.transaction_type?.toUpperCase() === "DR"
          ? parseFloat(data?.entry_amount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "0.00",
      "Cr.":
        data?.transaction_type?.toUpperCase() === "CR"
          ? parseFloat(data?.entry_amount || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          : "0.00",
      "Closing Balance": parseFloat(data?.closing_balance).toLocaleString(
        "en-IN",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      ),
      "UTR No/Chq No/NEFT":
        data?.utrn || data?.cheque_no || data?.bank_ref_no || "-",
      Remarks: data?.remarks,
    }));
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const response: any = await getLoggerDataApi(
        franchiseeId,
        fromDate,
        toDate,
        "20",
        offset,
        debouncedSearch.trim(),
      );

      if (response?.data?.status == 200) {
        setLogData(response?.data?.data?.result);
        setTotalPages(Math.ceil(response?.data?.data?.count / 20));
      } else if (response?.status == 204) {
        setLogData([]);
        setTotalPages();
        showAlert("No Data Found", "warning");
      } else if (response?.message == "Network Error") {
        setIsError(true);
        showAlert(response?.message, "error");
      } else if (response?.response?.status == 500) {
        showAlert("Internal Server Error", "error");
      } else if (response?.response?.status == 400) {
        showAlert(response?.response?.message, "error");
      } else if (response?.response?.status == 401) {
        showAlert("Unauthorized", "error");
      } else if (response?.response?.status == 404) {
        showAlert("Not Found", "error");
      } else if (response?.response?.status == 502) {
        showAlert("Bad GateWay", "error");
      } else if (response?.response?.status == 504) {
        showAlert("Failed to Fetch", "error");
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error",
        );
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setIsError(true);
      showAlert(err?.message, "error");
    }

    try {
      const response: any = await getLoggerDataApi(
        franchiseeId,
        fromDate,
        toDate,
        "",
      );
      if (response?.data?.status == 200) {
        setPrintData(response?.data?.data?.result);
      } else if (response?.message == "Network Error") {
        showAlert(response?.message, "error");
      } else if (response?.response?.status == 500) {
        showAlert("Internal Server Error", "error");
      } else if (response?.response?.status == 400) {
        showAlert(response?.response?.message, "error");
      } else if (response?.response?.status == 401) {
        showAlert("Unauthorized", "error");
      } else if (response?.response?.status == 404) {
        showAlert("Not Found", "error");
      } else if (response?.response?.status == 502) {
        showAlert("Bad GateWay", "error");
      } else if (response?.response?.status == 504) {
        showAlert("Failed to Fetch", "error");
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error",
        );
      }
    } catch (err: any) {
      showAlert(err?.message, "error");
    }
  };

  useEffect(() => {
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data));
  }, []);
  useEffect(() => {
    getData();
  }, [fromDate, toDate, offset, debouncedSearch]);

  return (
    <div className="w-full max-w-8xl p-6 px-10 mb-16 bg-white rounded-lg shadow-lg  mt-8  z-[0] relative">
      <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-5  items-end gap-8 w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold">
            {isDirectCust ? "Dr/Cr Statement" : "Franchisee Logger"}
          </h1>
        </div>

        <div className="w-full">
          <FormLabel htmlFor="modal-form-5">
            FROM DATE <span className="text-red-500">*</span>
          </FormLabel>
          <FormInput
            id="modal-form-5"
            type="date"
            value={fromDate}
            min={get90DaysBeforeDate()}
            max={toDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="w-full">
          <FormLabel htmlFor="modal-form-5">
            TO DATE <span className="text-red-500">*</span>
          </FormLabel>
          <FormInput
            id="modal-form-5"
            type="date"
            value={toDate}
            min={fromDate}
            max={getCurrentDate()}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="w-full flex">
          <FormInput
            type="text"
            placeholder="Enter AWB No."
            value={search}
            className="w-2/3"
            onChange={(e) => {
              setSearch(e.target.value.replace(/\s/g, ""));
              setPage(1);
            }}
          />
          <Button
            className="w-1/3 rounded-lg bg-red-500 hover:bg-red-600 text-white ml-2"
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
          >
            RESET
          </Button>
        </div>
        {logData.length > 0 && (
          <div className="w-[100%]" style={{ width: "100%" }}>
            <Menu className=" w-[100%] " style={{ width: "100%" }}>
              <Menu.Button
                as={Button}
                variant="outline-secondary"
                className="w-[100%] sm:w-auto"
                style={{ width: "100%" }}
              >
                <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                <Lucide
                  icon="ChevronDown"
                  className="w-4 h-4 ml-auto sm:ml-2"
                />
              </Menu.Button>
              <Menu.Items className="w-40">
                <Menu.Item
                  className={"flex "}
                  onClick={() => {
                    const fileName = isDirectCust
                      ? `Dr/Cr_Statement_${getTodayDate()}.xlsx`
                      : `Logger_franchisee_${getTodayDate()}.xlsx`;

                    convertJSONtoXLSX(formatData(printData), fileName);
                  }}
                >
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                  XLSX
                </Menu.Item>
                <Menu.Item
                  className={"flex "}
                  onClick={() => {
                    const fileName = isDirectCust
                      ? `Dr/Cr_Statement_${getTodayDate()}.csv`
                      : `Logger_franchisee_${getTodayDate()}.csv`;

                    convertJSONtoCSV(formatData(printData), fileName);
                  }}
                >
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export CSV
                </Menu.Item>
                <Menu.Item className={"flex "} onClick={generatePDF}>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export Pdf
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        )}
      </div>
      <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

      {logData.length > 0 ? (
        <div className="overflow-x-auto ">
          <Table className="table table-text-small mb-0 border ">
            <Table.Thead
              variant="dark"
              className="thead-primary table-sorting bg-mustard"
            >
              <Table.Tr className="text-center ">
                <Table.Th className="whitespace-nowrap border">Sr.No.</Table.Th>
                <Table.Th className="whitespace-nowrap border">Date</Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  Transaction Type
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  AWB No.
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  Opening Balance{" "}
                  {isOverseas && currencyId
                    ? `(${
                        (
                          currencyData?.find(
                            (item) => item?.id == currencyId,
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                      })`
                    : "(₹)"}
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  Dr{" "}
                  {isOverseas && currencyId
                    ? `(${
                        (
                          currencyData?.find(
                            (item) => item?.id == currencyId,
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                      })`
                    : "(₹)"}
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  Cr{" "}
                  {isOverseas && currencyId
                    ? `(${
                        (
                          currencyData?.find(
                            (item) => item?.id == currencyId,
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                      })`
                    : "(₹)"}
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  Closing Balance{" "}
                  {isOverseas && currencyId
                    ? `(${
                        (
                          currencyData?.find(
                            (item) => item?.id == currencyId,
                          ) ?? currencyData?.find((item) => item?.id == 24)
                        )?.symbol || " "
                      })`
                    : "(₹)"}
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  UTR No/ Chq No/NEFT
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  Remarks
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {logData?.map(
                (data, index) =>
                  data?.is_active == "1" && (
                    <Table.Tr key={index} className={`text-left  intro-x`}>
                      <Table.Td className="border whitespace-nowrap text-right">
                        {(page - 1) * 20 + (index + 1)}.
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap ">
                        {formatDate(data?.entry_date)}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {data?.entry_type}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {data?.airwaybilno || "N.A."}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-right">
                        {indianFormat(Number(data?.opening_balance))}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-right">
                        {data?.transaction_type?.toUpperCase() == "DR"
                          ? indianFormat(Number(data?.entry_amount))
                          : "0.00"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-right">
                        {data?.transaction_type?.toUpperCase() == "CR"
                          ? indianFormat(Number(data?.entry_amount))
                          : "0.00"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-right">
                        {indianFormat(Number(data?.closing_balance))}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {data?.utrn !== "NULL" && data?.utrn
                          ? data?.utrn
                          : data?.cheque_no !== "NULL" && data?.cheque_no
                            ? data?.cheque_no
                            : data?.bank_ref_no !== "NULL" && data?.bank_ref_no
                              ? data?.bank_ref_no
                              : "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {data?.remarks == "NULL"
                          ? "N.A."
                          : !data?.remarks
                            ? "N.A."
                            : data?.remarks}
                      </Table.Td>
                    </Table.Tr>
                  ),
              )}
            </Table.Tbody>
          </Table>
        </div>
      ) : isLoading ? (
        <LoadingIcon icon="tail-spin" className="block m-auto w-[4%] " />
      ) : (
        <p className="text-gray-400 text-center">No Data Found!</p>
      )}

      {logData.length > 0 && (
        <CommonPagination
          totalpages={totalpages}
          onPageChange={handlePagechange}
          page={page}
        />
      )}
    </div>
  );
};

export default main;
