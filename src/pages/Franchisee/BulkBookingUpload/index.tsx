import React, { useEffect, useRef, useState } from "react";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../base-components/Form";
import { Menu, Tab } from "../../../base-components/Headless";
import {
  checkAvailableCreditLimit,
  checkCSV,
  downloadAWBs,
  getAWBLimit,
  getCurrencyApi,
  getShipmentTypesApi,
  productTypesApi,
  uploadCSV,
} from "../../../AllServices/config.service";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { useAlert } from "../../../ContextProvider/AlertContext";
import {
  beautify,
  convertJSONtoCSV,
  getTodayDate,
  indianFormat,
} from "../../../utils";
import BulkCSVModal from "../Modals/BulkCSVModal";
import Tippy from "../../../base-components/Tippy";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Main = ({ setShowForm, getListingData }) => {
  const location = useLocation();
  const { franchiseeId, availableCreditLimit } = useFranchisee();
  const { showAlert } = useAlert();
  const [open, setOpen] = useState(false);
  const [bookingCount, setBookingCount] = useState("");
  const [downloadCourier, setDownloadCourier] = useState({});
  const [downloadSpinner, setDownloadSpinner] = useState(false);
  const [uploadSpinner, setUploadSpinner] = useState(false);
  const [shipmentTypesData, setShipmentTypesData] = useState([]);
  const [skartProductData, setSkartProductData] = useState([]);
  const [currencyData, setCurrencyData] = useState([]);
  const [currency, setCurrency] = useState<any>(24);
  const [shipmentType, setShipmentType] = useState("");
  const [shipmentMode, setShipmentMode] = useState({});
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState("No file chosen");
  const uploadedFile = useRef<HTMLInputElement | null>(null);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [uploadedFileDataModal, setUploadedFileDataModal] = useState(null);
  const [validated, setValidated] = useState(false);
  const [validateSpinner, setValidateSpinner] = useState(false);
  const [totalLimit, setTotalLimit] = useState(0);
  const [remainingLimit, setRemainingLimit] = useState(0);
  const [bookingAmount, setBookingAmount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [bookingType, setBookingType] = useState<any>(2);
  const navigate = useNavigate();
  const helperUrl = {
    ...(bookingType == 2
      ? {
        Domestic_Booking:
          "https://skartnew-prod.s3.ap-southeast-1.amazonaws.com/booking/shipper_invoice/17689990821764575363Bulk%20Booking%20Domestic%20Helper%20File.xlsx",
      }
      : {
        Teleport:
          "https://skartnew-prod.s3.ap-southeast-1.amazonaws.com/booking/shipper_invoice/1764573976TELEPORT%20BULK%20BOOKING%20HELPER%20FILE.csv",
        Widect:
          "https://skartnew-prod.s3.ap-southeast-1.amazonaws.com/booking/shipper_invoice/1764574076WIDECT%20BULK%20BOOKING%20HELPER%20FILE.xlsx",
        Fedex:
          "https://skartnew-prod.s3.ap-southeast-1.amazonaws.com/booking/shipper_invoice/1764575643FEDEX%20BULK%20BOOKING%20HELPER%20FILE.xlsx",
        United_worldwide:
          "https://skartnew-prod.s3.ap-southeast-1.amazonaws.com/booking/shipper_invoice/1764575221UNITED%20WORLDWIDE%20BULK%20BOOKING%20HELPER%20FILE.xlsx",
        UPS_Express:
          "https://skartnew-prod.s3.ap-southeast-1.amazonaws.com/booking/shipper_invoice/1764575312UPS%20EXPRESS%20BULK%20BOOKING%20HELPER%20FILE.xlsx",
        Skynet:
          "https://skartnew-prod.s3.ap-southeast-1.amazonaws.com/booking/shipper_invoice/1764575427SKYNET%20BULK%20BOOKING%20HELPER%20FILE.xlsx",
        Skart_self:
          "https://skartnew-prod.s3.ap-southeast-1.amazonaws.com/booking/shipper_invoice/1764575491sKart%20SELF%20International%20BULK%20BOOKING%20HELPER%20FILE.xlsx",
        Aramex_Express:
          "https://skartnew-prod.s3.ap-southeast-1.amazonaws.com/booking/shipper_invoice/1764575542ARAMEX%20EXPRESS%20Bulk%20Booking%20Helper%20File.xlsx",
        Skart_usa:
          "https://skartnew-prod.s3.ap-southeast-1.amazonaws.com/booking/shipper_invoice/1764575600skart%20USA%20USPS%20Bulk%20booking%20Helper%20File.csv",
      }),
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFileData(file);
      setUploadedFileDataModal(file);
      setFileName(file.name);
    } else {
      setFileName("No file chosen");
      uploadedFile.current.value = null;
      setUploadedFileData(null);
      setUploadedFileDataModal(null);
    }
  };

  const formatData = (
    data: any,
    booking_type: any = 2,
    courierData: any = null
  ) => {
    if (!data || data.length == 0) return [{ "No Data Found": "" }];
    return data?.map((item: any, index: number) => ({
      ...(booking_type == 2
        ? {
          awb_no: item.airwaybill_no || "",
        }
        : {}),
      origin_pin_code: "",
      ...(booking_type == 1
        ? {
          destination_country_name: "",
          destination_city_name: "",
        }
        : {}),
      destination_pin_code: "",
      description: "",
      weight: "",
      length: "",
      width: "",
      height: "",
      invoice_value: "",
      ...(booking_type == 1
        ? {
          hsn_code: "",
        }
        : {}),
      consignee_name: "",
      ...(booking_type == 1
        ? {
          consignee_company_name: "",
        }
        : {}),
      consignee_address_1: "",
      consignee_address_2: "",
      consignee_phone_no: "",
      consignee_email: "",
      shipper_name: "",
      ...(booking_type == 1
        ? {
          shipper_company_name: "",
        }
        : {}),
      shipper_address_1: "",
      shipper_address_2: "",
      shipper_phone_no: "",
      shipper_email: "",
      customer_ref_no: "",
      e_way_bill: "",
      ...(booking_type == 1
        ? {
          consigner_tax_payment: "",
          consigner_gst_applicable: "",
          consigner_doc_type: "",
          consigner_gst_number: "",
          invoice_number: "",
        }
        : {}),
      ...(booking_type == 1 &&
        courierData?.parent_vendor?.toLowerCase()?.includes("aramex")
        ? {
          export_type: "",
          tax_paid: "",
          tax_amount: "",
          consignee_gst_number: "",
        }
        : {}),
      ...(booking_type == 1 &&
        courierData?.parent_vendor?.toLowerCase()?.includes("skynet")
        ? {
          consignee_gst_number: "",
          consignee_doc_type: "",
          delivery_instructions: "",
        }
        : {}),
      ...(booking_type == 1 &&
        (courierData?.parent_vendor?.toLowerCase()?.includes("widect") ||
          courierData?.product_name?.toLowerCase()?.includes("widect"))
        ? {
          incoterm: "",
          business_number: "",
          rgr_number: "",
          ioss_number: "",
          vat_number: "",
          eori_number: "",
          market_place_vat_number: "",
          sku: "",
          manufacturer_id: "",
          iorr_number: "",
          poa: "",
        }
        : {}),
      ...(booking_type == 2
        ? {
          pickup_required: "",
          pickup_location: "",
          pickup_name: "",
          pickup_address_1: "",
          pickup_address_2: "",
        }
        : {}),
    }));
  };

  const handleCSV = async () => {
    if (bookingType == 1 && Object.keys(downloadCourier).length == 0) {
      showAlert("Please select a courier service to download CSV", "warning");
      return;
    } else {
      convertJSONtoCSV(
        formatData([{}], 1, downloadCourier),
        `${downloadCourier?.parent_vendor
        }_Bulk_Booking_Format_${getTodayDate()}.csv`
      );
    }
  };

  const handleDownloadCSV = async () => {
    if (Number(remainingLimit) == 0) {
      showAlert(`You have 0 awbs available to use`, "warning");
      return;
    }
    if (Number(bookingCount) < 10) {
      showAlert(`Booking Count should not be less than 10`, "warning");
      return;
    }
    if (Number(bookingCount) > Number(remainingLimit)) {
      showAlert(
        `Booking Count should not be greater than ${remainingLimit}`,
        "warning"
      );
      return;
    }
    setDownloadSpinner(true);
    try {
      const res = await downloadAWBs(franchiseeId, bookingCount);
      if (res?.status == 200) {
        if (res?.data?.data?.length > 0) {
          convertJSONtoCSV(
            formatData(res?.data?.data, 2, null),
            `Bulk_Booking_Format_${getTodayDate()}.csv`
          );
          setBookingCount("");
        } else {
          showAlert("AWBs not available", "warning");
        }
        getLimit();
      } else if (res?.status == 400 || res?.response?.status == 400) {
        showAlert(res?.response?.data?.message, "warning");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert("Unable to Download CSV", "error");
    } finally {
      setDownloadSpinner(false);
    }
  };

  const handleReset = () => {
    setValidated(false);
    setShipmentType("");
    uploadedFile.current.value = null;
    setUploadedFileData(null);
    setUploadedFileDataModal(null);
    setShipmentMode({});
    setFileName("No file chosen");
    setBookingAmount(0);
    setCurrency(24);
  };

  const handleUploadCSV = async () => {
    if (!shipmentType) {
      showAlert("Please Select Shipment Type", "warning");
      setUploadSpinner(false);
      return;
    }
    if (!shipmentMode?.product_id) {
      showAlert("Please Select a Courier Service", "warning");
      setUploadSpinner(false);
      return;
    }
    if (!currency) {
      showAlert("Please Select a Currency", "warning");
      return;
    }
    if (!uploadedFileData) {
      showAlert("Please upload a csv file", "warning");
      setUploadSpinner(false);
      return;
    }

    const formData = new FormData();
    formData.append("is_surface", shipmentMode?.product_id);
    formData.append(
      "courier_code",
      shipmentMode?.product_name?.toLowerCase().includes("widect")
        ? "widect"
        : shipmentMode?.parent_vendor?.toLowerCase()
    );
    formData.append("shipment_type", shipmentType);
    formData.append("booking_type", bookingType);
    formData.append("currency", currency);
    formData.append("document", uploadedFileData);

    try {
      const response = await uploadCSV(formData);
      if (response?.status == 200) {
        setProgress(100);
        handleReset();
        showAlert(
          "Booking data has been uploaded successfully. The final booking process will be completed shortly via the backend CRON job.\n(No further action is required. You will be notified once processing is complete.)"
        );
      } else if (response?.status == 400 || response?.status == 500) {
        showAlert(response?.response?.data?.error, "error");
      } else if (response?.status == 406) {
        if (!response?.response?.data?.errors[0]?.path.includes("[")) {
          showAlert(response?.response?.data?.errors[0]?.msg, "warning");
        } else if (response?.response?.data?.errors[0]?.path == "document") {
          showAlert(response?.response?.data?.errors[0]?.message, "error");
        } else if (
          response?.response?.data?.errors[0]?.msg == "Required!" ||
          response?.response?.data?.errors[0]?.msg == "Required"
        ) {
          const apiErrors = response?.response?.data?.errors;
          const errorMap = {};
          apiErrors?.forEach((err: any) => {
            const path = err.path;
            const match = path.match(/book_csv\[(\d+)\]\.(.+)/);
            if (match) {
              const rowIndex = parseInt(match[1], 10);
              const columnName = match[2];
              if (!errorMap[rowIndex]) errorMap[rowIndex] = {};
              errorMap[rowIndex][columnName] = err?.msg || "Required";
            } else if (err?.path == "courier_code") {
              showAlert(err?.msg, "error");
            }
          });
          setErrors(errorMap);
          setOpen(true);
          uploadedFile.current.value = null;
          setUploadedFileData(null);
          setFileName("No file chosen");
        } else if (
          response?.response?.data?.errors[0]?.msg == "Invalid value"
        ) {
          const error = response?.response?.data?.errors[0]?.path;
          const match = response?.response?.data?.errors[0]?.path.match(
            /(\w+)\[(\d+)\]\.(\w+)/
          );
          if (match) {
            const row = match[2];
            const key = match[3];

            showAlert(
              `${key
                ?.replaceAll("_", " ")
                .toUpperCase()} value is invalid in row number ${Number(row) + 1
              }`,
              "warning"
            );
          } else {
            showAlert(response?.response?.data?.errors[0]?.msg, "error");
          }
        } else {
          showAlert(response?.response?.data?.errors[0]?.msg, "error");
        }
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert(error?.message, "error");
    } finally {
      setUploadSpinner(false);
    }
  };

  const checkAcl = async () => {
    setUploadSpinner(true);
    try {
      const response = await checkAvailableCreditLimit(
        franchiseeId,
        bookingAmount
      );
      if (response?.data?.status == 200) {
        handleUploadCSV();
      } else if (response?.data?.status == 400) {
        showAlert(response?.data?.message.replaceAll("_", " "), "error");
        setUploadSpinner(false);
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error"
        );
        setUploadSpinner(false);
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
      setUploadSpinner(false);
    }
  };

  const handleValidateCSV = async () => {
    if (!shipmentType) {
      showAlert("Please Select Shipment Type", "warning");
      return;
    }
    if (!shipmentMode?.product_id) {
      showAlert("Please Select a Courier Service", "warning");
      return;
    }
    if (!currency) {
      showAlert("Please Select a Currency", "warning");
      return;
    }
    if (!uploadedFileData) {
      showAlert("Please upload a csv file", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("is_surface", shipmentMode?.product_id);
    formData.append(
      "courier_code",
      shipmentMode?.product_name?.toLowerCase().includes("widect")
        ? "widect"
        : shipmentMode?.parent_vendor?.toLowerCase()
    );
    formData.append("shipment_type", shipmentType);
    formData.append("booking_type", bookingType);
    formData.append("currency", currency);
    formData.append("document", uploadedFileData);
    setValidateSpinner(true);
    try {
      const res = await checkCSV(formData);
      if (res?.status == 200) {
        setValidated(true);
        setBookingAmount(res?.data?.toal_amount_with_gst);
        showAlert("CSV Data Successfully Validated !!");
      } else if (res?.status == 400 || res?.status == 500) {
        uploadedFile.current.value = null;
        setUploadedFileData(null);
        setFileName("No file chosen");
        showAlert(res?.response?.data?.error, "error");
      } else if (res?.status == 406) {
        if (!res?.response?.data?.errors[0]?.path.includes("[")) {
          showAlert(res?.response?.data?.errors[0]?.msg, "warning");
        } else {
          const apiErrors = res?.response?.data?.errors;
          const errorMap = {};
          apiErrors?.forEach((err) => {
            const path = err.path;
            const match = path.match(/book_csv\[(\d+)\]\.(.+)/);
            if (match) {
              const rowIndex = parseInt(match[1], 10);
              const columnName = match[2];
              if (!errorMap[rowIndex]) errorMap[rowIndex] = {};
              errorMap[rowIndex][columnName] = err?.msg || "Required";
            } else if (err?.path == "courier_code") {
              showAlert(err?.msg, "error");
            }
          });
          setErrors(errorMap);
          setOpen(true);
        }
        uploadedFile.current.value = null;
        setUploadedFileData(null);
        setFileName("No file chosen");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert(error?.message, "error");
    } finally {
      setValidateSpinner(false);
    }
  };

  const getData = async () => {
    try {
      const response: any = await getShipmentTypesApi();
      if (response?.status == 200) {
        setShipmentTypesData(response?.data?.data);
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
      } else if (response?.response?.status == 406) {
        showAlert("Bad GateWay", "error");
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error"
        );
      }
    } catch (err: any) {
      showAlert(err?.message, "error");
    }
  };

  const getProduct = async () => {
    try {
      const response: any = await productTypesApi(franchiseeId);
      if (response?.status == 200) {
        setSkartProductData(response?.data?.data);
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
      } else if (response?.response?.status == 406) {
        showAlert("Bad GateWay", "error");
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error"
        );
      }
    } catch (err: any) {
      showAlert(err?.message, "error");
    }
  };

  const getLimit = async () => {
    try {
      const res = await getAWBLimit(franchiseeId);
      if (res?.status == 200) {
        setTotalLimit(Number(res?.data?.data?.awb_limit) || 0);
        setRemainingLimit(Number(res?.data?.data?.remaining) || 0);
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (err: any) {
      showAlert(err?.message, "error");
    }
  };

  useEffect(() => {
    let interval;

    if (uploadSpinner) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevProgress + 10;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [uploadSpinner]);

  useEffect(() => {
    getLimit();
    getData();
    getProduct();
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data || []));
  }, []);

  useEffect(() => {
    if (location.pathname == "/franchisee/upload_bulk_booking") {
      setShowForm(1);
    } else if (location.pathname == "/franchisee/bulk_booking") {
      setShowForm(2);
    }
  }, [location.pathname]);

  return (
    <>
      <div
        className="p-2 my-2 cursor-pointer rounded-full shadow-lg mr-4 w-8 bg-white"
        onClick={() => {
          setShowForm(2);
          navigate("/franchisee/bulk_booking");
          getListingData();
        }}
      >
        <Lucide icon="ArrowLeft" className="w-4 h-4 stroke-2.5 text-mustard" />
      </div>

      <div className="max-w-xl mx-auto p-4  bg-white rounded-lg shadow-md">
        <div className="flex  items-end mb-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700 mb-1">
            {bookingType == 2 ? "Domestic" : "International"} Bulk Booking
          </h2>
        </div>

        <div className="flex justify-center flex-wrap my-4">
          <ul className="flex gap-x-9">
            {/* Domestic Shipment */}
            <Tippy content={"Domestic Shipment"} options={{ placement: "top" }}>
              <li className="animate-fade-in-down">
                <label>
                  <input type="radio" name="test" className="opacity-0 peer" />
                  <figure
                    className={`${bookingType == 2
                      ? "peer-checked:border-[#e8cf9e] peer-checked:bg-[#fbf8d5] peer-checked:scale-[1.14]"
                      : ""
                      } hover:border-[#e8cf9e] hover:bg-[#fbf8d5] transition-all duration-700 rounded-full w-[65px] h-[65px] m-auto p-[4px] border border-[#d0d8df] relative overflow-hidden cursor-pointer`}
                    onClick={() => {
                      setCurrency(24);
                      setBookingType(2);
                    }}
                  >
                    <i className="bg-white rounded-full w-[55px] h-[55px] flex justify-center items-center">
                      <Lucide
                        icon="Truck"
                        className={`${bookingType == 2 ? "text-mustard" : "text-gray-500"
                          } w-8 h-8 stroke-2.5`}
                      />
                    </i>
                  </figure>
                  <span
                    className={`font-bold mt-2 block text-center cursor-pointer hover:text-mustard ${bookingType == 2 ? "text-mustard" : "text-gray-500"
                      }`}
                    onClick={() => {
                      setCurrency(24);
                      setBookingType(2);
                    }}
                  >
                    Domestic Shipment
                  </span>
                </label>
              </li>
            </Tippy>

            {/* International Shipment */}
            <Tippy
              content={"International Shipment"}
              options={{ placement: "top" }}
            >
              <li className="animate-fade-in-down">
                <label>
                  <input type="radio" name="test" className="opacity-0 peer" />
                  <figure
                    className={`${bookingType == 1
                      ? "peer-checked:border-[#e8cf9e] peer-checked:bg-[#fbf8d5] peer-checked:scale-[1.14]"
                      : ""
                      } hover:border-[#e8cf9e] hover:bg-[#fbf8d5] transition-all duration-700 rounded-full w-[65px] h-[65px] m-auto p-[4px] border border-[#d0d8df] relative overflow-hidden cursor-pointer`}
                    onClick={() => setBookingType(1)}
                  >
                    <i className="bg-white rounded-full w-[55px] h-[55px] flex justify-center items-center">
                      <Lucide
                        icon="Plane"
                        className={`${bookingType == 1 ? "text-mustard" : "text-gray-500"
                          } w-8 h-8 stroke-2.5`}
                      />
                    </i>
                  </figure>
                  <span
                    className={`font-bold mt-2 block text-center cursor-pointer hover:text-mustard ${bookingType == 1 ? "text-mustard" : "text-gray-500"
                      }`}
                    onClick={() => setBookingType(1)}
                  >
                    International Shipment
                  </span>
                </label>
              </li>
            </Tippy>
          </ul>
        </div>

        <Tab.Group className="w-full">
          <Tab.List variant="boxed-tabs">
            <Tab>
              <Tab.Button
                className="w-full py-2 text-lg font-bold shadow-md "
                as="button"
                bg="mustard"
                onClick={handleReset}
              >
                Upload CSV
              </Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button
                className="w-full py-2 text-lg font-bold shadow-md"
                as="button"
                bg="mustard"
                onClick={() => setBookingCount("")}
              >
                Download CSV
              </Tab.Button>
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel className="leading-relaxed">
              <div className=" pt-4">
                <div className="grid grid-cols-1 gap-8 mt-4">
                  <div>
                    <FormLabel className="text-gray-700">
                      SHIPMENT TYPE <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormSelect
                      value={shipmentType}
                      disabled={validated || validateSpinner}
                      onChange={(e) => setShipmentType(e.target.value)}
                    >
                      <option value="">Select Shipment Type</option>
                      {shipmentTypesData?.map(
                        (type) =>
                          type?.is_active == 1 &&
                          (type?.booking_shipment_type_id == "1" ||
                            type?.booking_shipment_type_id == "2" ||
                            (bookingType == 1 &&
                              type?.booking_shipment_type_id == "6")) && (
                            <option
                              key={type?.booking_shipment_type_id}
                              value={type?.booking_shipment_type_id}
                            >
                              {type?.shipment_type}
                            </option>
                          )
                      )}
                    </FormSelect>
                  </div>
                  <div>
                    <FormLabel className="text-gray-700">
                      COURIER SERVICES <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormSelect
                      value={shipmentMode?.product_id || ""}
                      disabled={validated || validateSpinner}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedProduct = skartProductData?.find(
                          (type) => type.product_id == selectedId
                        );
                        setShipmentMode(selectedProduct || {});
                      }}
                    >
                      <option value="">Select Product</option>
                      {skartProductData
                        ?.filter(
                          (item) =>
                            !item?.parent_vendor
                              ?.toLowerCase()
                              ?.includes("dhl") &&
                            !item?.product_name
                              ?.toLowerCase()
                              ?.includes("import") &&
                            !item?.product_name
                              ?.toLowerCase()
                              ?.includes("cargo")
                        )
                        ?.map(
                          (type) =>
                            type?.is_active == 1 &&
                            (bookingType == 1
                              ? type?.is_international == 1
                              : type?.is_international == 0) && (
                              <option
                                key={type?.product_id}
                                value={type?.product_id}
                              >
                                {type?.product_name}
                              </option>
                            )
                        )}
                    </FormSelect>
                  </div>
                  <div>
                    <FormLabel className="text-gray-700">
                      CURRENCY <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormSelect
                      value={currency}
                      disabled={
                        validated || validateSpinner || bookingType == 2
                      }
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="">Select Currency Type</option>
                      {currencyData?.map((type) => (
                        <option key={type?.id} value={type?.id}>
                          {type?.currency}
                        </option>
                      ))}
                    </FormSelect>
                  </div>
                  <div>
                    <FormLabel className="text-gray-700 mb-2">
                      UPLOAD <span className="text-red-500"> *</span>
                    </FormLabel>

                    <div className="flex items-center bg-white border rounded-lg">
                      <label
                        className="cursor-pointer bg-mustard text-white px-4 py-3 mb-0 rounded-l-lg"
                        htmlFor="file-upload"
                      >
                        Choose File
                        <input
                          className="sr-only"
                          id="file-upload"
                          type="file"
                          accept=".csv"
                          disabled={validated || validateSpinner}
                          onChange={handleFileChange}
                          ref={uploadedFile}
                        />
                      </label>
                      <span className="px-4 py-1 text-gray-500 whitespace-wrap">
                        {fileName}
                      </span>
                    </div>
                  </div>
                </div>
                {progress != 100 && uploadSpinner && (
                  <div className="h-6 mt-3 rounded-lg bg-gray-200">
                    <div
                      className="bg-mustard rounded-lg text-center text-white transition-all duration-1000 ease-out"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{ width: `${progress}%` }}
                    >
                      {progress}%
                    </div>
                  </div>
                )}

                {validated && (
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p>Estimated Booking Amount</p>
                      <p className="text-right">
                        ₹ {indianFormat(bookingAmount)} /-
                      </p>
                    </div>
                    <div
                      className={`${Number(bookingAmount) > Number(availableCreditLimit)
                        ? "text-red-500"
                        : "text-green-500"
                        }`}
                    >
                      <p>Available Credit Limit</p>
                      <p className="text-right">
                        ₹ {indianFormat(availableCreditLimit)} /-
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <>
                    <Button
                      className="bg-red-500 text-white"
                      onClick={handleReset}
                      disabled={uploadSpinner || validateSpinner}
                    >
                      RESET
                    </Button>

                    {validated ? (
                      <Button
                        className="bg-mustard text-white"
                        onClick={checkAcl}
                        disabled={uploadSpinner}
                      >
                        UPLOAD{" "}
                        {uploadSpinner && (
                          <LoadingIcon
                            icon="puff"
                            color="white"
                            className="w-5 h-5 ml-2 stroke-2.5 text-white"
                          />
                        )}
                      </Button>
                    ) : (
                      <Button
                        className="bg-mustard text-white"
                        onClick={handleValidateCSV}
                        disabled={validateSpinner}
                      >
                        VALIDATE{" "}
                        {validateSpinner && (
                          <LoadingIcon
                            icon="puff"
                            color="white"
                            className="w-5 h-5 ml-2 stroke-2.5 text-white"
                          />
                        )}
                      </Button>
                    )}
                  </>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel className="leading-relaxed">
              <div className=" pt-4">
                {bookingType == 1 ? (
                  <div>
                    <FormLabel className="text-gray-700 mb-2">
                      COURIER SERVICES <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormSelect
                      value={downloadCourier?.product_id || ""}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedProduct = skartProductData?.find(
                          (type) => type.product_id == selectedId
                        );
                        setDownloadCourier(selectedProduct || {});
                      }}
                    >
                      <option value="">Select Product</option>
                      {skartProductData
                        ?.filter(
                          (item) =>
                            !item?.parent_vendor
                              ?.toLowerCase()
                              ?.includes("dhl") &&
                            !item?.product_name
                              ?.toLowerCase()
                              ?.includes("import") &&
                            !item?.product_name
                              ?.toLowerCase()
                              ?.includes("cargo")
                        )
                        ?.map(
                          (type) =>
                            type?.is_active == 1 &&
                            type?.is_international == 1 && (
                              <option
                                key={type.product_id}
                                value={type.product_id}
                              >
                                {type.product_name}
                              </option>
                            )
                        )}
                    </FormSelect>
                  </div>
                ) : (
                  <div>
                    <FormLabel className="text-gray-700 mt-4">
                      Booking Count <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormInput
                      maxLength={3}
                      placeholder="Enter Total Booking Count"
                      value={bookingCount}
                      onChange={(e) => {
                        setBookingCount(e.target.value.replace(/[^0-9]/g, ""));
                      }}
                    />
                  </div>
                )}
                <div className="flex justify-between items-center mt-4">
                  <div>
                    {bookingType == 2 ? (
                      <>
                        <p>Remaining AWBs : {remainingLimit}</p>
                        <p>Total AWBs : {totalLimit}</p>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="bg-mustard text-white"
                      disabled={
                        (bookingType == 2 && !bookingCount) || downloadSpinner
                      }
                      onClick={() =>
                        bookingType == 1 ? handleCSV() : handleDownloadCSV()
                      }
                    >
                      DOWNLOAD{" "}
                      {downloadSpinner && (
                        <LoadingIcon
                          icon="puff"
                          color="white"
                          className="w-5 h-5 ml-2 stroke-2.5 text-white"
                        />
                      )}
                    </Button>

                    <div>
                      <Menu>
                        <Menu.Button
                          as={Button}
                          className=" sm:w-auto text-white bg-mustard hover:bg-mustard/80"
                          style={{ width: "100%" }}
                        >
                          <Lucide icon="FileText" className="w-4 h-4 mr-2 stroke-2.5" />{" "}
                          Download Helper
                          <Lucide
                            icon="ChevronDown"
                            className="w-4 h-4 ml-auto sm:ml-2 stroke-2.5"
                          />
                        </Menu.Button>
                        <Menu.Items className="w-40 max-h-[25vh] overflow-y-auto">
                          {Object.entries(helperUrl).map(([key, url]) => (
                            <div key={key} className="p-1">
                              <Link
                                to={url}
                                target="_blank"
                                className="font-semibold underline underline-offset-2 hover:no-underline "
                              >
                                {beautify(key)}
                              </Link>
                            </div>
                          ))}
                        </Menu.Items>
                      </Menu>
                    </div>
                  </div>
                </div>
                <div className="border border-amber-400 p-4 mt-4 rounded-xl bg-yellow-100">
                  <div className="flex gap-4 mb-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-1" />
                    <h3 className="text-lg font-semibold text-amber-500">
                      Note:
                    </h3>
                  </div>
                  <ol className="list-decimal ml-10 text-amber-500">
                    <li>
                      Weight should be in{" "}
                      <span className="font-semibold ">Kilograms (kg)</span>.
                    </li>
                    <li>
                      Dimensions should be in{" "}
                      <span className="font-semibold ">Centimeters (cm)</span>.
                    </li>
                    <li>
                      Please refer to{" "}
                      <Link
                        to="/franchisee/country"
                        target="_blank"
                        className="font-semibold  underline underline-offset-2 hover:no-underline"
                      >
                        Country List
                      </Link>{" "}
                      for the destination country name.
                    </li>
                    <li>
                      Incoterm value for
                      <span className="font-semibold mx-2">DDU (use 1),</span>
                      <span className="font-semibold ">DDP (use 2)</span>.
                    </li>
                  </ol>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {open && (
        <BulkCSVModal
          open={open}
          onClose={() => setOpen(false)}
          uploadedFile={uploadedFileDataModal}
          errors={errors}
          shipmentType={shipmentType}
        />
      )}
    </>
  );
};

export default Main;