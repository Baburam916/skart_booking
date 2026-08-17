import React, { useEffect, useState } from "react";
import Table from "../../../base-components/Table";
import {
  addressLabel,
  getOrganizationDocumentsApi,
  walkinCustomer,
} from "../../../AllServices/config.service";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import CommonPagination from "../Pagination";
import { useAlert } from "../../../ContextProvider/AlertContext";
import Button from "../../../base-components/Button";
import { downloadAttachment, useDebounce } from "../../../utils";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { FormInput } from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";

const main = () => {
  const [walkinData, setWalkinData] = useState([]);
  const [documentTypeList, setDocumentTypeList] = useState([]);
  const { franchiseeId } = useFranchisee();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalpages, setTotalPages] = useState(1);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [labelSpinner, setLabelSpinner] = useState({
    index: "",
    state: false,
  });

  const getData = async () => {
    setIsLoading(true);
    const data = {
      franchisee_id: franchiseeId,
      perPage: "20",
      page: page - 1,
      search: debouncedSearch.trim(),
    };

    try {
      const response = await walkinCustomer(data);
      // console.log(response?.data);
      if (response?.status == 200) {
        if (response?.data?.data?.length > 0) {
          setWalkinData(response?.data?.data);
          setTotalPages(Math.ceil(response?.data?.total_records / 20));
        } else {
          setWalkinData([]);
          setTotalPages(1);
          showAlert("No Data Found", "warning");
        }
      } else {
        setWalkinData([]);
        showAlert("Something went wrong", "error");
      }
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const getDocumentType = async () => {
    try {
      const res = await getOrganizationDocumentsApi();
      if (res?.status == 200) {
        setDocumentTypeList(res?.data?.data);
        // console.log(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePagechange = (e: number) => {
    setPage(e);
    setOffset(e - 1);
  };

  const generateAddressLabel = async (index, awb) => {
    setLabelSpinner({ index: index, state: true });
    try {
      const response = await addressLabel(awb);
      if (response?.data?.status == 200) {
        window.open(response?.data?.url, "_blank");
        getData();
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (error) {
      showAlert("Error while generating address label", "error");
      console.log(error);
    } finally {
      setLabelSpinner({ index: "", state: false });
    }
  };

  useEffect(() => {
    getDocumentType();
  }, []);

  useEffect(() => {
    getData();
  }, [page, debouncedSearch]);

  return (
    <div className="w-full max-w-8xl p-6 px-10  bg-white rounded-lg shadow-lg  mt-8 mb-16  z-[0] relative">
      <div className="grid  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  xl:grid-cols-2  items-end gap-8 w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-left whitespace-nowrap">
            Walkin Customer
          </h1>
        </div>
        <div className="flex w-full items-end">
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

      {walkinData?.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="table table-text-small mb-0 border">
            <Table.Thead
              variant="dark"
              className="thead-primary table-sorting bg-mustard"
            >
              <Table.Tr className="text-center ">
                <Table.Th className="whitespace-nowrap border">SR.NO.</Table.Th>
                <Table.Th className="whitespace-nowrap border">NAME</Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  AIRWAYBILL NO.
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  REFERENCE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  BOOKING DATE
                </Table.Th>

                <Table.Th className="whitespace-nowrap border">
                  PROFORMA INVOICE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  SHIPPER INVOICE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  AWB LABEL
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  ADDRESS LABEL
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  KYC DOCUMENTS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {walkinData?.map((data, index) => (
                <Table.Tr key={index} className={`text-left intro-x`}>
                  <Table.Td className="border whitespace-nowrap text-right">
                    {search ? index + 1 : (page - 1) * 20 + (index + 1)}.
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap  capitalize">
                    {data?.shipper_name || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap  capitalize">
                    {data?.airwaybillno || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap ">
                    {data?.order_referenceno || "N.A."}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap ">
                    {data?.booking_date || "N.A."}
                  </Table.Td>

                  <Table.Td className="border whitespace-nowrap ">
                    {data?.invoice_url ? (
                      <Lucide
                        icon="FileText"
                        className="cursor-pointer h-6 block text-center w-[100%] text-blue-500 stroke-2.5"
                        onClick={() =>
                          downloadAttachment(
                            data?.invoice_url,
                            "Performa Invoice"
                          )
                        }
                      />
                    ) : (
                      "N.A."
                    )}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap ">
                    {data?.shipper_invoice ? (
                      <Lucide
                        icon="FileText"
                        className="cursor-pointer h-6 block text-center w-[100%] text-blue-500 stroke-2.5"
                        onClick={() =>
                          downloadAttachment(
                            data?.shipper_invoice,
                            "Shipper Invoice"
                          )
                        }
                      />
                    ) : (
                      "N.A."
                    )}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap ">
                    {data?.airwaybillno ? (
                      <Lucide
                        icon="FileBox"
                        className="cursor-pointer h-6 block text-center w-[100%] text-blue-500 stroke-2.5"
                        onClick={() =>
                          downloadAttachment(data?.dispatch_label, "AWB_Label")
                        }
                      />
                    ) : (
                      "Not Generated"
                    )}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap ">
                    {data?.address_url ? (
                      <Lucide
                        icon="MapPin"
                        className="cursor-pointer h-6 block text-center w-[100%] text-blue-500 stroke-2.5"
                        onClick={() =>
                          downloadAttachment(data?.address_url, "Address Label")
                        }
                      />
                    ) : (
                      <Button
                        className=" bg-mustard border-none text-white"
                        onClick={() =>
                          generateAddressLabel(index, data?.airwaybillno)
                        }
                        disabled={
                          labelSpinner?.state == true &&
                          labelSpinner?.index == index
                        }
                      >
                        ADDRESS LABEL{" "}
                        {labelSpinner?.index == index &&
                          labelSpinner?.state == true && (
                            <LoadingIcon
                              icon="puff"
                              color="white"
                              className="w-5 h-5 ml-2 stroke-2.5 text-white"
                            />
                          )}
                      </Button>
                    )}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap ">
                    {data?.kyc?.document_id_1 && data?.kyc?.document_id_2 ? (
                      <>
                        <Button
                          className="rounded-lg bg-green-500 text-white hover:bg-green-700"
                          onClick={() =>
                            downloadAttachment(
                              data?.kyc?.document_path_1,
                              "document_1"
                            )
                          }
                        >
                          {/* Document One */}
                          {
                            documentTypeList
                              ?.find(
                                (elem) =>
                                  elem?.organisation_id == data?.orgnization_id
                              )
                              ?.value?.find(
                                (item) => item?.id == data?.kyc?.document_id_1
                              )?.value
                          }
                        </Button>{" "}
                        <Button
                          className="rounded-lg bg-cyan-500 text-white hover:bg-cyan-700"
                          onClick={(e) => {
                            e.preventDefault();
                            downloadAttachment(
                              data?.kyc?.document_path_2,
                              "document_2"
                            );
                          }}
                        >
                          {/* Document Two */}
                          {
                            documentTypeList
                              ?.find(
                                (elem) =>
                                  elem?.organisation_id == data?.orgnization_id
                              )
                              ?.value?.find(
                                (item) => item?.id == data?.kyc?.document_id_2
                              )?.value
                          }
                        </Button>
                      </>
                    ) : (
                      "	No Documents"
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

      {walkinData?.length > 0 && (
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
