import React, { useEffect, useState } from "react";
import { FormInput, FormLabel } from "../../../base-components/Form";
import { useAlert } from "../../../ContextProvider/AlertContext";
import Button from "../../../base-components/Button";
import Table from "../../../base-components/Table";
import LoadingIcon from "../../../base-components/LoadingIcon";
import {
  convertJSONtoCSV,
  downloadAttachment,
  formatDate,
  get90DaysBeforeDate,
  useDebounce,
} from "../../../utils";
import { Box, Download, FileText } from "lucide-react";
import CommonPagination from "../Pagination";
import { Rto_listing_api } from "../../../AllServices/config.service";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";

const main = () => {
  const today = new Date().toISOString().split("T")[0];
  const { showAlert } = useAlert();
  const { franchiseeId } = useFranchisee();
  const [fromDate, setFromDate] = useState(get90DaysBeforeDate());
  const [toDate, setToDate] = useState(today);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [bookingData, setBookingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadSpinner, setDownloadSpinner] = useState(false);
  const [downloadData, setDownloadData] = useState([]);

  const handleTrack = async (awb: string) => {
    const url = `/franchisee/tracking?awb=${awb}`;
    window.open(url, "_blank");
  };
  const handlePagechange = (e: number) => {
    setPage(e);
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await Rto_listing_api({
        franchisee_id: franchiseeId,
        from_date: fromDate,
        to_date: toDate,
        airwaybill_no: debouncedSearch,
        limit: 20,
        page: page - 1,
      });
      if (res?.status == 200 || 204) {
        setBookingData(res?.data?.data || []);
        setTotalPages(Math.ceil(res?.data?.total / 20) || 1);
      } else {
        setBookingData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloadSpinner(true);
      const res = await Rto_listing_api({
        franchisee_id: franchiseeId,
        from_date: fromDate,
        to_date: toDate,
      });
      if (res?.status == 200 || 204) {
        setDownloadData(res?.data?.data || []);
        convertJSONtoCSV(formatData(res?.data?.data || []), "RTO");
      } else {
        showAlert(res?.data?.message || res?.response?.data?.message, "error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDownloadSpinner(false);
    }
  };

  const formatData = (data: any) => {
    if (!(data?.length > 0)) {
      showAlert("No data available for download", "warning");
      return;
    }

    return data?.map((data: any, index: number) => ({
      "Sr. No.": `${index + 1}.`,
      "R.T.O. Airwaybill": data?.new_airwaybilno,
      "R.T.O Date": formatDate(data?.created_date),
      "Booking Airwaybill": data?.airwaybilno,
      "Dispatch Label": data?.booked_data?.dispatch_url,
      "Invoice Pdf": data?.booked_data?.invoice_url,
    }));
  };

  useEffect(() => {
    getData();
  }, [fromDate, toDate, debouncedSearch, page]);

  return (
    <div className="w-full max-w-8xl p-6 px-10 bg-white rounded-lg shadow-lg  mt-8 mb-16 z-[0] relative">
      <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  xl:grid-cols-5  items-end gap-6 w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold ">R.T.O. List</h1>
        </div>
        <div className="w-full">
          <FormLabel htmlFor="modal-form-5">
            FROM DATE <span className="text-red-500">*</span>
          </FormLabel>
          <FormInput
            id="modal-form-5"
            type="date"
            value={fromDate}
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
            max={today}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <FormInput
          type="text"
          placeholder="Enter AWB No."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value.replace(/\s/g, ""));
            setPage(1);
          }}
        />
        <Button
          className=" rounded-lg bg-green-500 hover:bg-green-600 text-white ml-4 p-2"
          onClick={handleDownload}
          disabled={downloadSpinner}
        >
          DOWNLOAD{" "}
          {downloadSpinner ? (
            <LoadingIcon
              icon="puff"
              color="white"
              className="w-5 h-5 ml-2 stroke-2.5 text-white"
            />
          ) : (
            <Download className="ml-2" />
          )}
        </Button>
      </div>

      <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

      <div className="">
        {bookingData?.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table className="table table-text-small mb-0 border">
                <Table.Thead
                  variant="dark"
                  className="thead-primary table-sorting bg-mustard"
                >
                  <Table.Tr className="text-center ">
                    <Table.Th className="whitespace-nowrap border">
                      SR.NO.
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      R.T.O. AIRWAYBILL
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      R.T.O DATE
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      BOOKING AIRWAYBILL
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      DISPATCH LABEL
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      INVOICE PDF
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {bookingData?.map((item, index) => (
                    <Table.Tr key={index} className={`text-left intro-x`}>
                      <Table.Td className="border whitespace-nowrap text-right">
                        {search ? index + 1 : (page - 1) * 20 + (index + 1)}.
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        <p
                          className="text-mustard font-bold cursor-pointer underline underline-offset-4 hover:no-underline"
                          onClick={() => {
                            if (item?.new_airwaybilno) {
                              handleTrack(item?.new_airwaybilno);
                            }
                          }}
                        >
                          {item?.new_airwaybilno || "-"}
                        </p>
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {formatDate(item?.created_date)}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-right">
                        <p
                          className="text-mustard font-bold cursor-pointer underline underline-offset-4 hover:no-underline"
                          onClick={() => {
                            if (item?.airwaybilno) {
                              handleTrack(item?.airwaybilno);
                            }
                          }}
                        >
                          {item?.airwaybilno || "-"}
                        </p>
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        <div className="flex justify-center">
                          <Box
                            className="stroke-2.5 text-mustard cursor-pointer"
                            onClick={() =>
                              downloadAttachment(
                                item?.booked_data?.dispatch_url,
                                item?.booked_data?.airwaybilno
                              )
                            }
                          />
                        </div>
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        <div className="flex justify-center">
                          <FileText
                            className="stroke-2.5 text-mustard cursor-pointer"
                            onClick={() =>
                              downloadAttachment(
                                item?.booked_data?.invoice_url,
                                item?.booked_data?.airwaybilno
                              )
                            }
                          />
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
            {totalpages > 1 && (
              <CommonPagination
                totalpages={totalpages}
                onPageChange={handlePagechange}
                page={page}
              />
            )}
          </>
        ) : (
          <>
            {" "}
            <p className="mt-4 text-gray-400 text-center">No Data Found!</p>
          </>
        )}
      </div>
    </div>
  );
};

export default main;
