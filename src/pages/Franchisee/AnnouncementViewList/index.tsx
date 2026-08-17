import React from "react";
import {
  FormInline,
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../base-components/Form";
import Table from "../../../base-components/Table";

const main = () => {
  const datatableUsers = [{}, {}];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg ">
      <h1 className="text-3xl font-bold mb-2 ">sKart Announcement</h1>
      <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

      <div className="flex items-center justify-between my-4">
        <div className="flex items-center gap-2">
          <div>SHOW</div>
          <FormSelect formSelectSize="sm" aria-label=".form-select-sm example">
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

      <div>
        <Table className="table table-text-small mb-0 border">
          <Table.Thead
            variant="dark"
            className="thead-primary table-sorting bg-mustard"
          >
            <Table.Tr className="text-center ">
              <Table.Th className="whitespace-wrap border">Sr.No.</Table.Th>
              <Table.Th className="whitespace-wrap border">Date</Table.Th>
              <Table.Th className="whitespace-wrap border">
                Transaction Type
              </Table.Th>
              <Table.Th className="whitespace-wrap border">AWB No.</Table.Th>
              <Table.Th className="whitespace-wrap border">
                Opening Balance
              </Table.Th>
              <Table.Th className="whitespace-wrap border">Dr</Table.Th>
              <Table.Th className="whitespace-wrap border">Cr</Table.Th>
              <Table.Th className="whitespace-wrap border">
                Closing Balance
              </Table.Th>
              <Table.Th className="whitespace-wrap border">
                UTR No/ Chq No/NEFT
              </Table.Th>
              <Table.Th className="whitespace-wrap border">Remarks</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {datatableUsers?.map((data, index) => (
              <Table.Tr
                //   key={data.id}
                className={`text-center intro-x capitalize ${
                  index % 2 == 1 ? "bg-yellow-50" : ""
                } hover:bg-yellow-100`}
              >
                <Table.Td className="border">{}.</Table.Td>
                <Table.Td className="border">{}.</Table.Td>
                <Table.Td className="border">{}</Table.Td>
                <Table.Td className="border">{}</Table.Td>
                <Table.Td className="border">{}</Table.Td>
                <Table.Td className="border">{}</Table.Td>
                <Table.Td className="border">{}</Table.Td>
                <Table.Td className="border">{}</Table.Td>
                <Table.Td className="border">{}</Table.Td>
                <Table.Td className="border">{}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
};

export default main;
