import React, { useEffect, useState } from "react";
import {
  FormCheck,
  FormInline,
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import Table from "../../../base-components/Table";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  cargoProductsApi,
  courierProductsApi,
  getCargoTypeApi,
  getClearanceTypeApi,
  getCommodityTypeByIdApi,
  getCurrencyApi,
  getIncotermApi,
  getServiceTypeApi,
  getShipmentTypesApi,
  getWeightUnitApi,
  postSpotEnquiryApi,
  rateCalculatorApi,
  updateSpotEnquiryApi,
} from "../../../AllServices/config.service";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingGif from "../../../assets/images/icons/loading.gif";
import ErrorGif from "../../../assets/images/icons/error.gif";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Lucide from "../../../base-components/Lucide";
import Tippy from "../../../base-components/Tippy";
import DimensionModal from "../Modals/DimensionModal";
import { getChargeableWeight } from "../../../utils";
import CommonSearchableAll from "../../../components/CommonSearchableAll/CommonSearchableAll";

const main = () => {
  const { franchiseeId, hubId, branchId, currencyId, isOverseas } =
    useFranchisee();
  const [currentStep, setCurrentStep] = useState(1);
  const { state } = useLocation();
  const [selectVendor, setSelectVendor] = useState(false);
  const [selectedCommodityData, setSelectedCommodityData] = useState({
    commodity: "",
    commodity_id: "",
  });
  const [serviceType, setServiceType] = useState([]);

  const [spotData, setSpotData] = useState({
    franchisee_id: franchiseeId,
    hub_id: hubId,
    branch_id: branchId,
    enquiry_from: 1,
    import_booking: state?.booking?.import_booking || 1,
    origin_country: state?.booking?.origin_country,
    origin_country_code: state?.booking?.origin_country_code,
    org_zip: state?.booking?.origin_pincode,
    org_city: state?.booking?.origin_city,
    org_country_id: state?.booking?.origin_country_id || "97",
    org_state:
      state?.booking?.origin_state?.trim() ||
      state?.booking?.origin_state_code?.trim() ||
      "",
    org_state_code: state?.booking?.origin_state_code || "",
    destination_country: state?.booking?.destination_country,
    destination_country_code: state?.booking?.destination_country_code,
    dest_country_id: state?.booking?.destination_country_id,
    dest_zip: state?.booking?.destination_pincode,
    dest_city: state?.booking?.city,
    dest_state_code: state?.booking?.state || "",
    state_name: state?.booking?.state_name || "",
    shipment_type: state?.booking?.shipment_type || "",
    weight: state?.booking?.weight || "",
    weight_unit: state?.booking?.weight_unit || "kgs",
    quoted_by: state?.booking?.quoted_by || "",
    cargo_type: state?.booking?.cargo_type || "",
    clearence_type: state?.booking?.clearence_type || "",
    incoterm: state?.booking?.incoterm || "",
    price_type: state?.booking?.price_type,
    spot_price: state?.booking?.spot_price,
    currency_id: state?.booking?.currency_id || currencyId || "24",
    courier_id: state?.booking?.courier_id || "",
    courier_code: state?.booking?.courier_code || "",
    courier_name: state?.booking?.courier_name || "",
    courier_vendor_code: state?.booking?.courier_vendor_code || "",
    booking_status: 0,
    commodity: state?.booking?.commodity || "",
    // service_type: state?.booking?.service_type || "",
    startPoint: state?.booking?.startPoint,
    ...(state?.booking?.startPoint == "listing"
      ? {
        id: state?.booking?.id,
        booking_no: state?.booking?.booking_no,
        shipment_dimension: state?.booking?.shipment_dimension || [],
      }
      : {}),
    ...(state?.booking?.import_booking == 2
      ? { import_booking_type: state?.booking?.import_booking_type || "" }
      : {}),
  });

  const [weightData, setWeightData] = useState([]);
  const [currencyData, setCurrencyData] = useState([]);
  const [shipmentTypes, setShipmentTypes] = useState();
  const [clearanceType, setClearanceType] = useState();
  const [cargoType, setCargoType] = useState();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [vendorData, setVendorData] = useState();
  const [spinner, setSpinner] = useState(false);
  const [editSpinner, setEditSpinner] = useState(false);
  const [incotermType, setIncoterm] = useState([]);
  const [dimensionData, setDimensionData] = useState(
    state?.booking?.shipment_dimension || []
  );
  const [isEditDimension, setIsEditDimension] = useState<boolean>(false);
  const [editDimensionData, setEditDimensionData] = useState<any>({});
  const [editIndex, setEditIndex] = useState<number>();
  const [dimensionPreview, setDimensionPreview] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (e, index) => {
    e.stopPropagation();
    e.isPropagationStopped();
    const newData = [...dimensionData];
    newData.splice(index, 1);

    setDimensionData(newData);
  };

  const getData = () => {
    getShipmentTypesApi().then((res) => setShipmentTypes(res?.data?.data));
    getWeightUnitApi().then((res) => setWeightData(res?.data?.data));
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data || []));
    getClearanceTypeApi().then((res) => {
      setClearanceType(res?.data?.data);
    });
    getCargoTypeApi().then((res) => setCargoType(res?.data?.data));
    getIncotermApi().then((res) => setIncoterm(res?.data?.data));
    // getServiceTypeApi().then((res) => setServiceType(res?.data?.data));
  };

  const commodityFun1 = (item: any) => {
    setSpotData((prev) => ({
      ...prev,
      commodity: item?.commodity_id || "",
    }));
    setCurrentStep(1);
  };

  const commodityFuntoempty = () => {
    setSpotData((prev) => ({
      ...prev,
      commodity: "",
    }));
    setCurrentStep(1);
  };

  const handleGetQuote = async () => {
    let empty = {
      shipment_type: spotData?.shipment_type,
      weight: spotData?.weight,
      weight_unit: spotData?.weight_unit,
      quoted_by: spotData?.quoted_by,
      commodity: spotData?.commodity,
      // service_type: spotData?.service_type,
      ...(spotData?.shipment_type == 4
        ? {
          ...(spotData?.import_booking == 1
            ? { cargo_type: spotData?.cargo_type || "" }
            : {}),
          clearence_type: spotData?.clearence_type || "",
          incoterm: spotData?.incoterm || "",
        }
        : {}),
      ...((spotData?.shipment_type == 4 || spotData?.shipment_type == 5) &&
        spotData?.import_booking == 2
        ? {
          import_booking_type: spotData?.import_booking_type || "",
        }
        : {}),
      ...(spotData?.shipment_type == 5 || spotData?.shipment_type == 6
        ? {
          clearence_type: spotData?.clearence_type || "",
          incoterm: spotData?.incoterm || "",
        }
        : {}),
    };

    for (let key in empty) {
      if (empty[key] == "" || empty[key] == undefined) {
        showAlert(`${key.replaceAll("_", " ")} is required`, "warning");
        return;
      }
    }

    let data = {};

    if (spotData?.shipment_type == 1) {
      data = {
        franchisee: franchiseeId,
        booking_type:
          spotData?.dest_country_id == "97" && spotData?.import_booking == 1
            ? "2"
            : "1",
        origin_pincode: spotData?.org_zip,
        destination_country: spotData?.dest_country_id,
        country_code: spotData?.destination_country_code || "",
        destination_pincode: spotData?.dest_zip,
        state_name: spotData?.state_name,
        unit: {
          weight_unit: spotData?.weight_unit,
          length_unit: "cms",
          currency: spotData?.currency_id || "24",
        },
        shipment_type: spotData?.shipment_type,
        weight: spotData?.weight,
        ...(spotData?.import_booking == 2
          ? {
            import_booking: spotData?.import_booking,
            origin_country: spotData?.org_country_id,
            origin_country_code: spotData?.origin_country_code,
            origin_city: spotData?.org_city,
            origin_state: spotData?.org_state_code,
            origin_state_name: spotData?.org_state,
            state: spotData?.dest_state_code,
          }
          : {}),
      };
    } else if (
      spotData?.shipment_type == 4 ||
      spotData?.shipment_type == 5 ||
      spotData?.shipment_type == 6
    ) {
      data = {
        franchisee: franchiseeId,
        booking_type:
          spotData?.dest_country_id == "97" && spotData?.import_booking == 1
            ? "2"
            : "1",
        origin_pincode: spotData?.org_zip,
        destination_country: spotData?.dest_country_id,
        country_code: spotData?.destination_country_code || "",
        destination_pincode: spotData?.dest_zip,
        state_name: spotData?.state_name,
        unit: {
          weight_unit: spotData?.weight_unit,
          length_unit: "cms",
          currency: spotData?.currency_id || "24",
        },
        shipment_type: spotData?.shipment_type,
        weight: spotData?.weight,
        clearance_type: spotData?.clearence_type || "",
        incoterm: spotData?.incoterm || "",
        ...(spotData?.import_booking == 2
          ? {
            import_booking: spotData?.import_booking,
            origin_country: spotData?.org_country_id,
            origin_country_code: spotData?.origin_country_code,
            origin_city: spotData?.org_city,
            origin_state: spotData?.org_state_code,
            origin_state_name: spotData?.org_state,
            state: spotData?.dest_state_code,
          }
          : { cargo_type: spotData?.cargo_type }),
      };
    }

    setIsLoading(true);

    try {
      let response: any;
      if (spotData?.shipment_type == 5) {
        response = await cargoProductsApi(
          spotData?.hub_id,
          spotData?.import_booking == 2
            ? spotData?.org_country_id
            : spotData?.dest_country_id,
          spotData?.import_booking == 2 ? 1 : 0
        );
      } else {
        response = await rateCalculatorApi(data);
      }
      if (response?.status == 200) {
        setVendorData(response?.data?.data);
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
      } else if (response?.status == 422) {
        showAlert(response?.response?.data?.errors[0]?.msg, "error");
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error"
        );
      }
      setIsLoading(false);
    } catch (err: any) {
      showAlert(err?.message, "error");
      setIsError(true);
      setIsLoading(false);
      // console.log(err);
    }

    setCurrentStep(2);
  };

  const SpotBooking = async () => {
    const empty = {
      product_type: spotData?.courier_name || "",
      price_type: spotData?.price_type || "",
      spot_price: spotData?.spot_price || "",
    };

    if (spotData?.shipment_type == 1) {
      delete spotData?.cargo_type;
      delete spotData?.clearence_type;
      delete spotData?.incoterm;
    }

    if (!spotData?.shipment_type == 4 || !spotData?.shipment_type == 5) {
      delete spotData?.import_booking_type;
    }

    for (let key in empty) {
      if (empty[key] == "" || empty[key] == undefined) {
        showAlert(`${key.replaceAll("_", " ")} is required`, "warning");
        return;
      }
    }

    setSpinner(true);
    try {
      const response = await postSpotEnquiryApi({
        ...spotData,
        ...(dimensionData?.length > 0
          ? { shipment_dimensions: dimensionData }
          : {}),
      });
      if (response?.data?.status == 200) {
        // console.log(response?.data?.data);
        showAlert("Spot Enquiry Submitted Successfully");
        navigate("/franchisee/spotpricing_enquiry_list");
      } else if (response?.status == 422) {
        showAlert(response?.response?.data?.errors[0]?.msg, "error");
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setSpinner(false);
    }
  };

  const updateSpotBooking = async () => {
    const empty = {
      product_type: spotData?.courier_id || "",
      price_type: spotData?.price_type || "",
      spot_price: spotData?.spot_price || "",
    };

    delete spotData?.service_type;
    delete spotData?.cargo_type;
    if (spotData?.shipment_type == 1) {
      delete spotData?.clearence_type;
      delete spotData?.incoterm;
    }

    for (let key in empty) {
      if (empty[key] == "" || empty[key] == undefined) {
        showAlert(`${key.replaceAll("_", " ")} is required`, "warning");
        return;
      }
    }

    setEditSpinner(true);
    try {
      const response = await updateSpotEnquiryApi({
        ...spotData,
        ...(dimensionData?.length > 0
          ? { shipment_dimensions: dimensionData }
          : {}),
      });
      if (response?.data?.status == 200) {
        showAlert("Spot Enquiry Updated Successfully");
        navigate("/franchisee/spotpricing_enquiry_list");
      } else if (response?.status == 422) {
        showAlert(response?.response?.data?.errors[0]?.msg, "error");
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setEditSpinner(false);
    }
  };

  const totalWeight = getChargeableWeight(dimensionData);
  useEffect(() => {
    if (dimensionData?.length > 0) {
      setSpotData((prev) => ({
        ...prev,
        weight: totalWeight || "",
      }));
    }
  }, [totalWeight]);

  useEffect(() => {
    getData();
    if (state?.booking?.commodity) {
      getCommodityTypeByIdApi(state?.booking?.commodity).then((res) => {
        const data = Array.isArray(res?.data?.data)
          ? res?.data?.data[0]
          : res?.data?.data;
        if (data) {
          setSelectedCommodityData({
            commodity: data?.commodity || "",
            commodity_id: data?.commodity_id || "",
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    setCurrentStep(1);
  }, [spotData?.weight]);

  return (
    <>
      <Link
        to={`${spotData?.startPoint == "listing"
          ? "/franchisee/spotpricing_enquiry_list"
          : "/franchisee/spot_pricing"
          }`}
      >
        <div className="p-2 my-2 cursor-pointer rounded-full shadow-lg mr-4 w-8  bg-white">
          <Lucide
            icon="ArrowLeft"
            className="w-4 h-4 stroke-2.5 text-mustard"
          />
        </div>
      </Link>
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="w-full md:w-[65%] ">
          <div className="box my-4">
            <div className="box w-full  px-4 py-2  intro-x font-medium cursor-pointer text-sm flex flex-row justify-between gap-4 rounded-lg bg-white h-auto">
              <div>
                <div>
                  <span className="mt-2 text-lg font-bold">ORIGIN </span>
                </div>

                <div className="flex gap-2 ">
                  <div className="text-center p-1 border-2 h-auto  sm:h-14 w-full  sm:w-10 rounded flex flex-col items-center">
                    <img
                      src={`https://flagsapi.com/${spotData?.origin_country_code}/flat/32.png`}
                      alt="origin-flag"
                    />
                    <span className="text-sm block sm:hidden">
                      {" "}
                      {spotData?.org_zip}
                    </span>
                    <span className="text-sm">
                      ({spotData?.origin_country_code})
                    </span>
                  </div>
                  <div className=" p-1 pt-2 h-14 min-w-28 border-2 rounded hidden sm:flex flex-col  justify-center">
                    <h1 className="font-medium text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {spotData?.origin_country}
                    </h1>
                    <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                      ( {spotData?.org_zip})
                    </p>
                  </div>
                </div>
              </div>

              <div className=" mt-11 flex ">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 opacity-25 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 opacity-50 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 opacity-75 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/61/61212.png"
                  className="w-5 h-5"
                  alt="plane-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 opacity-75 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 opacity-50 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 opacity-25 hidden lg:block"
                  alt="dot-icon"
                />
              </div>

              {/* <div className="flex sm:hidden justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/61/61212.png"
                  className="w-6 h-6 md:hidden block"
                  alt="plane-icon"
                />
              </div> */}

              <div>
                <div>
                  <span className="mt-2 text-lg font-bold">DESTINATION</span>
                </div>

                <div className="flex gap-2 ">
                  <div className="text-center p-1 border-2 h-auto mx-6 sm:mx-0 sm:h-14 w-full  sm:w-10 rounded flex flex-col items-center">
                    <img
                      src={`https://flagsapi.com/${spotData?.destination_country_code}/flat/32.png`}
                      alt="destination-flag"
                    />
                    <span className="text-sm block sm:hidden">
                      {spotData?.dest_zip == "0000"
                        ? spotData?.dest_city
                        : spotData?.dest_zip}
                    </span>
                    <span className="text-sm">
                      ({spotData?.destination_country_code})
                    </span>
                  </div>
                  <div className=" p-1 pt-2 min-w-28 h-14 border-2 rounded hidden sm:flex flex-col  justify-center text-wrap">
                    <h1 className="font-medium text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {spotData?.destination_country}
                    </h1>
                    <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                      (
                      {spotData?.dest_zip == "0000"
                        ? spotData?.dest_city
                        : spotData?.dest_zip}
                      )
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="box my-4">
            <div className="flex flex-col items-center  py-2 px-4 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
              <h2 className="mr-auto text-xl font-medium">Shipment Details</h2>
            </div>

            <div className="space-y-4 px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <FormLabel
                    htmlFor="origin-country"
                    className="text-base text-slate-500"
                  >
                    SHIPMENT TYPE <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormSelect
                    id="default"
                    value={spotData.shipment_type}
                    onChange={(e) => {
                      setSpotData((prev) => ({
                        ...prev,
                        shipment_type: e.target.value,
                      }));
                      setCurrentStep(1);
                    }}
                  >
                    <option value="">Select Shipment Type</option>
                    {shipmentTypes
                      ?.filter((item) =>
                        spotData?.import_booking == 2
                          ? item?.booking_shipment_type_id != 5 &&
                          item?.booking_shipment_type_id != 6 &&
                          item?.booking_shipment_type_id != 7
                          : true
                      )
                      ?.map(
                        (type) =>
                          type?.booking_shipment_type_id !== 2 &&
                          type?.is_active == 1 && (
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
                  <FormLabel
                    htmlFor="weight"
                    className="text-base text-slate-500"
                  >
                    WEIGHT<span className="text-red-400">*</span>
                  </FormLabel>
                  <div className="flex items-center gap-2">
                    <FormInput
                      className="w-full"
                      id="weight"
                      value={spotData?.weight}
                      disabled={dimensionData?.length > 0}
                      onChange={(e) => {
                        setSpotData((prev) => ({
                          ...prev,
                          weight: e.target.value.replace(/[^0-9.]/g, ""),
                        }));
                        setCurrentStep(1);
                      }}
                    />

                    <FormSelect
                      value={spotData?.weight_unit}
                      onChange={(e) => {
                        setSpotData((prev) => ({
                          ...prev,
                          weight_unit: e.target.value,
                        }));
                        setCurrentStep(1);
                      }}
                    >
                      {weightData &&
                        weightData?.map((data, index) => (
                          <option
                            className="uppercase"
                            key={index}
                            value={data?.value}
                          >
                            {data?.value}
                          </option>
                        ))}
                    </FormSelect>
                  </div>
                </div>
                <div>
                  {" "}
                  <FormLabel
                    htmlFor="origin-city"
                    className="text-base text-slate-500"
                  >
                    QUOTED BY <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormInput
                    className="w-full"
                    id="origin-city"
                    value={spotData?.quoted_by}
                    onChange={(e) => {
                      setSpotData((prev) => ({
                        ...prev,
                        quoted_by: e.target.value,
                      }));
                      setCurrentStep(1);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  {" "}
                  <FormLabel
                    htmlFor="commodity-type"
                    className="text-base text-slate-500"
                  >
                    COMMODITY TYPE <span className="text-red-400">*</span>
                  </FormLabel>
                  <CommonSearchableAll
                    apiEndpoint={"admin/commodity-type"}
                    placeholder={"Search Commodity Type"}
                    selecteddata={selectedCommodityData}
                    setSelecteddata={setSelectedCommodityData}
                    fun1={commodityFun1}
                    funtoempty={commodityFuntoempty}
                    key1={"commodity"}
                    comingselectedname={"commodity"}
                    comingselectedid={"commodity_id"}
                    id={selectedCommodityData?.commodity}
                  />
                </div>

                {/* <div>
                  <FormLabel
                    htmlFor="service-type"
                    className="text-base text-slate-500"
                  >
                    SERVICE TYPE <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormSelect
                    className="w-full"
                    id="service-type"
                    value={spotData?.service_type}
                    onChange={(e) => {
                      setSpotData((prev) => ({
                        ...prev,
                        service_type: e.target.value,
                      }));
                      setCurrentStep(1);
                    }}
                  >
                    <option value="">Select Service Type</option>
                    {serviceType &&
                      serviceType?.map(
                        (data, index) =>
                          data?.is_active == 1 && (
                            <option key={index} value={data?.id}>
                              {data?.service_type}
                            </option>
                          )
                      )}
                  </FormSelect>
                </div> */}

                <div>
                  {" "}
                  <FormLabel
                    htmlFor="service-type"
                    className="text-base text-slate-500"
                  >
                    SHIPMENT CURRENCY
                  </FormLabel>
                  <FormSelect
                    className="w-full"
                    id="service-type"
                    value={spotData?.currency_id}
                    onChange={(e) => {
                      setSpotData((prev) => ({
                        ...prev,
                        currency_id: e.target.value,
                      }));
                      setCurrentStep(1);
                    }}
                  >
                    <option value="">Select</option>
                    {currencyData &&
                      currencyData?.map((data, index) => (
                        <option key={index} value={data?.id}>
                          {data?.currency}
                        </option>
                      ))}
                  </FormSelect>
                </div>

                {(spotData?.shipment_type == "4" ||
                  spotData?.shipment_type == "5") &&
                  spotData?.import_booking == "2" ? (
                  <div>
                    <FormLabel
                      htmlFor="import-booking-type"
                      className="text-base text-slate-500"
                    >
                      IMPORT BOOKING TYPE{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormSelect
                      id="import-booking-type"
                      value={spotData?.import_booking_type}
                      onChange={(e) => {
                        setSpotData((prev) => ({
                          ...prev,
                          import_booking_type: e.target.value,
                          clearence_type: e.target.value == 1 ? 3 : "",
                        }));
                        setCurrentStep(1);
                      }}
                    >
                      <option value="">Select Import Booking Type</option>
                      <option value={1}>D2D Import Booking</option>
                      <option value={2}>D2P/ BSO Import Booking</option>
                    </FormSelect>
                  </div>
                ) : null}
              </div>

              {(spotData?.shipment_type == 4 ||
                spotData?.shipment_type == 5 ||
                spotData?.shipment_type == 6) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {spotData?.shipment_type == 4 &&
                      spotData?.import_booking == 1 && (
                        <div>
                          <FormLabel
                            htmlFor="cargo-type"
                            className="text-base text-slate-500"
                          >
                            CARGO TYPE <span className="text-red-400">*</span>
                          </FormLabel>

                          <FormSelect
                            id="cargo-type"
                            className="sm:mr-2"
                            value={spotData?.cargo_type}
                            onChange={(e) => {
                              setSpotData((prev) => {
                                return {
                                  ...prev,
                                  cargo_type: e.target.value,
                                  clearence_type:
                                    e.target.value == "1" ? "3" : "1",
                                };
                              });
                              setCurrentStep(1);
                            }}
                          >
                            <option value="">Select Cargo Type</option>
                            {cargoType &&
                              cargoType?.map((ele, index) => (
                                <option key={index} value={ele?.id}>
                                  {ele?.name}
                                </option>
                              ))}
                          </FormSelect>
                        </div>
                      )}
                    <div>
                      <FormLabel
                        htmlFor="clearence-type"
                        className="text-base text-slate-500"
                      >
                        CLEARANCE TYPE <span className="text-red-400">*</span>
                      </FormLabel>

                      <FormSelect
                        id="clearence-type"
                        className="sm:mr-2"
                        value={spotData?.clearence_type}
                        onChange={(e) => {
                          setSpotData((prev) => ({
                            ...prev,
                            clearence_type: e.target.value,
                          }));
                          setCurrentStep(1);
                        }}
                      >
                        <option value="">Select Clearance Type</option>
                        {clearanceType &&
                          clearanceType
                            ?.filter((item) => {
                              if (spotData?.import_booking == 1) {
                                return item?.cargo_type?.includes(
                                  spotData?.cargo_type
                                );
                              } else {
                                if (spotData?.import_booking_type == 1) {
                                  return item?.id == 3;
                                } else if (spotData?.import_booking_type == 2) {
                                  return [1, 2].includes(item?.id);
                                }
                                return true;
                              }
                            })
                            ?.map((ele, index) => (
                              <option key={index} value={ele.id}>
                                {ele.name}
                              </option>
                            ))}
                      </FormSelect>
                    </div>
                    <div>
                      <FormLabel
                        htmlFor="incoterm"
                        className="text-base text-slate-500"
                      >
                        INCOTERM <span className="text-red-400">*</span>
                      </FormLabel>

                      <FormSelect
                        id="incoterm"
                        className="sm:mr-2"
                        value={spotData?.incoterm}
                        onChange={(e) => {
                          setSpotData((prev) => ({
                            ...prev,
                            incoterm: e.target.value,
                          }));
                          setCurrentStep(1);
                        }}
                      >
                        <option value="">Select Incoterm</option>
                        {incotermType &&
                          incotermType
                            ?.filter((ele) => {
                              if (spotData?.import_booking == 1) {
                                return [1, 2, 3, 4, 5].includes(ele?.id);
                              }
                              if (spotData?.import_booking == 2) {
                                return [6, 7, 8].includes(ele?.id);
                              }
                              return true;
                            })
                            ?.map((ele, index) => (
                              <option key={index} value={ele?.id}>
                                {ele?.name}
                              </option>
                            ))}
                      </FormSelect>
                    </div>
                  </div>
                )}

              <div className="mb-4">
                {dimensionData.length > 0 ? (
                  <div>
                    <FormLabel
                      htmlFor="regular-form-1"
                      className="text-base font-medium text-gray-900"
                    >
                      {" "}
                      Shipment Dimension
                    </FormLabel>

                    <div className=" p-2 w-full box cursor-pointer  border border-gray-200 flex justify-between items-end">
                      <div className=" flex flex-wrap gap-2 ">
                        {dimensionData &&
                          dimensionData.map(
                            (elem, index) =>
                              elem?.item_description && (
                                <div
                                  key={index}
                                  className=" flex  px-2 py-1 gap-4 mr-2 bg-slate-300 items-center justify-between  rounded-lg"
                                >
                                  <span
                                    className=" text-lg flex capitalize "
                                    onClick={(e) => {
                                      if (!spinner) {
                                        e.stopPropagation();
                                        e.isPropagationStopped();
                                        setDimensionPreview(true);
                                        setIsEditDimension(true);
                                        setEditDimensionData(elem);
                                        setEditIndex(index);
                                      }
                                    }}
                                  >
                                    {" "}
                                    {elem?.item_description}
                                  </span>

                                  {!spinner && (
                                    <Tippy
                                      content="Delete Dimension"
                                      options={{
                                        placement: "top",
                                      }}
                                    >
                                      <Lucide
                                        icon="XCircle"
                                        className="    text-red-500 stroke-2.5 "
                                        onClick={(e) => handleDelete(e, index)}
                                      />
                                    </Tippy>
                                  )}
                                </div>
                              )
                          )}
                      </div>

                      {!spinner && (
                        <Tippy
                          content="Add More Dimesions"
                          options={{ placement: "top" }}
                        >
                          <Lucide
                            icon="PlusCircle"
                            className="w-6 h-6 mr-2 mb-1 stroke-2.5 text-mustard"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.isPropagationStopped();
                              setIsEditDimension(false);
                              setDimensionPreview(true);
                            }}
                          />
                        </Tippy>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <Button
                      className="bg-mustard text-white"
                      onClick={() => {
                        setDimensionPreview(true);
                        setIsEditDimension(false);
                      }}
                    >
                      Add Dimension
                    </Button>
                  </div>
                )}
                <DimensionModal
                  open={dimensionPreview}
                  onClose={() => {
                    setDimensionPreview(false);
                    setIsEditDimension(false);
                  }}
                  dimensionData={dimensionData}
                  setDimensionData={setDimensionData}
                  isEditDimension={isEditDimension}
                  editIndex={editIndex}
                  editDimensionData={
                    isEditDimension ? editDimensionData : undefined
                  }
                  booking={{
                    unit: {
                      weight_unit: spotData?.weight_unit,
                      currency: spotData?.currency_id,
                    },
                  }}
                  currencyData={currencyData}
                  showHsn={true}
                  isSpot={true}
                />
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  elevated
                  rounded
                  className="w-32 bg-mustard text-white"
                  onClick={handleGetQuote}
                  disabled={isLoading}
                >
                  GET QUOTE{" "}
                  {isLoading && (
                    <LoadingIcon
                      icon="puff"
                      color="white"
                      className="w-5 h-5 ml-2 stroke-2.5 text-white"
                    />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {currentStep == 2 &&
          (isLoading ? (
            <div className="w-full md:w-[35%] h-72 my-4 md:my-8 flex justify-center items-center">
              <LoadingIcon icon="tail-spin" className="block m-auto w-[25%] " />
            </div>
          ) : isError ? (
            <div className="flex justify-center w-full md:w-[35%]">
              <img src={ErrorGif} alt="error-gif" className="w-48 h-24" />
            </div>
          ) : vendorData?.length > 0 ? (
            <div className="box w-full md:w-[35%] h-[100%] my-2 md:my-4">
              <div className="flex flex-col items-center  py-2 px-4 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto text-xl font-medium">
                  Price Comparison
                </h2>
              </div>

              <div className=" px-2 py-4 h-96 overflow-y-scroll">
                <Table className="border text-center">
                  <Table.Thead>
                    <Table.Tr className="border p-1 text-center space-y-1">
                      <Table.Th className="border p-1"></Table.Th>
                      <Table.Th className="border p-1">PRODUCT</Table.Th>
                      <Table.Th className="border p-1">PRODUCT TYPE</Table.Th>
                      <Table.Th className="border p-1">WEIGHT</Table.Th>
                      {spotData?.shipment_type != "5" ? (
                        <Table.Th className="border p-1">TAT</Table.Th>
                      ) : (
                        ""
                      )}
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody className="p-0">
                    {vendorData &&
                      vendorData?.map((elem, index) => (
                        <Table.Tr key={index} className="border p-1">
                          <Table.Td className="border p-1">
                            <FormCheck.Input
                              id="radio-switch-1"
                              type="radio"
                              name="radio_button"
                              checked={
                                spotData?.shipment_type == "5"
                                  ? spotData?.courier_id == elem?.product_id
                                  : spotData?.courier_id == elem?.courier_id
                              }
                              onChange={(e) => {
                                e.target.value == "on"
                                  ? setSelectVendor(true)
                                  : "";
                                if (spotData?.shipment_type == "5") {
                                  setSpotData((prev) => ({
                                    ...prev,
                                    courier_id: elem?.product_id,
                                    courier_code:
                                      elem?.product_code?.toLowerCase(),
                                    courier_name: elem?.product_name,
                                    courier_vendor_code: elem?.product_code,
                                    shipment_charges: {},
                                  }));
                                } else {
                                  setSpotData((prev) => ({
                                    ...prev,
                                    courier_id: elem?.courier_id,
                                    courier_code:
                                      elem?.special_code?.toLowerCase(),
                                    courier_name: elem?.product_name,
                                    courier_vendor_code: elem?.product_code,
                                    shipment_charges: elem,
                                  }));
                                }
                              }}
                            />
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {" "}
                            {elem?.parent_vendor}
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {" "}
                            {elem?.product_name}
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {spotData?.shipment_type == "5"
                              ? spotData?.weight
                              : Number(elem?.actual_weight).toFixed(2)}{" "}
                            kgs
                          </Table.Td>
                          {spotData?.shipment_type != "5" ? (
                            <Table.Td className="border p-1">
                              {elem?.tat_days}
                            </Table.Td>
                          ) : (
                            ""
                          )}
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </div>
              <div className="col-span-12 sm:col-span-6 flex item-center gap-5  mx-4 mt-4">
                <FormLabel
                  htmlFor="modal-form-5"
                  className="mt-2 flex whitespace-nowrap"
                >
                  {" "}
                  PRICE TYPE<span className="text-red-400">*</span>
                </FormLabel>
                <div className="flex flex-row gap-5">
                  <FormCheck>
                    <FormCheck.Input
                      id="radio-switch-4"
                      type="radio"
                      name="price_type_radio_button"
                      value={spotData?.price_type}
                      checked={spotData?.price_type == 1}
                      onClick={() =>
                        setSpotData((prev) => ({ ...prev, price_type: 1 }))
                      }
                    />
                    <FormCheck.Label htmlFor="radio-switch-4">
                      Absolute
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck>
                    <FormCheck.Input
                      id="radio-switch-5"
                      type="radio"
                      name="price_type_radio_button"
                      value={spotData?.price_type}
                      checked={spotData?.price_type == 2}
                      onClick={() =>
                        setSpotData((prev) => ({ ...prev, price_type: 2 }))
                      }
                    />
                    <FormCheck.Label
                      htmlFor="radio-switch-5"
                      className="whitespace-nowrap"
                    >
                      Per Kg
                    </FormCheck.Label>
                  </FormCheck>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <FormInline className="grid grid-cols-2 gap-5 mx-4">
                  <FormLabel
                    htmlFor="horizontal-form-1"
                    className="sm:w-20 flex whitespace-nowrap"
                  >
                    SPOT PRICE{" "}
                    {isOverseas && currencyId
                      ? `(${(
                        currencyData?.find(
                          (item) => item?.id == currencyId
                        ) ?? currencyData?.find((item) => item?.id == 24)
                      )?.symbol || " "
                      })`
                      : "(₹)"}{" "}
                    <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormInput
                    id="horizontal-form-1"
                    type="text"
                    placeholder="Spot Price"
                    value={spotData?.spot_price}
                    onChange={(e) =>
                      setSpotData((prev) => ({
                        ...prev,
                        spot_price: e.target.value?.replace(/[^0-9.]/g, ""),
                      }))
                    }
                  />
                </FormInline>
              </div>
              <div className="flex justify-end p-2">
                {spotData?.startPoint == "enquiry" ? (
                  <Button
                    elevated
                    rounded
                    disabled={!selectVendor}
                    className=" bg-mustard text-white"
                    onClick={SpotBooking}
                  >
                    SUBMIT{" "}
                    {spinner && (
                      <LoadingIcon
                        icon="puff"
                        color="white"
                        className="w-5 h-5 ml-2 stroke-2.5 text-white"
                      />
                    )}
                  </Button>
                ) : (
                  <Button
                    elevated
                    rounded
                    disabled={editSpinner}
                    className=" bg-mustard text-white"
                    onClick={updateSpotBooking}
                  >
                    UPDATE{" "}
                    {editSpinner && (
                      <LoadingIcon
                        icon="puff"
                        color="white"
                        className="w-5 h-5 ml-2 stroke-2.5 text-white"
                      />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="box text-red-500 font-medium text-lg w-full md:w-[35%] h-36 flex items-center justify-center px-2 my-2 md:my-4">
              Vendor Not Available for this region !!
            </div>
          ))}
      </div>
    </>
  );
};

export default main;