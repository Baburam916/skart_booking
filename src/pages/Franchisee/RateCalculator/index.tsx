import React, { useEffect, useRef, useState } from "react";
import { Disclosure } from "@headlessui/react";
import Lucide from "../../../base-components/Lucide";
import Button from "../../../base-components/Button";
import {
  getCurrencyApi,
  getShipmentTypesApi,
  rateCalculatorApi,
} from "../../../AllServices/config.service";
import { Tab } from "../../../base-components/Headless";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../base-components/Form";
import Table from "../../../base-components/Table";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import LoadingGif from "../../../assets/images/icons/loading.gif";
import ErrorGif from "../../../assets/images/icons/error.gif";
import OdaFinder from "./odaFinder";
import { indianFormat } from "../../../utils";
import {
  Map,
  MapPin,
  Box,
  Ruler,
  Boxes,
  ChevronRight,
  Globe,
  Scale,
} from "lucide-react";
import CommonSearchableAll from "../../../components/CommonSearchableAll/CommonSearchableAll";
import RateResultGif from "../../../assets/images/rate_result_bg.gif";
import NoVendor from "../../../assets/images/no_vendor.png";
import RateCalculator from "../../../assets/images/rate_calculator.png";
import CalculatorHome from "../../../assets/images/calculator_home.png";
import CalculatorExport from "../../../assets/images/calculator_export.png";
import CalculatorImport from "../../../assets/images/calculator_import.png";

const domOrigin = {
  pincode: "",
};
const domDestination = {
  pincode: "",
};
const intSelectedData = {
  country_id: "",
  country_name: "",
};

const intSelectedData2 = {
  zipcode: "",
  city: "",
};

const main = () => {
  const [toggleUI, setToggleUI] = useState(false);
  const { franchiseeId, isKavach, currencyId, isOverseas } = useFranchisee();
  const initialState = {
    franchisee: franchiseeId,
    booking_type: "2",
    origin_pincode: "",
    destination_pincode: "",
    unit: { weight_unit: "kgs", length_unit: "cms", currency: "24" },
    shipment_type: "",
    weight: "",
    length: "",
    quantity: "",
  };
  const [pincodeAvailable, setPincodeAvailable] = useState(false);
  const [ratesData, setRatesData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentFaq, setCurrentFaq] = useState(1);
  const [error, setError] = useState({});
  const { showAlert } = useAlert();
  const [shipmentTypeData, setShipmentTypeData] = useState([]);
  const [rateFormData, setRateFormData] = useState(initialState);
  const [isVendorLoading, setIsVendorLoading] = useState<boolean>(false);
  const [isVendorError, setIsVendorError] = useState<boolean>(false);
  const [clicked, setClicked] = useState("");
  const [currencyData, setCurrencyData] = useState([]);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedDomOrigin, setSelectedDomOrigin] = useState<any>(domOrigin);
  const [selectedDomDest, setSelectedDomDest] = useState<any>(domDestination);
  const [selectedData, setSelectedData] = useState<any>(intSelectedData);
  const [selectedData2, setSelectedData2] = useState<any>(intSelectedData2);
  const [selectedData3, setSelectedData3] = useState<any>(intSelectedData2);
  const refValue = useRef(null);
  const handleSubmit = async () => {
    setClicked("");
    const errors = {};
    Object.keys(rateFormData).forEach((item) => {
      if (!rateFormData[item]) errors[item] = "This field is required";
    });
    delete errors?.destination_country_code;
    delete errors?.length;
    delete errors?.quantity;
    delete errors?.city;
    delete errors?.state;
    delete errors?.state_name;

    if (rateFormData?.import_booking == 1 && activeTab == 2) {
      delete errors?.destination_pincode;
    }

    if (rateFormData?.import_booking == 2 && activeTab == 3) {
      delete errors?.origin_pincode;
    }

    setError(errors);

    if (Object.keys(errors).length > 0) {
      return false;
    }

    let data = {};

    if (rateFormData?.booking_type == 1) {
      if (rateFormData?.shipment_type == 2) {
        data = {
          is_kawach: isKavach || 0,
          franchisee: franchiseeId,
          booking_type: rateFormData?.booking_type,
          origin_pincode: rateFormData?.origin_pincode,
          destination_pincode: rateFormData?.destination_pincode
            ? rateFormData?.destination_pincode
            : "0000",
          destination_country: rateFormData?.destination_country,
          country_code:
            rateFormData?.import_booking == 2
              ? "IN"
              : rateFormData?.destination_country_code || "",
          shipment_type: rateFormData?.shipment_type,
          unit: {
            weight_unit: "kgs",
            length_unit: "cms",
            currency: "24",
          },
          weight: rateFormData?.weight,
          city: rateFormData?.city,
          state: rateFormData?.state,
          state_name: rateFormData?.state_name,
          import_booking: rateFormData?.import_booking || 1,
          ...(rateFormData?.import_booking == 2
            ? {
              origin_country: rateFormData?.origin_country,
              origin_country_code: rateFormData?.origin_country_code,
              origin_city: rateFormData?.origin_city,
              origin_state: rateFormData?.origin_state,
              origin_state_name: rateFormData?.origin_state_name,
            }
            : {}),
        };
      } else {
        data = {
          is_kawach: isKavach || 0,
          franchisee: franchiseeId,
          booking_type: rateFormData?.booking_type,
          origin_pincode: rateFormData?.origin_pincode,
          destination_pincode: rateFormData?.destination_pincode
            ? rateFormData?.destination_pincode
            : "0000",
          destination_country: rateFormData?.destination_country,
          country_code:
            rateFormData?.import_booking == 2
              ? "IN"
              : rateFormData?.destination_country_code || "",
          shipment_type: rateFormData?.shipment_type,
          unit: {
            weight_unit: "kgs",
            length_unit: "cms",
            currency: "24",
          },
          city: rateFormData?.city,
          state: rateFormData?.state,
          state_name: rateFormData?.state_name,
          shipment_dimensions: [
            {
              item_description: "Book",
              weight: rateFormData?.weight,
              value: "1",
              quantity: rateFormData?.quantity || "1",
              length: rateFormData?.length || "1",
              breadth: "1",
              height: "1",
              hsn_code: "49011010",
            },
          ],
          import_booking: rateFormData?.import_booking || 1,
          ...(rateFormData?.import_booking == 2
            ? {
              origin_country: rateFormData?.origin_country,
              origin_country_code: rateFormData?.origin_country_code,
              origin_city: rateFormData?.origin_city,
              origin_state: rateFormData?.origin_state,
              origin_state_name: rateFormData?.origin_state_name,
            }
            : {}),
        };
      }
    } else {
      if (rateFormData?.shipment_type == 2) {
        data = {
          is_kawach: isKavach || 0,
          franchisee: franchiseeId,
          booking_type: rateFormData?.booking_type,
          origin_pincode: rateFormData?.origin_pincode,
          destination_pincode: rateFormData?.destination_pincode,
          destination_country: "97",
          unit: {
            weight_unit: "kgs",
            length_unit: "cms",
            currency: "24",
          },
          shipment_type: rateFormData?.shipment_type,
          weight: rateFormData?.weight,
          import_booking: rateFormData?.import_booking || 1,
          ...(rateFormData?.import_booking == 2
            ? {
              origin_country: rateFormData?.origin_country,
              origin_country_code: rateFormData?.origin_country_code,
              origin_city: rateFormData?.origin_city,
              origin_state: rateFormData?.origin_state,
              origin_state_name: rateFormData?.origin_state_name,
            }
            : {}),
        };
      } else {
        data = {
          is_kawach: isKavach || 0,
          franchisee: franchiseeId,
          booking_type: rateFormData?.booking_type,
          origin_pincode: rateFormData?.origin_pincode,
          destination_pincode: rateFormData?.destination_pincode,
          destination_country: "97",
          unit: {
            weight_unit: "kgs",
            length_unit: "cms",
            currency: "24",
          },
          shipment_type: rateFormData?.shipment_type,
          shipment_dimensions: [
            {
              item_description: "Book",
              weight: rateFormData?.weight,
              value: "1",
              quantity: rateFormData?.quantity || "1",
              length: rateFormData?.length || "1",
              breadth: "1",
              height: "1",
              hsn_code: "49011010",
            },
          ],
          import_booking: rateFormData?.import_booking || 1,
          ...(rateFormData?.import_booking == 2
            ? {
              origin_country: rateFormData?.origin_country,
              origin_country_code: rateFormData?.origin_country_code,
              origin_city: rateFormData?.origin_city,
              origin_state: rateFormData?.origin_state,
              origin_state_name: rateFormData?.origin_state_name,
            }
            : {}),
        };
      }
    }

    setSpinner(true);
    setIsVendorLoading(true);

    try {
      const response: any = await rateCalculatorApi(data);
      if (response?.status == 200) {
        setRatesData(response?.data?.data || []);
        setIsVendorLoading(false);
        setIsVendorError(false);
        setSpinner(false);
        setCurrentStep(2);
        setCurrentFaq(2);
      } else if (response?.message == "Network Error") {
        showAlert(response?.message, "error");
      } else if (response?.response?.status == 500) {
        showAlert("Internal Server Error", "error");
      } else if (response?.status == 400 || response?.response?.data?.status == false || response?.response?.status == 400) {
        showAlert(response?.response?.data?.message || response?.message || response?.response?.message, "error");
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
      console.log(err);
      setIsVendorLoading(false);
      setIsVendorError(true);
    } finally {
      setSpinner(false);
      setIsVendorLoading(false);
    }
  };

  const handleSetInitial = () => {
    setCurrentStep(1);
    setCurrentFaq(1);
    setSelectedDomOrigin(domOrigin);
    setSelectedDomDest(domDestination);
    setSelectedData({});
    setSelectedData2(intSelectedData2);
    setSelectedData3(intSelectedData2);
    setPincodeAvailable(false);
    setSpinner(false);
    setRatesData([]);
    setIsVendorLoading(false);
    setError({});
  };

  const fun1 = (a: any, forWhat: any) => {
    if (forWhat == 1) {
      setRateFormData((prev) => ({
        ...prev,
        origin_pincode: a?.pincode,
      }));
      delete error?.origin_pincode;
    } else if (forWhat == 2) {
      setRateFormData((prev) => ({
        ...prev,
        destination_pincode: a?.pincode,
      }));
      delete error?.destination_pincode;
    } else {
      setRateFormData((prev) => ({
        ...prev,
        destination_pincode: a?.pincode,
        city: a?.city.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
        state: a?.state.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
        state_name: a?.state_code.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      }));
      delete error?.destination_pincode;
    }
  };

  const funtoempty1 = (forWhat: any) => {
    if (forWhat == 1) {
      setRateFormData((prev) => ({
        ...prev,
        origin_pincode: "",
      }));
      setSelectedDomOrigin(domOrigin);
    } else if (forWhat == 2) {
      setRateFormData((prev) => ({
        ...prev,
        destination_pincode: "",
      }));
      setSelectedDomOrigin(domDestination);
    } else {
      setRateFormData((prev) => ({
        ...prev,
        destination_pincode: "",
      }));
      (delete rateFormData?.city,
        delete rateFormData?.state,
        delete rateFormData?.state_name,
        setSelectedDomOrigin(domDestination));
    }
  };
  const fun2 = (a: any, forWhat: any) => {
    if (forWhat == 1) {
      setRateFormData((prev) => ({
        ...prev,
        destination_country: a?.country_id,
        destination_country_code: a?.country_code,
        destination_pincode: a?.pincode_avail == 1 ? "" : "0000",
      }));
      setPincodeAvailable(a?.pincode_avail == 1 ? true : false);
      delete error?.destination_country;
      delete error?.destination_country_code;
    } else {
      setRateFormData((prev) => ({
        ...prev,
        origin_country: a?.country_id,
        origin_country_code: a?.country_code,
        origin_pincode: a?.pincode_avail == 1 ? "" : "0000",
      }));
      setPincodeAvailable(a?.pincode_avail == 1 ? true : false);
      delete error?.origin_country;
      delete error?.origin_country_code;
    }
  };

  const funtoempty2 = (forWhat: any) => {
    if (forWhat == 1) {
      setRateFormData((prev) => ({
        ...prev,
        destination_country: "",
        destination_country_code: "",
        destination_pincode: "",
      }));
      setSelectedData({});
      setPincodeAvailable(false);
    } else {
      setRateFormData((prev) => ({
        ...prev,
        origin_country: "",
        origin_country_code: "",
        origin_pincode: "",
      }));
      setSelectedData({});
      setPincodeAvailable(false);
    }
    refValue.current.value = "";
  };
  const fun3 = (a: any, forWhat: any) => {
    if (forWhat == 1) {
      setRateFormData((prev) => ({
        ...prev,
        destination_pincode: a?.zipcode,
        city: a?.city_area.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
        state: a?.state_code.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
        state_name: a?.state.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      }));
      delete error?.destination_pincode;
      delete error?.city;
      delete error?.state;
      delete error?.state_name;
    } else {
      setRateFormData((prev) => ({
        ...prev,
        origin_pincode: a?.zipcode,
        origin_city: a?.city_area.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
        origin_state: a?.state_code.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
        origin_state_name: a?.state.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      }));
      delete error?.origin_pincode;
      delete error?.origin_city;
      delete error?.origin_state;
      delete error?.origin_state_name;
    }
  };

  const funtoempty3 = (forWhat: any) => {
    if (forWhat == 1) {
      setRateFormData((prev) => ({
        ...prev,
        destination_pincode: "",
      }));
      delete rateFormData?.city;
      delete rateFormData?.state;
      delete rateFormData?.state_name;
    } else {
      setRateFormData((prev) => ({
        ...prev,
        origin_pincode: "",
        origin_city: "",
        origin_state: "",
        origin_state_name: "",
      }));
      delete rateFormData?.origin_city;
      delete rateFormData?.origin_state;
      delete rateFormData?.origin_state_name;
    }
  };

  useEffect(() => {
    getShipmentTypesApi().then((res) =>
      setShipmentTypeData(res?.data?.data || []),
    );
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data || []));
  }, []);

  return (
    <>
      {toggleUI ? (
        <OdaFinder setToggleUI={setToggleUI} setActiveTab={setActiveTab} />
      ) : (
        <div className="w-full mt-5">
          <div className="h-auto grid grid-cols-12 gap-2 pb-8 mb-8">
            <Disclosure as="div" className=" col-span-12 lg:col-span-6">
              {({ open }) => (
                <div className="bg-white rounded-lg border-[1px] border-[#fff] RCalcuatorMain">
                  <Disclosure.Button
                    onClick={() => {
                      handleSetInitial();
                      setClicked("");
                    }}
                    className="flex items-center   w-full justify-between rounded-t-lg bg-[#FFF2D4] px-[15px] py-[8px] text-left text-sm font-medium"
                  >
                    <div className=" block md:flex items-center justify-between w-full">
                      <div className="w-full flex items-center">
                        <i>
                          <img
                            src={RateCalculator}
                            alt=""
                            className="w-[16px]"
                          />{" "}
                        </i>{" "}
                        <h1 className="text-xl font-bold ml-2">
                          Rate Calculator
                        </h1>
                      </div>
                      <div className="md:flex md:justify-end block">
                        <Button
                          rounded
                          className="bg-mustard text-white border-mustard w-[180px] py-[6px] px-[2px] hover:bg-[#303030] hover:border-[#303030]"
                          // onClick={() => {
                          //   setOpenModal(true);
                          // }}
                          onClick={() => {
                            setToggleUI(true);
                          }}
                        >
                          Click here to find {activeTab == 3 ? "OPA" : "ODA"}
                          <i>
                            {" "}
                            <Lucide
                              icon="Search"
                              className="w-4 h-4 ml-1 stroke-2.5"
                            />
                          </i>
                        </Button>
                      </div>
                    </div>

                    <i className="hidden">
                      {" "}
                      <Lucide
                        icon="ChevronUp"
                        onClick={() => {
                          handleSetInitial();
                          setClicked("");
                        }}
                        className={`w-1/3 ${currentStep == 1
                          ? ""
                          : "rotate-180 transform stroke-2.5"
                          } h-8 w-8 text-mustard`}
                      />
                    </i>
                  </Disclosure.Button>

                  {currentStep >= 1 && (
                    <Disclosure.Panel
                      static={true}
                      className="px-[10px] py-[14px] text-sm text-gray-500  w-full"
                    >
                      <Tab.Group className="w-full">
                        <Tab.List
                          variant="boxed-tabs"
                          className="block  calcualtorTab text-center md:text-left md:flex-none flex-wrap justify-center"
                        >
                          <Tab className="inline-block RatebtnAnimation ">
                            <Tab.Button
                              className={`w-full group hover:bg-[#FFC44C] hover:text-white hover:border-[#FFC44C] ${activeTab == 1
                                ? " bg-[#FFC44C] flex h-[38px]  border border-[#FFC44C] text-[#fff]  pl-[10px] pr-[12px]  py-[8px] text-[15px]  uppercase font-medium mb-1 md:md-0 "
                                : " mb-1 md:md-0 group h-[38px]  flex bg-[#F9F9F9] border border-[#DEDEDE] text-[#272626]  pl-[10px] pr-[12px]  py-[8px] text-[15px]  uppercase font-medium"
                                }`}
                              as="button"
                              bg="mustard"
                              onClick={() => {
                                setCurrentFaq(1);
                                setRateFormData((prev) => ({
                                  ...initialState,
                                  origin_country: "97",
                                  booking_type: "2",
                                  import_booking: 1,
                                }));
                                setError({});
                                setPincodeAvailable(false);
                                setSpinner(false);
                                setRatesData([]);
                                setIsVendorLoading(false);
                                setActiveTab(1);
                                handleSetInitial();
                              }}
                            >
                              <i className="mr-[5px]">
                                <img
                                  src={CalculatorHome}
                                  alt=""
                                  className={`w-[19px] group-hover:brightness-[5654%] ${activeTab == 1
                                    ? "brightness-[5654%]"
                                    : "filter-none"
                                    }`}
                                />
                              </i>

                              {isOverseas ? "Within India" : "Domestic"}
                            </Tab.Button>
                          </Tab>
                          <Tab className="inline-block">
                            <Tab.Button
                              className={`w-full group hover:bg-[#FFC44C] hover:text-white  hover:border-[#FFC44C] ${activeTab == 2
                                ? "ml-[6px] bg-[#FFC44C] flex h-[38px]  border border-[#FFC44C] text-[#fff]  pl-[10px] pr-[12px]  py-[8px] text-[15px]  uppercase font-medium mb-1 md:md-0"
                                : "mb-1 md:md-0 ml-[6px] h-[38px] flex bg-[#F9F9F9] border border-[#DEDEDE] text-[#272626]  pl-[10px] pr-[12px]  py-[8px] text-[15px]  uppercase font-medium"
                                }`}
                              as="button"
                              bg="mustard"
                              onClick={() => {
                                setCurrentFaq(1);
                                setRateFormData((prev) => ({
                                  ...initialState,
                                  booking_type: "1",
                                  origin_country: "97",
                                  destination_country: "",
                                  import_booking: 1,
                                }));
                                setError({});
                                setPincodeAvailable(false);
                                setSpinner(false);
                                setRatesData([]);
                                setIsVendorLoading(false);
                                setActiveTab(2);
                                handleSetInitial();
                              }}
                            >
                              <i className="relative  top-[-2px] mr-[5px]">
                                <img
                                  src={CalculatorExport}
                                  alt=""
                                  className={`w-[22px] group-hover:brightness-[5654%] ${activeTab == 2
                                    ? "brightness-[5654%] "
                                    : "filter-none"
                                    }`}
                                />
                              </i>

                              {isOverseas ? "From India" : "Export"}
                            </Tab.Button>
                          </Tab>
                          <Tab className="inline-block">
                            <Tab.Button
                              className={`w-full group hover:bg-[#FFC44C] hover:text-white hover:border-[#FFC44C] ${activeTab == 3
                                ? "ml-[12px] bg-[#FFC44C] flex h-[38px]   border border-[#FFC44C] text-[#fff]  pl-[10px] pr-[12px]  py-[8px] text-[15px]  uppercase font-medium"
                                : "ml-[12px] h-[38px] flex bg-[#F9F9F9] border border-[#DEDEDE] text-[#272626]  pl-[10px] pr-[12px]  py-[8px] text-[15px]  uppercase font-medium"
                                }`}
                              as="button"
                              bg="mustard"
                              onClick={() => {
                                setCurrentFaq(1);
                                setRateFormData((prev) => ({
                                  ...initialState,
                                  booking_type: "1",
                                  origin_country: "",
                                  destination_country: "97",
                                  import_booking: 2,
                                }));
                                setError({});
                                setPincodeAvailable(false);
                                setSpinner(false);
                                setRatesData([]);
                                setIsVendorLoading(false);
                                setActiveTab(3);
                                handleSetInitial();
                              }}
                            >
                              <i className="mr-[5px]">
                                <img
                                  src={CalculatorImport}
                                  alt=""
                                  className={`w-[22px] group-hover:brightness-[5654%] ${activeTab == 3
                                    ? "brightness-[5654%] "
                                    : "filter-none"
                                    }`}
                                />
                              </i>
                              {isOverseas ? "To India" : "Import"}
                            </Tab.Button>
                          </Tab>
                        </Tab.List>
                        <Tab.Panels className="my-5">
                          <Tab.Panel className="leading-relaxed">
                            <div className="grid gap-[10px] grid-cols-1 md:grid-cols-2 ">
                              <div className="grid gap-2">
                                <div className="rateCaluotBox ">
                                  <FormLabel
                                    htmlFor="origin"
                                    className="text-sm mb-[-2] text-black"
                                  >
                                    ORIGIN PINCODE{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>

                                  <div className="rateCalculatorInn relative">
                                    <i className="absolute  z-[1] top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                      <MapPin className="w-[18px]" />
                                    </i>

                                    <CommonSearchableAll
                                      apiEndpoint={`admin/domestic-pincode/`}
                                      placeholder={"Search Origin  Pincode"}
                                      selecteddata={selectedDomOrigin}
                                      setSelecteddata={setSelectedDomOrigin}
                                      fun1={(a: any) => fun1(a, 1)}
                                      comingselectedname={"pincode"}
                                      comingselectedid={"pincode_id"}
                                      funtoempty={(a: any) => funtoempty1(1)}
                                      directapply={true}
                                      zIndex={20}
                                      border={
                                        error?.origin_pincode ? true : false
                                      }
                                      className="rateinput"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <div className="rateCaluotBox ">
                                  <FormLabel
                                    htmlFor="destination"
                                    className="text-sm mb-[-2] text-black"
                                  >
                                    DESTINATION PINCODE{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <div className="rateCalculatorInn relative">
                                    <i className="absolute  z-[1] top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                      <Map className="w-[18px]" />
                                    </i>

                                    <CommonSearchableAll
                                      apiEndpoint={`admin/domestic-pincode/`}
                                      placeholder={
                                        "Search Destination  Pincode"
                                      }
                                      selecteddata={selectedDomDest}
                                      setSelecteddata={setSelectedDomDest}
                                      fun1={(a: any) => fun1(a, 2)}
                                      comingselectedname={"pincode"}
                                      comingselectedid={"pincode_id"}
                                      funtoempty={(a: any) => funtoempty1(2)}
                                      directapply={true}
                                      zIndex={20}
                                      border={
                                        error?.destination_pincode
                                          ? true
                                          : false
                                      }
                                      className="rateinput"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <div className="rateCaluotBox ">
                                  <FormLabel
                                    htmlFor="dimensions"
                                    className="text-sm mb-[-2] text-black"
                                  >
                                    SHIPMENT TYPE{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <div className="rateCalculatorInn relative">
                                    <i className="absolute top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                      <Box className="w-[18px]" />
                                    </i>

                                    <FormSelect
                                      className={`w-[100%] rateinput ${error?.shipment_type
                                        ? "border-red-500"
                                        : ""
                                        }`}
                                      formSelectSize="lg"
                                      value={rateFormData?.shipment_type}
                                      onChange={(e) => {
                                        setError((prev) => ({
                                          ...prev,
                                          shipment_type: "",
                                        }));
                                        setRateFormData((prev) => ({
                                          ...prev,
                                          shipment_type: e.target.value,
                                        }));
                                      }}
                                    >
                                      <option value="">
                                        Select Shipment Type
                                      </option>
                                      {shipmentTypeData
                                        ?.filter(
                                          (item: any) =>
                                            activeTab == 1 &&
                                            (item?.booking_shipment_type_id ==
                                              1 ||
                                              item?.booking_shipment_type_id ==
                                              2),
                                        )
                                        ?.map(
                                          (type) =>
                                            type?.is_active == 1 &&
                                            type?.booking_shipment_type_id !=
                                            4 &&
                                            type?.booking_shipment_type_id !=
                                            5 && (
                                              <option
                                                key={
                                                  type?.booking_shipment_type_id
                                                }
                                                value={
                                                  type?.booking_shipment_type_id
                                                }
                                              >
                                                {type?.shipment_type}
                                              </option>
                                            ),
                                        )}
                                    </FormSelect>
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <div className="rateCaluotBox ">
                                  <FormLabel
                                    htmlFor="weight"
                                    className="text-sm mb-[-2] text-black"
                                  >
                                    WEIGHT (IN KGS){" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>

                                  <div className="rateCalculatorInn relative">
                                    <i className="absolute  top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                      <Scale className="w-[18px]" />
                                    </i>

                                    <FormInput
                                      id="weight"
                                      placeholder="Enter weight"
                                      formInputSize="lg"
                                      maxLength={10}
                                      value={rateFormData?.weight}
                                      className={`w-[100%] rateinput ${error?.weight ? "border-red-500" : ""
                                        }`}
                                      onChange={(e) => {
                                        setError((prev) => ({
                                          ...prev,
                                          weight: "",
                                        }));
                                        setRateFormData((prev) => ({
                                          ...prev,
                                          weight: e.target.value
                                            .replace(/[^0-9.]/g, "")
                                            .replace(/(\..*)\./g, "$1"),
                                        }));
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              {rateFormData?.shipment_type &&
                                rateFormData?.shipment_type != 2 && (
                                  <>
                                    <div className="grid gap-2">
                                      <div className="rateCaluotBox ">
                                        <FormLabel
                                          htmlFor="length"
                                          className="text-sm mb-[-2] text-black"
                                        >
                                          MAX LENGTH (IN CMS){" "}
                                        </FormLabel>

                                        <div className="rateCalculatorInn relative">
                                          <i className="absolute  top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                            <Ruler className="w-[18px]" />
                                          </i>
                                          <FormInput
                                            id="length"
                                            placeholder="Enter Max Length"
                                            formInputSize="lg"
                                            value={rateFormData?.length}
                                            className="w-[100%] rateinput"
                                            onChange={(e) => {
                                              setRateFormData((prev) => ({
                                                ...prev,
                                                length: e.target.value.replace(
                                                  /[^0-9.]/g,
                                                  "",
                                                ),
                                              }));
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid gap-2">
                                      <div className="rateCaluotBox ">
                                        <FormLabel
                                          htmlFor="quantity"
                                          className="text-sm mb-[-2] text-black"
                                        >
                                          QUANTITY (IN PCS)
                                        </FormLabel>

                                        <div className="rateCalculatorInn relative">
                                          <i className="absolute  top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                            <Boxes className="w-[18px]" />
                                          </i>
                                          <FormInput
                                            id="quantity"
                                            placeholder="Enter Quantity"
                                            formInputSize="lg"
                                            value={rateFormData?.quantity}
                                            className="w-[100%] rateinput"
                                            onChange={(e) => {
                                              setRateFormData((prev) => ({
                                                ...prev,
                                                quantity:
                                                  e.target.value.replace(
                                                    /[^0-9.]/g,
                                                    "",
                                                  ),
                                              }));
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                              <div className="w-full md:w-auto">
                                <Button
                                  rounded
                                  className="px-2 w-full md:w-24 mr-1 text-white bg-[#8F8F8F]  text-base font-bold hover:bg-mustard"
                                  onClick={() => {
                                    setRateFormData(initialState);
                                    setCurrentStep(1);
                                    setCurrentFaq(1);
                                    setPincodeAvailable(false);
                                    setSpinner(false);
                                    setIsVendorLoading(false);
                                    setIsVendorError(false);
                                    setError({});
                                    handleSetInitial();
                                  }}
                                  disabled={spinner}
                                >
                                  Reset
                                </Button>
                              </div>
                              <div className="flex justify-end w-full md:w-auto">
                                <Button
                                  rounded
                                  className="px-3 w-full md:w-auto  mr-1 text-white bg-mustard  text-base font-bold hover:bg-[#303030]"
                                  onClick={handleSubmit}
                                  disabled={spinner}
                                >
                                  Get Quotation
                                  {spinner && (
                                    <LoadingIcon
                                      icon="puff"
                                      color="white"
                                      className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                    />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </Tab.Panel>
                          <Tab.Panel className="leading-relaxed">
                            <div className="grid gap-[10px] grid-cols-1 md:grid-cols-2">
                              <div className="grid gap-2">
                                <div className="rateCaluotBox ">
                                  <FormLabel
                                    htmlFor="origin"
                                    className="text-sm mb-[-2] text-black"
                                  >
                                    ORIGIN PINCODE{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>

                                  <div className="rateCalculatorInn relative">
                                    <i className="absolute z-[1] top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                      <MapPin className="w-[18px]" />
                                    </i>

                                    <CommonSearchableAll
                                      apiEndpoint={`admin/domestic-pincode/`}
                                      placeholder={"Search Origin  Pincode"}
                                      selecteddata={selectedDomOrigin}
                                      setSelecteddata={setSelectedDomOrigin}
                                      fun1={(a: any) => fun1(a, 1)}
                                      comingselectedname={"pincode"}
                                      comingselectedid={"pincode_id"}
                                      funtoempty={(a: any) => funtoempty1(1)}
                                      directapply={true}
                                      zIndex={20}
                                      border={
                                        error?.origin_pincode ? true : false
                                      }
                                      className="rateinput"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="grid gap-2">
                                <div className="rateCaluotBox ">
                                  <FormLabel
                                    htmlFor="destination"
                                    className="text-sm mb-[-2] text-black"
                                  >
                                    DESTINATION COUNTRY{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <div className="rateCalculatorInn relative">
                                    <i className="absolute z-[1] top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                      <Globe className="w-[18px]" />
                                    </i>

                                    <CommonSearchableAll
                                      apiEndpoint={"admin/country"}
                                      placeholder={"Search Destination Country"}
                                      selecteddata={selectedData}
                                      setSelecteddata={setSelectedData}
                                      fun1={(a: any) => fun2(a, 1)}
                                      key1={"country"}
                                      comingselectedname={"country_name"}
                                      comingselectedid={"country_id"}
                                      funtoempty={() => funtoempty2(1)}
                                      zIndex={20}
                                      border={
                                        error?.destination_country
                                          ? true
                                          : false
                                      }
                                      className="rateinput"
                                      refValue={refValue}
                                    />
                                  </div>
                                </div>
                              </div>
                              {pincodeAvailable && (
                                <div className="grid gap-2">
                                  <div className="rateCaluotBox ">
                                    <FormLabel
                                      htmlFor="destination"
                                      className="text-sm mb-[-2] text-black"
                                    >
                                      DESTINATION ZIPCODE{" "}
                                    </FormLabel>

                                    <div className="rateCalculatorInn relative">
                                      <i className="absolute z-[1] top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                        <Box className="w-[18px]" />
                                      </i>

                                      <CommonSearchableAll
                                        apiEndpoint={`admin/international-pincode?country_code=${rateFormData?.destination_country_code ||
                                          ""
                                          }`}
                                        placeholder={
                                          "Search Destination Pincode"
                                        }
                                        selecteddata={selectedData2}
                                        setSelecteddata={setSelectedData2}
                                        fun1={(a: any) => fun3(a, 1)}
                                        key1={"zipcode"}
                                        comingselectedname={"zipcode"}
                                        comingselectedid={"city"}
                                        questionmark={true}
                                        addcomingname2={"city_area"}
                                        addcomingname3={"state"}
                                        funtoempty={() => funtoempty3(1)}
                                        zIndex={20}
                                        forwhat="zipcode"
                                        className="rateinput"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="grid gap-2">
                                <div className="rateCaluotBox ">
                                  <FormLabel
                                    htmlFor="dimensions"
                                    className="text-sm mb-[-2] text-black"
                                  >
                                    SHIPMENT TYPE{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <div className="rateCalculatorInn relative">
                                    <i className="absolute top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                      <Box className="w-[18px]" />
                                    </i>

                                    <FormSelect
                                      className={`w-[100%] rateinput  ${error?.shipment_type
                                        ? "border-red-500"
                                        : ""
                                        }`}
                                      formSelectSize="lg"
                                      value={rateFormData?.shipment_type}
                                      onChange={(e) => {
                                        setError((prev) => ({
                                          ...prev,
                                          shipment_type: "",
                                        }));
                                        setRateFormData((prev) => ({
                                          ...prev,
                                          shipment_type: e.target.value,
                                        }));
                                      }}
                                    >
                                      <option value="">
                                        Select Shipment Type
                                      </option>
                                      {shipmentTypeData?.map(
                                        (type) =>
                                          type?.is_active == 1 && (
                                            <option
                                              key={
                                                type?.booking_shipment_type_id
                                              }
                                              value={
                                                type?.booking_shipment_type_id
                                              }
                                            >
                                              {type?.shipment_type}
                                            </option>
                                          ),
                                      )}
                                    </FormSelect>
                                  </div>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <div className="rateCaluotBox ">
                                  <FormLabel
                                    htmlFor="weight"
                                    className="text-sm mb-[-2] text-black"
                                  >
                                    WEIGHT (IN KGS){" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <div className="rateCalculatorInn relative">
                                    <i className="absolute top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                      <Scale className="w-[18px]" />
                                    </i>

                                    <FormInput
                                      id="weight"
                                      placeholder="Enter weight"
                                      value={rateFormData?.weight}
                                      formInputSize="lg"
                                      maxLength={10}
                                      className={`w-[100%] rateinput ${error?.weight ? "border-red-500" : ""
                                        }`}
                                      onChange={(e) => {
                                        setError((prev) => ({
                                          ...prev,
                                          weight: "",
                                        }));
                                        setRateFormData((prev) => ({
                                          ...prev,
                                          weight: e.target.value
                                            .replace(/[^0-9.]/g, "")
                                            .replace(/(\..*)\./g, "$1"),
                                        }));
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              {rateFormData?.shipment_type &&
                                rateFormData?.shipment_type != 2 && (
                                  <>
                                    <div className="grid gap-2">
                                      <div className="rateCaluotBox ">
                                        <FormLabel
                                          htmlFor="length"
                                          className="text-sm mb-[-2] text-black"
                                        >
                                          MAX LENGTH (IN CMS){" "}
                                        </FormLabel>

                                        <div className="rateCalculatorInn relative">
                                          <i className="absolute top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                            <Ruler className="w-[18px]" />
                                          </i>

                                          <FormInput
                                            id="weight"
                                            placeholder="Enter Max Length"
                                            formInputSize="lg"
                                            value={rateFormData?.length}
                                            className="w-[100%] rateinput"
                                            onChange={(e) => {
                                              setRateFormData((prev) => ({
                                                ...prev,
                                                length: e.target.value.replace(
                                                  /[^0-9.]/g,
                                                  "",
                                                ),
                                              }));
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid gap-2">
                                      <div className="rateCaluotBox ">
                                        <FormLabel
                                          htmlFor="quantity"
                                          className="text-sm mb-[-2] text-black"
                                        >
                                          QUANTITY (IN PCS)
                                        </FormLabel>
                                        <div className="rateCalculatorInn relative">
                                          <i className="absolute top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                            <Boxes className="w-[18px]" />
                                          </i>

                                          <FormInput
                                            id="quantity"
                                            placeholder="Enter Quantity"
                                            formInputSize="lg"
                                            value={rateFormData?.quantity}
                                            className="w-[100%] rateinput"
                                            onChange={(e) => {
                                              setRateFormData((prev) => ({
                                                ...prev,
                                                quantity:
                                                  e.target.value.replace(
                                                    /[^0-9.]/g,
                                                    "",
                                                  ),
                                              }));
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                              <div className="w-full md:w-auto">
                                <Button
                                  rounded
                                  className="px-2 w-full md:w-24 mr-1 text-white bg-[#8F8F8F]  text-base font-bold hover:bg-mustard"
                                  onClick={() => {
                                    setCurrentStep(1);
                                    setCurrentFaq(1);
                                    setPincodeAvailable(false);
                                    setSpinner(false);
                                    setError({});
                                    funtoempty2(1);
                                    setRateFormData((prev) => ({
                                      ...initialState,
                                      booking_type: "1",
                                      origin_country: "97",
                                      destination_country: "",
                                      import_booking: 1,
                                    }));
                                    setRatesData([]);
                                    setIsVendorLoading(false);
                                    setActiveTab(2);
                                    handleSetInitial();
                                  }}
                                  disabled={spinner}
                                >
                                  Reset
                                </Button>
                              </div>
                              <div className="flex justify-end w-full md:w-auto">
                                <Button
                                  rounded
                                  className="px-3  w-full md:w-auto mr-1 text-white bg-mustard  text-base font-bold"
                                  onClick={handleSubmit}
                                  disabled={spinner}
                                >
                                  Get Quotation
                                  {spinner && (
                                    <LoadingIcon
                                      icon="puff"
                                      color="white"
                                      className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                    />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </Tab.Panel>
                          <Tab.Panel className="leading-relaxed">
                            <div className="grid gap-[10px] grid-cols-1 md:grid-cols-2">
                              <div className="grid gap-2">
                                <div className="rateCaluotBox ">
                                  <FormLabel
                                    htmlFor="origin_country"
                                    className="text-sm mb-[-2] text-black"
                                  >
                                    ORIGIN COUNTRY{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>

                                  <div className="rateCalculatorInn relative">
                                    <i className="absolute z-[1] top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                      <MapPin className="w-[18px]" />
                                    </i>

                                    <CommonSearchableAll
                                      apiEndpoint={"admin/country"}
                                      placeholder={"Search Origin Country"}
                                      selecteddata={selectedData}
                                      setSelecteddata={setSelectedData}
                                      fun1={(a: any) => fun2(a, 2)}
                                      key1={"country"}
                                      comingselectedname={"country_name"}
                                      comingselectedid={"country_id"}
                                      funtoempty={() => funtoempty2(2)}
                                      zIndex={20}
                                      border={
                                        error?.origin_country ? true : false
                                      }
                                      className="rateinput"
                                      refValue={refValue}
                                    />
                                  </div>
                                </div>
                              </div>

                              {pincodeAvailable && (
                                <div className="grid gap-2">
                                  <div className="rateCaluotBox ">
                                    <FormLabel
                                      htmlFor="origin_zipcode"
                                      className="text-sm mb-[-2] text-black"
                                    >
                                      ORIGIN ZIPCODE{" "}
                                    </FormLabel>
                                    <div className="rateCalculatorInn relative">
                                      <i className="absolute z-[1] top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                        <Map className="w-[18px]" />
                                      </i>

                                      <CommonSearchableAll
                                        apiEndpoint={`admin/international-pincode?country_code=${rateFormData?.origin_country_code ||
                                          ""
                                          }`}
                                        placeholder={
                                          "Search Destination Pincode"
                                        }
                                        selecteddata={selectedData3}
                                        setSelecteddata={setSelectedData3}
                                        fun1={fun3}
                                        key1={"zipcode"}
                                        comingselectedname={"zipcode"}
                                        comingselectedid={"city"}
                                        questionmark={true}
                                        addcomingname2={"city_area"}
                                        addcomingname3={"state"}
                                        funtoempty={funtoempty3}
                                        zIndex={20}
                                        forwhat="zipcode"
                                        border={
                                          error?.origin_pincode ? true : false
                                        }
                                        className="rateinput"
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div className="grid gap-2">
                                <div className="rateCaluotBox ">
                                  <FormLabel
                                    htmlFor="destination_pincode"
                                    className="text-sm mb-[-2] text-black"
                                  >
                                    DESTINATION PINCODE{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>

                                  <div className="rateCalculatorInn relative">
                                    <i className="absolute z-[1] top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                      <MapPin className="w-[18px]" />
                                    </i>

                                    <CommonSearchableAll
                                      apiEndpoint={`admin/domestic-pincode/`}
                                      placeholder={
                                        "Search Destination  Pincode"
                                      }
                                      selecteddata={selectedDomDest}
                                      setSelecteddata={setSelectedDomDest}
                                      fun1={(a: any) => fun1(a, 3)}
                                      comingselectedname={"pincode"}
                                      comingselectedid={"pincode_id"}
                                      funtoempty={(a: any) => funtoempty1(3)}
                                      directapply={true}
                                      zIndex={20}
                                      border={
                                        error?.destination_pincode
                                          ? true
                                          : false
                                      }
                                      className="rateinput"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <div className="rateCaluotBox ">
                                  <FormLabel
                                    htmlFor="shipment_type"
                                    className="text-sm mb-[-2] text-black"
                                  >
                                    SHIPMENT TYPE{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <div className="rateCalculatorInn relative">
                                    <i className="absolute top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                      <Box className="w-[18px]" />
                                    </i>

                                    <FormSelect
                                      className={`w-[100%] rateinput  ${error?.shipment_type
                                        ? "border-red-500"
                                        : ""
                                        }`}
                                      formSelectSize="lg"
                                      value={rateFormData?.shipment_type}
                                      onChange={(e) => {
                                        setError((prev) => ({
                                          ...prev,
                                          shipment_type: "",
                                        }));
                                        setRateFormData((prev) => ({
                                          ...prev,
                                          shipment_type: e.target.value,
                                        }));
                                      }}
                                    >
                                      <option value="">
                                        Select Shipment Type
                                      </option>
                                      {shipmentTypeData
                                        ?.filter(
                                          (item: any) =>
                                            activeTab == 3 &&
                                            (item?.booking_shipment_type_id ==
                                              1 ||
                                              item?.booking_shipment_type_id ==
                                              2 ||
                                              item?.booking_shipment_type_id ==
                                              4),
                                        )
                                        ?.map(
                                          (type) =>
                                            type?.is_active == 1 && (
                                              <option
                                                key={
                                                  type?.booking_shipment_type_id
                                                }
                                                value={
                                                  type?.booking_shipment_type_id
                                                }
                                              >
                                                {type?.shipment_type}
                                              </option>
                                            ),
                                        )}
                                    </FormSelect>
                                  </div>
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <div className="rateCaluotBox ">
                                  <FormLabel
                                    htmlFor="weight"
                                    className="text-sm mb-[-2] text-black"
                                  >
                                    WEIGHT (IN KGS){" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <div className="rateCalculatorInn relative">
                                    <i className="absolute top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                      <Scale className="w-[18px]" />
                                    </i>

                                    <FormInput
                                      id="weight"
                                      placeholder="Enter weight"
                                      value={rateFormData?.weight}
                                      formInputSize="lg"
                                      maxLength={10}
                                      className={`w-[100%] rateinput ${error?.weight ? "border-red-500" : ""
                                        }`}
                                      onChange={(e) => {
                                        setError((prev) => ({
                                          ...prev,
                                          weight: "",
                                        }));
                                        setRateFormData((prev) => ({
                                          ...prev,
                                          weight: e.target.value
                                            .replace(/[^0-9.]/g, "")
                                            .replace(/(\..*)\./g, "$1"),
                                        }));
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              {rateFormData?.shipment_type &&
                                rateFormData?.shipment_type != 2 && (
                                  <>
                                    <div className="grid gap-2">
                                      <div className="rateCaluotBox ">
                                        <FormLabel
                                          htmlFor="length"
                                          className="text-sm mb-[-2] text-black"
                                        >
                                          MAX LENGTH (IN CMS){" "}
                                        </FormLabel>

                                        <div className="rateCalculatorInn relative">
                                          <i className="absolute top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                            <Ruler className="w-[18px]" />
                                          </i>

                                          <FormInput
                                            id="weight"
                                            placeholder="Enter Max Length"
                                            formInputSize="lg"
                                            value={rateFormData?.length}
                                            className="w-[100%] rateinput"
                                            onChange={(e) => {
                                              setRateFormData((prev) => ({
                                                ...prev,
                                                length: e.target.value.replace(
                                                  /[^0-9.]/g,
                                                  "",
                                                ),
                                              }));
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid gap-2">
                                      <div className="rateCaluotBox ">
                                        <FormLabel
                                          htmlFor="quantity"
                                          className="text-sm mb-[-2] text-black"
                                        >
                                          QUANTITY (IN PCS)
                                        </FormLabel>
                                        <div className="rateCalculatorInn relative">
                                          <i className="absolute top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                                            <Boxes className="w-[18px]" />
                                          </i>

                                          <FormInput
                                            id="quantity"
                                            placeholder="Enter Quantity"
                                            formInputSize="lg"
                                            value={rateFormData?.quantity}
                                            className="w-[100%] rateinput"
                                            onChange={(e) => {
                                              setRateFormData((prev) => ({
                                                ...prev,
                                                quantity:
                                                  e.target.value.replace(
                                                    /[^0-9.]/g,
                                                    "",
                                                  ),
                                              }));
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                              <div className="w-full md:w-auto">
                                <Button
                                  rounded
                                  className="px-2 w-full md:w-24 mr-1 text-white bg-[#8F8F8F]  text-base font-bold hover:bg-mustard"
                                  onClick={() => {
                                    setSelectedData({});
                                    setCurrentStep(1);
                                    setCurrentFaq(1);
                                    setPincodeAvailable(false);
                                    setSpinner(false);
                                    setError({});
                                    funtoempty2(2);
                                    setRateFormData((prev) => ({
                                      ...initialState,
                                      booking_type: "1",
                                      origin_country: "",
                                      destination_country: "97",
                                      import_booking: 2,
                                    }));
                                    setRatesData([]);
                                    setIsVendorLoading(false);
                                    setActiveTab(3);
                                    handleSetInitial();
                                  }}
                                  disabled={spinner}
                                >
                                  Reset
                                </Button>
                              </div>
                              <div className="flex justify-end w-full md:w-auto">
                                <Button
                                  rounded
                                  className="px-3  w-full md:w-auto mr-1 text-white bg-mustard  text-base font-bold"
                                  onClick={handleSubmit}
                                  disabled={spinner}
                                >
                                  Get Quotation
                                  {spinner && (
                                    <LoadingIcon
                                      icon="puff"
                                      color="white"
                                      className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                    />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </Tab.Panel>
                        </Tab.Panels>
                      </Tab.Group>
                    </Disclosure.Panel>
                  )}
                </div>
              )}
            </Disclosure>
            {currentFaq >= 2 ? (
              isVendorLoading ? (
                <div className=" col-span-12 lg:col-span-6">
                  <div className="rounded-lg pt-8  w-full">
                    <div className="flex justify-center items-center w-full">
                      <img
                        src={LoadingGif}
                        alt="loading-gif"
                        className="w-60 h-40"
                      />
                    </div>
                  </div>
                </div>
              ) : isVendorError ? (
                <div className="flex justify-center">
                  <img src={ErrorGif} alt="error-gif" className="w-48 h-24" />
                </div>
              ) : ratesData.length > 0 ? (
                <Disclosure
                  as="div"
                  className=" col-span-12 lg:col-span-6 w-full "
                >
                  {({ open }) => (
                    <div className="bg-white rounded-lg  border-[1px] border-[#fff] ">
                      <Disclosure.Button
                        onClick={() => setCurrentStep(2)}
                        className=" flex items-center   w-full  rounded-t-lg bg-[#FFF2D4] text-left text-sm font-medium"
                      >
                        <div className=" flex items-center relative overflow-hidden bg-[#ffc540] w-full h-[50px] px-[15px] py-[12px] rounded-t-lg  ">
                          <div className="justify-between z-[10]  flex items-center justify-center w-full">
                            <div className=" flex items-center ">
                              {" "}
                              <h1 className="text-xl font-medium ml-2 text-white">
                                Rates{" "}
                              </h1>
                            </div>

                            <div className="flex">
                              {" "}
                              {isOverseas != "1" ? (
                                <h3 className="text-lg font-bold text-white flex">
                                  * Excluding GST
                                </h3>
                              ) : null}
                            </div>
                          </div>
                          <figure className="tittlebggg absolute left-[0px] lg:top-[-120px] xl:top-[-210px] 2xl:top-[-350px] right-[0px]">
                            <img
                              src={RateResultGif}
                              className="w-full filter hue-rotate-[465deg] brightness-[5] opacity-20"
                            />
                          </figure>
                        </div>

                        <i className="hidden">
                          {" "}
                          <Lucide
                            icon="ChevronUp"
                            onClick={() => setCurrentStep(2)}
                            className={`${currentStep == 2
                              ? ""
                              : "rotate-180 transform stroke-2.5"
                              } h-8 w-8 text-mustard`}
                          />
                        </i>
                      </Disclosure.Button>
                      {currentStep == 2 && (
                        <Disclosure.Panel
                          static={true}
                          className="px-2 pb-2 py-4 text-sm text-gray-500  mb-4"
                        >
                          <div className="w-full">
                            <div className="w-full ">
                              {/* <Table.Thead
                              variant="dark"
                              className="thead-primary table-sorting bg-mustard"
                            >
                              <Table.Tr className="text-center ">
                                <Table.Th className="whitespace-nowrap border">
                                  SR.No.
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap border">
                                  VENDOR
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap border">
                                  PRODUCT TYPE
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap border">
                                  COST{" "}
                                  {isOverseas && currencyId
                                    ? `(${(
                                      currencyData?.find(
                                        (item) => item?.id == currencyId
                                      ) ??
                                      currencyData?.find(
                                        (item) => item?.id == 24
                                      )
                                    )?.symbol || " "
                                    })`
                                    : "(₹)"}
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap border">
                                  CHARGEABLE WEIGHT
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap border">
                                  TAT
                                </Table.Th>
                              </Table.Tr>
                            </Table.Thead> */}
                              <div className="">
                                {ratesData?.sort((a, b) =>
                                  Number(a?.grand_total_without_gst_show) -
                                  Number(b?.grand_total_without_gst_show)
                                )?.map((elem, index) => (
                                  <>
                                    <div
                                      key={index}
                                      className={`text-left cursor-pointer mb-3 group  ${index % 2 === 1 ? "" : ""
                                        } `}
                                      onClick={() => {
                                        if (clicked === index) {
                                          setClicked("");
                                        } else {
                                          setClicked(index);
                                        }
                                      }}
                                    >
                                      <div className="">
                                        <div
                                          className={` group-hover:border-[#FFE9B1] border border-[#E6E6E6] rounded-[10px]  ${clicked === index
                                            ? "border-[#FFE9B1] border bg-[#FFFDF8]"
                                            : ""
                                            }`}
                                        >
                                          <div
                                            className={`group-hover:bg-[#F9F2E1] group-hover:border-[#FFE9B1]          bookleftTittle rounded-tl-[9px] rounded-tr-[9px] border-b border-[#E6E6E6] px-[12px] py-[9px]  bg-[#F8F8F8]  ${clicked === index
                                              ? "bg-[#F9F2E1] border-[#FFE9B1]"
                                              : ""
                                              }`}
                                          >
                                            <div className="md:flex block justify-between items-center">
                                              <h2 className="m-0  font-bold text-[16px]   md:text-[18px] text-[#414342] ">
                                                {elem?.product_name}
                                              </h2>

                                              <div className="flex justify-between items-center">
                                                <p className="text-bold  text-[15px]  md:text-[16px]  text-[#414342]">
                                                  TAT - {elem?.tat_days} Days
                                                </p>

                                                <button className="bg-mustard rounded-full w-[23px] h-[23px] text-white flex items-center justify-between text-center ml-2 relative">
                                                  <ChevronRight
                                                    className={`w-[17px] h-[17px] m-auto ${clicked === index
                                                      ? "rotate-90"
                                                      : ""
                                                      }`}
                                                    onClick={() => {
                                                      if (clicked === index) {
                                                        setClicked("");
                                                      } else {
                                                        setClicked(index);
                                                      }
                                                    }}
                                                  />

                                                  <span
                                                    className={` ${clicked === index
                                                      ? "absolute inline-flex h-full w-full animate-ping rounded-full bg-mustard opacity-75"
                                                      : ""
                                                      }`}
                                                  ></span>
                                                </button>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="p-[12px] md:py-[2%]  md:px-[2%]  m-auto">
                                            <div className="w-full grid grid-cols-12 md:flex justify-between items-center">
                                              <div className="col-span-12">
                                                <h2 className="m-0  font-bold text-[14px]   text-[#414342] ">
                                                  Product Type
                                                </h2>
                                                <p className=" text-[14px]   text-[#5D5D5D]">
                                                  {" "}
                                                  {elem?.product_code}
                                                </p>
                                              </div>

                                              <div className="col-span-6">
                                                <h2 className="m-0  font-bold text-[14px]   text-[#414342] ">
                                                  COST{" "}
                                                  {isOverseas && currencyId
                                                    ? `(${(
                                                      currencyData?.find(
                                                        (item) =>
                                                          item?.id ==
                                                          currencyId,
                                                      ) ??
                                                      currencyData?.find(
                                                        (item) =>
                                                          item?.id == 24,
                                                      )
                                                    )?.symbol || " "
                                                    })`
                                                    : "(₹)"}
                                                </h2>
                                                <p className=" text-[14px]   text-[#5D5D5D]">
                                                  {" "}
                                                  {indianFormat(
                                                    Number(
                                                      elem?.grand_total_without_gst_show,
                                                    ),
                                                  ) || "-"}
                                                </p>
                                              </div>

                                              {(activeTab == 2 || activeTab == 3) ? (<div className="col-span-6">
                                                <h2 className="m-0  font-bold text-[14px]   text-[#414342] ">
                                                  MAX INVOICE VALUE{" "}
                                                  {isOverseas && currencyId
                                                    ? `(${(
                                                      currencyData?.find(
                                                        (item) =>
                                                          item?.id ==
                                                          currencyId,
                                                      ) ??
                                                      currencyData?.find(
                                                        (item) =>
                                                          item?.id == 24,
                                                      )
                                                    )?.symbol || " "
                                                    })`
                                                    : "(₹)"}
                                                </h2>
                                                <p className=" text-[14px]   text-[#5D5D5D]">
                                                  {" "}
                                                  {indianFormat(
                                                    Number(
                                                      elem?.max_invoice,
                                                    ),
                                                  ) || "-"}
                                                </p>
                                              </div>) : null}

                                              <div className="col-span-6">
                                                <h2 className="m-0  font-bold text-[14px]   text-[#414342] ">
                                                  Chargeable Weight
                                                </h2>
                                                <p className=" text-[14px]   text-[#5D5D5D]">
                                                  {" "}
                                                  {elem?.actual_weight} Kg
                                                </p>
                                              </div>
                                            </div>
                                          </div>

                                          {clicked === index && (
                                            <>
                                              <div className=" py-[2%]  px-[2%] w-80%] m-auto border-t border-[#F9EDCF] rateBottomclick">
                                                <div className="overflow-x-auto mb-0 ">
                                                  <Table className="table mb-0 border">
                                                    <Table.Tr className="text-sm">
                                                      <Table.Th className="whitespace-nowrap border border-[#F2DCAB] bg-[#F9F2E1]  font-bold text-black ">
                                                        SR.No.
                                                      </Table.Th>
                                                      <Table.Th
                                                        colSpan={3}
                                                        className="whitespace-nowrap border border-[#F2DCAB] bg-[#F9F2E1]  font-bold text-black"
                                                      >
                                                        PARTICULARS
                                                      </Table.Th>
                                                      <Table.Th
                                                        colSpan={2}
                                                        className="whitespace-nowrap border border-[#F2DCAB] bg-[#F9F2E1] font-bold text-black"
                                                      >
                                                        CHARGES
                                                      </Table.Th>
                                                    </Table.Tr>
                                                    {elem?.selling_charges
                                                      ?.filter(
                                                        (item) =>
                                                          item?.charge_amount_show !=
                                                          0,
                                                      )
                                                      .map((item, index) => (
                                                        <Table.Tr
                                                          className="border p-1 text-xs text-left border-[#F2DCAB] text-base text-black"
                                                          key={index}
                                                        >
                                                          <Table.Td className="border  border-[#F2DCAB] text-base text-black bg-white">
                                                            {index + 1}.
                                                          </Table.Td>
                                                          <Table.Td
                                                            colSpan={3}
                                                            className="border text-base text-black bg-white"
                                                          >
                                                            {item?.charge_name}
                                                          </Table.Td>
                                                          <Table.Td
                                                            colSpan={2}
                                                            className="border text-right border-[#F2DCAB] text-base text-black bg-white"
                                                          >
                                                            {indianFormat(
                                                              Number(
                                                                item?.charge_amount_show,
                                                              ),
                                                            ) || "-"}
                                                          </Table.Td>
                                                        </Table.Tr>
                                                      ))}
                                                    <Table.Tr className="border-none p-1 text-xs border-[#F2DCAB]">
                                                      <Table.Td
                                                        colSpan={4}
                                                        className="border-none font-medium border-[#F2DCAB] text-bold text-black text-lg bg-[#fbf9f3]"
                                                      >
                                                        TOTAL
                                                      </Table.Td>
                                                      <Table.Td
                                                        colSpan={2}
                                                        className="border-none  font-medium text-right border-[#F2DCAB] text-bold text-black text-lg bg-[#fbf9f3]"
                                                      >
                                                        {indianFormat(
                                                          Number(
                                                            elem?.grand_total_without_gst_show,
                                                          ),
                                                        ) || "-"}
                                                      </Table.Td>
                                                    </Table.Tr>
                                                  </Table>
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      )}
                    </div>
                  )}
                </Disclosure>
              ) : (
                <div className="box w-full col-span-12 lg:col-span-6">
                  <div className=" w-full  flex items-center justify-center h-full p-5">
                    <div className=" w-full text-center ">
                      <img
                        src={NoVendor}
                        alt="not Available"
                        className="m-auto w-[85px] animate-bounce"
                      />
                      <h2 className=" w-full text-red-500 font-bold text-xl text-center mt-4">
                        Vendor Not Available for this region !!
                      </h2>
                    </div>
                  </div>
                </div>
              )
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default main;
