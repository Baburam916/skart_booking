import React, { useState, useEffect } from "react";
import Table from "../../../base-components/Table";
import {
  getBatchList,
  getBulkListing,
  getShipmentTypesApi,
  productTypesApi,
  triggerPendingAPI,
} from "../../../AllServices/config.service";
import {
  arraysEqual,
  convertJSONtoCSV,
  convertUTCtoIST,
  formatDate,
} from "../../../utils";
import { useAlert } from "../../../ContextProvider/AlertContext";
import CommonPagination from "../Pagination";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { FormCheck } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import BulkBookingForm from "../BulkBookingUpload";
import { useLocation, useNavigate } from "react-router-dom";
import Batchwiselist from "./batchwiselist";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import Tippy from "../../../base-components/Tippy";

const Index: React.FC = () => {
  const location = useLocation();
  const { franchiseeId } = useFranchisee();
  const [showForm, setShowForm] = useState(location?.state?.showForm || 2);
  const [bulkData, setBulkData] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [batchData, setBatchData] = useState([]);
  const [batch, setBatch] = useState(null);
  const [downloadSpinner, setDownloadSpinner] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [shipmentTypes, setShipmentTypes] = useState([]);
  const navigate = useNavigate();

  const handlePagechange = (e: number) => {
    setPage(e);
  };
  const pendingDataIds = bulkData
    ?.filter((data) => Number(data?.fail) > 0)
    ?.map((data) => data?.booking_code);

  const [triggerSpinner, setTriggerSpinner] = useState({
    status: false,
    id: "",
  });

  const formatData = (data: any) => {
    if (!data || data.length == 0) return [{ "No Data Found": "" }];
    return data?.map((item: any, index: number) => ({
      "S.No.": index + 1,
      "Batch No.": item?.booking_code || "",
      "Courier Service":
        productTypes?.find((data: any) => data?.product_id == item?.is_surface)
          ?.product_name || "N.A.",
      "Booking Type":
        item?.booking_type == 1 ? "International" : "Domestic" || "N.A.",
      "Batch Date": convertUTCtoIST(item?.created_date) || "",
      "No. of AWBs": item?.total_bookings || "",
      Pending: item?.pending || "",
      Fail: item?.fail || "",
      Success: item?.success || "",
      Total: item?.total_bookings || "",
    }));
  };

  const getData = async (isDownload: boolean = false) => {
    if (isDownload) {
      setDownloadSpinner(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response: any = await getBulkListing(
        isDownload ? "" : 20,
        isDownload ? "" : page - 1,
        isDownload ? "" : batch?.value,
      );
      if (response?.status == 200) {
        if (isDownload) {
          convertJSONtoCSV(
            formatData(response?.data?.data || []),
            "Bulk_Booking_Data.csv",
          );
        } else {
          setBulkData(response?.data?.data || []);
          setTotalPages(response?.data?.pages);
        }
      } else if (response?.status == 204) {
        setBulkData([]);
        setTotalPages(1);
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error",
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

  const getBatchData = async () => {
    try {
      const response: any = await getBatchList();
      if (response?.status == 200) {
        let newdata = response?.data?.data?.map((item: any) => ({
          id: item?.booking_code,
          name: item?.booking_code,
        }));
        setBatchData(newdata);
      } else if (response?.status == 204) {
        setBatchData([]);
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error",
        );
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
    }
  };

  const triggerPending = async ({ single = false, retryId = [] }) => {
    if (triggerSpinner?.status == true) {
      return;
    }
    setTriggerSpinner({ status: true, id: single ? retryId[0] : "" });
    try {
      const res = await triggerPendingAPI({
        ids: single ? retryId : selectedBooking,
      });
      if (res?.status == 200) {
        getData();
        setSelectedBooking([]);
      } else if (res?.status == 406) {
        showAlert(res?.response?.data?.errors[0]?.msg, "warning");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (error) {
      showAlert(error?.message, "error");
    } finally {
      setTriggerSpinner({ status: false, id: "" });
      setSelectedBooking([]);
    }
  };

  useEffect(() => {
    if (location.pathname == "/franchisee/upload_bulk_booking") {
      setShowForm(1);
    } else if (location.pathname == "/franchisee/bulk_booking") {
      setShowForm(2);
    }
  }, [location.pathname]);

  useEffect(() => {
    getData();
  }, [showForm, page, batch?.value]);

  useEffect(() => {
    getBatchData();
    productTypesApi(franchiseeId).then((res) => {
      setProductTypes(res?.data?.data || []);
    });
    getShipmentTypesApi().then((res) => {
      setShipmentTypes(res?.data?.data || []);
    });
  }, []);

  return (
    <>
      {" "}
      {showForm == 1 ? (
        <BulkBookingForm setShowForm={setShowForm} getListingData={getData} />
      ) : showForm == 2 ? (
        <div className="w-full max-w-8xl p-6 px-10 bg-white rounded-lg shadow-lg  mt-8 mb-16  z-[0] relative">
          <div className="w-full grid grid-cols-1 md:grid-cols-4 items-end gap-8">
            <h1 className="text-2xl font-bold text-left lg:whitespace-nowrap">
              Bulk Booking List
            </h1>

            <div className="flex justify-end w-full md:w-auto">
              {selectedBooking?.length > 0 && (
                <Button
                  className="bg-mustard text-white  w-full md:w-auto"
                  onClick={() => triggerPending({ single: false })}
                  disabled={triggerSpinner?.status == true}
                >
                  Perform Booking
                  {triggerSpinner?.status == true && (
                    <LoadingIcon
                      icon="puff"
                      color="white"
                      className="w-5 h-5 ml-2 stroke-2.5 text-white"
                    />
                  )}
                </Button>
              )}
            </div>

            <div className="flex justify-end  w-full md:w-auto">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white  w-full md:w-auto"
                onClick={() => {
                  setShowForm(1);
                  navigate("/franchisee/upload_bulk_booking");
                }}
              >
                Upload Bulk Booking
                <Lucide
                  icon="Upload"
                  className="w-4 h-4 stroke-2.5 text-white ml-2"
                />
              </Button>
            </div>
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
          </div>

          <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

          {bulkData?.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="table table-text-small mb-0 border">
                <Table.Thead
                  variant="dark"
                  className="thead-primary table-sorting bg-mustard"
                >
                  <Table.Tr className="text-center ">
                    <Table.Th className="whitespace-nowrap border">
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
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      SR.NO.
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      BATCH NO.
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      Courier Service
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      Booking Type
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      BATCH DATE
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      NO. OF AWBs
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      STATUS
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      ACTION
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {bulkData?.map((data, index) => (
                    <Table.Tr key={index} className={`text-left intro-x`}>
                      <Table.Td className="border whitespace-nowrap text-center">
                        {Number(data?.fail) > 0 ? (
                          <FormCheck.Input
                            id="checkbox"
                            type="checkbox"
                            checked={selectedBooking?.includes(
                              data?.booking_code,
                            )}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBooking((prev) => [
                                  ...prev,
                                  data?.booking_code,
                                ]);
                              } else {
                                setSelectedBooking((prev) =>
                                  prev?.filter(
                                    (id) => id !== data?.booking_code,
                                  ),
                                );
                              }
                            }}
                          />
                        ) : (
                          <Tippy content="This batch cannot be selected for bulk booking because its status is Pending or Success. Only Failed batches (that haven't been auto-completed) can be used for booking.">
                            <div className="text-center w-full flex justify-center">
                              <Lucide
                                icon="Info"
                                className="text-blue-500 stroke-2.5"
                              />
                            </div>
                          </Tippy>
                        )}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-right">
                        {/* {search ? index + 1 : (page - 1) * 20 + (index + 1)}. */}
                        {(page - 1) * 20 + (index + 1)}.
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {data?.booking_code || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {productTypes?.find(
                          (item: any) => item?.product_id == data?.is_surface,
                        )?.product_name || "N.A."}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {data?.booking_type == 1
                          ? "International"
                          : "Domestic" || "N.A."}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {data?.created_date
                          ? formatDate(data?.created_date)
                          : "N.A."}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-right">
                        {data?.total_bookings || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-center">
                        <p className="text-mustard">
                          Pending Booking : {data?.pending || 0}
                        </p>
                        <p className="text-red-500">
                          Failed Booking : {data?.fail || 0}
                        </p>
                        <p className="text-green-500">
                          Success Booking : {data?.success || 0}
                        </p>
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        <div className="flex justify-center items-center">
                          <Lucide
                            icon="Eye"
                            className="w-8 h-8 stroke-2.5 text-mustard cursor-pointer"
                            onClick={() => {
                              setSelectedBatch(data?.booking_code);
                              setShowForm(3);
                            }}
                          />
                        </div>
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

          {bulkData?.length > 0 && (
            <CommonPagination
              totalpages={totalpages}
              onPageChange={handlePagechange}
              page={page}
            />
          )}
        </div>
      ) : (
        <Batchwiselist
          setShowForm={setShowForm}
          selectedBatch={selectedBatch}
          prevListing={getData}
          productTypes={productTypes}
          shipmentTypes={shipmentTypes}
        />
      )}
    </>
  );
};

export default Index;
