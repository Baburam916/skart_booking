import React, { useEffect, useState } from "react";
import AlertComponent from "../../../base-components/Alert";
import Lucide from "../../../base-components/Lucide";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../../base-components/Button";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import { useAlert } from "../../../ContextProvider/AlertContext";
import {
  getCountryApi,
  getCurrencyApi,
  getPUDaddressApi,
  getShipmentTypesApi,
} from "../../../AllServices/config.service";
import CommonSearchableAll from "../../../components/CommonSearchableAll/CommonSearchableAll";
import { FormLabel } from "../../../base-components/Form";
import csbv from "../../../assets/images/icons/csbv.png";
import ecommerce from "../../../assets/images/icons/ecommerce.png";
import Cargocommercial from "../../../assets/images/icons/cargo_commercial.png";
import parcel from "../../../assets/images/icons/parcel_sample.png";
import courier from "../../../assets/images/icons/courier_document.png";
import fairexhibition from "../../../assets/images/icons/fair_exhibition.png";
import importImg from "../../../assets/images/import.png";
import exportImg from "../../../assets/images/export.png";
import domesticImg from "../../../assets/images/domestic.png";
import Tippy from "../../../base-components/Tippy";
import { Check } from "lucide-react";
import DocumentUploadModal from "./DocumentUploadModal";
import InvoiceUploadModal from "./InvoiceUploadModal";

const intDestinationPincodeData = {
  pincode_id: "",
  pincode: "",
};

const intOriginPincodeData = {
  pincode_id: "",
  pincode: "",
  city: "",
  state: "",
  state_code: "",
};

const initial = {
  is_import: 1,
  booking_type: "1",
  startPoint: "booking",
  destination_country: "",
  destination_country_code: "",
  destination_country_id: "",
  origin_pincode: "",
  origin_state_code: "",
  destination_pincode: "",
  city: "",
  state: "",
  shipment_type: "",
  city_available: 0,
  pincode_available: 0,
  origin_country: "INDIA",
  origin_country_code: "IN",
  origin_country_id: "97",
};

const importInitial = {
  is_import: 2,
  booking_type: "1",
  startPoint: "booking",
  origin_pincode: "",
  origin_state_code: "",
  origin_country: "",
  origin_country_code: "",
  origin_country_id: "",
  origin_city: "",
  destination_pincode: "",
  destination_country: "INDIA",
  destination_country_code: "IN",
  destination_country_id: "97",
  city_available: 0,
  pincode_available: 0,
  city: "",
  state: "",
  shipment_type: "",
};

const intSelectedData = {
  country_name: "",
  country_id: "",
};

const intSelectedData2 = {
  zipcode: "",
  city: "",
};
const intSelectedData3 = {
  zipcode: "",
  city: "",
  city_area: "",
  state: "",
  state_code: "",
};

const main = () => {
  const { isKavach, isDirectCust } = useFranchisee();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [selectedOriginPincodeData, setSelectedOriginPincodeData] =
    useState<any>(intOriginPincodeData);
  const [selectedDestinationPincodeData, setSelectedDestinationPincodeData] =
    useState<any>(intDestinationPincodeData);
  const [selectedData, setSelectedData] = useState<any>(intSelectedData);
  const [selectedData2, setSelectedData2] = useState<any>(intSelectedData2);
  const [selectedData3, setSelectedData3] = useState<any>(intSelectedData3);
  const [isOda, setIsOda] = useState(0);
  const [booking, setBooking] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [flmEnable, setFlmEnable] = useState(false);
  const [error, setError] = useState({});
  const [shipmentTypes, setShipmentTypes] = useState([]);
  const [currencyData, setCurrencyData] = useState([]);
  const [selectedDataImport, setSelectedDataImport] =
    useState<any>(intSelectedData);
  const [selectedData2Import, setSelectedData2Import] =
    useState<any>(intSelectedData2);
  const [selectedData3Import, setSelectedData3Import] =
    useState<any>(intSelectedData3);
  const [
    selectedDestinationPincodeDataImport,
    setSelectedDestinationPincodeDataImport,
  ] = useState<any>(intDestinationPincodeData);
  const [activeIndex, setActiveIndex] = useState(0);
  const [docUploadModalOpen, setDocUploadModalOpen] = useState(false);
  const [invoiceUploadModalOpen, setInvoiceUploadModalOpen] = useState(false);

  const fun1 = (a: any) => {
    setBooking((prev) => ({
      ...prev,
      origin_pincode: a?.pincode,
      origin_city: a?.city?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      origin_state: a?.state?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      origin_state_code: a?.state_code,
    }));
    delete error?.origin_pincode;
    checkFlm(a?.pincode);
  };
  const funtoempty1 = () => {
    setSelectedOriginPincodeData(intOriginPincodeData);
    setBooking((prev) => ({
      ...prev,
      origin_pincode: "",
      origin_city: "",
      origin_state: "",
      origin_state_code: "",
    }));
    setSelectedOriginPincodeData(intOriginPincodeData);
    setFlmEnable(false);
  };
  const fun2 = (a: any) => {
    setBooking((prev) => ({
      ...prev,
      destination_pincode: a?.pincode,
      city: a?.city.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      state: a?.state.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
    }));
    setIsOda(a?.is_oda || 0);
    delete error?.destination_pincode;
  };
  const funtoempty2 = () => {
    setSelectedDestinationPincodeData(intDestinationPincodeData);
    setBooking((prev) => ({
      ...prev,
      destination_pincode: "",
      city: "",
      state: "",
    }));
    setIsOda(0);
    setSelectedDestinationPincodeData(intDestinationPincodeData);
  };
  const fun3 = (a: any) => {
    if (a?.country_id == 97) {
      funtoempty3();
      setSelectedData(intSelectedData);
      showAlert("Please select another destination country", "warning");
    } else {
      localStorage.setItem("code", a?.country_code);
      setBooking((prev) => ({
        ...prev,
        destination_country: a?.country_name || "",
        destination_country_code: a?.country_code || "",
        destination_country_id: a?.country_id || "",
        city_available: a?.city_avail == 1 ? 1 : 0,
        pincode_available: a?.pincode_avail == 1 ? 1 : 0,
        destination_pincode: a?.pincode_avail == 0 ? "0000" : "",
        city: "",
        state: "",
      }));
      delete error?.destination_country;
    }
  };
  const funtoempty3 = () => {
    setBooking((prev) => ({
      ...prev,
      destination_country: "",
      destination_country_code: "",
      destination_country_id: "",
      city_available: 0,
      pincode_available: 0,
      destination_pincode: "",
      city: "",
      state: "",
    }));
    localStorage.removeItem("code");
    setSelectedData(intSelectedData);
    setSelectedData2(intSelectedData2);
    setSelectedData3(intSelectedData3);
  };

  const fun4 = (a: any) => {
    setBooking((prev: any) => ({
      ...prev,
      destination_pincode: a?.zipcode,
      city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      state:
        a?.state_code?.replaceAll(/[^a-zA-Z0-9 ]/g, "") ||
        localStorage.getItem("code"),
      state_name: a?.state?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
    }));
    setSelectedData3((pre: any) => ({ ...pre, city_area: a?.city_area }));
    delete error?.destination_pincode;
    if (a?.city_area) {
      delete error?.city;
    }
  };
  const funtoempty4 = () => {
    setBooking((prev: any) => ({
      ...prev,
      destination_pincode: "",
      city: "",
      state: localStorage.getItem("code") || "",
      state_name: "",
    }));
    setSelectedData2(intSelectedData2);
    setSelectedData3(intSelectedData3);
  };

  const fun5 = (a: any) => {
    setBooking((prev: any) => ({
      ...prev,
      city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
    }));
    delete error?.city;
  };
  const funtoempty5 = () => {
    setBooking((prev: any) => ({
      ...prev,
      city: "",
    }));
  };

  const funtohandle = (forwhat?: any, value?: any) => {
    if (forwhat == "zipcode") {
      setBooking((pre: any) => ({
        ...pre,
        destination_pincode: value,
        city: "",
        city_area: "",
        state: localStorage.getItem("code"),
      }));
    } else {
      setBooking((pre: any) => ({
        ...pre,
        city: value,
      }));
    }
  };

  const checkFlm = async (origin_pincode: any) => {
    if (!origin_pincode) {
      return;
    }
    setLoading(true);
    try {
      const res = await getPUDaddressApi(origin_pincode);
      if (res?.status == 200) {
        if (res?.data?.data.length > 0) {
          if (res?.data?.data[0]?.flm_enable) {
            setFlmEnable(true);
          } else {
            setFlmEnable(false);
          }
        } else {
          setFlmEnable(false);
        }
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (ocr: any = 0, ocrData?: Record<string, any>) => {
    if (ocr) {
      let data = {
        "is_import": ocrData?.import_booking || 1,
        "booking_type": "1",
        "startPoint": "booking",
        "destination_country": ocrData?.destination_country,
        "destination_country_code": "",
        "destination_country_id": "",
        "origin_pincode": ocrData?.origin_pincode || ocrData?.shipper_details?.consigner_pincode,
        "origin_state_code": ocrData?.shipper_details?.consigner_state,
        "destination_pincode": ocrData?.destination_pincode || ocrData?.consignee_details?.consignee_pincode,
        "city": ocrData?.consignee_details?.consignee_city,
        "state": ocrData?.consignee_details?.consignee_state,
        "shipment_type": ocrData?.shipment_type,
        "origin_country": ocrData?.origin_country,
        "origin_country_code": "",
        "origin_country_id": "",
        "origin_city": ocrData?.shipper_details?.consigner_city,
        "origin_state": ocrData?.shipper_details?.consigner_state,
        "state_name": ocrData?.consignee_details?.consignee_state,
        "is_ocr": 1,
        "senderData": ocrData?.shipper_details || {},
        "receiverData": ocrData?.consignee_details || {},
        "shipment_dimension": ocrData?.shipment_dimensions || [],
        "ocr_document_type": ocrData?.ocr_document_type || "",
        "shipper_invoice": ocrData?.shipper_invoice || "",
        "currency_id":currencyData?.find((item) => item?.currency == ocrData?.currency_code?.toUpperCase())?.id || 24,
      }
      await getCountryApi(ocrData?.destination_country).then((res) => { data.destination_country_code = res?.data?.data[0]?.country_code; data.destination_country_id = res?.data?.data[0]?.country_id })
      await getCountryApi(ocrData?.origin_country).then((res) => { data.origin_country_code = res?.data?.data[0]?.country_code; data.origin_country_id = res?.data?.data[0]?.country_id })
      navigate("/franchisee/booking/book_courier_franchisee", {
        state: { booking: { ...data } },
      });
      return;
    } else {
      let bookData = { ...booking };
      if (!booking?.shipment_type) {
        showAlert("Please Select any of shipment Type", "warning");
        return;
      }

      if (!bookData?.origin_pincode) {
        setBooking((pre: any) => ({
          ...pre,
          origin_pincode: selectedOriginPincodeData?.pincode,
        }));
        checkFlm(selectedOriginPincodeData?.pincode);
        bookData.origin_pincode = selectedOriginPincodeData?.pincode;
        bookData.origin_state_code = selectedOriginPincodeData?.state_code;
      }
      if (bookData?.booking_type == "2" && !bookData?.destination_pincode) {
        bookData.destination_pincode = selectedDestinationPincodeData?.pincode;
      }

      if (bookData?.booking_type == "1" && !bookData?.destination_pincode) {
        bookData.destination_pincode = selectedData2?.zipcode;
        bookData.city = selectedData3?.city_area?.replaceAll(
          /[^a-zA-Z0-9 ]/g,
          ""
        );
        bookData.state =
          selectedData3?.state_code?.replaceAll(/[^a-zA-Z0-9 ]/g, "") ||
          localStorage.getItem("code");
        bookData.state_name = selectedData3?.state?.replaceAll(
          /[^a-zA-Z0-9 ]/g,
          ""
        );

        setBooking((pre: any) => ({
          ...pre,
          destination_pincode: selectedData2?.zipcode,
          city: selectedData3?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
          state:
            selectedData3?.state_code?.replaceAll(/[^a-zA-Z0-9 ]/g, "") ||
            localStorage.getItem("code"),
          state_name: selectedData3?.state?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
        }));
      }

      if (bookData?.booking_type == "1" && !bookData?.city) {
        bookData.city = selectedData3?.city_area?.replaceAll(
          /[^a-zA-Z0-9 ]/g,
          ""
        );
      }

      const errors = {};

      Object.keys(bookData).forEach((item) => {
        if (!bookData[item]) errors[item] = "This field is required";
      });

      if (bookData?.booking_type == 1) {
        delete errors?.state;
      }

      if (bookData?.pincode_available == 0 && bookData?.booking_type == 1) {
        setBooking((prev) => ({
          ...prev,
          destination_pincode: "0000",
        }));
        delete errors?.destination_pincode;
        delete errors?.pincode_available;
      }
      if (bookData?.city_available == 0) {
        delete errors?.city;
        delete errors?.city_available;
      }

      if (bookData?.booking_type == 2) {
        delete errors?.city_available;
        delete errors?.pincode_available;
      }

      delete errors?.city_area;
      delete bookData?.city_area;
      delete errors?.origin_state_code;
      delete errors?.state_name;
      delete errors?.state;

      setError(errors);
      if (Object.keys(errors).length > 0) {
        return false;
      }
      setBooking(bookData);
      navigate("/franchisee/booking/book_courier_franchisee", {
        state: { booking: { ...bookData } },
      });
    }
  };

  const handleImportSubmit = async (ocr: any = 0, ocrData?: Record<string, any>) => {
    if (ocr) {
      let data = {
        "is_import": ocrData?.import_booking || 1,
        "booking_type": "1",
        "startPoint": "booking",
        "destination_country": ocrData?.destination_country,
        "destination_country_code": "",
        "destination_country_id": "",
        "origin_pincode": ocrData?.origin_pincode || ocrData?.shipper_details?.consigner_pincode,
        "origin_state_code": ocrData?.shipper_details?.consigner_state,
        "destination_pincode": ocrData?.destination_pincode || ocrData?.consignee_details?.consignee_pincode,
        "city": ocrData?.consignee_details?.consignee_city,
        "state": ocrData?.consignee_details?.consignee_state,
        "shipment_type": ocrData?.shipment_type,
        "origin_country": ocrData?.origin_country,
        "origin_country_code": "",
        "origin_country_id": "",
        "origin_city": ocrData?.shipper_details?.consigner_city,
        "origin_state": ocrData?.shipper_details?.consigner_state,
        "state_name": ocrData?.consignee_details?.consignee_state,
        "is_ocr": 1,
        "senderData": ocrData?.shipper_details || {},
        "receiverData": ocrData?.consignee_details || {},
        "shipment_dimension": ocrData?.shipment_dimensions || [],
        "ocr_document_type": ocrData?.ocr_document_type || "",
        "shipper_invoice": ocrData?.shipper_invoice || "",
        "currency_id":currencyData?.find((item) => item?.currency == ocrData?.currency_code?.toUpperCase())?.id || 24,
      }
      await getCountryApi(ocrData?.destination_country).then((res) => { data.destination_country_code = res?.data?.data[0]?.country_code; data.destination_country_id = res?.data?.data[0]?.country_id })
      await getCountryApi(ocrData?.origin_country).then((res) => { data.origin_country_code = res?.data?.data[0]?.country_code; data.origin_country_id = res?.data?.data[0]?.country_id })
      navigate("/franchisee/booking/book_courier_franchisee", {
        state: { booking: { ...data } },
      });
      return;
    } else {
      let bookData = { ...booking };
      if (!booking?.shipment_type) {
        showAlert("Please Select any of shipment Type", "warning");
        return;
      }
      if (!booking?.origin_country) {
        showAlert("Please select origin country", "warning");
        return;
      }

      if (!bookData?.origin_pincode) {
        setBooking((pre: any) => ({
          ...pre,
          origin_pincode: selectedData2Import?.zipcode,
        }));
        bookData.origin_pincode = selectedData2Import?.zipcode;
      }

      if (!bookData?.origin_city) {
        setBooking((pre: any) => ({
          ...pre,
          origin_city: selectedData3Import?.city_area,
        }));
        bookData.origin_city = selectedData3Import?.city_area;
      }

      if (!bookData?.city) {
        delete bookData.city;
      }

      if (!bookData?.destination_pincode) {
        setBooking((pre: any) => ({
          ...pre,
          destination_pincode: selectedDestinationPincodeDataImport?.pincode,
        }));
        bookData.destination_pincode =
          selectedDestinationPincodeDataImport?.pincode;
      }

      const errors = {};

      Object.keys(bookData).forEach((item) => {
        if (!bookData[item]) errors[item] = "This field is required";
      });

      if (bookData?.pincode_available == 0) {
        setBooking((prev) => ({
          ...prev,
          origin_pincode: "0000",
        }));
        delete errors?.origin_pincode;
        delete errors?.pincode_available;
      }
      if (bookData?.city_available == 0) {
        delete errors?.origin_city;
        delete errors?.city_available;
      }

      delete errors?.city_area;
      delete bookData?.city_area;
      delete errors?.origin_state_code;
      delete errors?.state_name;
      delete errors?.state;

      setError(errors);
      if (Object.keys(errors).length > 0) {
        return false;
      }

      setBooking(bookData);
      navigate("/franchisee/booking/book_courier_franchisee", {
        state: { booking: { ...bookData } },
      });
    }
  };

  const fun1import = (a: any) => {
    if (a?.country_id == 97) {
      funtoempty1import();
      setSelectedDataImport({
        country_name: "",
        country_id: "",
      });
      showAlert("Please select another origin country", "warning");
    } else {
      localStorage.setItem("impcode", a?.country_code);
      setBooking((prev) => ({
        ...prev,
        origin_country: a?.country_name || "",
        origin_country_code: a?.country_code || "",
        origin_country_id: a?.country_id || "",
        city_available: a?.city_avail == 1 ? 1 : 0,
        pincode_available: a?.pincode_avail == 1 ? 1 : 0,
        origin_pincode: a?.pincode_avail == 0 ? "0000" : "",
        city: "",
        state: "",
      }));
      delete error?.origin_country;
    }
  };
  const funtoempty1import = () => {
    setBooking((prev) => ({
      ...prev,
      origin_country: "",
      origin_country_code: "",
      origin_country_id: "",
      city_available: 0,
      pincode_available: 0,
      origin_pincode: "",
      origin_city: "",
      origin_state: "",
      origin_state_code: "",
    }));
    localStorage.removeItem("impcode");
    setSelectedDataImport(intSelectedData);
    setSelectedData2Import(intSelectedData2);
    setSelectedData3Import(intSelectedData3);
    delete error?.origin_pincode;
    delete error?.origin_city;
  };

  const fun2import = (a: any) => {
    setBooking((prev: any) => ({
      ...prev,
      origin_pincode: a?.zipcode,
      origin_city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      origin_state: a?.state?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      origin_state_code:
        a?.state_code?.replaceAll(/[^a-zA-Z0-9 ]/g, "") ||
        localStorage.getItem("impcode"),
    }));
    setSelectedData3Import((pre: any) => ({ ...pre, city_area: a?.city_area }));
    delete error?.origin_pincode;
    if (a?.city_area) {
      delete error?.origin_city;
    }
  };
  const funtoempty2import = () => {
    setBooking((prev: any) => ({
      ...prev,
      origin_pincode: "",
      city: "",
      state: localStorage.getItem("impcode") || "",
      state_name: "",
    }));
    setSelectedData2Import(intSelectedData2);
    // setSelectedData3(intSelectedData3);
  };

  const funtohandleImport = (forwhat?: any, value?: any) => {
    if (forwhat == "zipcode") {
      setBooking((pre: any) => ({
        ...pre,
        origin_pincode: value,
        city: "",
        city_area: "",
        origin_state: localStorage.getItem("impcode"),
      }));
    } else {
      setBooking((pre: any) => ({
        ...pre,
        city: value,
      }));
    }
  };

  const fun3Import = (a: any) => {
    setBooking((prev: any) => ({
      ...prev,
      origin_city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
    }));
    delete error?.city;
  };
  const funtoempty3Import = () => {
    setBooking((prev: any) => ({
      ...prev,
      origin_city: "",
    }));
  };

  const fun4Import = (a: any) => {
    setBooking((prev) => ({
      ...prev,
      destination_pincode: a?.pincode,
      city: a?.city?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      state: a?.state_code,
      state_name: a?.state?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
    }));
    delete error?.destination_pincode;
  };
  const funtoempty4Import = () => {
    setSelectedDestinationPincodeDataImport(intDestinationPincodeData);
    setBooking((prev) => ({
      ...prev,
      destination_pincode: "",
      city: "",
      state: "",
      state_code: "",
    }));
    setSelectedDestinationPincodeDataImport(intDestinationPincodeData);
  };

  useEffect(() => {
    getShipmentTypesApi()?.then((res: any) =>
      setShipmentTypes(res?.data?.data),
    );
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data || []));
  }, []);

  return (
    <>
      {!isDirectCust && (
        <AlertComponent
          variant={(isKavach || booking?.is_import == 2) ? "soft-success" : "soft-warning"}
          className="flex items-center mb-2 p-2 text-lg font-bold z-[1] relative"
        >
          <Lucide
            icon={(isKavach || booking?.is_import == 2) ? "ShieldCheck" : "ShieldAlert"}
            className="w-6 h-6 mr-2"
          />{" "}
          {(isKavach || booking?.is_import == 2)
            ? "This booking is covered under Kavach."
            : "This booking is not covered under kavach. Please click on activate to save from any surprise additional charges."}
          {(!isKavach && booking?.is_import != 2) && (
            <Link to="/franchisee/activate_kavach">
              <Button
                rounded
                size="sm"
                className="text-white bg-green-500 ml-4 text-md px-4"
              >
                Activate
              </Button>
            </Link>
          )}
        </AlertComponent>
      )}
      <div className="mt-3  w-full py-8  px-5 bg-white rounded-lg shadow-lg">
        <div className="w-full lg:w-[810px] xl:w-[900px] m-auto ">
          <div className="grid grid-cols-12 w-full gap-5">
            <div className="col-span-12 lg:col-span-3">
              <div className="w-full lg:w-[194px] ">
                <ul className="w-full bookshopmentLeft gap-2 block md:flex-none md:flex    lg:block  lg:gap-0">
                  <li
                    className={`w-full mb-[10px] shadow-[0_0px_7px_#f1f1f1] ${booking?.is_import == 1 && booking?.booking_type == 1
                      ? "bactive"
                      : ""
                      }`}
                  >
                    <Button
                      className="cursor-pointer bg-[#F1F5F9] w-full py-2 px-3 rounded-[10px]  "
                      onClick={() => {
                        setError({});
                        setFlmEnable(false);
                        funtoempty1();
                        funtoempty2();
                        funtoempty3();
                        funtoempty4();
                        funtoempty5();
                        setError({});
                        setBooking({
                          is_import: 1,
                          booking_type: "1",
                          startPoint: "booking",
                          destination_country: "",
                          destination_country_code: "",
                          destination_country_id: "",
                          origin_pincode: "",
                          origin_state_code: "",
                          destination_pincode: "",
                          city: "",
                          state: "",
                          shipment_type: "",
                          city_available: 0,
                          pincode_available: 0,
                          origin_country: "INDIA",
                          origin_country_code: "IN",
                          origin_country_id: "97",
                        });
                        setActiveIndex(0);
                      }}
                    >
                      <i className="px-2 py-[5px] w-[55px]  h-[50px] rounded-[10px] bg-[#fff] flex items-center justify-center">
                        <img
                          src={exportImg}
                          alt="export"
                          className="grayscale-[12] contrast(.1)"
                        />
                      </i>

                      <p className="m-0 uppercase font-bold text-[17px] ml-[12px]">
                        EXPORT
                      </p>
                    </Button>
                  </li>
                  <li
                    className={`w-full mb-[10px] shadow-[0_0px_7px_#f1f1f1] ${booking?.is_import == 2 && booking?.booking_type == 1
                      ? "bactive"
                      : ""
                      }`}
                  >
                    <Button
                      className={`cursor-pointer bg-[#F1F5F9] w-full py-2 px-3 rounded-[10px] flex  ${booking?.is_import == 2 && booking?.booking_type == 1
                        ? "bactive"
                        : ""
                        }`}
                      onClick={() => {
                        setError({});
                        setFlmEnable(false);

                        setError({});
                        setFlmEnable(false);
                        funtoempty1();
                        funtoempty2();
                        funtoempty3();
                        funtoempty4();
                        funtoempty5();
                        setBooking({
                          is_import: 2,
                          booking_type: "1",
                          startPoint: "booking",
                          destination_country: "INDIA",
                          destination_country_code: "IN",
                          destination_country_id: "97",
                          origin_pincode: "",
                          origin_state_code: "",
                          destination_pincode: "",
                          city: "",
                          state: "",
                          shipment_type: "",
                          origin_country: "",
                          origin_country_code: "",
                          origin_country_id: "",
                          city_available: 0,
                          pincode_available: 0,
                        });
                        setActiveIndex(0);
                      }}
                    >
                      <i className="px-2 py-[5px] w-[55px]  h-[50px] rounded-[10px] bg-[#fff] flex items-center justify-center">
                        <img
                          src={importImg}
                          alt="import"
                          className="grayscale-[12] contrast(.1)"
                        />
                      </i>

                      <p className="m-0 uppercase font-bold text-[17px] ml-[12px]">
                        IMPORT
                      </p>
                    </Button>
                  </li>
                  <li
                    className={`w-full mb-[10px] shadow-[0_0px_7px_#f1f1f1] ${booking?.is_import == 1 && booking?.booking_type == 2
                      ? "bactive"
                      : ""
                      }`}
                  >
                    <Button
                      className="cursor-pointer bg-[#F1F5F9] w-full py-2 px-3 rounded-[10px] flex "
                      as="button"
                      onClick={() => {
                        setError({});
                        setFlmEnable(false);
                        funtoempty1();
                        funtoempty2();
                        funtoempty3();
                        funtoempty4();
                        funtoempty5();
                        setBooking({
                          ...booking,
                          booking_type: "2",
                          is_import: 1,
                          shipment_type: "",
                          destination_country: "INDIA",
                          destination_country_code: "IN",
                          destination_country_id: "97",
                          origin_pincode: "",
                          origin_state_code: "",
                          destination_pincode: "",
                          city: "",
                          state: "",
                          origin_country: "INDIA",
                          origin_country_code: "IN",
                          origin_country_id: "97",
                        });
                        setActiveIndex(0);
                      }}
                    >
                      <i className="px-2 py-[5px] w-[55px]  h-[50px] rounded-[10px] bg-[#fff] flex items-center justify-center">
                        <img
                          src={domesticImg}
                          alt="domestic"
                          className="grayscale-[12] contrast(.1)"
                        />
                      </i>

                      <p className="m-0 uppercase font-bold text-[17px] ml-[12px]">
                        DOMESTIC
                      </p>
                    </Button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-9">
              <div className="border border-[#E6E6E6] rounded-[15px] shadow-[0_0px_5px_#edf5ff]">
                <div className="leading-relaxed">
                  <div className="bookleftTittle rounded-tl-[15px] rounded-tr-[15px] border-b border-[#E6E6E6] px-5 py-4 shadow-[1px_4px_7px_#ececec] bg-[#F8F8F8] relative">
                    {booking?.booking_type == "1" && (
                      <div className="flex justify-end items-center gap-2 mb-2">
                        <button
                          type="button"
                          className="flex items-center gap-2 bg-mustard text-white text-sm font-semibold px-4 py-2 rounded-lg"
                          onClick={() => setDocUploadModalOpen(true)}
                        >
                          <Lucide icon="Upload" className="w-4 h-4  stroke-2.5" />
                          Upload Document
                        </button>
                        <div className="relative group">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center cursor-pointer shadow-md hover:shadow-blue-300 hover:scale-110 transition-all duration-200">
                            <Lucide icon="Info" className="w-3 h-3 text-white stroke-[2.5]" />
                          </div>
                          <div className="absolute bottom-7 left-1/2 z-50 hidden group-hover:block w-72 pointer-events-none">
                            <div className="bg-white text-gray-800 text-xs rounded-xl px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-blue-100">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <Lucide icon="Zap" className="w-3 h-3 text-blue-500" />
                                </div>
                                <span className="font-bold text-blue-600 text-[11px] uppercase tracking-wide">Smart Auto-Fill</span>
                              </div>
                              <p className="text-gray-600 leading-relaxed mb-2">
                                Save time! Upload your document and we'll read it automatically to fill in your details.
                              </p>
                              <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-lg px-2 py-1.5">
                                <Lucide icon="FileCheck" className="w-3 h-3 text-green-500 flex-shrink-0" />
                                <span className="text-gray-500">Supported: <span className="text-green-600 font-semibold">JPG, PNG, PDF</span></span>
                              </div>
                              <p className="text-gray-400 mt-2 text-[10px]">You can always edit the pre-filled information before submitting.</p>
                            </div>
                            <div className="w-2.5 h-2.5 bg-white border-r border-b border-blue-100 rotate-45 absolute -bottom-1.5 left-2"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <h2 className="m-0 uppercase font-bold text-[19px] text-center w-full text-mustard mb-3">
                      Process as
                    </h2>



                    <ul className="block  lg:flex gap-x-5 lg:justify-center newSelected ">
                      {(shipmentTypes
                        ?.map((item: any) => item?.booking_shipment_type_id)
                        .includes(1) ||
                        shipmentTypes
                          ?.map((item: any) => item?.booking_shipment_type_id)
                          .includes(2)) && (
                          <Tippy
                            content={
                              shipmentTypes?.find(
                                (item2: any) =>
                                  item2?.booking_shipment_type_id == 2
                              )?.info ||
                              shipmentTypes?.find(
                                (item2: any) =>
                                  item2?.booking_shipment_type_id == 1
                              )?.info ||
                              ""
                            }
                            options={{
                              placement: shipmentTypes?.find(
                                (item2: any) =>
                                  item2?.booking_shipment_type_id == 2
                              )?.info
                                ? "top"
                                : shipmentTypes?.find(
                                  (item2: any) =>
                                    item2?.booking_shipment_type_id == 1,
                                )?.info
                                  ? "top"
                                  : "",
                            }}
                          >
                            <li
                              className={`inline-block mr-5 lg:mr-0  mb-3  lg:mb-0  ${activeIndex === 1 ? "active" : ""
                                }`}
                              onClick={() => {
                                setActiveIndex(1);
                                setBooking((prev) => ({
                                  ...prev,
                                  shipment_type: "0",
                                }));
                              }}
                            >
                              <label className="flex cursor-pointer border border-[#E6E6E6] rounded-[7px] bg-[#fff] ">
                                <input
                                  type="radio"
                                  name="test"
                                  className="opacity-0 peer absolute"
                                />
                                <div className="newSelectedCheck border-r bg-[#F9F9F9]   rounded-l-[5px] border-l-[#E6E6E6] w-[32px]  h-[30px]  m-auto px-[0px] py-[3px] flex justify-center items-center">
                                  <i className=" bg-[#fff] border border-[#d0d8df] rounded-full w-[23px]  h-[23px] block m-auto p-[2px]">
                                    {" "}
                                    <Check className="w-[16px] h-[18px] hidden" />
                                  </i>
                                </div>
                                <article
                                  className={` ${booking?.shipment_type == "0"
                                    ? " peer-checked:border-[#e8cf9e] peer-checked:bg-[#fbf8d5] shipment_active "
                                    : ""
                                    } hover:border-[#e8cf9e] hover:bg-[#fbf8d5] ripplebg ripplebg pulse  flex pl-[5px] pr-[10px] py-[5px] "`}
                                  onClick={() =>
                                    setBooking((prev) => ({
                                      ...prev,
                                      shipment_type: "0",
                                    }))
                                  }
                                >
                                  <i className="mr-[3px] ">
                                    <img
                                      src={csbv}
                                      alt={`Shipment type ${1}`}
                                      className={`w-[20px] iconShip brightness-[.7] ${booking?.shipment_type == "0"
                                        ? "brightness-100 grayscale-0 mustard-100"
                                        : ""
                                        }hover:brightness-100 grayscale brightness-[.7] transition-all ${booking?.is_import == 2
                                          ? "rotate-[185deg]"
                                          : ""
                                        }`}
                                    />
                                  </i>
                                  <span
                                    className={`font-bold mt-0 block text-gray-500 uppercase ${booking?.shipment_type == "0"
                                      ? "text-mustard shipment_active"
                                      : "text-gray-500"
                                      }`}
                                    onClick={() =>
                                      setBooking((prev) => ({
                                        ...prev,
                                        shipment_type: "0",
                                      }))
                                    }
                                  >
                                    Courier
                                  </span>
                                </article>
                              </label>
                            </li>
                          </Tippy>
                        )}
                      {((booking?.booking_type == 1 &&
                        shipmentTypes
                          ?.map((item: any) => item?.booking_shipment_type_id)
                          .includes(4)) ||
                        (booking?.booking_type == 1 &&
                          shipmentTypes
                            ?.map((item: any) => item?.booking_shipment_type_id)
                            .includes(5))) && (
                          <Tippy
                            content={
                              shipmentTypes?.find(
                                (item2: any) =>
                                  item2?.booking_shipment_type_id == 4
                              )?.info ||
                              shipmentTypes?.find(
                                (item2: any) =>
                                  item2?.booking_shipment_type_id == 5
                              )?.info ||
                              ""
                            }
                            options={{
                              placement: shipmentTypes?.find(
                                (item2: any) =>
                                  item2?.booking_shipment_type_id == 4
                              )?.info
                                ? "top"
                                : shipmentTypes?.find(
                                  (item2: any) =>
                                    item2?.booking_shipment_type_id == 5,
                                )?.info
                                  ? "top"
                                  : "",
                            }}
                          >
                            <li
                              className={`inline-block mr-5 lg:mr-0  mb-3  lg:mb-0  ${activeIndex === 2 ? "active" : ""
                                }`}
                              onClick={() => {
                                setActiveIndex(2);
                                setBooking((prev) => ({
                                  ...prev,
                                  shipment_type: "4",
                                }));
                              }}
                            >
                              <label className="flex cursor-pointer border border-[#E6E6E6] rounded-[7px] bg-[#fff] ">
                                <input
                                  type="radio"
                                  name="test"
                                  className="opacity-0 peer absolute"
                                />
                                <div className="newSelectedCheck border-r bg-[#F9F9F9]   rounded-l-[5px] border-l-[#E6E6E6] w-[32px]  h-[30px]  m-auto px-[0px] py-[3px] flex justify-center items-center">
                                  <i className=" bg-[#fff] border border-[#d0d8df] rounded-full w-[23px]  h-[23px] block m-auto p-[2px]">
                                    {" "}
                                    <Check className="w-[16px] h-[18px] hidden" />
                                  </i>
                                </div>
                                <article
                                  className={` ${booking?.shipment_type == "4"
                                    ? " peer-checked:border-[#e8cf9e] peer-checked:bg-[#fbf8d5] shipment_active "
                                    : ""
                                    } hover:border-[#e8cf9e] hover:bg-[#fbf8d5] ripplebg ripplebg pulse  flex pl-[5px] pr-[10px] py-[5px] "`}
                                  onClick={() =>
                                    setBooking((prev) => ({
                                      ...prev,
                                      shipment_type: "4",
                                    }))
                                  }
                                >
                                  <i className="mr-[3px] ">
                                    <img
                                      src={Cargocommercial}
                                      alt={`Shipment type ${4}`}
                                      className={`w-[20px] iconShip brightness-[.7] ${booking?.shipment_type == "4"
                                        ? "brightness-100 grayscale-0 mustard-100"
                                        : ""
                                        }hover:brightness-100 grayscale brightness-[.7] transition-all`}
                                    />
                                  </i>
                                  <span
                                    className={`font-bold mt-0 block text-gray-500 uppercase ${booking?.shipment_type == "4"
                                      ? "text-mustard shipment_active"
                                      : "text-gray-500"
                                      }`}
                                    onClick={() =>
                                      setBooking((prev) => ({
                                        ...prev,
                                        shipment_type: "4",
                                      }))
                                    }
                                  >
                                    Commercial
                                  </span>
                                </article>
                              </label>
                            </li>
                          </Tippy>
                        )}
                      {shipmentTypes?.map((elem, index) => {
                        return (
                          elem?.booking_shipment_type_id != 2 &&
                          elem?.booking_shipment_type_id != 1 &&
                          elem?.booking_shipment_type_id != 4 &&
                          elem?.booking_shipment_type_id != 5 &&
                          ((booking?.is_import == 1 &&
                            booking?.booking_type == 1) ||
                            elem?.booking_shipment_type_id != 6) &&
                          ((booking?.is_import == 1 &&
                            booking?.booking_type == 1) ||
                            elem?.booking_shipment_type_id != 7) &&
                          elem?.booking_shipment_type_id != 8 && (
                            <Tippy
                              content={elem?.info}
                              options={{
                                placement: elem?.info ? "top" : null,
                              }}
                            >
                              <li
                                className={`inline-block mr-5 lg:mr-0  mb-3  lg:mb-0  ${activeIndex == 2 + index ? "active" : ""
                                  }`}
                                onClick={() => {
                                  setActiveIndex(2 + index);
                                  setBooking((prev) => ({
                                    ...prev,
                                    shipment_type:
                                      elem?.booking_shipment_type_id,
                                  }));
                                }}
                              >
                                <label className="flex cursor-pointer border border-[#E6E6E6] rounded-[7px] bg-[#fff] ">
                                  <input
                                    type="radio"
                                    name="test"
                                    className="opacity-0 peer absolute"
                                  />
                                  <div className="newSelectedCheck border-r bg-[#F9F9F9]   rounded-l-[5px] border-l-[#E6E6E6] w-[32px]  h-[30px]  m-auto px-[0px] py-[3px] flex justify-center items-center">
                                    <i className=" bg-[#fff] border border-[#d0d8df] rounded-full w-[23px]  h-[23px] block m-auto p-[2px]">
                                      {" "}
                                      <Check className="w-[16px] h-[18px] hidden" />
                                    </i>
                                  </div>
                                  <article
                                    className={` ${booking?.shipment_type ==
                                      elem?.booking_shipment_type_id
                                      ? " peer-checked:border-[#e8cf9e] peer-checked:bg-[#fbf8d5] shipment_active "
                                      : ""
                                      } hover:border-[#e8cf9e] hover:bg-[#fbf8d5] ripplebg ripplebg pulse  flex pl-[5px] pr-[10px] py-[5px] "`}
                                    onClick={() =>
                                      setBooking((prev) => ({
                                        ...prev,
                                        shipment_type:
                                          elem?.booking_shipment_type_id,
                                      }))
                                    }
                                  >
                                    <i className="mr-[3px] ">
                                      <img
                                        src={
                                          elem?.booking_shipment_type_id == 1
                                            ? parcel
                                            : elem?.booking_shipment_type_id ==
                                              2
                                              ? courier
                                              : elem?.booking_shipment_type_id ==
                                                7
                                                ? parcel
                                                : elem?.booking_shipment_type_id ==
                                                  5
                                                  ? Cargocommercial
                                                  : elem?.booking_shipment_type_id ==
                                                    6
                                                    ? ecommerce
                                                    : elem?.booking_shipment_type_id ==
                                                      8
                                                      ? fairexhibition
                                                      : ""
                                        }
                                        alt={`Shipment type ${elem?.booking_shipment_type_id}`}
                                        className={`w-[20px] iconShip brightness-[.7] ${booking?.shipment_type ==
                                          elem?.booking_shipment_type_id
                                          ? "brightness-100 grayscale-0 mustard-100"
                                          : ""
                                          }hover:brightness-100 grayscale brightness-[.7] transition-all`}
                                      />
                                    </i>
                                    <span
                                      className={`font-bold mt-0 block text-gray-500 uppercase ${booking?.shipment_type ==
                                        elem?.booking_shipment_type_id
                                        ? "text-mustard shipment_active"
                                        : "text-gray-500"
                                        }`}
                                      onClick={() =>
                                        setBooking((prev) => ({
                                          ...prev,
                                          shipment_type:
                                            elem?.booking_shipment_type_id,
                                        }))
                                      }
                                    >
                                      {elem?.shipment_type}
                                    </span>
                                  </article>
                                </label>
                              </li>
                            </Tippy>
                          )
                        );
                      })}
                    </ul>
                  </div>
                  <div className=" py-[6%]  px-[7%] w-80%] m-auto bookshipInner">
                    <div className=" w-full">
                      <div>
                        <div className=" w-full " id="step2">
                          {booking?.is_import == 1 &&
                            booking?.booking_type == 2 ? (
                            <div>
                              <h1 className="text-lg font-bold mb-8 px-2 py-2 text-center text-mustard bg-[#f9f3e8] uppercase border-l-2 border-[#FFC248]">
                                Book Domestic Shipment
                              </h1>

                              <div className="grid grid-cols-12 gap-3">
                                <div className="col-span-12 md:col-span-6 ">
                                  <div className="flex w-full justify-between flex-col md:flex-row">
                                    <FormLabel
                                      htmlFor="origin_pincode"
                                      className="text-base"
                                    >
                                      ORIGIN PINCODE{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                  </div>
                                  <CommonSearchableAll
                                    apiEndpoint={`admin/domestic-pincode/`}
                                    placeholder={"Search Origin  Pincode"}
                                    selecteddata={selectedOriginPincodeData}
                                    setSelecteddata={
                                      setSelectedOriginPincodeData
                                    }
                                    fun1={fun1}
                                    comingselectedname={"pincode"}
                                    comingselectedid={"pincode_id"}
                                    funtoempty={funtoempty1}
                                    directapply={true}
                                    zIndex={20}
                                    border={
                                      error?.origin_pincode ? true : false
                                    }
                                  />
                                  {flmEnable &&
                                    booking?.origin_pincode &&
                                    !loading && (
                                      <p className="text-green-500 mt-2">
                                        Pickup facility is available &#10004;
                                      </p>
                                    )}
                                  {!flmEnable &&
                                    booking?.origin_pincode &&
                                    !loading && (
                                      <p className="text-red-500 mt-2">
                                        Pickup facility is not available
                                        &#10008;
                                      </p>
                                    )}
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                  <div>
                                    <FormLabel
                                      htmlFor="destination_pincode"
                                      className="text-base"
                                    >
                                      DESTINATION PINCODE{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <CommonSearchableAll
                                      apiEndpoint={`admin/domestic-pincode/`}
                                      placeholder={"Search Destination Pincode"}
                                      selecteddata={
                                        selectedDestinationPincodeData
                                      }
                                      setSelecteddata={
                                        setSelectedDestinationPincodeData
                                      }
                                      fun1={fun2}
                                      comingselectedname={"pincode"}
                                      comingselectedid={"pincode_id"}
                                      funtoempty={funtoempty2}
                                      directapply={true}
                                      zIndex={20}
                                      border={
                                        error?.destination_pincode
                                          ? true
                                          : false
                                      }
                                    />
                                    {booking?.destination_pincode &&
                                      isOda == 1 && (
                                        <p className="text-mustard mt-1 font-bold">
                                          * Destination Pincode under ODA Zone
                                        </p>
                                      )}
                                  </div>
                                </div>

                                {booking?.city || booking?.state ? (
                                  <div className="col-span-12 md:col-span-12">
                                    <div className="rounded-lg grid grid-cols-12 bg-[#FFF7E5] px-4 py-3 mt-0">
                                      {booking?.city && (
                                        <div className="originbox col-span-12 lg:col-span-5 leading-[19px] text-[#2b1f06] lg:mb-0 mb-2">
                                          <p>
                                            City :{" "}
                                            <strong className="uppercase">
                                              {" "}
                                              {booking?.origin_city}
                                            </strong>{" "}
                                          </p>
                                          <p>
                                            State :{" "}
                                            <strong className="uppercase">
                                              {" "}
                                              {booking?.origin_state}
                                            </strong>{" "}
                                          </p>
                                        </div>
                                      )}

                                      <div className="odArrow relative col-span-12 lg:col-span-2">
                                        <div className="arrow">
                                          <span></span>
                                          <span></span>
                                          <span></span>
                                        </div>
                                      </div>

                                      {booking?.state && (
                                        <div className="desinatioBox   col-span-12 lg:col-span-5 leading-[19px] text-[#2b1f06]">
                                          <p>
                                            City :{" "}
                                            <strong className="uppercase">
                                              {" "}
                                              {booking?.city}
                                            </strong>
                                          </p>
                                          <p>
                                            State :{" "}
                                            <strong className="uppercase">
                                              {booking?.state}
                                            </strong>
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>
                              <div className="col-span-12  mb-0">
                                <div className="w-full flex justify-end">
                                  <Button
                                    rounded
                                    className="mt-4 px-9 py-2 inline-block  text-white bg-mustard text-lg font-bold hover:bg-gray-500"
                                    onClick={() => handleSubmit(0)}
                                  >
                                    Book Now
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : booking?.is_import == 2 &&
                            booking?.booking_type == 1 ? (
                            <div className="w-full">
                              <h1 className="text-lg font-bold mb-8 px-2 py-2 text-center text-mustard bg-[#f9f3e8] uppercase border-l-2 border-[#FFC248]">
                                Book import International Shipment
                              </h1>
                              <div className="grid grid-cols-12 gap-3">
                                <div className="col-span-12 md:col-span-6">
                                  <FormLabel
                                    htmlFor="originCountry"
                                    className="text-base"
                                  >
                                    ORIGIN COUNTRY{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <CommonSearchableAll
                                    apiEndpoint={"admin/country"}
                                    placeholder={"Search Origin Country"}
                                    selecteddata={selectedDataImport}
                                    setSelecteddata={setSelectedDataImport}
                                    fun1={fun1import}
                                    key1={"country"}
                                    comingselectedname={"country_name"}
                                    comingselectedid={"country_id"}
                                    funtoempty={funtoempty1import}
                                    zIndex={20}
                                    border={
                                      error?.origin_country ? true : false
                                    }
                                  />
                                  {selectedDataImport?.country_id == 97 && (
                                    <p className="text-red-500 mt-2 mx-2">
                                      Please select another origin country
                                    </p>
                                  )}
                                </div>

                                {booking?.pincode_available == 1 && (
                                  <div className="col-span-12 md:col-span-6 ">
                                    <FormLabel
                                      htmlFor="destinationZipcode"
                                      className="text-base"
                                    >
                                      ZIPCODE{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <CommonSearchableAll
                                      apiEndpoint={`admin/international-pincode?country_code=${booking?.origin_country_code || ""
                                        }`}
                                      placeholder={"Search Origin Pincode"}
                                      selecteddata={selectedData2Import}
                                      setSelecteddata={setSelectedData2Import}
                                      fun1={fun2import}
                                      key1={"zipcode"}
                                      comingselectedname={"zipcode"}
                                      comingselectedid={"city"}
                                      questionmark={true}
                                      addcomingname2={"city_area"}
                                      addcomingname3={"state"}
                                      funtoempty={funtoempty2import}
                                      zIndex={20}
                                      openhandedfun={funtohandleImport}
                                      forwhat="zipcode"
                                      border={
                                        error?.origin_pincode ? true : false
                                      }
                                      enableZipcodeLookup={true}
                                      countryName={booking?.origin_country}
                                    />
                                  </div>
                                )}

                                {booking?.city_available == 1 && (
                                  <div className="col-span-12 md:col-span-6 ">
                                    <FormLabel
                                      htmlFor="destinationCity"
                                      className="text-base"
                                    >
                                      CITY{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <CommonSearchableAll
                                      apiEndpoint={`admin/international-pincode?country_code=${booking?.origin_country_code || ""
                                        }&zipcode=${booking?.origin_pincode || ""
                                        }`}
                                      placeholder={"Search Origin City"}
                                      selecteddata={selectedData3Import}
                                      setSelecteddata={setSelectedData3Import}
                                      fun1={fun3Import}
                                      key1={"city"}
                                      comingselectedname={"city_area"}
                                      comingselectedid={"city_area"}
                                      questionmark={true}
                                      funtoempty={funtoempty3Import}
                                      openhandedfun={funtohandleImport}
                                      zIndex={20}
                                      forwhat="city"
                                      border={error?.origin_city ? true : false}
                                      enableZipcodeLookup={true}
                                      lookupType="city"
                                      countryName={booking?.origin_country}
                                      lookupZipcode={
                                        booking?.pincode_available == 1
                                          ? booking?.origin_pincode
                                          : "0000"
                                      }
                                    />
                                  </div>
                                )}

                                <div className="col-span-12 md:col-span-6">
                                  <div className="flex w-full justify-between flex-col md:flex-row">
                                    <FormLabel
                                      htmlFor="destination_pincode"
                                      className="text-base"
                                    >
                                      DESTINATION PINCODE{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>
                                  </div>
                                  <CommonSearchableAll
                                    apiEndpoint={`admin/domestic-pincode/`}
                                    placeholder={"Search Destination  Pincode"}
                                    selecteddata={
                                      selectedDestinationPincodeDataImport
                                    }
                                    setSelecteddata={
                                      setSelectedDestinationPincodeDataImport
                                    }
                                    fun1={fun4Import}
                                    comingselectedname={"pincode"}
                                    comingselectedid={"pincode_id"}
                                    funtoempty={funtoempty4Import}
                                    directapply={true}
                                    zIndex={16}
                                    border={
                                      error?.destination_pincode ? true : false
                                    }
                                  />
                                </div>

                                <div className="col-span-12  mb-0">
                                  <div className="w-full flex justify-end">
                                    <Button
                                      rounded
                                      className="mt-4 px-9 py-2 inline-block  text-white bg-mustard text-lg font-bold hover:bg-gray-500"
                                      onClick={() => handleImportSubmit(0)}
                                    >
                                      Book Now
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : booking?.booking_type == 1 &&
                            booking?.is_import == 1 ? (
                            <div className=" w-full">
                              <div className="w-full " id="step2">
                                <div className="my-0">
                                  <h1 className="text-lg font-bold mb-8 px-2 py-2 text-center text-mustard bg-[#f9f3e8] uppercase border-l-2 border-[#FFC248]">
                                    Book Export International Shipment
                                  </h1>
                                  <div className="grid grid-cols-12 gap-3">
                                    <div className="col-span-12 md:col-span-6">
                                      <FormLabel
                                        htmlFor="origin_pincode"
                                        className="text-base"
                                      >
                                        ORIGIN PINCODE{" "}
                                        <span className="text-red-500">*</span>
                                      </FormLabel>

                                      <CommonSearchableAll
                                        apiEndpoint={`admin/domestic-pincode/`}
                                        placeholder={"Search Origin  Pincode"}
                                        selecteddata={selectedOriginPincodeData}
                                        setSelecteddata={
                                          setSelectedOriginPincodeData
                                        }
                                        fun1={fun1}
                                        comingselectedname={"pincode"}
                                        comingselectedid={"pincode_id"}
                                        funtoempty={funtoempty1}
                                        directapply={true}
                                        zIndex={20}
                                        border={
                                          error?.origin_pincode ? true : false
                                        }
                                      />
                                      {flmEnable &&
                                        booking?.origin_pincode &&
                                        !loading && (
                                          <p className="text-green-500 mt-2 ">
                                            Pickup facility is available
                                            &#10004;
                                          </p>
                                        )}
                                      {!flmEnable &&
                                        booking?.origin_pincode &&
                                        !loading && (
                                          <p className="text-red-500 mt-2">
                                            Pickup facility is not available
                                            &#10008;
                                          </p>
                                        )}
                                    </div>{" "}
                                    <div className="col-span-12 md:col-span-6">
                                      <div className="">
                                        <FormLabel
                                          htmlFor="destinationCountry"
                                          className="text-base"
                                        >
                                          DESTINATION COUNTRY{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </FormLabel>
                                        <CommonSearchableAll
                                          apiEndpoint={"admin/country"}
                                          placeholder={
                                            "Search Destination Country"
                                          }
                                          selecteddata={selectedData}
                                          setSelecteddata={setSelectedData}
                                          fun1={fun3}
                                          key1={"country"}
                                          comingselectedname={"country_name"}
                                          comingselectedid={"country_id"}
                                          funtoempty={funtoempty3}
                                          zIndex={20}
                                          border={
                                            error?.destination_country
                                              ? true
                                              : false
                                          }
                                        />
                                        {selectedData?.country_id == 97 && (
                                          <p className="text-red-500 mt-2 mx-2">
                                            Please select another destination
                                            country
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    {booking?.pincode_available == 1 && (
                                      <div className="col-span-12 md:col-span-6">
                                        <FormLabel
                                          htmlFor="destinationZipcode"
                                          className="text-base"
                                        >
                                          ZIPCODE{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </FormLabel>
                                        <CommonSearchableAll
                                          apiEndpoint={`admin/international-pincode?country_code=${booking?.destination_country_code ||
                                            ""
                                            }`}
                                          placeholder={
                                            "Search Destination Pincode"
                                          }
                                          selecteddata={selectedData2}
                                          setSelecteddata={setSelectedData2}
                                          fun1={fun4}
                                          key1={"zipcode"}
                                          comingselectedname={"zipcode"}
                                          comingselectedid={"city"}
                                          questionmark={true}
                                          addcomingname2={"city_area"}
                                          addcomingname3={"state"}
                                          funtoempty={funtoempty4}
                                          zIndex={20}
                                          openhandedfun={funtohandle}
                                          forwhat="zipcode"
                                          border={
                                            error?.destination_pincode
                                              ? true
                                              : false
                                          }
                                          enableZipcodeLookup={true}
                                          countryName={booking?.destination_country}
                                        />
                                      </div>
                                    )}
                                    {booking?.city_available == 1 && (
                                      <div className="col-span-12 md:col-span-6">
                                        <FormLabel
                                          htmlFor="destinationCity"
                                          className="text-base"
                                        >
                                          CITY{" "}
                                          <span className="text-red-500">
                                            *
                                          </span>
                                        </FormLabel>
                                        <CommonSearchableAll
                                          apiEndpoint={`admin/international-pincode?country_code=${booking?.destination_country_code ||
                                            ""
                                            }&zipcode=${booking?.destination_pincode || ""
                                            }`}
                                          placeholder={
                                            "Search Destination City"
                                          }
                                          selecteddata={selectedData3}
                                          setSelecteddata={setSelectedData3}
                                          fun1={fun5}
                                          key1={"city"}
                                          comingselectedname={"city_area"}
                                          comingselectedid={"city_area"}
                                          questionmark={true}
                                          funtoempty={funtoempty5}
                                          openhandedfun={funtohandle}
                                          forwhat="city"
                                          border={error?.city ? true : false}
                                          enableZipcodeLookup={true}
                                          lookupType="city"
                                          countryName={booking?.destination_country}
                                          lookupZipcode={
                                            booking?.pincode_available == 1
                                              ? booking?.destination_pincode
                                              : "0000"
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="col-span-12  mb-0">
                                  <div className="w-full flex justify-end">
                                    <Button
                                      rounded
                                      className="mt-4 px-9 py-2 inline-block  text-white bg-mustard text-lg font-bold hover:bg-gray-500"
                                      onClick={() => handleSubmit(0)}
                                    >
                                      Book Now
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DocumentUploadModal
        open={docUploadModalOpen}
        onClose={() => setDocUploadModalOpen(false)}
        shipmentTypes={shipmentTypes}
        onSubmit={(data) => {
          setDocUploadModalOpen(false);
          if (booking?.is_import == 2) {
            handleImportSubmit(1, data);
          } else {
            handleSubmit(1, data);
          }
        }}
      />
      <InvoiceUploadModal
        open={invoiceUploadModalOpen}
        onClose={() => setInvoiceUploadModalOpen(false)}
        onUploaded={(url) => {
          setBooking((prev: any) => ({ ...prev, shipper_invoice: url }));

        }}
      />
    </>
  );
};

export default main;