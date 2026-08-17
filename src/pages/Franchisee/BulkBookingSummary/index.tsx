import React from "react";
import Table from "../../../base-components/Table";

const main = () => {
  const datatableUsers = [{}, {}, {}, {}, {}];

  return (
    <>
      <div className="w-full max-w-6xl mx-auto mt-8 p-8 md:p-10 lg:p-12 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2"> Bulk Booking Summary</h1>
        <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

        <div className="overflow-x-auto">
          <Table className="table table-text-small mb-0 border">
            <Table.Thead className="thead-primary table-sorting bg-mustard">
              <Table.Tr className="text-center text-white">
                <Table.Th className="whitespace-nowrap border">SR.NO.</Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  BOOKING ID
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  NO. OF SHIPMENTS
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  IN QUEUE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  COMPLETED
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">ERROR</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {datatableUsers?.map((data, index) => (
                <Table.Tr
                  key={index}
                  className={`text-center intro-x capitalize `}
                >
                  <Table.Td className="border">{index + 1}.</Table.Td>
                  <Table.Td className="border"></Table.Td>
                  <Table.Td className="border"></Table.Td>
                  <Table.Td className="border"></Table.Td>
                  <Table.Td className="border"></Table.Td>
                  <Table.Td className="border"></Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default main;
