import React, { useState, useEffect } from "react";
import Table from "../../../base-components/Table";
import {
  getCurrencyApi,
  getWalletRechargeHistoryApi,
} from "../../../AllServices/config.service";
import { formatDate, indianFormat, useDebounce } from "../../../utils";
import Tippy from "../../../base-components/Tippy";
import { useAlert } from "../../../ContextProvider/AlertContext";
import CommonPagination from "../Pagination";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { FormInput } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";

const Index: React.FC = () => {
  const [rechargeData, setRechargeData] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [currencyData, setCurrencyData] = useState([]);
  const { currencyId, isOverseas } = useFranchisee();

  const handlePagechange = (e: number) => {
    setPage(e);
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const response: any = await getWalletRechargeHistoryApi(
        debouncedSearch.trim(),
        20,
        page - 1
      );
      setRechargeData(response?.data?.data);
      setTotalPages(response?.data?.pages);
    } catch (error) {
      showAlert("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page, debouncedSearch]);

  useEffect(() => {
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data));
  }, []);

  return (
    <div className="w-full max-w-8xl p-6 px-10 bg-white rounded-lg shadow-lg  mt-8 mb-16  z-[0] relative">
      <div className="grid  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  xl:grid-cols-2  items-end gap-8 w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-left whitespace-nowrap">
            Wallet Recharge History
          </h1>
        </div>
        <div className="flex w-full items-end">
          <FormInput
            type="text"
            placeholder="Enter Utr No. / Skart Ref. No."
            value={search}
            className="w-2/3"
            onChange={(e) => {
              setSearch(e.target.value.replace(/\s/g, ""));
              setPage(1);
            }}
          />
          <Button
            className="w-1/3 rounded-lg bg-red-500 hover:bg-red-600 text-white ml-4"
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

      {rechargeData?.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="table table-text-small mb-0 border">
            <Table.Thead
              variant="dark"
              className="thead-primary table-sorting bg-mustard"
            >
              <Table.Tr className="text-center ">
                <Table.Th className="whitespace-nowrap border">SR.NO.</Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  {isOverseas ? "TRANSACTION ID/SKART REF. NO" : "UTRNO/SKART REF. NO"}
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  {isOverseas ? "TRANSACTION DATE" : "UTRN DATE"}
                </Table.Th>
                {isOverseas ? (
                  <Table.Th className="whitespace-nowrap border">
                    SWIFT CODE
                  </Table.Th>
                ) : null}
                <Table.Th className="whitespace-nowrap border">
                  AMOUNT{" "}
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
                  REQUEST DATE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  APPROVAL DATE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  REJECTED DATE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">STATUS</Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  PAYMENT TYPE
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rechargeData?.map((data, index) => (
                <Table.Tr key={index} className={`text-left intro-x`}>
                  <Table.Td className="border whitespace-nowrap text-right">
                    {search ? index + 1 : (page - 1) * 20 + (index + 1)}.
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">{`${data?.utr_no ? data?.utr_no + " /" : ""
                    } ${data?.ref_no}`}</Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.utrn_date || "-"}
                  </Table.Td>
                  {isOverseas ? (
                    <Table.Td className="border whitespace-nowrap">
                      {data?.transaction_id || "-"}
                    </Table.Td>
                  ) : null}
                  <Table.Td className="border whitespace-nowrap text-right">
                    {indianFormat(data?.recharge_amount) || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {formatDate(data?.initiate_datetime)}
                  </Table.Td>
                  <Table.Td
                    className={`border whitespace-nowrap ${data?.approved_status == 1 ? "text-green-500" : ""
                      }`}
                  >
                    {data?.approved_status == 1
                      ? formatDate(data?.approved_datetime)
                      : "-"}
                  </Table.Td>
                  <Table.Td
                    className={`border whitespace-nowrap ${data?.approved_status == 2 ? "text-red-500" : ""
                      }`}
                  >
                    {data?.approved_status == 2
                      ? formatDate(data?.approved_datetime)
                      : "-"}
                  </Table.Td>
                  <Table.Td
                    className={`border whitespace-nowrap ${data?.approved_status == 1
                      ? "text-green-500"
                      : data?.approved_status == 2
                        ? "text-red-500"
                        : "text-yellow-500"
                      }`}
                  >
                    <Tippy
                      content={data?.pay_remarks ? data?.pay_remarks : "NA"}
                      options={{ placement: "top" }}
                    >
                      {data?.approved_status == 0
                        ? "Pending"
                        : data?.approved_status == 1
                          ? "Approved"
                          : data?.approved_status == 2
                            ? "Rejected"
                            : ""}
                    </Tippy>
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    <Tippy
                      content={data?.payment_mode}
                      options={{ placement: "top" }}
                    >
                      {data?.payment_method == 0
                        ? "Offline"
                        : data?.payment_method == 1
                          ? "Online"
                          : ""}
                    </Tippy>
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

      {rechargeData?.length > 0 && (
        <CommonPagination
          totalpages={totalpages}
          onPageChange={handlePagechange}
          page={page}
        />
      )}
    </div>
  );
};

export default Index;
