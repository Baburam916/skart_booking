import React, { useEffect, useState } from "react";
import Table from "../../../base-components/Table";
import { getShipmentTypesApi } from "../../../AllServices/config.service";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import parcelSample from "../../../assets/images/icons/parcel_sample_icon.png";
import courierDocument from "../../../assets/images/icons/courier_document_icon.png";
import courierCommercial from "../../../assets/images/icons/courier_commercial_icon.png";
import cargoCommercial from "../../../assets/images/icons/cargo_commercial_icon.png";
import eCommerce from "../../../assets/images/icons/e-commerce_icon.png";
import csbv from "../../../assets/images/icons/csb_v_icon.png";
import fairExhibition from "../../../assets/images/icons/fair_exhibition_icon.png";



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
    <div className="box m-auto p-4 lg:px-[20px] lg:py-[30px]  md:px-[20px] md:py-[50px]  mt-8 w-full">
      <div className="lg:w-[100%]  xl:w-[100%] 2xl:w-[1000px]  m-auto">
        <h1 className="mb-3 font-bold text-2xl">Shipment Type</h1>

        <div className="overflow-x-auto">
          {shipmentTypes?.length > 0 ? (
            <div className="grid grid-cols-12 gap-4">
              {shipmentTypes
                ?.filter((item) => item.is_active == 1)
                .map((data, index) => (
                  <div
                    className="col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-3"
                    key={index}
                  >
                    <div className="shipmentTypeicon min-h-[188px] md:min-h-auto w-full  border-[#F4DCA4] border bg-[#FEFBF4] items-center justify-center grid m-auto rounded-lg p-4 cursor-pointer">
                      <figure className=" border bg-[#FFF4DA] border-[#FFE4A7] rounded-full p-[10px] mb-2 w-[92px] h-[92px] flex items-center justify-center m-auto ">
                        <img
                          src={
                            data?.booking_shipment_type_id == 1
                              ? parcelSample
                              : data?.booking_shipment_type_id == 2
                              ? courierDocument
                              : data?.booking_shipment_type_id == 4
                              ? courierCommercial
                              : data?.booking_shipment_type_id == 5
                              ? cargoCommercial
                              : data?.booking_shipment_type_id == 6
                              ? eCommerce
                              : data?.booking_shipment_type_id == 7
                              ? csbv
                              : data?.booking_shipment_type_id == 8
                              ? fairExhibition
                              : courierCommercial
                          }
                        />
                      </figure>
                      <h2 className=" mt-1 text-base font-bold text-center text-[#363636]">
                        {" "}
                        {data?.shipment_type}
                      </h2>
                    </div>
                  </div>
                ))}
            </div>
          ) : isLoading ? (
            <LoadingIcon icon="tail-spin" className="block m-auto w-[4%] " />
          ) : (
            <p className="text-gray-400 text-center">No Data Found!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default main;
