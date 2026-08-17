import React from 'react'
import Table from '../../../base-components/Table';

const main = () => {
    const datatableUsers:any[] = [];
    return (
      <div className="w-full max-w-7xl mx-auto mt-8 p-8 md:p-10 lg:p-12 bg-white rounded-lg shadow-lg ">
        <h1 className="text-3xl font-bold mb-2">Scanned Manifest</h1>
        <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

        <div>
          <Table className="table table-text-small mb-0 border">
            <Table.Thead
              variant="dark"
              className="thead-primary table-sorting bg-mustard"
            >
              <Table.Tr className="text-center ">
                <Table.Th className="whitespace-wrap border">SR.NO.</Table.Th>
                <Table.Th className="whitespace-wrap border">
                  MANIFEST NUMBER
                </Table.Th>
                <Table.Th className="whitespace-wrap border">
                  AIRWAYBILL NO.
                </Table.Th>
                <Table.Th className="whitespace-wrap border">
                  DATE AND TIME
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {datatableUsers.length > 0 ? (
                datatableUsers?.map((data, index) => (
                  <Table.Tr
                    //   key={data.id}
                    className={`text-center intro-x ${
                      index % 2 === 1 ? "bg-yellow-50" : ""
                    } hover:bg-yellow-100`}
                  >
                    <Table.Td className="border">{}.</Table.Td>
                    <Table.Td className="border">{}</Table.Td>
                    <Table.Td className="border">{}</Table.Td>
                    <Table.Td className="border">{}</Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr className="intro-x">
                  <Table.Td className="text-center" colSpan={4}>
                    No Manifest Found...
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </div>
      </div>
    );
}

export default main