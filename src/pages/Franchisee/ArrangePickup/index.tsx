import React, { useState } from "react";
import { FormInline, FormInput, FormLabel, FormSelect } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";
import Pagination from "../../../base-components/Pagination";
import { ChevronsLeft } from "lucide-react";
import { ChevronsRight } from "lucide-react";

const Index: React.FC = () => {
  const datatableUsers = [
    {
      id: 1,
      awbNo: "100357062",
      mobNumber: "9780610184",
      refNumber: "ui887",
      reqDateTime: "27-Jul-2020 & 12:37am",
      pickupTime: "27-Sep-2022 & 12:34pm",
      status: "Processed",
    },
    {
      id: 2,
      awbNo: "100357062",
      mobNumber: "",
      refNumber: "",
      reqDateTime: "27-Jul-2020 & 12:37am",
      pickupTime: "",
      status: "Pending",
    },
    {
      id: 3,
      awbNo: "100357062",
      mobNumber: "",
      refNumber: "",
      reqDateTime: "27-Jul-2020 & 12:37am",
      pickupTime: "",
      status: "Processed",
    },
    {
      id: 4,
      awbNo: "100357062",
      mobNumber: "9780610184",
      refNumber: "ui887",
      reqDateTime: "27-Jul-2020 & 12:37am",
      pickupTime: "27-Sep-2022 & 12:34pm",
      status: "Processed",
    },
    {
      id: 5,
      awbNo: "100357062",
      mobNumber: "",
      refNumber: "",
      reqDateTime: "27-Jul-2020 & 12:37am",
      pickupTime: "",
      status: "Pending",
    },
    {
      id: 6,
      awbNo: "100357062",
      mobNumber: "",
      refNumber: "",
      reqDateTime: "27-Jul-2020 & 12:37am",
      pickupTime: "",
      status: "Processed",
    },
    {
      id: 7,
      awbNo: "100357062",
      mobNumber: "9780610184",
      refNumber: "ui887",
      reqDateTime: "27-Jul-2020 & 12:37am",
      pickupTime: "27-Sep-2022 & 12:34pm",
      status: "Processed",
    },
  ]; // Your data here

  const [perPage, setPerPage] = useState<number>(10);
  const [size, setSize] = useState<number>(perPage);
  const [current, setCurrent] = useState<number>(1);

  const PerPageChange = (value: number) => {
    setSize(value);
    const newPerPage = Math.ceil(datatableUsers.length / value);
    if (current > newPerPage) {
      setCurrent(newPerPage);
    }
  };

  const getData = (current: number, pageSize: number) => {
    return datatableUsers.slice((current - 1) * pageSize, current * pageSize);
  };

  const PaginationChange = (page: number, pageSize: number) => {
    setCurrent(page);
    setSize(pageSize);
  };

  const PrevNextArrow = (
    current: number,
    type: string,
    originalElement: React.ReactNode
  ) => {
    if (type === "prev") {
      return <ChevronsLeft />;
    }
    if (type === "next") {
      return <ChevronsRight />;
    }
    return originalElement;
  };
  return (
    <>
      <div className="w-full max-w-6xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg ">
        <h1 className="text-3xl font-bold mb-2">Arrange Pickup</h1>
        <div className="flex justify-center w-full my-3 border-t border-slate-200 dark:border-darkmode-400"></div>

        <div className="flex  items-end gap-8">
          <div>
            <FormLabel
              htmlFor="airwaybill"
              className="text-lg font-medium ml-1"
            >
              AWB NO. <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="airwaybill"
              placeholder="Enter Airwaybill No. For Pickup"
              formInputSize="lg"
              required
            />
          </div>
          <div>
            <Button size="lg" className=" mr-1 text-white bg-mustard">
              REQUEST
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Pending Airwaybillno's</h1>
        <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>
        <div className="flex items-center justify-between my-4">
          <div className="flex items-center gap-2">
            <div>SHOW</div>
            <FormSelect
              formSelectSize="sm"
              aria-label=".form-select-sm example"
            >
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </FormSelect>
            <div>ENTRIES</div>
          </div>
          <div>
            <FormInline>
              <FormLabel htmlFor="horizontal-form-1" className="sm:w-20">
                SEARCH:
              </FormLabel>
              <FormInput
                id="horizontal-form-1"
                type="text"
                formInputSize="sm"
                placeholder=""
              />
            </FormInline>
          </div>
        </div>
        <div className="">
          <div className="overflow-x-auto">
            <Table className="table table-text-small mb-0 border">
              <Table.Thead className="thead-primary table-sorting bg-mustard">
                <Table.Tr className="text-center text-white">
                  <Table.Th className="whitespace-wrap border">SR.NO.</Table.Th>
                  <Table.Th className="whitespace-wrap border">
                    AIRWAYBILL NO.
                  </Table.Th>
                  <Table.Th className="whitespace-wrap border">
                    MOBILE NUMBER
                  </Table.Th>
                  <Table.Th className="whitespace-wrap border">
                    REFERENCE NUMBER
                  </Table.Th>
                  <Table.Th className="whitespace-wrap border">
                    REQUEST DATE & TIME
                  </Table.Th>
                  <Table.Th className="whitespace-wrap border">
                    PICKUP DATE & TIME
                  </Table.Th>
                  <Table.Th className="whitespace-wrap border">STATUS</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {getData(current, size).map((data, index) => (
                  <Table.Tr
                    key={index}
                    className={`text-center capitalize intro-x ${
                      index % 2 == 1 ? "bg-yellow-50" : ""
                    } hover:bg-yellow-100`}
                  >
                    <Table.Td className="border">{index + 1}.</Table.Td>
                    <Table.Td className="border">{data?.awbNo}</Table.Td>
                    <Table.Td className="border">
                      {data?.mobNumber ? data?.mobNumber : "--"}
                    </Table.Td>
                    <Table.Td className="border">
                      {data?.refNumber ? data?.refNumber : "--"}
                    </Table.Td>
                    <Table.Td className="border">{data?.reqDateTime}</Table.Td>
                    <Table.Td className="border">
                      {data?.pickupTime ? data?.pickupTime : "--"}
                    </Table.Td>
                    <Table.Td className="border">
                      <Button
                        className={`text-white ${
                          data?.status == "Pending"
                            ? "bg-red-500"
                            : data?.status == "Processed"
                            ? "bg-green-400"
                            : ""
                        }`}
                      >
                        {data?.status}
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
          {/* BEGIN: Pagination */}
          <div className="flex flex-wrap items-center mt-6 intro-y sm:flex-row sm:flex-nowrap">
            <Pagination className="w-full sm:w-auto sm:mr-auto">
              <Pagination.Link>
                <Lucide icon="ChevronsLeft" className="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link>
                <Lucide icon="ChevronLeft" className="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link>...</Pagination.Link>
              <Pagination.Link>1</Pagination.Link>
              <Pagination.Link active>2</Pagination.Link>
              <Pagination.Link>3</Pagination.Link>
              <Pagination.Link>...</Pagination.Link>
              <Pagination.Link>
                <Lucide icon="ChevronRight" className="w-4 h-4" />
              </Pagination.Link>
              <Pagination.Link>
                <Lucide icon="ChevronsRight" className="w-4 h-4" />
              </Pagination.Link>
            </Pagination>
            <FormSelect className="w-20 mt-3 !box sm:mt-0">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </FormSelect>
          </div>
          {/* END: Pagination */}
        </div>
      </div>
    </>
  );
};

export default Index;
