import React, { useEffect, useState } from "react";
import Table from "../../../base-components/Table";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { getCountryApi } from "../../../AllServices/config.service";
import { dataURItoBlob } from "dropzone";
import { convertJSONtoCSV,  useDebounce } from "../../../utils";
import { FormInput } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import CommonPagination from "../Pagination";
import Lucide from "../../../base-components/Lucide";

const main = () => {
  const [countryData, setCountryData] = useState([]);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(0);
  const [spinner, setSpinner] = useState(false);
  const handleOffset = (page: number) => {
    setPage(+page);
    setOffset((+page - 1) * 20);
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await getCountryApi(debouncedSearch.trim(), offset);
      if (res?.status == 200 || res?.status == 204) {
        setCountryData(res?.data?.data || []);
        setTotalPages(res?.data?.count || 0);
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const formatData = (data: any) => {
    if (!data || data?.length == 0) return [{ "No Data Found": "" }];
    return data?.map((item: any, index: number) => ({
      "S.No": index + 1,
      "Country Name": item?.country_name || "",
      "Country Code": item?.country_code || "",
    }));
  };

  const handleDownload = async () => {
    try {
      setSpinner(true);
      const res = await getCountryApi();
      if (res?.status == 200 || res?.status == 204) {
        convertJSONtoCSV(
          formatData(res?.data?.data || []),
          "country_list.csv"
        );
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch {
      showAlert("Unable to Download CSV", "error");
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    getData();
  }, [debouncedSearch, offset]);

  return (
    <div className="w-full max-w-8xl mx-auto mt-8  p-3 px-2 lg:p-6 lg:px-10 mb-16 bg-white rounded-lg shadow-lg  z-[0] relative">
      <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-8 w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-left whitespace-nowrap">
            Country List
          </h1>
        </div>

        {/* Responsive form actions */}
        <div className="flex flex-wrap md:flex-nowrap w-full items-end gap-4">
          <FormInput
            type="text"
            placeholder="Enter Country Name"
            value={search}
            className="flex-1 min-w-[180px]"
            onChange={(e) => {
              setSearch(e.target.value.replace(/\s/g, ""));
              setOffset(0);
              setPage(1);
            }}
          />

          <Button
            className="rounded-lg bg-red-500 hover:bg-red-600 text-white"
            onClick={() => {
              setSearch("");
              setOffset(0);
              setPage(1);
            }}
          >
            RESET
          </Button>

          <Button
            className="whitespace-nowrap rounded-lg bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white"
            disabled={spinner}
            onClick={() => {
              handleDownload();
            }}
          >
            DOWNLOAD CSV{" "}
            {spinner ? (
              <LoadingIcon
                icon="puff"
                color="white"
                className="w-5 h-5 ml-2 stroke-2.5 text-white"
              />
            ) : (
              <Lucide icon="Download" className="w-4 h-4 ml-2 stroke-2.5" />
            )}
          </Button>
        </div>
      </div>
      <div className="flex justify-center w-full mt-2 mb-4 border-t border-slate-200 dark:border-darkmode-400"></div>

      <div className="overflow-x-auto">
        {countryData.length > 0 ? (
          <Table className="table table-text-small mb-0 border">
            <Table.Thead
              variant="dark"
              className="thead-primary table-sorting bg-mustard"
            >
              <Table.Tr className="text-center ">
                <Table.Th className="whitespace-nowrap border">SR.NO.</Table.Th>

                <Table.Th className="whitespace-nowrap border">
                  COUNTRY NAME
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  COUNTRY FLAG
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  COUNTRY CODE
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {countryData?.map((data, index) => (
                <Table.Tr
                  key={index}
                  className={`text-center intro-x capitalize `}
                >
                  <Table.Td className="border">
                    {(page - 1) * 20 + (index + 1)}.
                  </Table.Td>
                  <Table.Td className="border">{data?.country_name}</Table.Td>
                  <Table.Td className="border">
                    <div className="flex justify-center">
                      <img
                        src={`https://flagsapi.com/${data?.country_code}/flat/32.png`}
                        alt={data?.country_code}
                      />
                    </div>
                  </Table.Td>
                  <Table.Td className="border">{data?.country_code}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : isLoading ? (
          <LoadingIcon icon="tail-spin" className="block m-auto w-[4%] " />
        ) : (
          <p className="text-gray-400 text-center">No Data Found!</p>
        )}
      </div>
      {totalpages > 1 && (
        <CommonPagination
          totalpages={+totalpages}
          onPageChange={handleOffset}
          page={+page}
        />
      )}
    </div>
  );
};

export default main;
