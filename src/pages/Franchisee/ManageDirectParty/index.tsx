import React from "react";
import {
  FormInline,
  FormInput,
  FormLabel,
  FormSelect,
  FormSwitch,
} from "../../../base-components/Form";
import Table from "../../../base-components/Table";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";

const main = () => {
  const datatableUsers = [
    {
      direct_party_code: "	BD11010925",
      name: "test",
      direct_party_type: "main",
      created: "04-Oct-22 05:50 pm",
    },
    {
      direct_party_code: "	BD11010925",
      name: "test",
      direct_party_type: "main",
      created: "04-Oct-22 05:50 pm",
    },
    {
      direct_party_code: "	BD11010925",
      name: "test",
      direct_party_type: "main",
      created: "04-Oct-22 05:50 pm",
    },
    {
      direct_party_code: "	BD11010925",
      name: "test",
      direct_party_type: "main",
      created: "04-Oct-22 05:50 pm",
    },
 
  ];

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 p-8 md:p-10 lg:p-12 bg-white rounded-lg shadow-lg ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-2 ">
          Business Associates Direct Party
        </h1>
        <Button rounded className=" mb-2 mr-1  text-white bg-mustard">
          ADD DIRECT PARTY
        </Button>
      </div>
      <div className="flex justify-center w-full mt-1 border-t border-slate-200 dark:border-darkmode-400"></div>

      <div className="flex items-center justify-between my-6">
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
              <Table.Th className="whitespace-nowrap border">Sr.No.</Table.Th>
              <Table.Th className="whitespace-nowrap border">
                Direct Party Code
              </Table.Th>
              <Table.Th className="whitespace-nowrap border">Name</Table.Th>
              <Table.Th className="whitespace-nowrap border">
                Direct Party Type
              </Table.Th>
              <Table.Th className="whitespace-nowrap border">Action</Table.Th>
              <Table.Th className="whitespace-nowrap border">
                <div className="flex items-center gap-2">
                  {/* <Lucide icon="ToggleRight" className="text-green-400"/> */}
                  <span>Active / Inactive</span>
                  {/* <Lucide icon="ToggleLeft" className="text-red-400"/> */}
                </div>
              </Table.Th>
              <Table.Th className="whitespace-nowrap border">
                Created(Date&Time)
              </Table.Th>
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
                <Table.Td className="border">{index + 1}.</Table.Td>
                <Table.Td className="border">
                  {data?.direct_party_code}
                </Table.Td>
                <Table.Td className="border">{data?.name}</Table.Td>
                <Table.Td className="border">
                  {data?.direct_party_type}
                </Table.Td>
                <Table.Td className="border">
                  <Button variant="twitter">Edit</Button>
                </Table.Td>
                <Table.Td className="border">
                  <FormSwitch.Input type="checkbox" />
                </Table.Td>
                <Table.Td className="border">{data?.created}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  );
};

export default main;
