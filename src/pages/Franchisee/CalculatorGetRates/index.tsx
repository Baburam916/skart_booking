import React, { useEffect, useState } from "react";
import Table from "../../../base-components/Table";
import { useLocation } from "react-router-dom";

const main = () => {
  const location = useLocation();
  const [ratesData, setRatesData] = useState([]);
  const [weight, setWeight] = useState("");

  useEffect(() => {
    setRatesData(location.state.rateData);
    setWeight(location.state.weight);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 p-8 md:p-10 lg:p-12 bg-white rounded-lg shadow-lg ">
      <h1 className="text-2xl font-bold mb-2">Rate Calculator Rates</h1>
      <ul className="list-none text-md font-bold mb-2 text-red-600">
        Disclaimer :<li> * The prices shown here are exclusive of GST.</li>
        <li> * Additional charges like (ODA, ODC, etc.) not included.</li>
      </ul>

      <div className="flex justify-center w-full my-6 border-t border-slate-200 dark:border-darkmode-400"></div>

      <div>
        <Table className="table table-text-small mb-0 border">
          <Table.Thead
            variant="dark"
            className="thead-primary table-sorting bg-mustard"
          >
            <Table.Tr className="text-center ">
              <Table.Th className="whitespace-nowrap border">SR.No.</Table.Th>
              <Table.Th className="whitespace-nowrap border">VENDOR</Table.Th>
              <Table.Th className="whitespace-nowrap border">
                PRODUCT TYPE
              </Table.Th>
              <Table.Th className="whitespace-nowrap border">COST</Table.Th>
              <Table.Th className="whitespace-nowrap border">
                CHARGEABLE WEIGHT
              </Table.Th>
              <Table.Th className="whitespace-nowrap border">TAT</Table.Th>
              <Table.Th className="whitespace-nowrap border">ACTION</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {ratesData?.map((data, index) => (
              <Table.Tr
                //   key={data.id}
                className={`text-center intro-x ${
                  index % 2 === 1 ? "bg-yellow-50" : ""
                } hover:bg-yellow-100`}
              >
                <Table.Td className="border">{index + 1}.</Table.Td>
                <Table.Td className="border">{data?.courier_id}.</Table.Td>
                <Table.Td className="border">{data?.service_type}</Table.Td>
                <Table.Td className="border">{data?.courier_rate}</Table.Td>
                <Table.Td className="border">{weight}</Table.Td>
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
