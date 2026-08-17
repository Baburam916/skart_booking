import React, { useState, useEffect } from "react";
import Table from "../../../base-components/Table";
import { Edit, FileText } from "lucide-react";
import {
  approveSpotEnquiryApi,
  getCountryApi,
  getCurrencyApi,
  productTypesApi,
  spotEnquiryListingApi,
} from "../../../AllServices/config.service";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { useNavigate } from "react-router";
import {
  downloadAttachment,
  formatDate,
  indianFormat,
  useDebounce,
} from "../../../utils";
import Button from "../../../base-components/Button";
import Modal from "../../../components/Modal";
import { FormInput } from "../../../base-components/Form";
import CommonPagination from "../Pagination";
const Index: React.FC = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [spotData, setSpotData] = useState([]);
  const { franchiseeId, currencyId, isOverseas } = useFranchisee();
  const [isLoading, setIsLoading] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [open, setOpen] = useState(false);
  const [spotId, setSpotId] = useState(null);
  const currentDate = new Date();
  const [approveSpinner, setApproveSpinner] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const [currencyData, setCurrencyData] = useState([]);

  const handlePagechange = (e: number) => {
    setPage(e);
  };

  const getProductData = async () => {
    try {
      const response: any = await productTypesApi();
      // console.log(response, "response");
      if (response?.status == 200) {
        setProductTypes(response?.data?.data);
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
    }
  };

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await spotEnquiryListingApi(
        franchiseeId,
        debouncedSearch.trim(),
        20,
        page - 1
      );
      // console.log(response, "spot");

      if (response?.status == 200) {
        // console.log(response?.data?.data);
        setSpotData(response?.data?.data);
        setTotalPages(Math.ceil(response?.data?.total / 20));
      } else if (response?.status == 204) {
        setSpotData([]);
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
      setIsLoading(false);
    }
  };

  const getCountryData = async () => {
    try {
      const res = await getCountryApi();

      if (res?.status == 200) {
        setCountryData(res?.data?.data);
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
    }
  };

  const handleEdit = async (data) => {
    // console.log(data, "single");

    const selectedCountry = countryData.find(
      (item) => item.country_id == data?.dest_country_id
    );

    const originCountry = countryData.find(
      (item) => item.country_id == data?.org_country_id
    );

    const booking = {
      id: data?.id,
      booking_no: data?.booking_no,
      origin_pincode: data?.org_zip,
      origin_city: data?.org_city,
      origin_state: data?.org_state,
      origin_state_code: data?.org_state_code,
      destination_country: selectedCountry?.country_name,
      destination_country_code: selectedCountry?.country_code,
      destination_country_id: data?.dest_country_id,
      destination_pincode: data?.dest_zip,
      state: data?.dest_state_code,
      city: data?.dest_city,
      startPoint: "listing",
      shipment_type: data?.shipment_type,
      weight: data?.weight,
      weight_unit: data?.weight_unit,
      quoted_by: data?.quoted_by,
      price_type: data?.price_type,
      spot_price: data?.spot_price,
      cargo_type: data?.cargo_type,
      clearence_type: data?.clearence_type,
      incoterm: data?.incoterm,
      currency_id: data?.currency_id || "24",
      courier_id: data?.courier_id,
      courier_code: data?.courier_code,
      courier_name: data?.courier_name,
      courier_vendor_code: data?.courier_vendor_code,
      commodity: data?.commodity || "",
      shipment_dimension: data?.shipment_dimensions || [],
      import_booking: data?.import_booking || 1,
      origin_country: originCountry?.country_name,
      origin_country_code: originCountry?.country_code,
      origin_country_id: data?.org_country_id,
      state_name: data?.dest_state || "",
      ...(data?.import_booking == "2"
        ? { import_booking_type: data?.import_booking_type || "" }
        : {}),
    };

    navigate("/franchisee/spot_pricing/book_courier_franchisee", {
      state: { booking },
    });
  };

  const handleBooking = async (data) => {
    // console.log("Booking");

    const selectedCountry = countryData.find(
      (item) => item.country_id == data?.dest_country_id
    );

    const originCountry = countryData.find(
      (item) => item.country_id == data?.org_country_id
    );

    const booking = {
      booking_type:
        data?.dest_country_id == "97" && data?.import_booking == "1"
          ? "2"
          : "1",
      origin_pincode: data?.org_zip,
      destination_pincode: data?.dest_zip,
      destination_country: selectedCountry?.country_name,
      destination_country_id: data?.dest_country_id,
      destination_country_code: selectedCountry?.country_code,
      origin_city: data?.org_city,
      origin_state: data?.org_state,
      origin_state_code: data?.org_state_code,
      city: data?.dest_city,
      state: data?.dest_state_code,
      state_name: data?.dest_state || "",
      shipment_type: data?.shipment_type,
      is_spot: 1,
      booking_id: data?.id,
      startPoint: "spotbooking",
      spot_weight: data?.weight,
      weight_unit: data?.weight_unit,
      weight_from: data?.weight_from,
      weight_to: data?.weight_to,
      spot_courier_id: data?.courier_id,
      rate: data?.spot_price,
      buy_rate: data?.buy_price,
      currency_id: data?.currency_id || "24",
      is_per_kg: data?.price_type == "2" ? 1 : 0,
      shipment_dimension: data?.shipment_dimensions || [],
      ...(data?.shipment_type == 4
        ? {
          cargo_type: data?.cargo_type,
          clearance_type: data?.clearence_type,
          incoterm: data?.incoterm,
        }
        : {}),
      import_booking: data?.import_booking || 1,
      origin_country: originCountry?.country_name,
      origin_country_code: originCountry?.country_code,
      origin_country_id: data?.org_country_id,
      ...(data?.import_booking == "2"
        ? { import_booking_type: data?.import_booking_type || "" }
        : {}),
      ...(
        ["PPX", "GPX", "DPX"].includes(data?.courier_vendor_code)
          ? { aramex_service_type: data?.courier_vendor_code }
          : {}
      )
    };

    navigate("/franchisee/booking/book_courier_franchisee", {
      state: { booking },
    });
  };

  const handleApprove = async (id: string) => {
    setApproveSpinner(true);
    try {
      const response = await approveSpotEnquiryApi({
        booking_id: id,
        booking_status: 4,
      });
      if (response.status == 200) {
        showAlert(response?.data?.message);
        getData();
      } else {
        showAlert("Something went wrong", "error");
      }
      // console.log(response);
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setApproveSpinner(false);
    }
  };

  const description = (
    <p className="text-center">
      Are you sure you want to approve this spot pricing enquiry ?
    </p>
  );

  const footer = (
    <div className="flex justify-end gap-4">
      <Button
        className="px-4 py-1 rounded-lg bg-green-400 text-white hover:bg-green-500 ml-2"
        onClick={() => {
          handleApprove(spotId);
          setOpen(false);
        }}
      >
        Yes{" "}
        {approveSpinner && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
      <Button
        className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 ml-2"
        onClick={() => setOpen(false)}
      >
        No
      </Button>
    </div>
  );

  useEffect(() => {
    getProductData();
    getCountryData();
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data));
  }, []);

  useEffect(() => {
    getData();
  }, [page, debouncedSearch.trim()]);

  return (
    <div className="w-full max-w-8xl p-6 px-10 bg-white rounded-lg shadow-lg  mt-8 mb-16 z-[0] relative">
      <div className="grid  sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2  xl:grid-cols-2  items-end gap-8 w-full">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-left whitespace-nowrap">
            Spot Pricing Enquiry List
          </h1>
        </div>
        <div className="flex w-full items-end">
          <FormInput
            type="text"
            placeholder="Enter Enquiry ID"
            value={search}
            className="w-2/3"
            onChange={(e) => {
              setSearch(e.target.value.replace(/\s/g, ""));
              setPage(1);
            }}
          />
          <Button
            className="w-1/3 rounded-lg bg-red-500 hover:bg-red-600 text-white ml-4"
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
          >
            RESET
          </Button>
        </div>
      </div>

      <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

      {spotData?.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="table table-text-small mb-0 border">
            <Table.Thead className="thead-primary table-sorting bg-mustard">
              <Table.Tr className="text-center text-white">
                <Table.Th className="whitespace-nowrap border">SR.NO.</Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  ENQUIRY ID
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  ENQUIRY DATE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">ORIGIN</Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  DESTINATION
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">WEIGHT</Table.Th>
                <Table.Th className="whitespace-nowrap border">VENDOR</Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  SHIPMENT TYPE
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  QUOTED BY
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  DOCUMENTS
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  QUOTED PRICE{" "}
                  {isOverseas && currencyId
                    ? `(${(
                      currencyData?.find(
                        (item) => item?.id == currencyId
                      ) ?? currencyData?.find((item) => item?.id == 24)
                    )?.symbol || " "
                    })`
                    : "(₹)"}
                </Table.Th>
                {/* <Table.Th className="whitespace-nowrap border">
                  OVERSEAS CURRENCY PRICE
                </Table.Th> */}
                <Table.Th className="whitespace-nowrap border">
                  RATE VALID TILL
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">
                  AIRWAYBILL NO.
                </Table.Th>
                <Table.Th className="whitespace-nowrap border">ACTION</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {spotData?.map((data, index) => (
                <Table.Tr
                  key={index}
                  className={`text-left intro-x capitalize `}
                >
                  <Table.Td className="border whitespace-nowrap text-right">
                    {search ? index + 1 : (page - 1) * 20 + (index + 1)}.
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.booking_no || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {formatDate(data?.created_date) || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.org_city || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.org_country_id == "97" &&
                      data?.dest_country_id == "97"
                      ? data?.dest_city
                      : countryData?.find(
                        (item) => item.country_id == data?.dest_country_id
                      )?.country_name ||
                      data?.dest_city ||
                      "N.A."}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap text-right">
                    {Number(data?.weight) || "-"}{" "}
                    {data?.weight_unit ? `(${data.weight_unit})` : ""}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {productTypes?.find(
                      (item) => item.product_id == data?.courier_id
                    )?.product_name || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.shipment_type == 1
                      ? "Courier Non-Document"
                      : data?.shipment_type == 2
                        ? "Courier Document"
                        : data?.shipment_type == 4
                          ? "Courier Commercial"
                          : data?.shipment_type == 5
                            ? "Cargo Commercial"
                            : "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.quoted_by || "-"}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.proforma_url ||
                      data?.house_draft ||
                      data?.house_pdf ? (
                      <div className="flex justify-around gap-4 ">
                        {data?.proforma_url ? (
                          <div className="items-center">
                            <FileText
                              className="cursor-pointer text-mustard stroke-2.5 m-auto"
                              onClick={() =>
                                downloadAttachment(
                                  data?.proforma_url,
                                  "Proforma Invoice"
                                )
                              }
                            />
                            <p>Proforma Invoice</p>
                          </div>
                        ) : null}
                        {data?.house_draft ? (
                          <div className="items-center">
                            <FileText
                              className="cursor-pointer text-mustard stroke-2.5 m-auto"
                              onClick={() =>
                                downloadAttachment(
                                  data?.house_draft,
                                  "House Draft"
                                )
                              }
                            />
                            <p>House Draft</p>
                          </div>
                        ) : null}
                        {data?.house_pdf ? (
                          <div className="items-center">
                            <FileText
                              className="cursor-pointer text-mustard stroke-2.5 m-auto"
                              onClick={() =>
                                downloadAttachment(data?.house_pdf, "House Pdf")
                              }
                            />
                            <p>House Pdf</p>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center">
                        Documents Not Available
                      </div>
                    )}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap lowercase text-right">
                    {indianFormat(data?.spot_price) || "-"}{" "}
                    {data?.price_type == "1"
                      ? "(a)"
                      : data?.price_type == "2"
                        ? "(k)"
                        : ""}
                  </Table.Td>
                  {/* <Table.Td className="border whitespace-nowrap lowercase text-right">
                    {data?.franchisee_currency || ""}
                    {"  "}
                    {indianFormat(data?.spot_price_foreign_currency) || "0.00"}
                  </Table.Td> */}
                  <Table.Td className="border whitespace-nowrap">
                    {formatDate(data?.valid_till) || "N.A."}
                  </Table.Td>
                  <Table.Td className="border whitespace-nowrap">
                    {data?.airwaybilno || "N.A."}
                  </Table.Td>
                  <Table.Td className="px-8 flex justify-center">
                    {data?.valid_till &&
                      currentDate > new Date(data?.valid_till) ? (
                      <p className="text-base  text-gray-500 whitespace-nowrap">
                        Rate Expired
                      </p>
                    ) : data?.booking_status == 1 ||
                      data?.booking_status == 3 ||
                      data?.booking_status == 6 ? (
                      <Button
                        rounded
                        className="w-24 text-base  text-white bg-green-500"
                        onClick={() => {
                          setSpotId(data?.id);
                          setOpen(true);
                        }}
                      >
                        APPROVE
                      </Button>
                    ) : data?.booking_status == 2 ? (
                      <p className="text-base   text-red-500">REJECTED</p>
                    ) : data?.booking_status == 5 ? (
                      <p className=" text-green-500 text-base ">BOOKED</p>
                    ) : data?.booking_status == 4 &&
                      data?.shipment_type != 5 ? (
                      <Button
                        rounded
                        size="sm"
                        className="w-20  text-base text-white bg-green-500"
                        onClick={() => handleBooking(data)}
                      >
                        BOOK
                      </Button>
                    ) : data?.booking_status == 0 &&
                      data?.shipment_type != 5 ? (
                      <Edit
                        className="cursor-pointer text-mustard stroke-2.5"
                        onClick={() => handleEdit(data)}
                      />
                    ) : data?.booking_status == 0 &&
                      data?.shipment_type == 5 ? (
                      <p className="text-base  whitespace-nowrap text-mustard">
                        PENDING FOR APPROVAL
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

      <Modal
        open={open}
        setOpen={setOpen}
        title="Confirm"
        size="md"
        description={description}
        footer={footer}
      />

      {spotData?.length > 0 && (
        <CommonPagination
          totalpages={totalpages}
          onPageChange={handlePagechange}
          page={page}
        />
      )}
    </div>
  );
};

export default Index;
