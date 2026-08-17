import React, { useEffect, useState } from "react";
import Registration from "./registration";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import { msmeList } from "../../../AllServices/config.service";
import Table from "../../../base-components/Table";
import CommonPagination from "../Pagination";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { convertJSONtoCSV, getTodayDate, useDebounce } from "../../../utils";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { Link } from "react-router-dom";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import { FormInput } from "../../../base-components/Form";
import Tippy from "../../../base-components/Tippy";

const main = () => {
  const { franchiseeId } = useFranchisee();
  const [showReg, setShowReg] = useState<Boolean>(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [csvLoading, setCsvLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const handlePagechange = (e: number) => {
    setPage(e);
  };

  const handleGetData = async () => {
    setIsLoading(true);
    try {
      const res = await msmeList({
        franchisee_id: franchiseeId,
        limit: 20,
        offset: page - 1,
        search: debouncedSearch.trim(),
      });
      if (res?.status == 200) {
        setData(res?.data?.data);
        setTotalPages(Math.ceil(res?.data?.total_count / 20));
      } else if (res?.status == 204) {
        setData([]);
      } else if (res?.response?.status == 500) {
        showAlert("Internal Server Error", "error");
      } else if (res?.response?.status == 400) {
        showAlert(res?.response?.message, "error");
      } else if (res?.response?.status == 401) {
        showAlert("Unauthorized", "error");
      } else if (res?.response?.status == 404) {
        showAlert("Not Found", "error");
      } else if (res?.response?.status == 502) {
        showAlert("Bad GateWay", "error");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
      showAlert(error?.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatData = (data: any) => {
    if (!(data?.length > 0)) {
      showAlert("No data available for download", "warning");
      return;
    }
    return data?.map((item: any, index: number) => ({
      "Sr. No.": `${index + 1}.`,
      "Company Name": item?.company_name || "",
      "Contact Person": item?.contact_person || "",
      "Mobile Number": item?.mobile_number || "",
      Email: item?.customers_email || "",
      Address: `${item.address_1 || ""} ${item.address_2 || ""}`.trim(),
      City: item?.city || "",
      State: item?.state || "",
      Pincode: item?.zipcode || "",
      "Gstin Number": item?.gstin_number || "",
      "IEC Code": item?.iec_code || "",
      "Pan Number": item?.pan_number || "",
      Status:
        item?.ops_approvel == 0
          ? "Pending"
          : item?.ops_approvel == 1
          ? "Accepted"
          : item?.ops_approvel == 2
          ? "Rejected"
          : "",
    }));
  };

  const handleCsvData = async () => {
    setCsvLoading(true);
    try {
      const res = await msmeList({
        franchisee_id: franchiseeId,
        limit: null,
        offset: null,
        search: "",
      });
      if (res?.status == 200) {
        setCsvData(res?.data?.data);
        convertJSONtoCSV(
          formatData(res?.data?.data),
          `MSME_Data_${getTodayDate()}.csv`
        );
      } else if (res?.status == 204) {
        setCsvData([]);
        convertJSONtoCSV(formatData([]), `MSME_Data_${getTodayDate()}.csv`);
      } else if (res?.response?.status == 500) {
        showAlert("Internal Server Error", "error");
      } else if (res?.response?.status == 400) {
        showAlert(res?.response?.message, "error");
      } else if (res?.response?.status == 401) {
        showAlert("Unauthorized", "error");
      } else if (res?.response?.status == 404) {
        showAlert("Not Found", "error");
      } else if (res?.response?.status == 502) {
        showAlert("Bad GateWay", "error");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
      showAlert(error?.message, "error");
    } finally {
      setCsvLoading(false);
    }
  };

  useEffect(() => {
    handleGetData();
  }, [debouncedSearch, page]);

  return (
    <>
      {showReg ? (
        <Registration setShowReg={setShowReg} handleGetData={handleGetData} />
      ) : (
        <div className="w-full max-w-8xl p-3 px-2 lg:p-6 lg:px-10 bg-white rounded-lg shadow-lg  mt-8 mb-16 z-[0] relative">
          <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3  xl:grid-cols-3  items-end gap-2 lg:gap-8 w-full">
            <div className="w-full">
              <h1 className="text-2xl font-bold text-left whitespace-nowrap">
                MSME List
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                className="  bg-mustard text-white"
                onClick={() => setShowReg(true)}
              >
                <Lucide icon="UserPlus" className="text-white stroke-2.5 h-4" />
                Registration
              </Button>
              <Button
                className="  bg-green-500 text-white"
                onClick={handleCsvData}
                disabled={csvLoading}
              >
                <Lucide icon="Download" className="text-white stroke-2.5 h-4" />
                Download
                {csvLoading && (
                  <LoadingIcon
                    icon="puff"
                    color="white"
                    className="w-5 h-5 ml-2 stroke-2.5 text-white"
                  />
                )}
              </Button>
            </div>

            <div className="block lg:flex w-full items-end">
              <FormInput
                type="text"
                placeholder="Enter Mobile No."
                value={search}
                className="w-full lg:w-2/3"
                onChange={(e) => {
                  setSearch(e.target.value.replace(/\s/g, ""));
                  setPage(1);
                }}
              />
              <Button
                className="w-full lg:w-1/3 rounded-lg bg-red-500 hover:bg-red-600 text-white lg:ml-4 mt-2 lg:mt-0"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
              >
                RESET
              </Button>
            </div>
          </div>

          <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

          {data?.length > 0 ? (
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
                      MSME ID
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      COMPANY NAME
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      CONTACT PERSON
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      MOBILE NUMBER
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      EMAIL
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      ADDRESS
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      CITY
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      STATE
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      PINCODE
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      GSTIN NUMBER
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      IEC CODE
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      PAN NUMBER
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      AUTHORISATION LETTER
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      STATUS
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {data?.map((item, index) => (
                    <Table.Tr key={index} className={`text-left intro-x`}>
                      <Table.Td className="border text-right whitespace-nowrap">
                        {search ? index + 1 : (page - 1) * 20 + (index + 1)}.
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-right">
                        {item?.msme_id || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {item?.company_name || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {item?.contact_person || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-right">
                        {item?.mobile_number || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {item?.customers_email || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {item?.address_1} {item?.address_2}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {item?.city || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {item?.state || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-right">
                        {item?.zipcode || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        <Link
                          to={item?.gstin_signed_stamped}
                          target="_blank"
                          className="text-mustard underline-offset-4 underline hover:no-underline"
                        >
                          {item?.gstin_number || "-"}
                        </Link>
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        <Link
                          to={item?.iec_signed_stamped}
                          target="_blank"
                          className="text-mustard underline-offset-4 underline hover:no-underline"
                        >
                          {item?.iec_code || "-"}
                        </Link>
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        <Link
                          to={item?.company_pan}
                          target="_blank"
                          className="text-mustard underline-offset-4 underline hover:no-underline"
                        >
                          {item?.pan_number || "-"}
                        </Link>
                      </Table.Td>

                      <Table.Td className="border whitespace-nowrap">
                        <div className="flex justify-center">
                          <Link
                            to={item?.authorisation_letter}
                            target="_blank"
                            className="text-mustard underline-offset-4 underline hover:no-underline"
                          >
                            <Lucide
                              icon="FileText"
                              className="stroke-2.5 text-mustard cursor-pointer"
                            />
                          </Link>
                        </div>
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {item?.ops_approvel == 0 ? (
                          <p className="text-base text-mustard">PENDING</p>
                        ) : item?.ops_approvel == 1 ? (
                          <p className="text-base text-green-500">ACCEPTED</p>
                        ) : item?.ops_approvel == 2 ? (
                          <Tippy
                            content={item?.remarks ? item?.remarks : "N.A."}
                            options={{ placement: "top" }}
                          >
                            <p className="text-base text-red-500 cursor-pointer">
                              REJECTED
                            </p>
                          </Tippy>
                        ) : (
                          "-"
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

          {data?.length > 0 && (
            <CommonPagination
              totalpages={totalpages}
              onPageChange={handlePagechange}
              page={page}
            />
          )}
        </div>
      )}
    </>
  );
};

export default main;
