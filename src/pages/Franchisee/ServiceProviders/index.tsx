import React, { useEffect, useState } from "react";
import Table from "../../../base-components/Table";
import { productTypesApi } from "../../../AllServices/config.service";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";

const main = () => {
  const {franchiseeId} = useFranchisee();
  const [productsData, setProductData] = useState([]);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const getData = async () => {
    setIsLoading(true)
    try {
      const res = await productTypesApi(franchiseeId);
            
      if (res?.status == 200) {
        setProductData(res?.data?.data);
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-full max-w-8xl mx-auto mt-8 p-8 md:p-10 lg:p-12 mb-16 bg-white rounded-lg shadow-lg  z-[0] relative">
      <h1 className="text-2xl font-bold ">Service Provider</h1>
      <div className="flex justify-center w-full mt-2 mb-4 border-t border-slate-200 dark:border-darkmode-400"></div>

      <div className="overflow-x-auto">
        {productsData.length > 0 ? (
          <Table className="table table-text-small mb-0 border">
            <Table.Thead
              variant="dark"
              className="thead-primary table-sorting bg-mustard"
            >
              <Table.Tr className="text-center ">
                <Table.Th className="whitespace-nowrap border">SR.NO.</Table.Th>

                <Table.Th className="whitespace-nowrap border">
                  PRODUCT
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  PRODUCT TYPE
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {productsData?.map((data, index) => (
                  <Table.Tr
                    key={index}
                    className={`text-center intro-x capitalize `}
                  >
                    <Table.Td className="border">{index + 1}.</Table.Td>
                    <Table.Td className="border">
                      {data?.parent_vendor}
                    </Table.Td>
                    <Table.Td className="border">{data?.product_name}</Table.Td>
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
    </div>
  );
};

export default main;
