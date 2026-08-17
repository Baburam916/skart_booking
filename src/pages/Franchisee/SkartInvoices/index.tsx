import React, { useState, useEffect } from "react";
import Table from "../../../base-components/Table";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import Button from "../../../base-components/Button";
import { useAlert } from "../../../ContextProvider/AlertContext";
import CommonPagination from "../Pagination";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { downloadAttachment, indianFormat, useDebounce } from "../../../utils";
import {
  getCurrencyApi,
  getSkartInvoicesApi,
} from "../../../AllServices/config.service";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";

const Index: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [invoiceType, setInvoiceType] = useState<number>(1);
  const { currencyId, isOverseas } = useFranchisee();

  const [currencyData, setCurrencyData] = useState([]);

  const handlePagechange = (e: number) => {
    setPage(e);
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const response: any = await getSkartInvoicesApi(
        invoiceType,
        debouncedSearch.trim(),
        10,
        search ? 0 : page - 1
      );
      setInvoiceData(response?.data?.data);
      setTotalPages(response?.data?.pages);
    } catch (error) {
      showAlert("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [invoiceType, page, debouncedSearch]);

  useEffect(() => {
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data));
  }, []);

  return (
    <div className="w-full max-w-8xl  p-6 px-10 bg-white rounded-lg shadow-lg  mt-8 mb-16  z-[0] relative">
      <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  xl:grid-cols-3  items-end gap-8 w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold">View Bills</h1>
        </div>

        <div className="w-full">
          <FormSelect
            value={invoiceType}
            onChange={(e) => {
              setInvoiceType(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={1}>E-Invoice</option>
            <option value={0}>Invoice</option>
          </FormSelect>
        </div>
        <div className="w-full flex gap-4">
          {" "}
          <FormInput
            type="text"
            placeholder="Enter Bill No."
            value={search}
            className="w-2/3"
            onChange={(e) => setSearch(e.target.value.replace(/\s/g, ""))}
          />
          <Button
            className="w-1/3 rounded-lg bg-red-500 hover:bg-red-600 text-white"
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
      <div className="">
        {invoiceData?.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="table table-text-small mb-0 border">
              <Table.Thead className="thead-primary table-sorting bg-mustard">
                <Table.Tr className="text-center text-white">
                  <Table.Th className="whitespace-nowrap border">
                    SR.NO.
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    BILL NO
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    INVOICE DATE
                  </Table.Th>
                  <Table.Th className="whitespace-wrap border">PERIOD</Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    OUTSTANDING{" "}
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
                  {/* <Table.Th className="whitespace-nowrap border">
                    Credit Note,Debit Note & Additional Invoice
                  </Table.Th> */}
                  <Table.Th className="whitespace-nowrap border">
                    SUMMARY
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {invoiceData?.map((data, index) => (
                  <Table.Tr key={index} className={`text-left intro-x  `}>
                    <Table.Td className="border text-right">
                      {" "}
                      {search ? index + 1 : (page - 1) * 10 + (index + 1)}.
                    </Table.Td>
                    <Table.Td className="border">
                      {data?.bill_no || "N.A."}
                    </Table.Td>
                    <Table.Td className="border">
                      {data?.invoice_date || "N.A."}
                    </Table.Td>

                    <Table.Td className="border whitespace-wrap">
                      {/* {data?.from_date && data?.to_date
                        ? `${data?.from_date} - ${data?.to_date}`
                        : "N.A."} */}
                      {data?.from_date && data?.to_date ? (
                        <>
                          <span className="whitespace-nowrap">
                            {data?.from_date}
                          </span>{" "}
                          to{" "}
                          <span className="whitespace-nowrap">
                            {data?.to_date}
                          </span>
                        </>
                      ) : (
                        "N.A."
                      )}
                    </Table.Td>

                    <Table.Td className="border text-right">
                      {indianFormat(data?.inv_balance_amount) || "N.A."}
                    </Table.Td>
                    {/* <Table.Td className="border">
                      <div>
                        <div className="flex item-center gap-4 my-2">
                          <FormSelect formSelectSize="sm" className="h-8">
                            <option>Invoice No.</option>
                          </FormSelect>
                          <Button
                            variant="linkedin"
                            size="sm"
                            className="h-8 whitespace-nowrap"
                          >
                            Debit Note
                          </Button>
                        </div>
                        <div className="flex item-center gap-4 my-2">
                          <FormSelect formSelectSize="sm" className="h-8">
                            <option>Invoice No.</option>
                          </FormSelect>
                          <Button
                            variant="linkedin"
                            size="sm"
                            className="h-8 whitespace-nowrap"
                          >
                            Additional Invoice
                          </Button>
                        </div>
                        <div className="flex item-center gap-4 my-2">
                          <FormSelect formSelectSize="sm" className="h-8">
                            <option>Invoice No.</option>
                          </FormSelect>
                          <Button
                            variant="linkedin"
                            size="sm"
                            className="h-8 whitespace-nowrap"
                          >
                            Credit Note
                          </Button>
                        </div>
                      </div>
                    </Table.Td> */}
                    <Table.Td className="border p-0">
                      <div className="flex justify-center">
                        {/* <Button rounded variant="twitter" className="mb-2 mr-1">
                          <Lucide icon="Eye" className="w-10 h-5" />
                        </Button> */}

                        <Lucide
                          icon="Eye"
                          className="w-8 h-8 cursor-pointer stroke-2.5 text-mustard"
                          onClick={() =>
                            downloadAttachment(
                              isOverseas == 1
                                ? data?.currency_invoice_pdf
                                : data?.invoice_pdf || data?.invoice_pdf,
                              "invoice"
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
        ) : isLoading ? (
          <LoadingIcon icon="tail-spin" className="block m-auto w-[4%] " />
        ) : (
          <p className="text-gray-400 text-center">No Data Found!</p>
        )}

        {/* BEGIN: Pagination */}

        {invoiceData?.length > 0 && (
          <CommonPagination
            totalpages={totalpages}
            onPageChange={handlePagechange}
            page={page}
          />
        )}
        {/* END: Pagination */}
      </div>
    </div>
  );
};

export default Index;
