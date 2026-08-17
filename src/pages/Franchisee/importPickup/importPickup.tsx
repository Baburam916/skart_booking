import React, { useState, useEffect } from "react";
import Table from "../../../base-components/Table";

import Tippy from "../../../base-components/Tippy";
import { useAlert } from "../../../ContextProvider/AlertContext";
import CommonPagination from "../Pagination";
import LoadingIcon from "../../../base-components/LoadingIcon";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import { GET, POST, commongetrequest } from "../../../AllServices/services";
import Nodatafound from "../../../components/Nodata/Nodatafound";
import { useLogin } from "../../../ContextProvider/LoginContext";
import { Settings } from "lucide-react";
import CommonModal from "../../../components/CommonModal";
import styles from "./importbooking.module.css";
import { update } from "lodash";
import { formatDate, getCurrentDate } from "../../../utils";
import { Eye } from "lucide-react";
const intdatatoget = {
  from_date: "",

  to_date: "",

  airwaybill_no: "",

  franchisee_id: "",
};
const intpincodedata = {
  city: "",
  state: "",
  pickup_id: "",
};
export default function UpdatePickup() {
  const [alldata, setAllData] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [pickupdates, setPickupdates] = useState<any>([]);
  const [forwhat, setForwhat] = useState<any>(1);
  const { userdata } = useLogin();
  const [datatoget, setDatatoget] = useState<any>({
    ...intdatatoget,
    franchisee_id: userdata?.mapped_id,
  });
  const [pincodedata, setPincodedata] = useState<any>(intpincodedata);
  const [tippystate, setTippyState] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModal2, setOpenModal2] = useState<boolean>(false);
  const [updateModaldata, setupdateModaldata] = useState<any>({});
  const [pickupdata, setPickupdata] = useState<any>({});
  const [updateloading, setUpdateLoading] = useState<boolean>(false);
  const [cancelloading, setCancelLoading] = useState<boolean>(false);

  const handlePagechange = (e: number) => {
    setPage(e);
  };

  const getData = async () => {
    try {
      setIsLoading(true);
      const response: any = await POST(
        `/booking/get_booking_import?page=${page - 1}&limit=20`,
        datatoget,
      );
      if (response?.status == 200) {
        setAllData(response?.data?.data || []);

        setTotalPages(Math.ceil(Number(response?.data?.total) / 20) || 1);
      } else {
        setAllData([]);
        setTotalPages(1);
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (datatoget?.from_date && datatoget?.to_date) {
      getData();
    }
  }, [page]);
  const handleCancel = () => {
    setPincodedata(intpincodedata);
    setupdateModaldata({});
    setUpdateLoading(false);
  };
  const handlechange = (e: any) => {
    const { name, value } = e.target;
    setDatatoget((pre: any) => ({ ...pre, [name]: value }));
    setAllData([]);
    setTotalPages(1);
    setPage(1);
  };
  function mergeDateOnlyWithTime(dateOnly: any, timeString: any) {
    // console.log(dateOnly,timeString,"both coming")

    const [year, month, day] = dateOnly?.split("-").map(Number);
    const [hours, minutes, seconds] = timeString.split(":")?.map(Number);

    // Create UTC date
    const date = new Date(
      Date?.UTC(year, month - 1, day, hours, minutes, seconds || 0),
    );

    return date.toISOString();
  }
  const extractdata = (item?: any) => {
    return {
      airwaybilno: item.airwaybilno,
      consigner_company_name: item.company_name || "",
      consigner_first_name: item.shipper_name || "",
      consigner_mobile_number: item.mobile_no || "",
      consigner_pincode: item.pincode || "",
      consigner_country_code: item.extra_data?.origin_country_code || "",
      consigner_address_1: item?.gst_registered_address || "",
      consigner_address_2: item?.street_address || "",
      consigner_city: item.city_name || "",
      consigner_state: item.state || "",
      consigner_date_timestamp:
        mergeDateOnlyWithTime(
          pickupdata?.pickupDate,
          item?.consigner_close_time2,
        ) || "",
      consigner_close_time: item.consigner_close_time || "",
      consigner_close_time2: item.consigner_close_time2 || "",
      actual_weight: item.actual_weight || 0,
      product_description: item.product_description || "",
      consigner_email_id: item.email_id || "",
      number_of_pieces: item?.number_of_pieces || "",
      courier_code: item?.courier_code || "",
    };
  };
  const handleUpdate = async (value: any,type?:any) => {
    let data: any;
    if (value == 1) {
        if (type == "aramex") {
          data = {
            consigner_country_code: pickupdata?.extra_data?.origin_country_code,
            consigner_pincode: pickupdata?.extra_data?.origin_pincode,
            airwaybilno: pickupdata?.airwaybilno,
            consigner_address_1: pickupdata?.gst_registered_address || "",
            consigner_address_2: pickupdata?.street_address || "",
            consigner_first_name: pickupdata?.shipper_name || "",
            consigner_company_name: pickupdata?.company_name || "",
            consigner_mobile_number: pickupdata?.mobile_no || "",
            consigner_email_id: pickupdata?.email_id || "",
            consigner_city: pickupdata?.extra_data?.origin_city,
            actual_weight: pickupdata?.actual_weight,
            courier_code: "aramex",
            PickupDate: pickupdata?.PickupDate,
            ReadyTime: pickupdata?.ReadyTime,
            LastPickupTime: pickupdata?.LastPickupTime,
            ClosingTime: pickupdata?.ClosingTime,
          };
        }else{

    
      data = extractdata(pickupdata);
      if (
        (!data?.consigner_close_time && value == 1) ||
        !data?.consigner_date_timestamp ||
        !data?.consigner_close_time2
      ) {
        showAlert("Please provide Required Details", "warning");
        return;
      }
    }}
    if (value == 1) {
      delete data["consigner_close_time2"];
    }

    try {
      value == 1 ? setUpdateLoading(true) : setCancelLoading(true);
      const res =
        value == 1
          ? await POST(`/book/create_pickup`, data)
          : await POST(`/book/cancel_pickup`, {
              airwaybilno: updateModaldata?.airwaybilno || "",
              pickup_confirmation_code:
                updateModaldata?.pickupconfirmationcode || "",
              scheduled_date: getCurrentDate(),
              location: updateModaldata?.location || "",
            });

      if (res?.status == 200) {
        if (res?.data?.status == 200) {
          showAlert(
            "Action Performed Successfully",
            res?.data?.message ||
              res?.data?.errors[0]?.message ||
              res?.data?.message ||
              "Updated Successfully",
          );
          setOpenModal(false);
          setPickupdata({});
          setupdateModaldata({});
          setOpenModal2(false);
          getData();
        } else {
          showAlert(
            res?.data?.message ||
              res?.data?.errors[0]?.message ||
              res?.data?.message ||
              "Updated Successfully",
            "error",
          );
        }
      } else {
        showAlert(
          res?.response?.data?.message ||
            res?.response?.data?.errors[0]?.message ||
            "Something went wrong please try after some time ",
          "error",
        );
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setUpdateLoading(false);
      setCancelLoading(false);
    }
  };
  const handlereset = () => {
    setDatatoget({ ...intdatatoget, franchisee_id: userdata?.mapped_id });
    setTotalPages(1);
    setAllData([]);
    setPage(1);
  };

  const getpincodedata = async (value: any) => {
    try {
      const res = await commongetrequest(
        `admin/domestic-pincode/${value?.extra_data["destination_pincode"]}`,
      );
      if (res?.status == 200) {
        const data = res?.data?.data[0];
        setPincodedata(
          {
            pickup_id: value?.pickup_id,
            state: data?.state || "",
            city: data?.city,
          } || { ...intpincodedata, pickup_id: value["pickup_id"] },
        );
      } else {
        setPincodedata({ ...intpincodedata, pickup_id: value["pickup_id"] });
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };
  const getpickupdetails = async (data: any, value: any) => {
    try {
      value == 1 ? setUpdateLoading(true) : setCancelLoading(true);
      const res =
        value == 1
          ? await POST("/book/check_pickup_availabilty", {
              airwaybilno: data?.airwaybilno || "",

              consigner_pincode: data?.extra_data?.origin_pincode || "",

              consigner_country_code:
                data?.extra_data?.origin_country_code || "",
            })
          : await POST("/booking/get_fedex_pickup_data?page=0&limit=20", {
              airwaybilno: data?.airwaybilno || "",

              from_date: datatoget?.from_date || "",

              to_date: datatoget?.to_date || "",
            });
      if (res?.status == 200) {
        const data = res?.data;
        if (value == 1) {
          setupdateModaldata({
            latestTimeOptions: data?.latestTimeOptions,
            pickupDate: data?.pickupDate,
            readyTimeOptions: data?.readyTimeOptions,
          });
        } else {
          setupdateModaldata({
            ...data?.data[0],
            scheduled_date: getCurrentDate(),
          });
        }

        value == 1 ? setOpenModal(true) : setOpenModal2(true);
      } else {
        setupdateModaldata({});
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setUpdateLoading(false);
      setPincodedata(intpincodedata);
      setCancelLoading(false);
    }
  };

  const modaldescription = (
    <div>
      {" "}
      {forwhat == 1 && pickupdata?.courier_code?.toLowerCase() == "fedex" ? (
        <span className={`text-red-500  `}> NOTE*: </span>
      ) : (
        ""
      )}
      {forwhat == 1 && pickupdata?.courier_code?.toLowerCase() == "fedex" ? (
        <span className={`text-red-500   `}>
          Please ensure the pickup is ready at least three hours before the
          scheduled pickup time.
        </span>
      ) : (
        ""
      )}
      {pickupdata?.courier_code?.toLowerCase() == "fedex" ? (
        <div className="grid lg:grid-cols-3 gap-4 mt-2">
          <div>
            <FormLabel>
              PICKUP DATE <span className="text-red-400">*</span>
            </FormLabel>
            {forwhat == 2 ? (
              <FormInput
                value={formatDate(pickupdata?.pickup_transaction_date)}
                disabled
              />
            ) : (
              <FormSelect
                value={pickupdata?.pickupDate}
                onChange={(e: any) =>
                  setPickupdata((pre: any) => ({
                    ...pre,
                    pickupDate: e.target.value,
                  }))
                }
              >
                <option value={""}>Select</option>
                {updateModaldata?.pickupDate?.map((item: any) => (
                  <option value={item}>{item}</option>
                ))}
              </FormSelect>
            )}
          </div>
          <div>
            <FormLabel>
              PICKUP READY SLOT (24-HOUR){" "}
              <span className="text-red-400">*</span>
            </FormLabel>
            {forwhat == 2 ? (
              <FormInput
                value={pickupdata?.pickup_transaction_ready_slot}
                disabled
              />
            ) : (
              <FormSelect
                value={pincodedata?.consigner_close_time2}
                onChange={(e: any) => {
                  setPickupdata((pre: any) => ({
                    ...pre,
                    consigner_close_time2: e.target.value,
                  }));
                }}
              >
                <option value="">Select</option>
                {updateModaldata?.readyTimeOptions?.map(
                  (obj: any, i: number) => {
                    const key = Object.keys(obj)[0]; // "20:00:00"
                    const value = obj[key]; // "20:00:00"

                    return (
                      <option key={i} value={value}>
                        {value}
                      </option>
                    );
                  },
                )}
              </FormSelect>
            )}
          </div>

          <div>
            <FormLabel>
              Last Avail. Pickup Slot (24-HOUR){" "}
              <span className="text-red-400">*</span>
            </FormLabel>
            {forwhat == 2 ? (
              <FormInput
                value={pickupdata?.pickup_transaction_close_slot}
                disabled
              />
            ) : (
              <FormSelect
                value={pincodedata?.consigner_close_time}
                onChange={(e: any) => {
                  setPickupdata((pre: any) => ({
                    ...pre,
                    consigner_close_time: e.target.value,
                  }));
                }}
              >
                <option value="">Select</option>
                {updateModaldata?.latestTimeOptions?.map(
                  (obj: any, i: number) => {
                    const key = Object.keys(obj)[0]; // "20:00:00"
                    const value = obj[key]; // "20:00:00"

                    return (
                      <option key={i} value={value}>
                        {value}
                      </option>
                    );
                  },
                )}
              </FormSelect>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      {pickupdata?.courier_code?.toLowerCase() == "aramex" ? (
        <div className="col-span-6 gap-2">
          <div className="grid lg:grid-cols-4 gap-4 mt-2">
            <div>
              <FormLabel>
                PICKUP DATE <span className="text-red-400">*</span>
              </FormLabel>

              <FormInput
                type="date"
                value={pickupdata?.pickupDate}
                max={pickupdata?.LastPickupTime}
                onChange={(e: any) => {
                  setPickupdata((pre: any) => ({
                    ...pre,
                    PickupDate: e.target.value,
                  }));
                }}
              />
            </div>
            <div>
              <FormLabel>
                READY DATE
                <span className="text-red-400">*</span>
              </FormLabel>

              <FormInput
                type="date"
                max={pickupdata?.ClosingTime}
                value={pickupdata?.ReadyTime}
                onChange={(e: any) => {
                  setPickupdata((pre: any) => ({
                    ...pre,
                    ReadyTime: e.target.value,
                  }));
                }}
              />
            </div>

            <div>
              <FormLabel>
                LAST PICKUP DATE
                <span className="text-red-400">*</span>
              </FormLabel>

              <FormInput
                type="date"
                value={pickupdata?.LastPickupTime}
                min={pickupdata?.pickupDate}
                onChange={(e: any) => {
                  setPickupdata((pre: any) => ({
                    ...pre,
                    LastPickupTime: e.target.value,
                  }));
                }}
              />
            </div>
            <div>
              <FormLabel>
                CLOSING DATE
                <span className="text-red-400">*</span>
              </FormLabel>

              <FormInput
                type="date"
                value={pickupdata?.ClosingTime}
                min={pickupdata?.ReadyTime}
                onChange={(e: any) => {
                  setPickupdata((pre: any) => ({
                    ...pre,
                    ClosingTime: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
  const description2 = (
    <div className="text-center">
      {updateModaldata?.location && updateModaldata?.pickupconfirmationcode
        ? " Are You Sure , You want to perform this "
        : "Oops! Cancellation can't be performed."}
    </div>
  );
  const ModalFooter = (
    <>
      <Button
        className="bg-primary text-white"
        onClick={() => {
          setupdateModaldata({});
          setOpenModal(false);
          setPincodedata(intpincodedata);
          setUpdateLoading(false);
          setPickupdata({});
          setForwhat(1);
        }}
      >
        Cancel
      </Button>
      {forwhat == 1 ? (
        <Button
          className="bg-mustard text-white p-2"
          disabled={
            pickupdata?.courier_code?.toLowerCase() == "aramex"
              ? !pickupdata?.ClosingTime ||
                !pickupdata?.LastPickupTime ||
                !pickupdata?.ReadyTime ||
                !pickupdata?.PickupDate
              : !pickupdata?.pickupDate ||
                !pickupdata?.consigner_close_time ||
                !pickupdata?.consigner_close_time2
          }
          onClick={() =>
            handleUpdate(1, pickupdata?.courier_code?.toLowerCase())
          }
        >
          {updateloading ? "Processing.." : "Schedule"}
        </Button>
      ) : (
        ""
      )}
    </>
  );
  const footer2 = (
    <>
      <Button
        className="bg-primary text-white"
        onClick={() => {
          setupdateModaldata({});
          setOpenModal2(false);
          setPincodedata(intpincodedata);
          setUpdateLoading(false);
        }}
      >
        Cancel
      </Button>
      <Button className="bg-red-400 text-white" onClick={() => handleUpdate(2)}>
        Cancel Pickup
        {cancelloading && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
    </>
  );
  return (
    <>
      <div className="w-full max-w-8xl p-6 px-10 bg-white rounded-lg shadow-lg  mt-8 mb-2 z-[0] relative">
        <div className="w-full">
          <div className="w-full">
            <h1 className="text-2xl font-bold text-left whitespace-nowrap">
              Schedule Pickup (Import Booking)
            </h1>
          </div>
        </div>

        <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>
        <div className="grid  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4  xl:grid-cols-4  items-end gap-8">
          <div className="">
            <FormLabel>
              FROM DATE <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              type="date"
              value={datatoget?.from_date}
              max={datatoget?.to_date}
              name="from_date"
              onChange={handlechange}
            />
          </div>
          <div className="">
            <FormLabel>
              TO DATE <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              type="date"
              name="to_date"
              value={datatoget?.to_date}
              min={datatoget?.from_date}
              onChange={handlechange}
            />
          </div>
          <div className="">
            <FormLabel>AIRWAYBILL NO.</FormLabel>
            <FormInput
              name="airwaybill_no"
              placeholder={"Enter AWB No."}
              value={datatoget?.airwaybill_no}
              onChange={handlechange}
            />
          </div>
          <div className="flex ">
            <Button
              className=" bg-success text-white ml-4"
              disabled={
                !datatoget?.from_date ||
                !datatoget?.to_date ||
                !datatoget?.franchisee_id ||
                isLoading
              }
              onClick={() => {
                getData();
              }}
            >
              SEARCH
            </Button>
            <Button
              className=" rounded-lg bg-red-500 hover:bg-red-600 text-white ml-4"
              onClick={() => {
                handlereset();
              }}
            >
              RESET
            </Button>
          </div>
        </div>
      </div>
      <div className=" rounded-lg shadow-lg bg-white ">
        {alldata?.length > 0 && !isLoading ? (
          <div className="overflow-x-auto h-[100vh]">
            <Table className="table table-text-small mb-0 border">
              <Table.Thead
                variant="dark"
                className="thead-primary table-sorting bg-mustard"
              >
                <Table.Tr className="text-center ">
                  <Table.Th className="whitespace-nowrap border">
                    SR.NO.
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    ACTION
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    STATUS
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    PICKUP DETAILS
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    AIRWAYBILL NO.
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    PICKUP NO.
                  </Table.Th>

                  <Table.Th className="whitespace-nowrap border text-left">
                    ORIGIN COUNTRY
                  </Table.Th>

                  <Table.Th className="whitespace-nowrap border text-left">
                    DESTINATION PINCODE
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    SHIPPER NAME
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    CHARGEABLE WEIGHT
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    NO. OF PIECES
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {alldata?.map((data: any, index: number) => (
                  <Table.Tr key={index}>
                    <Table.Td className="border whitespace-nowrap text-right">
                      {(page - 1) * 20 + (index + 1)}.
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap text-center ">
                      <div
                        className={`flex text-center ${
                          data?.pickup_transaction_id
                            ? "justify-between"
                            : "justify-center"
                        }  items-between`}
                      >
                        {Number(data?.pickup_transaction_flag) &&
                        !Number(data?.cancel_transaction_flag) &&
                        data?.courier_code?.toLowerCase() != "aramex" ? (
                          <div>
                            <Button
                              className="p-2 bg-red-400 text-white"
                              onClick={() => {
                                setPickupdata(data);
                                getpickupdetails(data, 2);
                                setPincodedata(data);
                              }}
                            >
                              {cancelloading &&
                              pickupdata?.pickup_id == data?.pickup_id
                                ? " Loading..."
                                : " Cancel Pickup"}
                            </Button>
                          </div>
                        ) : (!Number(data?.pickup_transaction_flag) &&
                            !Number(data?.cancel_transaction_flag)) ||
                          (Number(data?.pickup_transaction_flag) &&
                            Number(data?.cancel_transaction_flag)) ? (
                          <Button
                            className="p-2 bg-success text-white w-[100px]"
                            onClick={() => {
                              const { courier_code } = data;
                              if (courier_code?.toLowerCase() == "fedex") {
                                setPickupdata(data);
                                getpickupdetails(data, 1);
                                setPincodedata(data);
                              } else {
                                setPickupdata(data);
                                setOpenModal(true);
                                //  setOpenModal2(true)
                              }
                            }}
                          >
                            {updateloading &&
                            pickupdata?.pickup_id == data?.pickup_id
                              ? " Loading..."
                              : "Schedule"}
                          </Button>
                        ) : (
                          <p className="text-center">No-Action</p>
                        )}
                        <div></div>
                      </div>
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap text-left uppercase ">
                      <p
                        className={`${
                          Number(data?.pickup_transaction_flag) &&
                          !Number(data?.cancel_transaction_flag)
                            ? "text-success"
                            : Number(data?.cancel_transaction_flag)
                              ? "text-red-500"
                              : (!Number(data?.pickup_transaction_flag) &&
                                    !Number(data?.cancel_transaction_flag)) ||
                                  (Number(data?.pickup_transaction_flag) &&
                                    Number(data?.cancel_transaction_flag))
                                ? "text-mustard"
                                : "N.A"
                        }`}
                      >
                        {" "}
                        {Number(data?.pickup_transaction_flag) &&
                        !Number(data?.cancel_transaction_flag)
                          ? "Pickup Scheduled"
                          : Number(data?.cancel_transaction_flag)
                            ? "Cancelled"
                            : (!Number(data?.pickup_transaction_flag) &&
                                  !Number(data?.cancel_transaction_flag)) ||
                                (Number(data?.pickup_transaction_flag) &&
                                  Number(data?.cancel_transaction_flag))
                              ? "Not Scheduled"
                              : "N.A"}
                      </p>
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      <div
                        className={`flex text-center justify-center  items-between`}
                      >
                        {data?.pickup_transaction_date ? (
                          <Eye
                            className="text-mustard"
                            onClick={() => {
                              setOpenModal(true);
                              setForwhat(2);
                              setPickupdata(data);
                                if (
                                  data?.courier_code?.toLowerCase() == "aramex"
                                ) {
                                  setPickupdata((pre: any) => ({
                                    ...pre,
                                    pickupDate:
                                      data?.pickup_transaction_date || "",
                                    ReadyTime:
                                      data?.pickup_transaction_ready_slot || "",

                                    ClosingTime:
                                      data?.pickup_transaction_close_slot || "",
                                  }));
                                }
                            }}
                          />
                        ) : (
                          "N.A"
                        )}
                      </div>
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.airwaybilno || "-"}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.pickup_transaction_id || "N.A"}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap text-left">
                      {data?.extra_data?.origin_country || "-"}
                    </Table.Td>

                    <Table.Td className="border whitespace-nowrap text-left">
                      <div className=" relative ">
                        <div>
                          <strong
                            onMouseLeave={() => {
                              setPincodedata(intpincodedata);
                              setTippyState(false);
                            }}
                            onMouseEnter={async () => {
                              await getpincodedata(data);
                              setTippyState(true);
                            }}
                            className="text-success cursor-pointer"
                          >
                            {" "}
                            {data?.extra_data["destination_pincode"]}
                            {/* <div className="border border-gray-400"></div> */}
                          </strong>

                          {pincodedata?.pickup_id == data?.pickup_id &&
                          tippystate ? (
                            <div className="absolute p-2 border rounded-lg shadow-lg bg-gray-400 bottom-6  ">
                              <p>
                                City: <strong>{pincodedata?.city}</strong>
                              </p>
                              <p>
                                State: <strong>{pincodedata?.state}</strong>
                              </p>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td className={`border whitespace-nowrap text-left `}>
                      {data?.shipper_name || "-"}
                    </Table.Td>
                    <Table.Td className={`border whitespace-nowrap text-left `}>
                      {data?.chargeable_weight} {data["weight_unit"]}
                    </Table.Td>
                    <Table.Td
                      className={`border whitespace-nowrap text-right `}
                    >
                      {data["number_of_pieces"] || "-"}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        ) : isLoading ? (
          <div className="h-[100vh]">
            {" "}
            <LoadingIcon icon="tail-spin" className="block m-auto w-[4%] " />
          </div>
        ) : (
          <Nodatafound />
        )}

        {alldata?.length > 0 && totalpages > 1 && (
          <CommonPagination
            totalpages={totalpages}
            onPageChange={handlePagechange}
            page={page}
          />
        )}
      </div>
      {openModal && (
        <CommonModal
          open={openModal}
          setOpen={setOpenModal}
          title={forwhat == 1 ? "Schedule Pickup" : "Pickup Details"}
          description={modaldescription}
          footer={ModalFooter}
          sticky={true}
          size={
            "xl"
          }
          handlecancel={handleCancel}
        />
      )}
      {openModal2 && (
        <CommonModal
          open={openModal2}
          setOpen={setOpenModal2}
          title={"Cancel Pickup"}
          description={description2}
          footer={
            updateModaldata?.pickupconfirmationcode &&
            updateModaldata?.location &&
            footer2
          }
          sticky={true}
          size="lg"
          handlecancel={handleCancel}
        />
      )}
    </>
  );
}
