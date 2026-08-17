import React, { useEffect, useState } from "react";
import CommonPagination from "../Pagination";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Lucide from "../../../base-components/Lucide";
import {
  convertJSONtoCSV,
  convertUTCtoIST,
  downloadAttachment,
  formatDate,
  getTodayDate,
  indianFormat,
} from "../../../utils";
import Button from "../../../base-components/Button";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { getBatchWiseListing } from "../../../AllServices/config.service";
import CommonModal from "../../../components/CommonModal";
import Table from "../../../base-components/Table";

const Batchwiselist = ({
  setShowForm,
  selectedBatch,
  prevListing,
  productTypes,
  shipmentTypes,
}) => {
  const [bookingData, setBookingData] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [batch, setBatch] = useState(selectedBatch || null);
  const [downloadSpinner, setDownloadSpinner] = useState(false);

  const handlePagechange = (e: number) => {
    setPage(e);
  };
  const formatData = (data: any) => {
    if (!data || data.length === 0) return [{ "No Data Found": "" }];
    return data?.map((item: any, index: number) => ({
      "S.No.": index + 1,
     "AWB No.": item?.airwaybilno || "",
      "Created Date": item?.created_date
        ? formatDate(item?.created_date)
        : "",
      "Origin Pin Code": item?.origin_pin_code || "",
      "Destination Pin Code": item?.destination_pin_code || "",
      "Shipper Name": item?.shipper_name || "",
      "Shipper Phone No.": item?.shipper_phone_no || "",
      "Shipper Email": item?.shipper_email || "",
      "Shipper Address 1": item?.shipper_address_1 || "",
      "Shipper Address 2": item?.shipper_address_2 || "",
      "Consignee Name": item?.consignee_name || "",
      "Consignee Address 1": item?.consignee_address_1 || "",
      "Consignee Address 2": item?.consignee_address_2 || "",
      "Consignee Phone No.": item?.consignee_phone_no || "",
      "Consignee Email": item?.consignee_email || "",
      Description: item?.description || "",
      Weight: item?.weight || "",
      Length: item?.length || "",
      width: item?.width || "",
      Height: item?.height || "",
      "Rate Amount": item?.rate_amount || "",
      "Invoice Value": item?.invoice_value || "",
      "Status":
        item?.booking_status === 0
          ? "Pending"
          : item?.booking_status === 1
          ? "Completed"
          : item?.booking_status === 2
          ? "Failed"
          : "",
      "Customer Ref No.": item?.customer_ref_no || "",
      "E-Way Bill": item?.e_way_bill || "",
      "Booking Code": item?.booking_code || "",
      "Franchise Name": item?.franchise_name || "",
      Remarks: item?.remarks || "",
    }));
  };

  const getData = async (isDownload: boolean = false) => {
    if (isDownload) {
      setDownloadSpinner(true);
    } else {
      setIsLoading(true);
    }
    try {
      const response: any = await getBatchWiseListing(
        isDownload ? "" : 20,
        isDownload ? "" : page - 1,
        batch
      );

      if (response?.status == 200) {
        if (isDownload) {
          convertJSONtoCSV(
            formatData(response?.data?.data),
            `${selectedBatch}_${getTodayDate()}.csv`
          );
        } else {
          setBookingData(response?.data?.data || []);
          setTotalPages(response?.data?.pages);
        }
      } else if (response?.status == 204) {
        setBookingData([]);
        setTotalPages(1);
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
    } finally {
      if (isDownload) {
        setDownloadSpinner(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  const ModalDescription = (
    <div className="overflow-auto">
      <Table hover sm>
        <Table.Thead className="bg-mustard text-white border">
          <Table.Tr>
            <Table.Th className="text-center border whitespace-nowrap ">
              DESCRIPTION
            </Table.Th>
            <Table.Th className="text-center border whitespace-nowrap">
              WEIGHT (KGS)
            </Table.Th>
            <Table.Th className="text-center border whitespace-nowrap">
              LENGTH (CMS)
            </Table.Th>
            <Table.Th className="text-center border whitespace-nowrap">
              WIDTH (CMS)
            </Table.Th>
            <Table.Th className="text-center border whitespace-nowrap">
              HEIGHT (CMS)
            </Table.Th>

            <Table.Th className="text-center border whitespace-nowrap">
              VALUE (INR)
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          <Table.Tr>
            <Table.Td className="text-center capitalize border whitespace-nowrap">
              {modalData?.description}
            </Table.Td>
            <Table.Td className="text-center border whitespace-nowrap">
              {Number(modalData?.weight)?.toFixed(2)}
            </Table.Td>
            <Table.Td className="text-center border whitespace-nowrap">
              {modalData?.length}
            </Table.Td>
            <Table.Td className="text-center border whitespace-nowrap">
              {modalData?.width}
            </Table.Td>
            <Table.Td className="text-center border whitespace-nowrap">
              {modalData?.height}
            </Table.Td>

            <Table.Td className="text-center border whitespace-nowrap">
              {modalData?.invoice_value}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  );

  useEffect(() => {
    getData(false);
  }, [page, batch]);

  return (
    <>
      <div
        className="p-2 my-2 cursor-pointer rounded-full shadow-lg mr-4 w-8 bg-white"
        onClick={() => {
          setShowForm(2);
          prevListing();
        }}
      >
        <Lucide icon="ArrowLeft" className="w-4 h-4 stroke-2.5 text-mustard" />
      </div>
      <div className="w-full max-w-8xl p-6 px-10 bg-white rounded-lg shadow-lg  mt-8 mb-16  z-[0] relative">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 items-end gap-8">
          <h1 className="text-2xl font-bold text-left lg:whitespace-nowrap">
            BATCH No : {selectedBatch}
          </h1>
          {bookingData?.length > 0 && (
            <div className="flex justify-end  w-full md:w-auto">
              <Button
                className="bg-green-500 hover:bg-green-600 text-white  w-full md:w-auto"
                onClick={() => getData(true)}
                disabled={downloadSpinner}
              >
                Download CSV
                {downloadSpinner == true ? (
                  <LoadingIcon
                    icon="puff"
                    color="white"
                    className="w-5 h-5 ml-2 stroke-2.5 text-white"
                  />
                ) : (
                  <Lucide
                    icon="Download"
                    className="w-4 h-4 stroke-2.5 text-white ml-2"
                  />
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

        {bookingData?.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="table table-text-small mb-0 border">
              <Table.Thead
                variant="dark"
                className="thead-primary table-sorting bg-mustard"
              >
                <Table.Tr className="text-center ">
                  {/* <Table.Th className="whitespace-nowrap border">
                    {" "}
                    {pendingDataIds?.length > 0 ? (
                      <FormCheck.Input
                        id="checkbox"
                        type="checkbox"
                        checked={arraysEqual(pendingDataIds, selectedBooking)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBooking(pendingDataIds);
                          } else {
                            setSelectedBooking([]);
                          }
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </Table.Th> */}
                  <Table.Th className="whitespace-nowrap border">
                    SR.NO.
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    AWB NO.
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Courier Service
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Shipment Type
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Created Date
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Origin Pincode
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Destination Pincode
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Shipper Name
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Shipper Contact Info
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Shipper Address
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Consignee Name
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Consignee Address
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Consignee Contact Info
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Shipment Details
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Estimated Booking Amount (₹)
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Status
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Dispatch Label
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Remarks
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {bookingData?.map((data, index) => (
                  <Table.Tr key={index} className={`text-left intro-x`}>
                    {/* <Table.Td className="border whitespace-nowrap">
                      {data?.booking_status == 2 ? (
                        <FormCheck.Input
                          id="checkbox"
                          type="checkbox"
                          checked={selectedBooking?.includes(data?.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedBooking((prev) => [...prev, data?.id]);
                            } else {
                              setSelectedBooking((prev) =>
                                prev.filter((id) => id !== data?.id)
                              );
                            }
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </Table.Td> */}
                    <Table.Td className="border whitespace-nowrap text-right">
                      {/* {search ? index + 1 : (page - 1) * 20 + (index + 1)}. */}
                      {(page - 1) * 20 + (index + 1)}.
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.airwaybilno || "-"}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {productTypes?.find(
                        (item: any) => item?.product_id == data?.is_surface
                      )?.product_name || "N.A."}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {shipmentTypes?.find(
                        (item: any) =>
                          item?.booking_shipment_type_id == data?.shipment_type
                      )?.shipment_type || "N.A."}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.created_date
                        ? formatDate(data?.created_date)
                        : "N.A."}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.origin_pin_code}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.destination_pin_code}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.shipper_name}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.shipper_phone_no
                        ? `${data?.shipper_phone_no} , `
                        : "" || "N.A. , "}
                      {data?.shipper_email || "N.A."}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.shipper_address_1 +
                        " , " +
                        data?.shipper_address_2}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.consignee_name}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.consignee_address_1 +
                        " , " +
                        data?.consignee_address_2}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.consignee_phone_no
                        ? `${data?.consignee_phone_no} , `
                        : "" || "N.A. , "}
                      {data?.consignee_email || "N.A."}
                    </Table.Td>
                    <Table.Td className=" whitespace-nowrap border">
                      {data?.shipment_type == 2 ? (
                        data?.weight
                      ) : (
                        <>
                          <div className="flex justify-center ">
                            <Lucide
                              icon="PackageOpen"
                              className="text-mustard stroke-2.5 w-6 h-6 cursor-pointer"
                              onClick={() => {
                                setModalData(data);
                                setOpen(true);
                              }}
                            />
                          </div>

                          {open && data?.id == modalData?.id && (
                            <CommonModal
                              open={open}
                              setOpen={setOpen}
                              title={"Shipment Details"}
                              description={ModalDescription}
                              sticky={false}
                              size="xl"
                            />
                          )}
                        </>
                      )}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap text-right">
                      {indianFormat(data?.rate_amount) || "N.A."}
                    </Table.Td>

                    <Table.Td className="border whitespace-nowrap">
                      {data?.booking_status == 0 ? (
                        <p className="text-base   text-mustard">Pending</p>
                      ) : data?.booking_status == 1 ? (
                        <p className="text-base   text-green-400">Completed</p>
                      ) : data?.booking_status == 2 ? (
                        <p className="text-base   text-red-500">Failed</p>
                      ) : // <div className=" flex gap-4 cursor-pointer">
                      //   <Tippy
                      //     content="Retry Booking"
                      //     options={{ placement: "top" }}
                      //   >
                      //     <Lucide
                      //       icon="RefreshCw"
                      //       className={`text-mustard stroke-2.5 ml-2 cursor-pointer ${
                      //         triggerSpinner?.status == true &&
                      //         data?.id == triggerSpinner?.id
                      //           ? "animate-spin"
                      //           : ""
                      //       } `}
                      //       onClick={() => {
                      //         setSelectedBooking([]);

                      //         triggerPending({
                      //           single: true,
                      //           retryId: [data?.id],
                      //         });
                      //       }}
                      //     />
                      //   </Tippy>
                      // </div>
                      data?.booking_status == 3 ? (
                        <p className="text-base   text-red-500">Error</p>
                      ) : (
                        "N.A."
                      )}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      <div className="flex justify-center">
                        {data?.shipper_inv ? (
                          <Lucide
                            icon="FileText"
                            className="stroke-2.5 text-mustard cursor-pointer"
                            onClick={() =>
                              downloadAttachment(
                                data?.shipper_inv,
                                data?.airwaybilno
                              )
                            }
                          />
                        ) : (
                          "N.A."
                        )}
                      </div>
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.booking_status == 0 ? (
                        <p className="text-base  ">N.A.</p>
                      ) : data?.booking_status == 1 ? (
                        <p className="text-base   text-green-400">
                          {data?.remarks || "N.A."}
                        </p>
                      ) : data?.booking_status == 2 ? (
                        <p className="text-base   text-red-500">
                          {data?.remarks || "N.A."}
                        </p>
                      ) : data?.booking_status == 3 ? (
                        <p className="text-base   text-red-500">
                          {data?.remarks || "N.A."}
                        </p>
                      ) : (
                        "N.A."
                      )}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        ) : isLoading ? (
          <LoadingIcon icon="tail-spin" className="block m-auto w-[4%] " />
        ) : (
          <p className="text-gray-400 text-center">No Data Found!</p>
        )}

        {bookingData?.length > 0 && (
          <CommonPagination
            totalpages={totalpages}
            onPageChange={handlePagechange}
            page={page}
          />
        )}
      </div>
    </>
  );
};

export default Batchwiselist;
