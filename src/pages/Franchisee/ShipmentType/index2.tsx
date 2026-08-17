import React, { useEffect, useState } from "react";
import Table from "../../../base-components/Table";
import { getShipmentTypesApi } from "../../../AllServices/config.service";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";

const main = () => {
  const { showAlert } = useAlert();
  const [shipmentTypes, setShipmentTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    setIsLoading(true);
    try {
      const response: any = await getShipmentTypesApi();
      // console.log(response, "response");
      if (response?.status == 200) {
        setShipmentTypes(response?.data?.data);
      } else if (response?.message == "Network Error") {
        showAlert(response?.message, "error");
      } else if (response?.response?.status == 500) {
        showAlert("Internal Server Error", "error");
      } else if (response?.response?.status == 400) {
        showAlert(response?.response?.message, "error");
      } else if (response?.response?.status == 401) {
        showAlert("Unauthorized", "error");
      } else if (response?.response?.status == 404) {
        showAlert("Not Found", "error");
      } else if (response?.response?.status == 502) {
        showAlert("Bad GateWay", "error");
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (err: any) {
      showAlert(err?.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-full max-w-8xl mx-auto mt-8 mb-16 p-8 md:p-10 lg:p-12 bg-white rounded-lg shadow-lg  z-[0] relative">
      <h1 className="text-2xl font-bold ">Shipment Type</h1>
      <div className="flex justify-center w-full mt-2 mb-4 border-t border-slate-200 dark:border-darkmode-400"></div>

      <div className="overflow-x-auto">
        {shipmentTypes?.length > 0 ? (
          <Table className="table table-text-small mb-0 border">
            <Table.Thead
              variant="dark"
              className="thead-primary table-sorting bg-mustard"
            >
              <Table.Tr className="text-center ">
                <Table.Th className="whitespace-nowrap border">SR.No.</Table.Th>

                <Table.Th className="whitespace-nowrap border">
                  SHIPMENT TYPE
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {shipmentTypes
                ?.filter((item) => item.is_active == 1)
                .map((data, index) => (
                  <Table.Tr
                    key={index}
                    className={`text-center intro-x capitalize `}
                  >
                    <Table.Td className="border">{index + 1}.</Table.Td>
                    <Table.Td className="border">
                      {data?.shipment_type}
                    </Table.Td>
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
