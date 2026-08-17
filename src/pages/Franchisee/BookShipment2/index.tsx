import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormSwitch,
  InputGroup,
} from "../../../base-components/Form";
import { useEffect, useState } from "react";
import Button from "../../../base-components/Button";
import { Disclosure } from "@headlessui/react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Lucide from "../../../base-components/Lucide";
import Table from "../../../base-components/Table";
import PriceDetailsModal from "../Modals/PriceDetailsModal";
import SenderModal from "../Modals/SenderModal";
import ReceiverModal from "../Modals/ReceiverModal";
import Tippy from "../../../base-components/Tippy";
import Courier_commercial_icon from "../../../assets/images/courier_commercial_icon.png";
import ReceiverIcon from "../../../assets/images/receivericon.png";

import {
  addressLabel,
  bookShipmentApi,
  check_prohibited_hsncode,
  checkAvailableCreditLimit,
  getAWBDataApi,
  getBookingChargesApi,
  getCargoTypeApi,
  getCityStatesApi,
  getClearanceTypeApi,
  getCountryApi,
  getCurrencyApi,
  getFranchiseeDetailsApi,
  getfranchiseeThreshold,
  getIncotermApi,
  getLengthUnitApi,
  getLocalPincodeApi,
  getOverWeightLimitApi,
  getShipmentTypesApi,
  getSkynetServiceCodeApi,
  getWeightUnitApi,
  Pga_hsncode_Api,
  rateCalculatorApi,
  uploadShipperInvoiceApi,
} from "../../../AllServices/config.service";
import { getCurrentDate, getDeviceType, indianFormat } from "../../../utils";
import { useAlert } from "../../../ContextProvider/AlertContext";
import DimensionModal from "../Modals/DimensionModal";
import ShipperInvoiceModal from "../Modals/ShipperInvoiceModal";
import OrderSummaryModal from "../Modals/OrderSummary";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import TinySlider from "../../../base-components/TinySlider";
import LoadingIcon from "../../../base-components/LoadingIcon";
import LoadingGif from "../../../assets/images/icons/loading.gif";
import ErrorGif from "../../../assets/images/icons/error.gif";
import PaymentModal from "../Modals/PaymentModal";
import AlertComponent from "../../../base-components/Alert";
import CommonSearchableAll from "../../../components/CommonSearchableAll/CommonSearchableAll";
import csbv from "../../../assets/images/icons/csbv.png";
import ecommerce from "../../../assets/images/icons/ecommerce.png";
import Cargocommercial from "../../../assets/images/icons/cargo_commercial.png";
import parcel from "../../../assets/images/icons/parcel_sample.png";
import courier from "../../../assets/images/icons/courier_document.png";
import fairexhibition from "../../../assets/images/icons/fair_exhibition.png";
import PreviewDetailsModal from "../Modals/PreviewDetailsModal/index.tsx";
import { MapPin, Plane, ShoppingCart, Wallet } from "lucide-react";
import CommodityModal from "../Modals/CommodityModal";

axios.defaults.withCredentials = true;

function main() {
  const deviceType = getDeviceType();
  const {
    displayName,
    franchiseeName,
    franchiseeId,
    franchiseeCode,
    isDirectCust,
    gstStatus,
    isKavach,
    hubId,
    branchId,
    availableCreditLimit,
    liveVendorDetails,
    isOverseas,
    currencyId,
    isTest,
    setFranchisee,
  } = useFranchisee();
  const { state } = useLocation();

  const { showAlert } = useAlert();
  const [awbData, setAwbData] = useState([]);
  const [startPoint, setStartPOint] = useState(
    state?.booking?.startPoint || "",
  );
  const intDescriptionData = {
    standard_description: "",
    match_score: "",
  };
  const [selectedDescriptionData, setSelectedDescriptionData] =
    useState<any>(intDescriptionData);
  const [aclSpinner, setAclSpinner] = useState(false);
  const [rateSpinner, setRateSpinner] = useState(false);
  const [productName, setProductName] = useState("");
  const [skartCounter, setSkartCounter] = useState(0);
  const restrictedCountries = ["BH", "IQ", "QA", "AE", "KW", "OM", "SA"];
  const initialData = {
    franchisee_id: franchiseeId,
    hub_id: hubId,
    branch_id: branchId,
    import_booking:
      state?.booking?.is_import || state?.booking?.import_booking || 1,
    is_overseas: isOverseas || 0,
    is_direct_cust: isDirectCust || 0,
    is_kawach:
      state?.booking?.is_import == 2
        ? 1
        : state?.booking?.startPoint == "spotbooking"
          ? 0
          : isKavach,
    kyc_message: true,
    live_vendor_details: liveVendorDetails,
    import_booking_type: state?.booking?.import_booking_type || "",
    is_test: isTest || 0,
    direct_party: "walk-in",
    booking_type: state?.booking?.booking_type,
    origin_pincode: state?.booking?.origin_pincode,
    origin_country_code: state?.booking?.origin_country_code || "IN",
    destination_pincode: state?.booking?.destination_pincode
      ? state?.booking?.destination_pincode
      : "0000",
    destination_country: state?.booking?.destination_country,
    destination_country_id: state?.booking?.destination_country_id,
    destination_country_code: state?.booking?.destination_country_code,
    origin_city: state?.booking?.origin_city,
    origin_state: state?.booking?.origin_state,
    origin_state_code: state?.booking?.origin_state_code,
    city: state?.booking?.city,
    state: state?.booking?.state || state?.booking?.destination_country_code,
    state_name: state?.booking?.state_name || "",
    shipment_type: state?.booking?.shipment_type || "",
    unit: {
      weight_unit: state?.booking?.weight_unit || "kgs",
      length_unit: "cms",
      currency: state?.booking?.currency_id || currencyId || "24",
    },
    shipment_dimensions: "",
    courier_id: "",
    courier_code: "",
    courier_vendor_code: "",
    consigner_first_name: "",
    consigner_company_name: "",
    consigner_mobile_number: "",
    consigner_email_id: "",
    consigner_address_1: "",
    consigner_address_2: "",
    consigner_city: "",
    consigner_pincode: "",
    consigner_state:
      state?.booking?.origin_state?.trim() ||
      state?.booking?.origin_country_code?.trim() ||
      "",
    consigner_doc_type: "",
    consignee_first_name: "",
    consignee_company_name: "",
    consignee_mobile_number: "",
    consignee_email_id: "",
    consignee_address_1: "",
    consignee_address_2: "",
    consignee_city: "",
    consignee_pincode: "",
    consignee_state: "",
    consignee_country: "",
    booking_invoice_number: "",
    booking_invoice_date: getCurrentDate(),
    consigner_gst_number: "",
    consigner_gst_applicable: "2",
    consigner_tax_payment: "3",
    flag: "booking",
    counter: skartCounter,
    pickup_required: 2,
    ...(state?.booking?.startPoint == "spotbooking"
      ? {
        is_spot: 1,
        rate: state?.booking?.rate,
        buy_rate: state?.booking?.buy_rate,
        is_per_kg: state?.booking?.is_per_kg,
        spot_weight: state?.booking?.spot_weight,
        weight_from: state?.booking?.weight_from,
        weight_to: state?.booking?.weight_to,
        booking_id: state?.booking?.booking_id,
        spot_courier_id: state?.booking?.spot_courier_id,
        ...(state?.booking?.aramex_service_type ? { aramex_service_type: state?.booking?.aramex_service_type } : {})
      }
      : {}),
    ...(startPoint === "spotbooking" && state?.booking?.shipment_type == "4"
      ? {
        cargo_type: state?.booking?.cargo_type || 2,
        clearance_type: state?.booking?.clearance_type || 1,
      }
      : {}),
    ...(state?.booking?.is_import == "2" ||
      state?.booking?.import_booking == "2"
      ? {
        origin_country: state?.booking?.origin_country,
        origin_country_id: state?.booking?.origin_country_id,
      }
      : {}),
    incoterm: state?.booking?.incoterm
      ? state?.booking?.incoterm
      : state?.booking?.destination_country_code == "US"
        ? 2
        : restrictedCountries.includes(state?.booking?.destination_country_code)
          ? 1
          : 1,
    ...(state?.booking?.is_import == "2" ||
      state?.booking?.import_booking == "2"
      ? {
        import_booking_type: state?.booking?.import_booking_type || "",
        clearance_type: 3,
      }
      : {}),
    ...(state?.booking?.is_ocr == 1 ? { is_ocr: 1, senderData: state?.booking?.senderData, receiverData: state?.booking?.receiverData, ocr_document_type: state?.booking?.ocr_document_type } : {}),
    ...(state?.booking?.shipper_invoice ? { shipper_invoice: state?.booking?.shipper_invoice } : {})
  };

  const [vendorName, setVendorName] = useState(
    state?.booking?.vendor_name || "",
  );

  const [airwaybilno, setAirwaybillno] = useState(
    state?.booking?.airwaybilno || "",
  );
  const [pickupId, setPickupId] = useState(state?.booking?.pickup_id || "");
  const [lengthData, setLengthData] = useState([]);
  const [bookingCharges, setBookingCharges] = useState([]);
  const [selectVendor, setSelectVendor] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isVendorLoading, setIsVendorLoading] = useState<boolean>(false);
  const [isVendorError, setIsVendorError] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentFaq, setCurrentFaq] = useState(1);
  const [cargoType, setCargoType] = useState([]);
  const [clearanceType, setClearanceType] = useState([]);
  const [incotermType, setIncoterm] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [labelSpinner, setLabelSpinner] = useState(false);
  const [shipmentTypes, setShipmentTypes] = useState([]);
  const [currencyData, setCurrencyData] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [shipmentResponse, setShipmentResponse] = useState("");
  const [booking, setBooking] = useState(initialData);
  const [senderModalPreview, setSenderModalPreview] = useState<boolean>(false);
  const [orderSummaryModalPreview, setOrderSummaryModalPreview] =
    useState<boolean>(false);
  const [receiverModalPreview, setReceiverModalPreview] =
    useState<boolean>(false);
  const [priceDetailsPreview, setPriceDetailsPreview] =
    useState<boolean>(false);

  const [isEditDimension, setIsEditDimension] = useState<boolean>(false);
  const [editDimensionData, setEditDimensionData] = useState<any>({});
  const [editIndex, setEditIndex] = useState<number>();
  const [dimensionPreview, setDimensionPreview] = useState(false);
  const [shipperPreview, setShipperPreview] = useState(false);
  const [dimensionData, setDimensionData] = useState(
    state?.booking?.shipment_dimension || [],
  );
  const [vendorData, setVendorData] = useState([]);
  const [allVendorData, setAllVendorData] = useState([]);
  const [odcData, setOdcData] = useState([]);
  const [priceDetailsData, setPriceDetailsData] = useState();
  const [otpField, setOtpField] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const [franchiseeSpinner, setFranchiseeSpinner] = useState(false);
  const [clicked, setClicked] = useState("");
  const [minLimit, setMinLimit] = useState({});
  const [showField, setShowField] = useState(false);
  const isRestricted = restrictedCountries.includes(
    booking?.destination_country_code,
  );

  const [pga, setPga] = useState(false);
  const [region, setRegion] = useState("");
  const [commodityPreview, setCommodityPreview] = useState(false);

  const handleDataFilter = (data: any = [], is_ddp: number = 1) => {
    if (booking?.shipment_type != "4" && booking?.booking_type != "2") {
      const filterData = data?.filter(
        (item: any) => item?.is_ddp == (is_ddp == 2 ? 1 : 0),
      );
      setVendorData(filterData || []);
    } else {
      setVendorData(data || []);
    }
  };

  useEffect(() => {
    if (booking?.shipment_type != "4" && booking?.booking_type != "2") {
      handleDataFilter(allVendorData, booking?.incoterm);
    }
  }, [booking?.incoterm]);

  const [senderData, setSenderData] = useState({});
  const [receiverData, setReceiverData] = useState({});
  const [openPreview, setOpenPreview] = useState(false);
  const [isDraft, setIsDraft] = useState(0);

  const handleStepTwo = async () => {
    setClicked("");
    setCurrentFaq(1);
    setCurrentStep(1);
    setBooking((prev) => ({
      ...prev,
      shipment_charges: {},
      courier_id: "",
      courier_code: "",
      courier_name: "",
      courier_vendor_code: "",
    }));
    const errors = {
      booking_shipment_type: booking?.shipment_type || "",
      weight_unit: booking?.unit?.weight_unit || "",
      length_unit: booking?.unit?.length_unit || "",
      currency: booking?.unit?.currency || "",

      ...(booking?.shipment_type == 1 ||
        booking?.shipment_type == 4 ||
        booking?.shipment_type == 5 ||
        booking?.shipment_type == 8
        ? {
          shipment_dimensions: dimensionData || [],
        }
        : {}),
      ...(booking?.shipment_type == 4 ||
        booking?.shipment_type == 5 ||
        booking?.shipment_type == 8
        ? {
          ...(booking?.import_booking == "1"
            ? { cargo_type: booking?.cargo_type || "" }
            : {}),
          clearance_type: booking?.clearance_type || "",
          incoterm: booking?.incoterm || "",
        }
        : {}),
      ...(booking?.shipment_type == 2
        ? {
          description: booking?.description || "",
          weight: booking?.weight || "",
        }
        : {}),
    };

    for (const key in errors) {
      if (errors.hasOwnProperty(key) && errors[key] === "") {
        showAlert(`${key.replaceAll("_", " ")} is required`, "warning");
        return;
      }
    }

    setIsVendorLoading(true);
    setIsVendorError(false);

    let rateFormData;

    if (booking?.shipment_type == 2) {
      rateFormData = {
        franchisee: franchiseeId,
        is_kawach: booking?.is_kawach,
        booking_type: booking?.booking_type,
        origin_pincode: booking?.origin_pincode,
        destination_pincode: booking?.destination_pincode
          ? booking?.destination_pincode
          : "0000",
        city: booking?.city,
        state: booking?.state,
        state_name: booking?.state_name || "",
        country_code: booking?.destination_country_code || "",
        destination_country: booking?.destination_country_id,
        shipment_type: booking?.shipment_type,
        unit: booking?.unit,
        weight: booking?.weight,
        description: booking?.description,
        ...(booking?.import_booking == 2
          ? {
            import_booking: booking?.import_booking,
            origin_country: booking?.origin_country_id,
            origin_country_code: booking?.origin_country_code,
            origin_city: booking?.origin_city,
            origin_state: booking?.origin_state_code,
            origin_state_name: booking?.origin_state,
          }
          : {}),
      };

      setBooking((prev) => ({
        ...prev,
        shipment_dimensions: JSON.stringify([
          { item_description: prev?.description, weight: prev?.weight },
        ]),
      }));
    } else if (
      booking?.shipment_type == 1 ||
      booking?.shipment_type == 6 ||
      booking?.shipment_type == 7
    ) {
      rateFormData = {
        franchisee: franchiseeId,
        is_kawach: booking?.is_kawach,
        booking_type: booking?.booking_type,
        origin_pincode: booking?.origin_pincode,
        destination_pincode: booking?.destination_pincode
          ? booking?.destination_pincode
          : "0000",
        city: booking?.city,
        state: booking?.state,
        state_name: booking?.state_name || "",
        destination_country: booking?.destination_country_id,
        country_code: booking?.destination_country_code || "",
        shipment_type: booking?.shipment_type,
        unit: booking?.unit,
        shipment_dimensions: dimensionData,
        ...(startPoint == "spotbooking"
          ? {
            courier_id: booking?.spot_courier_id,
            is_spot: 1,
            rate: booking?.rate,
            buy_rate: booking?.buy_rate,
            is_per_kg: booking?.is_per_kg,
          }
          : {}),
        ...(booking?.import_booking == 2
          ? {
            import_booking: booking?.import_booking,
            origin_country: booking?.origin_country_id,
            origin_country_code: booking?.origin_country_code,
            origin_city: booking?.origin_city,
            origin_state: booking?.origin_state_code,
            origin_state_name: booking?.origin_state,
          }
          : {}),
      };
    } else if (
      booking?.shipment_type == 4 ||
      booking?.shipment_type == 5 ||
      booking?.shipment_type == 8
    ) {
      rateFormData = {
        franchisee: franchiseeId,
        is_kawach: booking?.is_kawach,
        booking_type: booking?.booking_type,
        origin_pincode: booking?.origin_pincode,
        destination_pincode: booking?.destination_pincode
          ? booking?.destination_pincode
          : "0000",
        city: booking?.city,
        state: booking?.state,
        state_name: booking?.state_name || "",
        destination_country: booking?.destination_country_id,
        country_code: booking?.destination_country_code || "",
        shipment_type: booking?.shipment_type,
        unit: booking?.unit,
        shipment_dimensions: dimensionData,
        clearance_type: booking?.clearance_type || "",
        incoterm: booking?.incoterm || "",
        ...(startPoint == "spotbooking"
          ? {
            courier_id: booking?.spot_courier_id,
            is_spot: 1,
            rate: booking?.rate,
            buy_rate: booking?.buy_rate,
            is_per_kg: booking?.is_per_kg,
          }
          : {}),
        ...(booking?.import_booking == 2
          ? {
            import_booking: booking?.import_booking,
            origin_country: booking?.origin_country_id,
            origin_country_code: booking?.origin_country_code,
            origin_city: booking?.origin_city,
            origin_state: booking?.origin_state_code,
            origin_state_name: booking?.origin_state,
          }
          : { cargo_type: booking?.cargo_type || "" }),
      };
    }

    setRateSpinner(true);

    try {
      if (startPoint == "spotbooking") {
        let actualWeight;
        if (booking?.shipment_type == "2") {
          actualWeight = Number(rateFormData?.weight);
        } else {
          actualWeight = Number(
            rateFormData?.shipment_dimensions?.reduce(
              (acc, curr) => Number(acc) + Number(curr?.weight || 0),
              0,
            ),
          );
        }

        if (
          actualWeight < Number(booking?.weight_from) ||
          actualWeight > Number(booking?.weight_to)
        ) {
          showAlert("Weight should be in weight slab", "warning");
          return;
        }
      }

      const res = await rateCalculatorApi(rateFormData);

      if (res?.status == 200) {
        setAllVendorData(res?.data?.data);
        handleDataFilter(res?.data?.data || [], booking?.incoterm || 0);
        setOdcData(res?.data?.odc_lengths || []);
      } else if (res?.status == 406) {
        showAlert(res?.response?.data?.errors[0]?.msg, "warning");
      } else if (res?.status == 204) {
        setAllVendorData([]);
        setOdcData([]);
      } else {
        showAlert(
          res?.message || res?.data?.message || res?.response?.data?.message,
          "error",
        );
      }
    } catch (error) {
      setIsVendorError(true);
      showAlert("Something went wrong", "error");
    } finally {
      setIsVendorLoading(false);
      setRateSpinner(false);
    }

    setBooking((prevBooking) => ({
      ...prevBooking,
      shipment_dimensions: JSON.stringify(dimensionData),
    }));

    setCurrentStep(2);
    setCurrentFaq(2);
  };

  const handleDelete = (e, index) => {
    if (rateSpinner) {
      return;
    }

    e.stopPropagation();
    e.isPropagationStopped();
    const newData = [...dimensionData];
    newData.splice(index, 1);

    if (newData.length === 0) {
      setBooking((prev) => ({
        ...prev,
        shipment_dimensions: "",
      }));
    } else {
      setBooking((prev) => ({
        ...prev,
        shipment_dimensions: JSON.stringify(newData),
      }));
    }

    setDimensionData(newData);
    setBooking((prev) => ({
      ...prev,
      shipment_charges: {},
      courier_id: "",
      courier_code: "",
      courier_name: "",
      courier_vendor_code: "",
    }));
    setCurrentFaq(1);
    setCurrentStep(1);
  };
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [payableAmount, setPayableAmount] = useState();
  const directShipment = async () => {
    if (
      Number(booking?.shipment_charges?.grand_total_with_gst_show) >
      Number(availableCreditLimit)
    ) {
      let amount =
        Number(booking?.shipment_charges?.grand_total_with_gst_show) -
        Number(availableCreditLimit);

      amount = Math.ceil(amount * 100) / 100;
      setPayableAmount(amount);
      setPaymentOpen(true);
    } else {
      checkAcl();
    }
    // setPaymentOpen(true);
  };

  const checkAcl = async () => {
    setAclSpinner(true);
    try {
      const response = await checkAvailableCreditLimit(
        franchiseeId,
        booking?.shipment_charges?.grand_total_with_gst_show,
      );

      if (response?.data?.status == 200) {
        setCurrentStep(3);
        setCurrentFaq(3);
      } else if (response?.data?.status == 400) {
        if (booking?.is_direct_cust) {
          directShipment();
        } else {
          showAlert(response?.data?.message.replaceAll("_", " "), "error");
          setSkartCounter(0);
        }
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error",
        );
        setSkartCounter(0);
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
      setSkartCounter(0);
    } finally {
      setAclSpinner(false);
    }
  };

  const bookShipment = async (is_draft: any = "") => {
    setIsDraft(is_draft);
    if (skartCounter >= 5) {
      showAlert(
        "You have reached the maximum request limit. Please refresh the page & try again.",
        "warning",
      );
      return;
    }

    setSpinner(true);
    setShipmentResponse("");
    setIsError(false);
    setIsLoading(true);

    try {
      let res;
      if (booking?.booking_type == "2") {
        const data = {
          booking_type: "2",
          franchisee_id: franchiseeId,
          hub_id: hubId,
          branch_id: branchId,
          is_direct_cust: isDirectCust || 0,
          is_kawach: booking?.is_kawach,
          live_vendor_details: liveVendorDetails,
          direct_party: "walk-in",
          flag: "booking",
          unit: {
            weight_unit: booking?.unit?.weight_unit || "kgs",
            length_unit: booking?.unit?.length_unit || "cms",
            currency: booking?.unit?.currency || "24",
          },
          shipment_type: booking?.shipment_type,
          origin_pincode: booking?.origin_pincode,
          origin_state_code: booking?.origin_state_code,
          destination_pincode: booking?.destination_pincode,
          destination_country: booking?.destination_country,
          destination_country_id: booking?.destination_country_id,
          destination_country_code: booking?.destination_country_code,
          consignee_first_name: booking?.consignee_first_name,
          consignee_company_name: booking?.consignee_company_name,
          consignee_address_1: booking?.consignee_address_1,
          consignee_address_2: booking?.consignee_address_2,
          consignee_city: booking?.consignee_city,
          consignee_state: booking?.consignee_state,
          consignee_country: booking?.consignee_country,
          consignee_pincode: booking?.consignee_pincode,
          consignee_mobile_number: booking?.consignee_mobile_number,
          consignee_email: booking?.consignee_email_id,
          consigner_first_name: booking?.consigner_first_name,
          consigner_company_name: booking?.consigner_company_name,
          consigner_address_1: booking?.consigner_address_1,
          consigner_address_2: booking?.consigner_address_2,
          consigner_city: booking?.consigner_city,
          consigner_state: booking?.consigner_state,
          consigner_pincode: booking?.consigner_pincode,
          consigner_mobile_number: booking?.consigner_mobile_number,
          consigner_email_id: booking?.consigner_email_id,
          booking_invoice_date: booking?.booking_invoice_date,
          shipment_charges: booking?.shipment_charges,
          counter: 0,
          courier_id: booking?.courier_id,
          courier_code: booking?.courier_code,
          courier_name: booking?.courier_name,
          courier_vendor_code: booking?.courier_vendor_code,
          city: booking?.city,
          state: booking?.state,
          state_name: booking?.state_name,
          pickup_required: booking?.pickup_required || 2,
          pickup_location: booking?.pickup_location || 2,
          pickup_name: booking?.pickup_name || "",
          pickup_address_1: booking?.pickup_address_1 || "",
          pickup_address_2: booking?.pickup_address_2 || "",
          pickup_pincode: booking?.origin_pincode,
          pickup_city: booking?.origin_city,
          pickup_state: booking?.origin_state,
          pickup_ready_start_time: booking?.pickup_ready_start_time || "",
          pickup_ready_end_time: "N.A.",
          kyc_details: booking?.kyc_details || "",
          ...(booking?.shipment_type == "2"
            ? { description: booking?.description, weight: booking?.weight }
            : { shipment_dimensions: booking?.shipment_dimensions }),
          order_id: booking?.order_id || "",
          is_cod: booking?.is_cod || 0,
        };
        res = await bookShipmentApi(data);
      } else {
        const MID = booking?.manufacturer_id || "INSKAGLO1281NEW";
        res = await bookShipmentApi({
          ...booking,
          counter:
            booking?.shipment_type == 4 && booking?.import_booking_type == 3
              ? 3
              : skartCounter,
          ...(is_draft == 1 ? { is_draft: is_draft } : {}),
          ...(booking?.courier_code.includes("widect")
            ? { manufacturer_id: MID }
            : {}),
        });
      }

      if (res?.data?.status == 201) {
        setOtpField(true);
        showAlert(res?.data?.error_message);
      } else if (res?.data?.status == 200) {
        setOtpField(false);
        setShipmentResponse(res?.data?.data[0]);
        setCurrentStep(4);
        setCurrentFaq(4);
        setSkartCounter(0);
        handleFranchisee();
      } else if (res?.response?.status == 500) {
        showAlert("Internal Server Error", "error");
      } else {
        showAlert(res?.data?.message, "error");
      }
    } catch (error) {
      setIsError(true);
      showAlert("Something Went Wrong", "error");
    } finally {
      setSpinner(false);
      setIsLoading(false);
    }
  };

  const handleFranchisee = async () => {
    if (franchiseeSpinner) {
      return;
    }
    setFranchiseeSpinner(true);
    try {
      const response = await getFranchiseeDetailsApi(franchiseeId);
      if (response?.data) {
        const available_credit_limit =
          response?.data?.data[0]?.available_credit_limit;
        const credit_limit = response?.data?.data[0]?.credit_limit;
        const wallet = response?.data?.data[0]?.wallet;
        const security_deposit = response?.data?.data[0]?.security_deposite;
        const live_vendor_details =
          response?.data?.data[0]?.live_vendor_details;
        const isDirectCust = response?.data?.data[0]?.is_direct_customer;
        const gstStatus = response?.data?.data[0]?.gst_status;
        const is_kavach = response?.data?.data[0]?.is_kawach;
        const kavach_expiry = response?.data?.data[0]?.kawach_expiry;
        const is_overseas = response?.data?.data[0]?.is_overseas;
        const currency_id = response?.data?.data[0]?.currency;
        const bulk_booking = response?.data?.data[0]?.bulk_booking;
        const is_test = response?.data?.data[0]?.is_test;

        setFranchisee(
          displayName,
          franchiseeName,
          franchiseeCode,
          franchiseeId,
          isDirectCust,
          gstStatus,
          is_kavach,
          kavach_expiry,
          hubId,
          branchId,
          available_credit_limit,
          credit_limit,
          wallet,
          security_deposit,
          live_vendor_details,
          is_overseas,
          currency_id,
          bulk_booking,
          is_test,
        );
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error",
        );
      }
    } catch (error) {
      // console.log(error);
      if (error) showAlert("something went wrong", "error");
    } finally {
      setFranchiseeSpinner(false);
    }
  };

  const generateAddressLabel = async (airwaybilno: any = "") => {
    setLabelSpinner(true);
    try {
      const response = await addressLabel(airwaybilno);
      if (response?.data?.status == 200) {
        window.open(response?.data?.url, "_blank");
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (error) {
      showAlert("Error while generating address label", "error");
      console.log(error);
    } finally {
      setLabelSpinner(false);
    }
  };

  const getSkynetCode = async () => {
    try {
      const response: any = await getSkynetServiceCodeApi(
        booking?.shipment_type,
        booking?.destination_country,
        booking?.shipment_charges?.actual_weight || "",
      );
      if (response?.status == 200) {
        setBooking((prev) => ({
          ...prev,
          service_code: response?.data?.serivce_code,
          package_type: response?.data?.package_type,
        }));
        checkAcl();
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

  const checkProhibited = async () => {
    try {
      setAclSpinner(true);
      const hsn_code = JSON.parse(booking?.shipment_dimensions || "[]")?.reduce(
        (acc: any[], curr: any) => {
          if (curr?.hsn_code) {
            acc.push(curr.hsn_code);
          }
          return acc;
        },
        [],
      );
      const res = await check_prohibited_hsncode({ hsn_code });
      if (res?.data?.status == 200) {
        await checkPga();
      } else if (res?.data?.status == 400) {
        showAlert(res?.data?.message, "warning");
        setCurrentFaq(1);
        setCurrentStep(1);
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (error) {
      console.error("Error checking prohibited HSN codes:", error);
    } finally {
      setAclSpinner(false);
    }
  };

  const checkPga = async () => {
    try {
      setAclSpinner(true);
      const hts_code = JSON.parse(booking?.shipment_dimensions || "[]")?.reduce(
        (acc: any[], curr: any) => {
          if (curr?.hsn_code) {
            acc.push(curr.hsn_code);
          }
          return acc;
        },
        [],
      );

      const res = await Pga_hsncode_Api({ hts_code });
      if (res?.data?.status == 200) {
        setPga(true);
        await checkAcl();
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (error) {
      console.error("Error checking pga:", error);
    } finally {
      setAclSpinner(false);
    }
  };

  const getAWBData = async () => {
    getBookingChargesApi().then((res) => setBookingCharges(res?.data?.data));
    try {
      const response: any = await getAWBDataApi(franchiseeId, pickupId);
      if (response?.status == 200) {
        setAwbData(response?.data?.Data);
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

  const uploadInvoice = async (event: any) => {
    const selectedFile = event.target.files[0];
    setFileName(selectedFile ? selectedFile.name : "");

    const formData = new FormData();
    if (selectedFile) {
      formData.append("shipper_invoice", selectedFile);
    }

    try {
      if (selectedFile) {
        const response = await uploadShipperInvoiceApi(formData);

        if (response?.data?.status == 200) {
          setBooking((prev) => ({
            ...prev,
            shipper_invoice: response.data?.shipper_url,
          }));
        } else {
          showAlert("Error while uploading Shipper Invoice", "error");
          setFileName("No file chosen");
        }
      } else {
        showAlert("Please reselect file to upload", "error");
        setFileName("No file chosen");
      }
    } catch (error) {
      console.log(error);
      showAlert("Error while uploading Shipper Invoice", "error");
      setFileName("No file chosen");
    }
  };

  const getData = () => {
    getShipmentTypesApi().then((res) =>
      setShipmentTypes(res?.data?.data || []),
    );
    getWeightUnitApi().then((res) => setWeightData(res?.data?.data || []));
    getLengthUnitApi().then((res) => setLengthData(res?.data?.data || []));
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data || []));
    getClearanceTypeApi().then((res) => {
      setClearanceType(res?.data?.data || []);
    });
    getCargoTypeApi().then((res) => setCargoType(res?.data?.data));
    getIncotermApi().then((res) => setIncoterm(res?.data?.data));
    getOverWeightLimitApi().then((res) => setMinLimit(res?.data?.data || []));
    getfranchiseeThreshold(franchiseeId).then((res) =>
      setBooking((prev) => ({
        ...prev,
        threshold: res?.data?.threshold || "",
        weight_consideration: res?.data?.weight_consideration || "",
      })),
    );
  };

  useEffect(() => {
    getData();
    if (startPoint == "listing") {
      getAWBData();
    }
  }, []);

  const fun1 = (a: any) => {
    setSelectedDescriptionData({
      standard_description: a?.standard_description,
      match_score: a?.match_score,
    });
    setBooking((prev) => ({
      ...prev,
      description: a?.standard_description,
      shipment_charges: {},
      courier_id: "",
      courier_code: "",
      courier_name: "",
      courier_vendor_code: "",
    }));
    setCurrentFaq(1);
    setCurrentStep(1);
  };

  const funtoempty1 = () => {
    setSelectedDescriptionData(intDescriptionData);
    setBooking((prev) => ({
      ...prev,
      description: "",
      shipment_charges: {},
      courier_id: "",
      courier_code: "",
      courier_name: "",
      courier_vendor_code: "",
    }));
    setCurrentFaq(1);
    setCurrentStep(1);
  };

  useEffect(() => {
    setBooking((prev) => ({
      ...prev,
      description: selectedDescriptionData?.standard_description,
      shipment_charges: {},
      courier_id: "",
      courier_code: "",
      courier_name: "",
      courier_vendor_code: "",
    }));
  }, [selectedDescriptionData?.standard_description]);

  useEffect(() => {
    if (booking?.startPoint == "booking") {
      setSelectedDescriptionData(intDescriptionData);
      setDimensionData([]);
      setBooking((prev) => ({
        ...prev,
        description: "",
        shipment_charges: {},
        shipment_dimensions: "",
      }));
    }
  }, [booking?.shipment_type]);

  useEffect(() => {
    getCountryApi(booking?.destination_country).then((res) => {
      setRegion(res?.data?.data[0]?.region?.toLowerCase() || "");
    });
    if (
      state?.booking?.startPoint == "booking" ||
      state?.booking?.startPoint == "importlisting"
    ) {
      if (
        (state?.booking?.is_import == "1" ||
          state?.booking?.import_booking == "1") &&
        state?.booking?.booking_type == 1
      ) {
        getCityStatesApi(
          state.booking.destination_country_code,
          state.booking.destination_pincode || "",
          // state.booking.city || "",
        ).then((res) => {
          if (res?.status == 200) {
            setBooking((prev) => ({
              ...prev,
              state:
                res?.data?.data[0]?.state_code ||
                state.booking.destination_country_code ||
                "",
              state_name: res?.data?.data[0]?.state || "",
            }));
          }
        });
        getLocalPincodeApi(state.booking.origin_pincode).then((res) => {
          if (res?.status == 200) {
            setBooking((prev) => ({
              ...prev,
              origin_city: res?.data?.data[0]?.city || "",
              origin_state: res?.data?.data[0]?.state || "",
              origin_state_code: res?.data?.data[0]?.state_code || "",
            }));
          }
        });
      } else if (
        (state?.booking?.is_import == "1" ||
          state?.booking?.import_booking == "1") &&
        state.booking.booking_type == 2
      ) {
        getLocalPincodeApi(state.booking.origin_pincode).then((res) => {
          if (res?.status == 200) {
            setBooking((prev) => ({
              ...prev,
              origin_city: res?.data?.data[0]?.city || "",
              origin_state: res?.data?.data[0]?.state || "",
              origin_state_code: res?.data?.data[0]?.state_code || "",
            }));
          }
        });
        getLocalPincodeApi(state.booking.destination_pincode).then((res) => {
          if (res?.status == 200) {
            setBooking((prev) => ({
              ...prev,
              city: res?.data?.data[0]?.city || "",
              state: res?.data?.data[0]?.state || "",
              state_name: res?.data?.data[0]?.state_code || "",
            }));
          }
        });
      } else if (
        state?.booking?.is_import == "2" ||
        state?.booking?.import_booking == "2"
      ) {
        getCityStatesApi(
          state.booking.origin_country_code,
          state.booking.origin_pincode || "",
          // state.booking.origin_city || "",
        ).then((res) => {
          if (res?.status == 200) {
            setBooking((prev) => ({
              ...prev,
              origin_state: res?.data?.data[0]?.state || "",
              origin_state_code:
                res?.data?.data[0]?.state_code ||
                state.booking.destination_country_code ||
                "",
            }));
          }
        });
        getLocalPincodeApi(state.booking.destination_pincode).then((res) => {
          if (res?.status == 200) {
            setBooking((prev) => ({
              ...prev,
              city: res?.data?.data[0]?.city || "",
              state: res?.data?.data[0]?.state || "",
              state_name: res?.data?.data[0]?.state_code || "",
            }));
          }
        });
      }
    }

    if (state?.booking?.startPoint == "importlisting") {
      const data = state?.booking || {};
      setDimensionData(JSON.parse(data?.shipment_dimensions) || []);
      setBooking(data || {});

      setSenderData({
        consigner_mobile_number: data?.consigner_mobile_number || "",
        consigner_email_id: data?.consigner_email_id || "",
        consigner_first_name: data?.consigner_first_name || "",
        consigner_company_name: data?.consigner_company_name || "",
        consigner_address_1: data?.consigner_address_1 || "",
        consigner_address_2: data?.consigner_address_2 || "",
        consigner_pincode: data?.consigner_pincode || "",
        consigner_city: data?.consigner_city || "",
        consigner_state:
          data?.consigner_state || data?.origin_country_code || "",
        consigner_doc_type: data?.consigner_doc_type || "",
        consigner_gst_applicable: data?.consigner_gst_applicable || "",
        consigner_gst_number: data?.consigner_gst_number || "",
        consigner_tax_payment: data?.consigner_tax_payment || "",
        pickup_required: data?.pickup_required || 2,
        pickup_location: data?.pickup_location || "",
        pickup_name: data?.pickup_name || "",
        pickup_address_1: data?.pickup_address_1 || "",
        pickup_address_2: data?.pickup_address_2 || "",
        pickup_pincode: data?.pickup_pincode || "",
        pickup_city: data?.pickup_city || "",
        pickup_state: data?.pickup_state || "",
        pickup_ready_start_time: data?.pickup_ready_start_time || "",
        pickup_ready_end_time: data?.pickup_ready_end_time || "",
      });
      setReceiverData({
        consignee_mobile_number: data?.consignee_mobile_number || "",
        consignee_email_id: data?.consignee_email_id || "",
        consignee_first_name: data?.consignee_first_name || "",
        consignee_company_name: data?.consignee_company_name || "",
        consignee_address_1: data?.consignee_address_1 || "",
        consignee_address_2: data?.consignee_address_2 || "",
        consignee_pincode: data?.consignee_pincode || "",
        consignee_city: data?.consignee_city || "",
        consignee_state: data?.consignee_state || "",
        consignee_country: data?.consignee_country || "",
        consignee_reference_no: data?.consignee_reference_no || "",
        booking_invoice_number: data?.booking_invoice_number || "",
        booking_invoice_date: data?.booking_invoice_date || "",
        kyc_details: data?.kyc_details || null,
        consignee_gst_number: data?.consignee_gst_number || "",
      });
    }
  }, []);

  return (
    <>
      {(startPoint == "booking" || startPoint == "importlisting") &&
        !isDirectCust &&
        !isOverseas && (
          <AlertComponent
            variant={isKavach ? "soft-success" : "soft-warning"}
            className="flex items-center mb-2 p-2 text-lg font-bold z-[1] relative"
          >
            <Lucide
              icon={isKavach ? "ShieldCheck" : "ShieldAlert"}
              className="w-6 h-6 mr-2"
            />{" "}
            {isKavach
              ? "This booking is covered under Kavach."
              : "This booking is not covered under kavach. Please click on activate to save from any surprise additional charges."}
            {!isKavach && (
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

      <div className="w-full overflow-y-scroll scrollbar-hidden h-auto mb-8 z-[1] relative">
        <div className="p-2 my-2 cursor-pointer rounded-full shadow-lg mr-4 w-8 bg-white">
          {" "}
          <Link
            to={
              startPoint == "booking"
                ? "/franchisee/booking"
                : startPoint == "spotbooking"
                  ? "/franchisee/spotpricing_enquiry_list"
                  : startPoint == "importlisting"
                    ? "/franchisee/import_draft_list"
                    : "/franchisee/list_booking"
            }
          >
            <Lucide
              icon="ArrowLeft"
              className="w-4 h-4 stroke-2.5 text-mustard"
            />
          </Link>
        </div>

        <div className="w-full flex justify-between gap-4">
          <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-0 justify-between w-full">
            <div
              className="w-full md:w-[63%] font-medium cursor-pointer text-sm rounded-lg h-auto"
            // onClick={() => setShowChangeVendor(false)}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4 ">
                <div className=" w-full py-2  px-3 bg-white rounded-lg shadow-lg">
                  <div className="flex justify-between items-center w-full">
                    <div className="  flex   items-center   relative ">
                      <figure className="bg-[#FFF2D8] rounded-[4px] p-2 w-[35px] h-[35px]">
                        <Plane
                          className={`w-[20px] h-[20px] text-mustard ${booking?.import_booking == 2 ? "rotate-[90deg]" : ""
                            }`}
                        />
                      </figure>
                      <aside className="ml-2">
                        <h2 className=" text-[16px] font-bold uppercase text-mustard">
                          {startPoint == "listing"
                            ? awbData?.pickup_data?.is_domestic == "2"
                              ? "Domestic"
                              : awbData?.pickup_data?.import_booking == "2"
                                ? "Import"
                                : "Export"
                            : booking?.booking_type == "2"
                              ? "Domestic"
                              : booking?.import_booking == "2"
                                ? "Import"
                                : "Export"}
                        </h2>
                      </aside>
                    </div>

                    <div className="flex    items-center  relative ">
                      {Number(booking?.shipment_type) ? (
                        <figure className="bg-[#FFF2D8]  rounded-full p-[6px] w-[30px] h-[30px]">
                          <ShoppingCart className="w-[17px] h-[17px] text-mustard" />
                        </figure>
                      ) : null}
                      <aside className="ml-3">
                        <h2 className=" text-[13px] font-[500] uppercase text-mustard">
                          {shipmentTypes?.find(
                            (item: any) =>
                              item?.booking_shipment_type_id ==
                              booking?.shipment_type,
                          )?.shipment_type || ""}
                        </h2>
                      </aside>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row justify-between gap-4 box  px-4 py-2 rounded-lg mt-3">
                <div>
                  <div className="flex gap-2">
                    <span className="mt-2 text-sm md:text-lg font-bold">
                      ORIGIN
                    </span>
                  </div>

                  <div className="flex gap-2 ">
                    <div className="text-center p-1 border-2 mx-auto h-14 w-10 rounded">
                      <img
                        src={`https://flagsapi.com/${startPoint == "listing" &&
                          awbData?.pickup_data?.import_booking == "2"
                          ? awbData?.pickup_data?.origin_country_code || "IN"
                          : booking?.origin_country_code
                            ? booking?.origin_country_code
                            : "IN"
                          }/flat/32.png`}
                        alt="origin-flag"
                      />
                      <span className="text-sm">
                        (
                        {startPoint == "listing" &&
                          awbData?.pickup_data?.import_booking == "2"
                          ? awbData?.pickup_data?.origin_country_code
                          : booking?.origin_country_code
                            ? booking?.origin_country_code
                            : "IN"}
                        )
                      </span>
                    </div>
                    <div className="mx-auto p-1 pt-2 h-14 min-w-28 border-2 rounded flex flex-col  justify-center">
                      <h1 className="font-medium text-sm md:text-lg">
                        {startPoint == "listing"
                          ? awbData?.pickup_data?.origin_country || "INDIA"
                          : booking?.origin_country
                            ? booking?.origin_country
                            : "INDIA"}
                      </h1>
                      <p className="">({booking?.origin_pincode})</p>
                    </div>
                  </div>

                  <div className="flex items-center pt-2">
                    <MapPin className="w-[16px] h-[16px] text-mustard" />{" "}
                    <p className="ml-[3px] text-mustard">
                      {startPoint == "listing" &&
                        awbData?.pickup_data?.is_domestic == "1"
                        ? `${awbData?.pickup_data?.origin_city || ""}, ${awbData?.pickup_data?.origin_state || ""}`
                        : startPoint == "listing" &&
                          awbData?.pickup_data?.is_domestic == "2"
                          ? `${awbData?.shipper_data[0]?.city_name || ""}, ${awbData?.shipper_data[0]?.state || ""}`
                          : `${booking?.origin_city || ""}, ${booking?.origin_state || ""}`}
                    </p>
                  </div>
                </div>

                <div className=" mt-11 hidden sm:flex">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                    className="w-5 h-5 opacity-25 hidden md:block"
                    alt="dot-icon"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                    className="w-5 h-5 opacity-50 hidden md:block"
                    alt="dot-icon"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                    className="w-5 h-5 opacity-75 hidden md:block"
                    alt="dot-icon"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                    className="w-5 h-5 hidden md:block"
                    alt="dot-icon"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/61/61212.png"
                    className="w-5 h-5 "
                    alt="plane-icon"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                    className="w-5 h-5 hidden md:block"
                    alt="dot-icon"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                    className="w-5 h-5 opacity-75 hidden md:block"
                    alt="dot-icon"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                    className="w-5 h-5 opacity-50 hidden md:block"
                    alt="dot-icon"
                  />
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                    className="w-5 h-5 opacity-25 hidden md:block"
                    alt="dot-icon"
                  />
                </div>

                <div className="flex sm:hidden rotate-90 justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/61/61212.png"
                    className="w-6 h-6 "
                    alt="plane-icon"
                  />
                </div>

                <div>
                  <div className="flex gap-2">
                    <span className="mt-2 text-sm md:text-lg font-bold">
                      DESTINATION
                    </span>
                  </div>

                  <div className="flex gap-2 ">
                    <div className="text-center p-1 border-2 mx-auto h-14 w-10 rounded">
                      <img
                        src={
                          booking?.booking_type == 2
                            ? `https://flagsapi.com/IN/flat/32.png`
                            : `https://flagsapi.com/${booking?.destination_country_code}/flat/32.png`
                        }
                        alt="destination-flag"
                      />
                      <span className="text-sm">
                        ({booking?.destination_country_code})
                      </span>
                    </div>
                    <div
                      className={`mx-auto p-1 pt-2 min-w-28 h-14 border-2 rounded flex flex-col  justify-center text-wrap ${Number(booking?.shipment_charges?.oda) > 0
                        ? "border-orange-500"
                        : ""
                        }`}
                    >
                      <h1 className="font-medium text-sm md:text-lg">
                        {booking?.destination_country}
                      </h1>
                      <p
                        className={`${Number(booking?.shipment_charges?.oda) > 0
                          ? "text-orange-500"
                          : ""
                          }`}
                      >
                        <Tippy
                          content={`${Number(booking?.shipment_charges?.oda) > 0
                            ? "ODA might be charged"
                            : ""
                            }`}
                          options={{
                            placement:
                              Number(booking?.shipment_charges?.oda) > 0
                                ? "right"
                                : "",
                          }}
                        >
                          ({booking?.destination_pincode})
                        </Tippy>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center pt-2">
                    <MapPin className="w-[16px] h-[16px] text-mustard" />{" "}
                    <p className="ml-[3px] text-mustard">
                      {startPoint === "listing" &&
                        awbData?.pickup_data?.is_domestic == "1"
                        ? `${awbData?.pickup_data?.city || ""}, ${awbData?.pickup_data?.state || ""}`
                        : startPoint === "listing" &&
                          awbData?.pickup_data?.is_domestic == "2"
                          ? `${awbData?.consignee_data[0]?.city || ""}, ${awbData?.consignee_data[0]?.state || ""}`
                          : `${booking?.city || ""}, ${booking?.state || ""}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {franchiseeName && startPoint != "listing" && (
              <div className=" rounded-lg w-full md:w-[35%] h-full">
                <div className="px-4 py-3 h-full box  w-full">
                  <div className=" w-full  bg-[#FFF7E5] md:p-4 p-2 rounded-lg mb-4">
                    <div className="text-lg font-bold whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {franchiseeName}
                    </div>
                    {booking?.courier_code && (
                      <div className="text-[#303030] text-base mt-0.5">{`Product : ${productName?.toUpperCase()}`}</div>
                    )}
                  </div>

                  <div className="  w-full       ">
                    <div className="  flex      relative ">
                      <figure className="bg-[#c1efc7] rounded-full p-2 w-[50px] h-[50px] flex items-center justify-center">
                        <Wallet className="w-[30px] h-[27px] text-[#2A9A37]" />
                      </figure>
                      <aside className="ml-3">
                        <h2 className=" text-sm font-[500] uppercase text-[#585858]">
                          Wallet
                        </h2>
                        <div className="text-base font-bold leading-[15px] text-[#262525] flex items-center justify-center">
                          <div
                            className={`px-2 py-1 font-bold  text-lg text-center  rounded-full cursor-pointer ${Number(availableCreditLimit) < 100
                              ? "bg-red-50 text-[#e70f0f]"
                              : "bg-green-50 text-[#2A9A37]"
                              }  whitespace-nowrap overflow-hidden overflow-ellipsis `}
                          >
                            <span className="mr-1 text-base">
                              {" "}
                              {isOverseas && currencyId
                                ? `${(
                                  currencyData?.find(
                                    (item) => item?.id == currencyId,
                                  ) ??
                                  currencyData?.find(
                                    (item) => item?.id == 24,
                                  )
                                )?.symbol || " "
                                }`
                                : "₹"}
                            </span>
                            {Number(
                              Number(availableCreditLimit).toFixed(2),
                            ).toLocaleString("en-IN")}{" "}
                            /-
                          </div>

                          <Lucide
                            icon="RefreshCw"
                            className={`text-mustard stroke-2.5 ml-2 cursor-pointer w-[25px] h-[22px] ${franchiseeSpinner ? "animate-spin" : ""
                              } `}
                            onClick={handleFranchisee}
                          />
                        </div>
                      </aside>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row gap-4 md:gap-0  justify-between tbl-overflow-x-auto">
          <div className="w-full md:w-[63%] pb-8 md:pb-0">
            <Disclosure defaultOpen>
              {({ open }) => (
                <div className="bg-white rounded-lg pb-8 md:pb-0">
                  <Disclosure.Button
                    onClick={() => setCurrentStep(1)}
                    className="flex w-full justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                  >
                    <span> SHIPMENT DETAILS</span>
                    <Lucide
                      icon="ChevronUp"
                      onClick={() => setCurrentStep(1)}
                      className={`${currentStep == 1 ? "" : "rotate-180 transform"
                        } h-5 w-5  text-mustard`}
                    />
                  </Disclosure.Button>
                  {currentStep == 1 && (
                    <Disclosure.Panel
                      static={true}
                      className="px-4 pb-2 pt-4 text-sm text-gray-500 border-t"
                    >
                      <div>
                        <div className="min-w-lg mx-auto px-4 ">
                          <div className="grid grid-cols-1 gap-2">
                            <div className="mb-2">
                              <FormLabel
                                htmlFor="repeat-password"
                                className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
                              >
                                UNITS <span className="text-red-500">*</span>
                              </FormLabel>

                              <div className="grid grid-cols-3 gap-2 w-full">
                                <InputGroup>
                                  <InputGroup.Text>
                                    <Lucide
                                      icon="Scale"
                                      className="text-grey-500 stroke-2.5 "
                                    />
                                  </InputGroup.Text>
                                  <FormSelect
                                    id="units"
                                    className="sm:mr-2 uppercase rounded-none rounded-r-lg"
                                    value={booking?.unit?.weight_unit}
                                    disabled={
                                      startPoint == "listing" ||
                                      startPoint == "spotbooking" ||
                                      startPoint == "importlisting" ||
                                      rateSpinner ||
                                      spinner ||
                                      shipmentResponse?.airwaybilno
                                    }
                                    onChange={(e) => {
                                      setBooking((prev) => ({
                                        ...prev,
                                        unit: {
                                          ...prev.unit,
                                          weight_unit: e.target.value,
                                        },
                                        shipment_charges: {},
                                        courier_id: "",
                                        courier_code: "",
                                        courier_name: "",
                                        courier_vendor_code: "",
                                      }));
                                      setCurrentFaq(1);
                                      setCurrentStep(1);
                                    }}
                                  >
                                    {startPoint == "listing" ? (
                                      <option value="">
                                        {awbData?.pickup_data?.weight_unit}
                                      </option>
                                    ) : (
                                      <option value="">Select</option>
                                    )}

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
                                </InputGroup>
                                <InputGroup>
                                  <InputGroup.Text>
                                    {" "}
                                    <Lucide
                                      icon="Wallet"
                                      className="text-grey-500 stroke-2.5 "
                                    />
                                  </InputGroup.Text>
                                  <FormSelect
                                    id="default"
                                    className="sm:mr-2 uppercase rounded-none rounded-r-lg"
                                    value={
                                      startPoint == "listing"
                                        ? awbData?.pickup_data?.currency_id
                                        : booking?.unit?.currency
                                    }
                                    disabled={
                                      startPoint == "listing" ||
                                      startPoint == "importlisting" ||
                                      booking?.booking_type == "2" ||
                                      rateSpinner ||
                                      spinner ||
                                      shipmentResponse?.airwaybilno
                                    }
                                    onChange={(e) => {
                                      setBooking((prev) => ({
                                        ...prev,
                                        unit: {
                                          ...prev.unit,
                                          currency: e.target.value,
                                        },
                                        shipment_charges: {},
                                        courier_id: "",
                                        courier_code: "",
                                        courier_name: "",
                                        courier_vendor_code: "",
                                      }));
                                      setCurrentFaq(1);
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
                                </InputGroup>
                                <InputGroup>
                                  <InputGroup.Text>
                                    <Lucide
                                      icon="Ruler"
                                      className="text-grey-500 stroke-2.5 "
                                    />
                                  </InputGroup.Text>
                                  <FormSelect
                                    id="default"
                                    className="sm:mr-2 uppercase rounded-none rounded-r-lg"
                                    disabled
                                    value={booking?.unit?.length_unit}
                                    onChange={(e) => {
                                      setBooking({
                                        ...booking,
                                        unit: {
                                          ...booking.unit,
                                          length_unit: e.target.value,
                                        },
                                      });
                                    }}
                                  >
                                    {startPoint == "listing" ? (
                                      <option value="">
                                        {awbData?.pickup_data?.dimention_unit}
                                      </option>
                                    ) : (
                                      <option value="">Select</option>
                                    )}
                                    {lengthData &&
                                      lengthData?.map((data, index) => (
                                        <option
                                          className="uppercase"
                                          key={index}
                                          value={data?.value}
                                        >
                                          {data?.value}
                                        </option>
                                      ))}
                                  </FormSelect>
                                </InputGroup>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {[1, 2, 0, 4, 5].includes(
                                Number(booking?.shipment_type),
                              ) && (
                                  <div
                                    className={`mb-4 ${(booking?.shipment_type == "4" ||
                                      booking?.shipment_type == "5") &&
                                      booking?.import_booking == "2"
                                      ? ""
                                      : "col-span-2"
                                      }`}
                                  >
                                    <FormLabel
                                      htmlFor="directParty"
                                      className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
                                    >
                                      SHIPMENT TYPE{" "}
                                      <span className="text-red-500">*</span>
                                    </FormLabel>

                                    <InputGroup>
                                      <InputGroup.Text>
                                        <i className="bg-white rounded-full w-[30px] h-[30px] flex justify-center items-center">
                                          <img
                                            // src={
                                            //   booking?.shipment_type == 1
                                            //     ? parcel
                                            //     : elem?.booking_shipment_type_id == 2
                                            //     ? courier
                                            //     : elem?.booking_shipment_type_id == 7
                                            //     ? csbv
                                            //     : elem?.booking_shipment_type_id == 5
                                            //     ? Cargocommercial
                                            //     : elem?.booking_shipment_type_id == 6
                                            //     ? ecommerce
                                            //     : ""
                                            // }
                                            src={
                                              booking?.shipment_type == 1
                                                ? parcel
                                                : booking?.shipment_type == 2
                                                  ? courier
                                                  : booking?.shipment_type == 7
                                                    ? csbv
                                                    : booking?.shipment_type == 4
                                                      ? Cargocommercial
                                                      : booking?.shipment_type ==
                                                        5
                                                        ? Cargocommercial
                                                        : booking?.shipment_type ==
                                                          6
                                                          ? ecommerce
                                                          : booking?.shipment_type ==
                                                            8
                                                            ? fairexhibition
                                                            : null
                                            }
                                            // alt={`Shipment type`}
                                            className={`w-[40px] peer-checked:grayscale-0 peer-checked:brightness-100 hover:grayscale-0 hover:brightness-100 grayscale brightness-[.7] transition-all`}
                                          />
                                        </i>
                                      </InputGroup.Text>

                                      <FormSelect
                                        id="default"
                                        value={booking?.shipment_type}
                                        disabled={
                                          startPoint == "listing" ||
                                          startPoint == "spotbooking" ||
                                          startPoint == "importlisting" ||
                                          rateSpinner ||
                                          spinner ||
                                          shipmentResponse?.airwaybilno
                                        }
                                        // disabled
                                        onChange={(e) => {
                                          if (
                                            e.target.value == 1 ||
                                            e.target.value == 4
                                          ) {
                                            delete booking?.weight;
                                            delete booking?.description;
                                          }
                                          setBooking((prev) => ({
                                            ...prev,
                                            shipment_type: e.target.value,
                                            shipment_dimensions: "",
                                            shipment_charges: {},
                                            courier_id: "",
                                            courier_code: "",
                                            courier_name: "",
                                            courier_vendor_code: "",
                                          }));
                                          setCurrentFaq(1);
                                          setCurrentStep(1);
                                          setDimensionData([]);

                                          if (
                                            e.target.value == "4" &&
                                            booking?.import_booking_type == 3
                                          ) {
                                            setSkartCounter(3);
                                            setBooking((prev) => ({
                                              ...prev,
                                              incoterm: 1,
                                            }));
                                          } else {
                                            setSkartCounter(0);
                                          }
                                          setShipmentResponse("");
                                          setCurrentStep(1);
                                          setCurrentFaq(1);
                                        }}
                                      >
                                        {![4, 5].includes(
                                          Number(booking?.shipment_type),
                                        ) && (
                                            <option value="0">
                                              Select Shipment Type
                                            </option>
                                          )}
                                        {booking?.booking_type === "2"
                                          ? shipmentTypes
                                            ?.filter((item) => {
                                              if (
                                                booking?.shipment_type == "0" ||
                                                booking?.shipment_type == "1" ||
                                                booking?.shipment_type == "2"
                                              ) {
                                                return (
                                                  item?.booking_shipment_type_id ==
                                                  1 ||
                                                  item?.booking_shipment_type_id ==
                                                  2
                                                );
                                              }
                                              if (
                                                booking?.shipment_type == "4" ||
                                                booking?.shipment_type == "5"
                                              ) {
                                                return (
                                                  item?.booking_shipment_type_id ==
                                                  4 ||
                                                  item?.booking_shipment_type_id ==
                                                  5
                                                );
                                              }
                                            })
                                            ?.map(
                                              (type) =>
                                                type?.is_active === 1 && (
                                                  <option
                                                    key={
                                                      type?.booking_shipment_type_id
                                                    }
                                                    value={
                                                      type?.booking_shipment_type_id
                                                    }
                                                  >
                                                    {type.shipment_type}
                                                  </option>
                                                ),
                                            )
                                          : shipmentTypes
                                            ?.filter((item) => {
                                              if (
                                                booking?.shipment_type == "0" ||
                                                booking?.shipment_type == "1" ||
                                                booking?.shipment_type == "2"
                                              ) {
                                                return (
                                                  item?.booking_shipment_type_id ==
                                                  1 ||
                                                  item?.booking_shipment_type_id ==
                                                  2
                                                );
                                              }
                                              if (
                                                booking?.shipment_type == "4" ||
                                                booking?.shipment_type == "5"
                                              ) {
                                                if (
                                                  booking?.import_booking == 2
                                                ) {
                                                  return (
                                                    item?.booking_shipment_type_id ==
                                                    4
                                                  );
                                                }

                                                return (
                                                  item?.booking_shipment_type_id ==
                                                  4 ||
                                                  item?.booking_shipment_type_id ==
                                                  5
                                                );
                                              }
                                            })
                                            ?.map(
                                              (type) =>
                                                type?.is_active === 1 && (
                                                  <option
                                                    key={
                                                      type?.booking_shipment_type_id
                                                    }
                                                    value={
                                                      type?.booking_shipment_type_id
                                                    }
                                                  >
                                                    {type.shipment_type}
                                                  </option>
                                                ),
                                            )}
                                      </FormSelect>
                                    </InputGroup>
                                  </div>
                                )}
                              {(booking?.shipment_type == "4" ||
                                booking?.shipment_type == "5") &&
                                booking?.import_booking == "2" ? (
                                <div>
                                  <FormLabel
                                    htmlFor="import-booking-type"
                                    className="block mt-2 md:mb-2 md:mt-0 text-base font-medium text-gray-900 dark:text-white"
                                  >
                                    IMPORT BOOKING TYPE{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormSelect
                                    id="import-booking-type"
                                    formSelectSize="lg"
                                    value={booking?.import_booking_type}
                                    disabled={
                                      startPoint == "listing" ||
                                      startPoint == "spotbooking" ||
                                      startPoint == "importlisting" ||
                                      rateSpinner ||
                                      spinner ||
                                      shipmentResponse?.airwaybilno
                                    }
                                    onChange={(e) => {
                                      setBooking((prev) => ({
                                        ...prev,
                                        import_booking_type: e.target.value,
                                        shipment_charges: {},
                                        courier_id: "",
                                        courier_code: "",
                                        courier_name: "",
                                        courier_vendor_code: "",
                                        clearance_type:
                                          e.target.value == 1 ? 3 : "",
                                      }));
                                      setCurrentFaq(1);
                                      setCurrentStep(1);
                                    }}
                                    className="py-3 text-sm"
                                  >
                                    <option value="">
                                      Select Import Booking Type
                                    </option>
                                    <option value={1}>
                                      D2D Import Booking
                                    </option>
                                    <option value={2}>
                                      D2P/ BSO Import Booking
                                    </option>
                                  </FormSelect>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        {booking?.booking_type == 1 &&
                          (booking?.shipment_type == 4 ||
                            booking?.shipment_type == 5 ||
                            booking?.shipment_type == 8) && (
                            <div className="grid grid-cols-1  md:grid-cols-3 gap-2 md:gap-6 px-5 max-w-4xl py-4 md:py-0 mb-4">
                              {booking?.import_booking == 1 ? (
                                <div className="mb-0 md:mb-5 ">
                                  <FormLabel
                                    htmlFor="directParty"
                                    className="block mt-2 md:mb-2 md:mt-0 text-base font-medium text-gray-900 dark:text-white"
                                  >
                                    CARGO TYPE{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>

                                  <FormSelect
                                    id="default"
                                    value={booking?.cargo_type}
                                    disabled={
                                      startPoint == "listing" ||
                                      startPoint == "spotbooking" ||
                                      rateSpinner ||
                                      spinner ||
                                      shipmentResponse?.airwaybilno
                                    }
                                    onChange={(e) => {
                                      setBooking((prev) => ({
                                        ...prev,
                                        cargo_type: e.target.value,
                                        clearance_type:
                                          e.target.value == "1" ? "3" : "1",
                                        shipment_charges: {},
                                        courier_id: "",
                                        courier_code: "",
                                        courier_name: "",
                                        courier_vendor_code: "",
                                      }));
                                      setCurrentFaq(1);
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
                              ) : null}
                              <div>
                                <FormLabel
                                  htmlFor="directParty"
                                  className="block mt-2 md:mb-2 md:mt-0 text-base font-medium text-gray-900 dark:text-white"
                                >
                                  CLEARANCE TYPE{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>

                                <FormSelect
                                  id="default"
                                  value={booking?.clearance_type}
                                  disabled={
                                    startPoint == "listing" ||
                                    startPoint == "spotbooking" ||
                                    rateSpinner ||
                                    spinner ||
                                    shipmentResponse?.airwaybilno
                                  }
                                  onChange={(e) => {
                                    setBooking((prev) => ({
                                      ...prev,
                                      clearance_type: e.target.value,
                                      shipment_charges: {},
                                      courier_id: "",
                                      courier_code: "",
                                      courier_name: "",
                                      courier_vendor_code: "",
                                    }));
                                    setCurrentFaq(1);
                                    setCurrentStep(1);
                                  }}
                                >
                                  <option value="">
                                    Select Clearance Type
                                  </option>

                                  {clearanceType &&
                                    clearanceType
                                      .filter((item) => {
                                        if (booking?.import_booking == 1) {
                                          return item?.cargo_type?.includes(
                                            booking?.cargo_type,
                                          );
                                        } else {
                                          if (
                                            booking?.import_booking_type == 1
                                          ) {
                                            return item?.id == 3;
                                          } else if (
                                            booking?.import_booking_type == 2
                                          ) {
                                            return [1, 2].includes(item?.id);
                                          }
                                          return true;
                                        }
                                      })
                                      .map((ele, index) => (
                                        <option key={index} value={ele.id}>
                                          {ele.name}
                                        </option>
                                      ))}
                                </FormSelect>
                              </div>
                              <div className="">
                                <FormLabel
                                  htmlFor="directParty"
                                  className="block mt-2 md:mb-2 md:mt-0 text-base font-medium text-gray-900 dark:text-white"
                                >
                                  INCOTERM{" "}
                                  <span className="text-red-500">*</span>
                                </FormLabel>

                                <FormSelect
                                  id="default"
                                  value={booking?.incoterm}
                                  disabled={
                                    startPoint == "listing" ||
                                    startPoint == "spotbooking" ||
                                    rateSpinner ||
                                    spinner ||
                                    shipmentResponse?.airwaybilno
                                  }
                                  onChange={(e) => {
                                    setBooking((prev) => ({
                                      ...prev,
                                      incoterm: e.target.value,
                                      shipment_charges: {},
                                      courier_id: "",
                                      courier_code: "",
                                      courier_name: "",
                                      courier_vendor_code: "",
                                    }));
                                    setCurrentFaq(1);
                                    setCurrentStep(1);
                                  }}
                                >
                                  <option value="">Select Incoterm</option>
                                  {incotermType &&
                                    incotermType
                                      ?.filter((ele) => {
                                        if (booking?.import_booking === 1) {
                                          return [1, 2, 3, 4, 5].includes(
                                            ele?.id,
                                          );
                                        }
                                        if (booking?.import_booking === 2) {
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

                        {startPoint == "booking" ||
                          startPoint == "importlisting" ||
                          startPoint == "spotbooking" ? (
                          <>
                            {booking?.shipment_type === "2" ? (
                              <div className="w-full grid grid-cols-1  md:grid-cols-2 md:gap-6 px-4">
                                <div className=" pb-4">
                                  <FormLabel
                                    htmlFor="description"
                                    className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
                                  >
                                    DESCRIPTION{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  {booking?.destination_country_id == 12 ? (
                                    <CommonSearchableAll
                                      apiEndpoint={
                                        "admin/aiqs-data-set/get-standard-description-for"
                                      }
                                      placeholder={"Enter Description"}
                                      selecteddata={selectedDescriptionData}
                                      setSelecteddata={
                                        setSelectedDescriptionData
                                      }
                                      fun1={fun1}
                                      key1={"description"}
                                      comingselectedname={
                                        "standard_description"
                                      }
                                      comingselectedid={"match_score"}
                                      funtoempty={funtoempty1}
                                      zIndex={20}
                                      id={
                                        selectedDescriptionData?.standard_description
                                      }
                                    />
                                  ) : (
                                    <FormInput
                                      id="description"
                                      type="text"
                                      placeholder="Description"
                                      value={booking?.description}
                                      disabled={
                                        rateSpinner ||
                                        spinner ||
                                        shipmentResponse?.airwaybilno ||
                                        startPoint == "importlisting"
                                      }
                                      onChange={(e) => {
                                        setBooking((prev) => ({
                                          ...prev,
                                          description: e.target.value,
                                          shipment_charges: {},
                                          courier_id: "",
                                          courier_code: "",
                                          courier_name: "",
                                          courier_vendor_code: "",
                                        }));
                                        setCurrentFaq(1);
                                        setCurrentStep(1);
                                      }}
                                    />
                                  )}
                                </div>
                                <div className=" pb-4">
                                  <FormLabel
                                    htmlFor="weight"
                                    className="block mb-2 text-base font-medium text-gray-900 dark:text-white"
                                  >
                                    Weight{" "}
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormInput
                                    id="weight"
                                    type="number"
                                    placeholder="Weight"
                                    value={booking?.weight}
                                    disabled={
                                      rateSpinner ||
                                      spinner ||
                                      shipmentResponse?.airwaybilno ||
                                      startPoint == "importlisting"
                                    }
                                    onChange={(e) => {
                                      setBooking((prev) => ({
                                        ...prev,
                                        weight: e.target.value,
                                        shipment_charges: {},
                                        courier_id: "",
                                        courier_code: "",
                                        courier_name: "",
                                        courier_vendor_code: "",
                                      }));
                                      setCurrentFaq(1);
                                      setCurrentStep(1);
                                    }}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="mb-4">
                                {dimensionData.length > 0 ? (
                                  <div className="px-5">
                                    <FormLabel
                                      htmlFor="regular-form-1"
                                      className="text-base font-medium text-gray-900"
                                    >
                                      {" "}
                                      Shipment Dimension
                                    </FormLabel>

                                    <div className=" p-2 w-full box cursor-pointer  border border-gray-400 flex justify-between items-end">
                                      <div className="flex flex-wrap gap-2">
                                        {dimensionData &&
                                          dimensionData?.map((elem, index) => {
                                            if (!elem?.item_description)
                                              return null;

                                            const weightPerQty =
                                              (booking?.unit?.weight_unit ===
                                                "gms"
                                                ? Number(elem?.weight) / 1000
                                                : Number(elem?.weight)) /
                                              (Number(elem?.quantity) || 1);

                                            const isOverweight =
                                              weightPerQty >=
                                              Number(minLimit?.min_overweight);
                                            const isODC =
                                              Number(elem?.length) >=
                                              Number(minLimit?.min_odc) ||
                                              Number(elem?.width) >=
                                              Number(minLimit?.min_odc) ||
                                              Number(elem?.height) >=
                                              Number(minLimit?.min_odc);

                                            const tooltipContent = `${isOverweight
                                              ? "Overweight might be charged"
                                              : ""
                                              }${isOverweight && isODC ? ", " : ""
                                              }${isODC
                                                ? "Oversize might be charged"
                                                : ""
                                              }`;

                                            return (
                                              <Tippy
                                                key={`${index}-${tooltipContent}`} // Ensures re-render when conditions change
                                                content={tooltipContent}
                                                options={{
                                                  placement:
                                                    isOverweight || isODC
                                                      ? "top"
                                                      : "",
                                                }}
                                              >
                                                <div
                                                  key={index}
                                                  className={`flex px-2 py-1 gap-4 mr-2 bg-slate-300 items-center justify-between rounded-lg ${isOverweight || isODC
                                                    ? "border-2 border-orange-500 text-orange-500 font-bold"
                                                    : ""
                                                    }`}
                                                >
                                                  <span
                                                    className="text-lg flex capitalize"
                                                    onClick={(e) => {
                                                      if (
                                                        startPoint !=
                                                        "importlisting" &&
                                                        !rateSpinner &&
                                                        !spinner &&
                                                        !shipmentResponse?.airwaybilno
                                                      ) {
                                                        e.stopPropagation();
                                                        setDimensionPreview(
                                                          true,
                                                        );
                                                        setIsEditDimension(
                                                          true,
                                                        );
                                                        setEditDimensionData(
                                                          elem,
                                                        );
                                                        setEditIndex(index);
                                                      }
                                                    }}
                                                  >
                                                    {elem?.item_description}
                                                  </span>

                                                  {startPoint !=
                                                    "importlisting" &&
                                                    !rateSpinner &&
                                                    !spinner &&
                                                    !shipmentResponse?.airwaybilno && (
                                                      <Tippy
                                                        content="Delete Dimension"
                                                        options={{
                                                          placement: "right",
                                                        }}
                                                      >
                                                        <Lucide
                                                          icon="XCircle"
                                                          className="text-red-500 stroke-2.5"
                                                          onClick={(e) =>
                                                            handleDelete(
                                                              e,
                                                              index,
                                                            )
                                                          }
                                                        />
                                                      </Tippy>
                                                    )}
                                                </div>
                                              </Tippy>
                                            );
                                          })}
                                      </div>

                                      {startPoint != "importlisting" &&
                                        !rateSpinner &&
                                        !spinner &&
                                        !shipmentResponse?.airwaybilno && (
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
                                  <div className="px-5">
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
                                  setBooking={setBooking}
                                  setSelectVendor={setSelectVendor}
                                  setCurrentStep={setCurrentStep}
                                  setCurrentFaq={setCurrentFaq}
                                  booking={booking}
                                  currencyData={currencyData}
                                  isEditDimension={isEditDimension}
                                  editIndex={editIndex}
                                  editDimensionData={
                                    isEditDimension
                                      ? editDimensionData
                                      : undefined
                                  }
                                  setShipmentResponse={setShipmentResponse}
                                  showHsn={
                                    booking?.booking_type == "1" ||
                                      booking?.import_booking == "2"
                                      ? true
                                      : false
                                  }
                                  minLimit={minLimit}
                                  isSpot={booking?.is_spot == 1 ? true : false}
                                />
                              </div>
                            )}
                          </>
                        ) : (booking?.shipment_type == 1 ||
                          booking?.shipment_type == 4 ||
                          booking?.shipment_type == 5 ||
                          booking?.shipment_type == 8) &&
                          awbData?.pickup_item?.length > 0 ? (
                          <div className="max-w-8xl mx-auto p-6 ">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <FormLabel htmlFor="vendorname">
                                  Vendor Name
                                </FormLabel>
                                <FormInput
                                  id="regular-form-1"
                                  type="text"
                                  disabled
                                  value={vendorName || ""}
                                />
                              </div>

                              <div>
                                <FormLabel htmlFor="productvalue">
                                  Product Value{" "}
                                  {isOverseas && currencyId
                                    ? `(${(
                                      currencyData?.find(
                                        (item) => item?.id == currencyId,
                                      ) ??
                                      currencyData?.find(
                                        (item) => item?.id == 24,
                                      )
                                    )?.symbol || " "
                                    })`
                                    : "(₹)"}
                                </FormLabel>
                                <FormInput
                                  id="regular-form-1"
                                  type="text"
                                  disabled
                                  value={
                                    awbData?.pickup_data?.product_value
                                      ? Number(
                                        awbData?.pickup_data?.product_value,
                                      )
                                      : ""
                                  }
                                />
                              </div>
                            </div>

                            <div className="my-2">
                              <TinySlider
                                options={{
                                  controls: true,
                                  nav: true,
                                }}
                              >
                                {awbData &&
                                  awbData.pickup_item.map((item, index) => (
                                    <div key={index}>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                          <FormLabel htmlFor="airrwaybillno">
                                            Airway Bill No.
                                          </FormLabel>
                                          <FormInput
                                            id="regular-form-1"
                                            type="text"
                                            disabled
                                            value={
                                              awbData?.pickup_data
                                                ?.airwaybilno || ""
                                            }
                                          />
                                        </div>
                                        <div>
                                          <FormLabel htmlFor="description">
                                            Description
                                          </FormLabel>
                                          <FormInput
                                            id="regular-form-1"
                                            type="text"
                                            className="capitalize"
                                            disabled
                                            value={
                                              awbData?.pickup_item[index]
                                                ?.item_description || ""
                                            }
                                          />
                                        </div>
                                        <div>
                                          <FormLabel htmlFor="weight">
                                            Weight
                                          </FormLabel>
                                          <FormInput
                                            id="regular-form-1"
                                            type="text"
                                            disabled
                                            value={
                                              awbData?.pickup_item[index]
                                                ?.weight
                                                ? Number(
                                                  awbData?.pickup_item[index]
                                                    ?.weight,
                                                )
                                                : ""
                                            }
                                          />
                                        </div>

                                        <div>
                                          <FormLabel htmlFor="quantity">
                                            Quantity
                                          </FormLabel>
                                          <FormInput
                                            id="regular-form-1"
                                            type="text"
                                            disabled
                                            value={
                                              awbData?.pickup_item[index]
                                                ?.quantity
                                                ? Number(
                                                  awbData?.pickup_item[index]
                                                    ?.quantity,
                                                )
                                                : ""
                                            }
                                          />
                                        </div>
                                        <div>
                                          <FormLabel htmlFor="length">
                                            Length
                                          </FormLabel>
                                          <FormInput
                                            id="regular-form-1"
                                            type="text"
                                            disabled
                                            value={
                                              awbData?.pickup_item[index]
                                                ?.length
                                                ? Number(
                                                  awbData?.pickup_item[index]
                                                    ?.length,
                                                )
                                                : ""
                                            }
                                          />
                                        </div>
                                        <div>
                                          <FormLabel htmlFor="breadth">
                                            Breadth
                                          </FormLabel>
                                          <FormInput
                                            id="regular-form-1"
                                            type="text"
                                            disabled
                                            value={
                                              awbData?.pickup_item[index]
                                                ?.breadth
                                                ? Number(
                                                  awbData?.pickup_item[index]
                                                    ?.breadth,
                                                )
                                                : ""
                                            }
                                          />
                                        </div>
                                        <div>
                                          <FormLabel htmlFor="height">
                                            Height
                                          </FormLabel>
                                          <FormInput
                                            id="regular-form-1"
                                            type="text"
                                            disabled
                                            value={
                                              awbData?.pickup_item[index]
                                                ?.height
                                                ? Number(
                                                  awbData?.pickup_item[index]
                                                    ?.height,
                                                )
                                                : ""
                                            }
                                          />
                                        </div>
                                        <div>
                                          <FormLabel htmlFor="hsn_code">
                                            HSN Code
                                          </FormLabel>
                                          <FormInput
                                            id="regular-form-1"
                                            type="text"
                                            disabled
                                            value={
                                              awbData?.pickup_item[index]
                                                ?.hsn_code
                                                ? Number(
                                                  awbData?.pickup_item[index]
                                                    ?.hsn_code,
                                                )
                                                : ""
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </TinySlider>
                            </div>
                          </div>
                        ) : booking?.shipment_type == 2 &&
                          awbData?.pickup_item?.length > 0 ? (
                          <div className="max-w-4xl mx-auto p-6 ">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <FormLabel htmlFor="vendorname">
                                  Vendor Name
                                </FormLabel>
                                <FormInput
                                  id="regular-form-1"
                                  type="text"
                                  disabled
                                  value={vendorName || ""}
                                />
                              </div>

                              <div>
                                <FormLabel htmlFor="productvalue">
                                  Airway Bill No.
                                </FormLabel>
                                <FormInput
                                  id="regular-form-1"
                                  type="text"
                                  disabled
                                  value={
                                    awbData?.pickup_data?.airwaybilno || "N.A."
                                  }
                                />
                              </div>

                              <div>
                                <FormLabel htmlFor="description">
                                  Description
                                </FormLabel>
                                <FormInput
                                  id="regular-form-1"
                                  type="text"
                                  className="capitalize"
                                  disabled
                                  value={
                                    awbData?.pickup_item[0]
                                      ?.product_description || ""
                                  }
                                />
                              </div>
                              <div>
                                <FormLabel htmlFor="weight">Weight</FormLabel>
                                <FormInput
                                  id="regular-form-1"
                                  type="text"
                                  disabled
                                  value={
                                    awbData?.pickup_item[0]?.chargeable_weight
                                      ? Number(
                                        awbData?.pickup_item[0]
                                          ?.chargeable_weight,
                                      )
                                      : ""
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                      {(booking?.weight && booking?.description) ||
                        dimensionData.length >= 1 ? (
                        <div className="flex w-full items-end justify-between mb-2">
                          <div className="w-1/2 pl-5">
                            <FormLabel
                              htmlFor="regular-form-1"
                              className="mt-2 text-base font-medium text-gray-900 whitespace-nowrap"
                            >
                              Shipper Invoice
                            </FormLabel>
                            {booking?.shipper_invoice ? (
                              <div
                                className="flex flex-row items-center gap-2 p-2 cursor-pointer hover:bg-gray-50 w-fit"
                                onClick={() =>
                                  window.open(
                                    booking.shipper_invoice,
                                    "_blank",
                                    "noopener,noreferrer",
                                  )
                                }
                                title="View Shipper Invoice"
                              >
                                <Lucide
                                  icon="FileText"
                                  className="w-8 h-8 text-mustard flex-shrink-0"
                                />
                                <span className="text-xs text-gray-500 truncate max-w-[150px]">
                                  {fileName !== "No file chosen"
                                    ? fileName
                                    : "Shipper Invoice"}
                                </span>
                              </div>
                            ) : (
                              <div className=" flex border-2 border-l-none w-full  rounded-lg">
                                <label
                                  className="cursor-pointer bg-mustard text-white px-4 py-2 rounded-l-lg"
                                  htmlFor="file-upload"
                                >
                                  File
                                  <input
                                    className="sr-only"
                                    id="file-upload"
                                    type="file"
                                    onChange={(e) => uploadInvoice(e)}
                                    disabled={startPoint == "importlisting"}
                                  />
                                </label>
                                <div className="p-2 pt-3 text-gray-500 whitespace-nowrap overflow-hidden overflow-ellipsis">
                                  {fileName}
                                </div>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="primary"
                            size="lg"
                            className="  mr-1 bg-mustard border-none"
                            onClick={handleStepTwo}
                            disabled={
                              rateSpinner ||
                              spinner ||
                              shipmentResponse?.airwaybilno ||
                              !Number(booking?.shipment_type)
                            }
                          >
                            Next{" "}
                            {rateSpinner && (
                              <LoadingIcon
                                icon="puff"
                                color="white"
                                className="w-5 h-5 ml-2 stroke-2.5 text-white"
                              />
                            )}
                          </Button>
                        </div>
                      ) : (
                        <></>
                      )}
                    </Disclosure.Panel>
                  )}
                </div>
              )}
            </Disclosure>

            {shipperPreview && (
              <ShipperInvoiceModal
                open={shipperPreview}
                onClose={() => {
                  setShipperPreview(false);
                }}
                checkAcl={checkAcl}
                booking={booking}
                setBooking={setBooking}
              />
            )}

            {commodityPreview && (
              <CommodityModal
                open={commodityPreview}
                onClose={() => {
                  setCommodityPreview(false);
                }}
                dimensionData={dimensionData}
                setDimensionData={setDimensionData}
                setBooking={setBooking}
                currencyData={currencyData}
                checkAcl={checkAcl}
              />
            )}

            <div className="w-full md:hidden block mt-4 pb-8 md:pb-0">
              {currentFaq >= 2 ? (
                isVendorLoading ? (
                  <div className=" w-full h-72 my-8 flex md:hidden justify-center items-center">
                    <LoadingIcon
                      icon="tail-spin"
                      className="block m-auto w-[35%] "
                    />
                  </div>
                ) : isVendorError ? (
                  <div className="flex md:hidden justify-center">
                    <img src={ErrorGif} alt="error-gif" className="w-48 h-24" />
                  </div>
                ) : allVendorData.length > 0 ? (
                  <Disclosure as="div" defaultOpen>
                    {({ open }) => (
                      <div className="bg-white rounded-lg  w-full pb-8 md:pb-0">
                        <Disclosure.Button
                          onClick={() => {
                            setCurrentStep(2);
                            // setCurrentFaq(2);
                          }}
                          className="flex w-full justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-medium  focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                        >
                          <span>PRICE COMPARISONS</span>
                          <Lucide
                            icon="ChevronUp"
                            onClick={() => {
                              setCurrentStep(2);
                              // setCurrentFaq(2);
                            }}
                            className={`${currentStep == 2 ? "" : "rotate-180 transform"
                              } h-5 w-5 text-mustard`}
                          />
                        </Disclosure.Button>
                        {currentStep == 2 && (
                          <Disclosure.Panel
                            static={true}
                            className=" pb-2 px-2 text-sm text-gray-500 border-t"
                          >
                            {isDirectCust && gstStatus == "2" ? (
                              <div className="overflow-x-auto">
                                <Table className="border text-center ">
                                  <Table.Thead>
                                    <Table.Tr className="border p-1 text-sm text-center space-y-1">
                                      <Table.Th className="border p-1 text-sm"></Table.Th>
                                      <Table.Th className="border p-1 text-sm whitespace-nowrap">
                                        PRODUCT
                                      </Table.Th>
                                      <Table.Th className="border p-1 text-sm ">
                                        PRODUCT TYPE
                                      </Table.Th>
                                      <Table.Th className="border p-1 text-sm whitespace-nowrap">
                                        COST{" "}
                                        {isOverseas && currencyId
                                          ? `(${(
                                            currencyData?.find(
                                              (item) =>
                                                item?.id == currencyId,
                                            ) ??
                                            currencyData?.find(
                                              (item) => item?.id == 24,
                                            )
                                          )?.symbol || " "
                                          })`
                                          : "(₹)"}
                                      </Table.Th>
                                      <Table.Th className="border p-1 text-sm whitespace-nowrap">
                                        WEIGHT
                                      </Table.Th>
                                      <Table.Th className="border p-1 text-sm">
                                        <p>
                                          ESTIMATED
                                          <span className="text-red-500 ml-1">
                                            **
                                          </span>
                                        </p>
                                        <p> DELIVERY</p>
                                      </Table.Th>
                                    </Table.Tr>
                                  </Table.Thead>
                                  <Table.Tbody className="p-0 text-sm">
                                    {vendorData.length > 0 &&
                                      vendorData?.sort((a, b) =>
                                        Number(a?.grand_total_without_gst_show) -
                                        Number(b?.grand_total_without_gst_show)
                                      )?.map((elem, index) => (
                                        <>
                                          <Table.Tr
                                            className="border p-1 text-sm"
                                            key={index}
                                          >
                                            <Table.Td className="border p-1 text-sm">
                                              <FormCheck.Input
                                                id="radio-switch-1_mobile"
                                                type="radio"
                                                name="radio_button_mobile"
                                                checked={
                                                  booking?.courier_id ==
                                                  elem?.courier_id
                                                }
                                                disabled={
                                                  shipmentResponse || spinner
                                                }
                                                onChange={(e) => {
                                                  setClicked(index);
                                                  setCurrentStep(2);
                                                  setCurrentFaq(2);
                                                  e.target.value == "on"
                                                    ? setSelectVendor(true)
                                                    : "";
                                                  setBooking((prev) => ({
                                                    ...prev,
                                                    courier_id:
                                                      elem?.courier_id,
                                                    courier_code:
                                                      elem?.special_code
                                                        ? elem?.special_code.toLowerCase()
                                                        : elem?.special_code,
                                                    courier_name:
                                                      elem?.product_name,
                                                    courier_vendor_code:
                                                      elem?.product_code,
                                                    shipment_charges: elem,
                                                  }));

                                                  if (currentFaq < 4) {
                                                    setProductName(
                                                      elem?.product_name,
                                                    );
                                                  }
                                                }}
                                              />
                                            </Table.Td>
                                            <Table.Td className="border p-1 text-sm ">
                                              {elem?.parent_vendor}
                                            </Table.Td>
                                            <Table.Td className="border p-1 text-sm ">
                                              {elem?.product_name}
                                            </Table.Td>
                                            <Table.Td className="border p-1 text-sm whitespace-nowrap">
                                              {indianFormat(
                                                Number(
                                                  elem?.grand_total_with_gst_show,
                                                ),
                                              )}
                                              /-
                                            </Table.Td>
                                            <Table.Td className="border p-1 text-sm whitespace-nowrap">
                                              {Number(
                                                elem?.actual_weight,
                                              ).toFixed(2)}
                                              kgs
                                            </Table.Td>
                                            <Table.Td className="border p-1 text-sm whitespace-nowrap">
                                              {elem?.tat_days} DAYS
                                            </Table.Td>
                                          </Table.Tr>
                                          {clicked === index && (
                                            <>
                                              <Table.Tr className="text-xs">
                                                <Table.Th className="whitespace-nowrap border">
                                                  SR.No.
                                                </Table.Th>
                                                <Table.Th
                                                  colSpan={3}
                                                  className="whitespace-nowrap border"
                                                >
                                                  PARTICULARS
                                                </Table.Th>
                                                <Table.Th
                                                  colSpan={2}
                                                  className="whitespace-nowrap border"
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
                                                    className="border p-1 text-xs"
                                                    key={index}
                                                  >
                                                    <Table.Td className="border">
                                                      {index + 1}.
                                                    </Table.Td>
                                                    <Table.Td
                                                      colSpan={3}
                                                      className="border"
                                                    >
                                                      {item?.charge_name}
                                                    </Table.Td>
                                                    <Table.Td
                                                      colSpan={2}
                                                      className="border"
                                                    >
                                                      {Number(
                                                        Number(
                                                          item?.charge_amount_show,
                                                        ).toFixed(2),
                                                      ).toLocaleString(
                                                        "en-IN",
                                                      ) || "-"}
                                                    </Table.Td>
                                                  </Table.Tr>
                                                ))}
                                              <Table.Tr className="border p-1 text-xs">
                                                <Table.Td className="border font-medium"></Table.Td>
                                                <Table.Td
                                                  colSpan={3}
                                                  className="border font-medium"
                                                >
                                                  TOTAL
                                                </Table.Td>
                                                <Table.Td
                                                  colSpan={2}
                                                  className="border  font-medium"
                                                >
                                                  {Number(
                                                    Number(
                                                      elem?.grand_total_without_gst_show,
                                                    ).toFixed(2),
                                                  ).toLocaleString("en-IN") ||
                                                    "-"}
                                                </Table.Td>
                                              </Table.Tr>
                                            </>
                                          )}
                                        </>
                                      ))}
                                  </Table.Tbody>
                                </Table>
                              </div>
                            ) : (
                              <>
                                <div className="py-3">
                                  {isOverseas != "1" ? (
                                    <p className="text-red-500 text-center  text-sm font-normal">
                                      * The prices shown here are exclusive of
                                      GST
                                    </p>
                                  ) : null}
                                  <p className="text-red-500 text-center text-sm font-normal">
                                    ** Estimated delivery is calculated from the
                                    date of handover to vendor
                                  </p>
                                </div>
                                {booking?.shipment_type != "4" &&
                                  booking?.booking_type != "2" && (
                                    <div className="py-3 flex justify-center">
                                      <FormSwitch>
                                        <FormSwitch.Label
                                          htmlFor="is_ddp"
                                          className={`${booking?.incoterm == 2
                                            ? "text-black"
                                            : "text-mustard font-bold text-base"
                                            } cursor-pointer hover:text-mustard mr-4`}
                                        >
                                          DDU
                                        </FormSwitch.Label>
                                        <FormSwitch.Input
                                          id="is_ddp"
                                          type="checkbox"
                                          checked={
                                            booking?.incoterm == 2
                                              ? true
                                              : false
                                          }
                                          onChange={(e) => {
                                            setCurrentStep(2);
                                            setCurrentFaq(2);
                                            handleDataFilter(
                                              allVendorData,
                                              e.target.checked ? 2 : 1,
                                            );
                                            setBooking((prev) => ({
                                              ...prev,
                                              incoterm: e.target.checked
                                                ? 2
                                                : 1,
                                              shipment_charges: {},
                                              courier_id: "",
                                              courier_code: "",
                                              courier_name: "",
                                              courier_vendor_code: "",
                                            }));
                                          }}
                                          disabled={
                                            shipmentResponse ||
                                              aclSpinner ||
                                              spinner
                                              ? true
                                              : false
                                          }
                                        />
                                        <FormSwitch.Label
                                          htmlFor="is_ddp"
                                          className={`${booking?.incoterm == 2
                                            ? "text-mustard font-bold text-base"
                                            : "text-black"
                                            }  cursor-pointer hover:text-mustard ml-4`}
                                        >
                                          DDP
                                        </FormSwitch.Label>
                                      </FormSwitch>
                                    </div>
                                  )}
                                <div className="overflow-x-auto">
                                  <Table className="border text-center ">
                                    <Table.Thead>
                                      <Table.Tr className="border p-1 text-sm text-center space-y-1">
                                        <Table.Th className="border p-1 text-sm"></Table.Th>
                                        <Table.Th className="border p-1 text-sm whitespace-nowrap">
                                          PRODUCT
                                        </Table.Th>
                                        <Table.Th className="border p-1 text-sm ">
                                          PRODUCT TYPE
                                        </Table.Th>
                                        <Table.Th className="border p-1 text-sm whitespace-nowrap">
                                          COST{" "}
                                          {isOverseas && currencyId
                                            ? `(${(
                                              currencyData?.find(
                                                (item) =>
                                                  item?.id == currencyId,
                                              ) ??
                                              currencyData?.find(
                                                (item) => item?.id == 24,
                                              )
                                            )?.symbol || " "
                                            })`
                                            : "(₹)"}
                                        </Table.Th>
                                        <Table.Th className="border p-1 text-sm whitespace-nowrap">
                                          WEIGHT
                                        </Table.Th>
                                        <Table.Th className="border p-1 text-sm ">
                                          <p>
                                            ESTIMATED
                                            <span className="text-red-500 ml-1">
                                              **
                                            </span>
                                          </p>
                                          <p> DELIVERY</p>
                                        </Table.Th>
                                      </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody className="p-0 text-sm">
                                      {vendorData.length > 0 &&
                                        vendorData?.sort((a, b) =>
                                          Number(a?.grand_total_without_gst_show) -
                                          Number(b?.grand_total_without_gst_show)
                                        )?.map((elem, index) => (
                                          <Table.Tr
                                            className="border p-1 text-sm"
                                            key={index}
                                          >
                                            <Table.Td className="border p-1 text-sm">
                                              <FormCheck.Input
                                                id="radio-switch-1_mobile"
                                                type="radio"
                                                name="radio_button_mobile"
                                                checked={
                                                  booking?.courier_id ==
                                                  elem?.courier_id
                                                }
                                                disabled={
                                                  shipmentResponse || spinner
                                                }
                                                onChange={(e) => {
                                                  setCurrentStep(2);
                                                  setCurrentFaq(2);
                                                  e.target.value == "on"
                                                    ? setSelectVendor(true)
                                                    : "";
                                                  setBooking((prev) => ({
                                                    ...prev,
                                                    courier_id:
                                                      elem?.courier_id,
                                                    courier_code:
                                                      elem?.special_code
                                                        ? elem?.special_code.toLowerCase()
                                                        : elem?.special_code,
                                                    courier_name:
                                                      elem?.product_name,
                                                    courier_vendor_code:
                                                      elem?.product_code,
                                                    shipment_charges: elem,
                                                  }));

                                                  if (currentFaq < 4) {
                                                    setProductName(
                                                      elem?.product_name,
                                                    );
                                                  }
                                                }}
                                              />
                                            </Table.Td>
                                            <Table.Td className="border p-1 text-sm ">
                                              {elem?.parent_vendor}
                                            </Table.Td>
                                            <Table.Td className="border p-1 text-sm ">
                                              {elem?.product_name}
                                            </Table.Td>
                                            <Table.Td
                                              className="border p-1 text-sm whitespace-nowrap cursor-pointer text-blue-600"
                                              onClick={() => {
                                                setPriceDetailsData(elem);
                                                setPriceDetailsPreview(true);
                                              }}
                                            >
                                              {indianFormat(
                                                Number(
                                                  elem?.grand_total_without_gst_show,
                                                ),
                                              )}
                                              /-
                                            </Table.Td>
                                            <Table.Td className="border p-1 text-sm whitespace-nowrap">
                                              {Number(
                                                elem?.actual_weight,
                                              ).toFixed(2)}
                                              kgs
                                            </Table.Td>
                                            <Table.Td className="border p-1 text-sm whitespace-nowrap">
                                              {elem?.tat_days} DAYS
                                            </Table.Td>
                                          </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                  </Table>
                                </div>
                              </>
                            )}

                            <PriceDetailsModal
                              open={priceDetailsPreview}
                              priceDetailsData={priceDetailsData}
                              odcData={odcData}
                              onClose={() => setPriceDetailsPreview(false)}
                              currencySymbol={
                                isOverseas && currencyId
                                  ? `(${(
                                    currencyData?.find(
                                      (item) => item?.id == currencyId,
                                    ) ??
                                    currencyData?.find(
                                      (item) => item?.id == 24,
                                    )
                                  )?.symbol || " "
                                  })`
                                  : "(₹)"
                              }
                            />

                            <div className="flex justify-end my-3">
                              <Button
                                elevated
                                rounded
                                disabled={
                                  !selectVendor ||
                                  shipmentResponse ||
                                  spinner ||
                                  aclSpinner
                                }
                                className="w-1/3 bg-mustard border-none text-white text-lg font-medium"
                                onClick={async (
                                  e: React.MouseEvent<HTMLButtonElement>,
                                ) => {
                                  if (
                                    booking?.courier_code.includes("skynet")
                                  ) {
                                    getSkynetCode();
                                  } else if (
                                    // booking?.courier_code.includes("dhl") ||
                                    booking?.courier_code.includes(
                                      "emirates",
                                    ) &&
                                    (booking?.shipment_type == "1" ||
                                      booking?.shipment_type == "4" ||
                                      booking?.shipment_type == "7")
                                  ) {
                                    setCommodityPreview(true);
                                  } else if (
                                    booking?.courier_code.includes("widect")
                                  ) {
                                    if (
                                      booking?.destination_country_code ==
                                      "GB" ||
                                      booking?.destination_country_code == "US"
                                    ) {
                                      if (
                                        ![22, 48, 50].includes(
                                          Number(booking?.unit?.currency),
                                        )
                                      ) {
                                        setCurrentFaq(1);
                                        setCurrentStep(1);
                                        showAlert(
                                          "Only USD, EUR or GBP is allowed in currency",
                                          "warning",
                                        );
                                        return;
                                      }

                                      // if (
                                      //   booking?.destination_country_code ==
                                      //   "US"
                                      // ) {
                                      //   if (booking?.shipment_type == 2) {
                                      //     const isValid = validateDescription(
                                      //       booking?.description,
                                      //     );
                                      //     if (!isValid && !ignoreValidation) {
                                      //       setDescriptionError([
                                      //         {
                                      //           index: 0,
                                      //           description:
                                      //             booking?.description,
                                      //         },
                                      //       ]);
                                      //       setDescriptionModal(true);
                                      //       return;
                                      //     }
                                      //   } else {
                                      //     const invalidDescriptions =
                                      //       await dimensionData?.reduce(
                                      //         (
                                      //           acc: any,
                                      //           item: any,
                                      //           index: any,
                                      //         ) => {
                                      //           if (
                                      //             !validateDescription(
                                      //               item?.item_description,
                                      //             )
                                      //           ) {
                                      //             acc.push({
                                      //               index,
                                      //               description:
                                      //                 item?.item_description,
                                      //             });
                                      //           }
                                      //           return acc;
                                      //         },
                                      //         [],
                                      //       );

                                      //     if (
                                      //       invalidDescriptions.length > 0 &&
                                      //       !ignoreValidation
                                      //     ) {
                                      //       setDescriptionError(
                                      //         invalidDescriptions,
                                      //       );
                                      //       setDescriptionModal(true);
                                      //       return;
                                      //     }
                                      //   }
                                      // }
                                    }
                                    // if (
                                    //   checkHsnLength(dimensionData || []) !=
                                    //   true
                                    // ) {
                                    //   showAlert(
                                    //     "Please provide a valid 10-digit HSN code for Widect",
                                    //     "warning",
                                    //   );
                                    // }

                                    if (!booking?.incoterm) {
                                      if (isRestricted) {
                                        setBooking({
                                          ...booking,
                                          incoterm: 1,
                                        });
                                        setShowField(true);
                                        showAlert(
                                          "DDU Incoterm is selected",
                                          "warning",
                                        );
                                        await checkProhibited();
                                        return;
                                      } else if (
                                        booking?.destination_country_code ==
                                        "US"
                                      ) {
                                        setBooking({
                                          ...booking,
                                          incoterm: 2,
                                        });
                                        setShowField(true);
                                        showAlert(
                                          "DDP Incoterm is selected",
                                          "warning",
                                        );
                                        await checkProhibited();
                                        return;
                                      } else {
                                        setCurrentFaq(1);
                                        setCurrentStep(1);
                                        setShowField(true);
                                        showAlert(
                                          "Please select Incoterm",
                                          "warning",
                                        );
                                        return;
                                      }
                                    } else {
                                      await checkProhibited();
                                    }
                                  } else if (
                                    (booking?.courier_code.includes(
                                      "heyword",
                                    ) ||
                                      booking?.courier_code.includes("ups") ||
                                      booking?.courier_code.includes(
                                        "fedex",
                                      )) &&
                                    startPoint != "importlisting" &&
                                    (booking?.shipment_type == "1" ||
                                      booking?.shipment_type == "6" ||
                                      booking?.shipment_type == "7")
                                  ) {
                                    setShipperPreview(!booking?.shipper_invoice);
                                    if (booking?.shipper_invoice) {
                                      setShowField(false);
                                      checkAcl();
                                    }
                                  } else if (
                                    booking?.courier_code.includes("dhl")
                                  ) {
                                    if (booking?.shipment_type == "2") {
                                      if (booking?.description.length > 90) {
                                        showAlert(
                                          "Description length should be less than 90 characters in Dhl",
                                          "warning",
                                        );
                                        setCurrentStep(1);
                                        setCurrentFaq(1);
                                      } else {
                                        delete booking?.invoiceData;
                                        setShowField(false);
                                        setShipperPreview(false);
                                        checkAcl();
                                      }
                                    } else {
                                      const hasInvalid = dimensionData?.some((elem: any, index: any) => {
                                        if (elem?.item_description?.length > 90) {
                                          showAlert(
                                            "Description length should be less than 90 characters in Dhl",
                                            "warning",
                                          );
                                          setDimensionPreview(true);
                                          setIsEditDimension(true);
                                          setEditDimensionData(elem);
                                          setEditIndex(index);
                                          setCurrentStep(1);
                                          setCurrentFaq(1);

                                          return true; // 🚀 stops iteration immediately
                                        }
                                        return false;
                                      });

                                      if (!hasInvalid) {
                                        delete booking?.invoiceData;
                                        setShowField(false);
                                        setShipperPreview(false);
                                        checkAcl();
                                      }
                                    }
                                  } else {
                                    delete booking?.invoiceData;
                                    setShowField(false);
                                    setShipperPreview(false);
                                    checkAcl();
                                  }
                                }}
                              >
                                {isDirectCust &&
                                  availableCreditLimit <
                                  booking?.shipment_charges
                                    ?.grand_total_with_gst_show
                                  ? "Add Money"
                                  : "Next"}

                                {aclSpinner && (
                                  <LoadingIcon
                                    icon="puff"
                                    color="white"
                                    className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                  />
                                )}
                              </Button>

                              {paymentOpen && deviceType !== "Desktop" && (
                                <PaymentModal
                                  open={paymentOpen}
                                  onClose={() => setPaymentOpen(false)}
                                  amount={payableAmount}
                                  setCurrentStep={setCurrentStep}
                                  setCurrentFaq={setCurrentFaq}
                                  handleFranchisee={handleFranchisee}
                                />
                              )}
                            </div>
                          </Disclosure.Panel>
                        )}
                      </div>
                    )}
                  </Disclosure>
                ) : (
                  <div className="box text-red-500 font-medium text-lg w-full h-36 flex md:hidden items-center justify-center">
                    Vendor Not Available for this region !!
                  </div>
                )
              ) : null}
            </div>

            {currentFaq >= 3 && (
              <Disclosure as="div" className="mt-2" defaultOpen>
                {({ open }) => (
                  <div className="bg-white rounded-lg pb-8 md:pb-0">
                    <Disclosure.Button
                      onClick={() => setCurrentStep(3)}
                      className="flex w-full justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-medium  focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                    >
                      <span>ADDRESS DETAILS</span>
                      <Lucide
                        icon="ChevronUp"
                        onClick={() => setCurrentStep(3)}
                        className={`${currentStep == 3 ? "" : "rotate-180 transform"
                          } h-5 w-5 text-mustard`}
                      />
                    </Disclosure.Button>
                    {currentStep == 3 && (
                      <Disclosure.Panel
                        static={true}
                        className="px-4 pb-2 pt-4 text-sm text-gray-500 border-t"
                      >
                        <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-12 md:col-span-6">
                            <div className="flex  justify-between  items-center bg-[#F9F6EF] rounded-lg px-3 py-2">
                              <h1 className="flex items-center  font-bold text-sm md:text-base whitespace-nowrap">
                                <img
                                  src={Courier_commercial_icon}
                                  alt="Courier_commercial_icon"
                                  className="w-[38px] h-[auto] mr-2"
                                />
                                <strong className="uppercase">
                                  Sender Details{" "}
                                </strong>
                              </h1>
                              <div className="">
                                {!spinner && (
                                  <Tippy
                                    className="cursor-pointer bg-[#fab221] rounded-lg px-1 py-1 flex items-center "
                                    content="Add Sender Details"
                                    options={{ placement: "right" }}
                                    onClick={() => {
                                      setSenderModalPreview(true);
                                    }}
                                  >
                                    <Lucide
                                      icon="PlusCircle"
                                      className="w-6 h-6 cursor-pointer text-[#fff]"
                                      onClick={() => {
                                        setSenderModalPreview(true);
                                      }}
                                    />
                                  </Tippy>
                                )}
                                <SenderModal
                                  booking={booking}
                                  setBooking={setBooking}
                                  open={senderModalPreview}
                                  onClose={() => setSenderModalPreview(false)}
                                  setSenderData={setSenderData}
                                />
                              </div>
                            </div>

                            <div className="w-full m-2">
                              {booking?.consigner_first_name && (
                                <div className="flex items-center mb-1">
                                  <i className="w-[28px] h-[28px] bg-[#FFF0CC] text-[#D8A128] rounded-full p-1 mr-3 flex items-center justify-center">
                                    <Lucide icon="User" className="w-[22px]" />
                                  </i>
                                  <p className="text-sm">
                                    {booking?.consigner_first_name}
                                  </p>
                                </div>
                              )}
                              {booking?.consigner_address_1 && (
                                <div className="flex items-center mb-1">
                                  <i className="w-[28px] h-[28px] bg-[#FFF0CC] text-[#D8A128] rounded-full p-1 mr-3 flex items-center justify-center">
                                    <Lucide
                                      icon="MapPin"
                                      className="w-[22px]"
                                    />
                                  </i>
                                  <p className="text-sm">
                                    {booking?.consigner_address_1}
                                  </p>
                                </div>
                              )}
                              {booking?.consigner_city && (
                                <div className="flex items-center mb-1">
                                  <i className="w-[28px] h-[28px] bg-[#FFF0CC] text-[#D8A128] rounded-full p-1 mr-3 flex items-center justify-center">
                                    <Lucide
                                      icon="Navigation"
                                      className="w-[22px]"
                                    />
                                  </i>
                                  <p className="text-sm">
                                    {booking?.consigner_city}
                                  </p>
                                </div>
                              )}
                              {booking?.consigner_pincode && (
                                <div className="flex items-center mb-1">
                                  <i className="w-[28px] h-[28px] bg-[#FFF0CC] text-[#D8A128] rounded-full p-1 mr-3 flex items-center justify-center">
                                    <Lucide
                                      icon="Locate"
                                      className="w-[22px]"
                                    />
                                  </i>
                                  <p className="text-sm">
                                    {booking?.consigner_pincode}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-span-12 md:col-span-6">
                            <div className="flex justify-between items-center bg-[#F0FFF2] rounded-lg px-3 py-2">
                              {" "}
                              <h1 className="flex items-center font-bold text-sm md:text-base whitespace-nowrap">
                                <img
                                  src={ReceiverIcon}
                                  alt="ReceiverIcon"
                                  className="w-[38px] h-[auto]"
                                />
                                <strong className="uppercase ml-2">
                                  {" "}
                                  Receiver Details
                                </strong>
                              </h1>
                              {!spinner && (
                                <Tippy
                                  className="cursor-pointer bg-[#25A21E] rounded-lg px-1 py-1 flex items-center "
                                  content="Add Receiver Details"
                                  options={{ placement: "right" }}
                                  onClick={() => {
                                    setReceiverModalPreview(true);
                                  }}
                                >
                                  <Lucide
                                    icon="PlusCircle"
                                    className="w-6 h-6 cursor-pointer text-[#fff]"
                                    onClick={() => {
                                      setReceiverModalPreview(true);
                                    }}
                                  />
                                </Tippy>
                              )}
                              <ReceiverModal
                                booking={booking}
                                setBooking={setBooking}
                                open={receiverModalPreview}
                                onClose={() => setReceiverModalPreview(false)}
                                setReceiverData={setReceiverData}
                              />
                            </div>

                            <div className="w-full m-2">
                              {booking?.consignee_first_name && (
                                <div className="flex items-center mb-1">
                                  <i className="w-[28px] h-[28px] bg-[#D3F2D6] text-[#11B324] rounded-full p-1 mr-3 flex items-center justify-center">
                                    <Lucide icon="User" className="w-[22px]" />
                                  </i>
                                  <p className="text-sm">
                                    {booking?.consignee_first_name}
                                  </p>
                                </div>
                              )}
                              {booking?.consignee_address_1 && (
                                <div className="flex items-center mb-1">
                                  <i className="w-[28px] h-[28px] bg-[#D3F2D6] text-[#11B324] rounded-full p-1 mr-3 flex items-center justify-center">
                                    <Lucide
                                      icon="MapPin"
                                      className="w-[22px]"
                                    />
                                  </i>
                                  <p className="text-sm">
                                    {booking?.consignee_address_1}
                                  </p>
                                </div>
                              )}
                              {booking?.consignee_city && (
                                <div className="flex items-center mb-1">
                                  <i className="w-[28px] h-[28px] bg-[#D3F2D6] text-[#11B324] rounded-full p-1 mr-3 flex items-center justify-center">
                                    <Lucide
                                      icon="Navigation"
                                      className="w-[22px]"
                                    />
                                  </i>
                                  <p className="text-sm">
                                    {booking?.consignee_city}
                                  </p>
                                </div>
                              )}
                              {booking?.consignee_pincode && (
                                <div className="flex items-center mb-1">
                                  <i className="w-[28px] h-[28px] bg-[#D3F2D6] text-[#11B324] rounded-full p-1 mr-3 flex items-center justify-center">
                                    <Lucide
                                      icon="Locate"
                                      className="w-[22px]"
                                    />
                                  </i>
                                  <p className="text-sm">
                                    {booking?.consignee_pincode}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {booking?.import_booking == "2" ? (
                          <div className="flex justify-end gap-4">
                            {skartCounter <= 5 ? (
                              <>
                                <Button
                                  variant="primary"
                                  className="my-4 mr-1 bg-mustard border-none font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 hover:bg-opacity-90 hover:border-opacity-90 text-center disabled:opacity-70 disabled:cursor-not-allowed text-white"
                                  onClick={() => setOpenPreview(true)}
                                  disabled={spinner}
                                >
                                  Preview Details{" "}
                                  {spinner ? (
                                    <LoadingIcon
                                      icon="puff"
                                      color="white"
                                      className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                    />
                                  ) : (
                                    <Lucide
                                      icon="FileScan"
                                      color="white"
                                      className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                    />
                                  )}
                                </Button>{" "}
                                <Button
                                  variant="primary"
                                  className="my-4 mr-1 bg-mustard border-none font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 hover:bg-opacity-90 hover:border-opacity-90 text-center disabled:opacity-70 disabled:cursor-not-allowed text-white"
                                  onClick={() => {
                                    setSkartCounter((prev) => prev + 1);
                                    bookShipment();
                                  }}
                                  disabled={
                                    !booking.consigner_mobile_number ||
                                    !booking.consigner_company_name ||
                                    !booking.consigner_first_name ||
                                    !booking.consigner_address_1 ||
                                    !booking.consigner_address_2 ||
                                    !booking.consigner_city ||
                                    !booking.consigner_state ||
                                    !booking.consigner_pincode ||
                                    !booking.pickup_required ||
                                    !booking.consignee_mobile_number ||
                                    !booking.consignee_company_name ||
                                    !booking.consignee_first_name ||
                                    !booking.consignee_address_1 ||
                                    !booking.consignee_address_2 ||
                                    !booking.consignee_city ||
                                    !booking.consignee_state ||
                                    !booking.consignee_pincode ||
                                    spinner ||
                                    shipmentResponse ||
                                    (booking?.courier_code?.includes("fedex") &&
                                      booking?.import_booking == "1" &&
                                      !booking?.kyc_details) ||
                                    (booking?.booking_type == "1" &&
                                      !booking.consigner_gst_number) ||
                                    (booking?.booking_type == "1" &&
                                      !booking.consignee_email_id) ||
                                    (booking?.booking_type == "1" &&
                                      !booking.consigner_email_id) ||
                                    (booking?.booking_type == "1" &&
                                      booking?.shipment_type !== "2" &&
                                      booking?.import_booking == "1" &&
                                      !booking?.kyc_details) ||
                                    (booking?.courier_code?.includes(
                                      "aramex",
                                    ) &&
                                      !booking?.export_type) ||
                                    (booking?.courier_code?.includes(
                                      "aramex",
                                    ) &&
                                      !booking?.tax_paid) ||
                                    (booking?.courier_code?.includes(
                                      "aramex",
                                    ) &&
                                      !booking?.consignee_reference_no) ||
                                    (booking?.courier_code?.includes(
                                      "aramex",
                                    ) &&
                                      !booking?.consignee_gst_number) ||
                                    (![4, 5, 7].includes(
                                      Number(booking?.shipment_type),
                                    ) &&
                                      booking?.courier_code?.includes("dhl") &&
                                      (!booking?.shipper_type ||
                                        !booking?.shipment_purpose)) ||
                                    (booking?.courier_code?.includes("dhl") &&
                                      booking?.shipment_type == "1" &&
                                      booking?.destination_country_code ==
                                      "US" &&
                                      !booking?.commodity_code) ||
                                    (booking?.import_booking == "2" &&
                                      booking?.import_booking_type != "2" &&
                                      !booking?.kyc_details) ||
                                    (booking?.courier_code?.includes(
                                      "emirates",
                                    ) &&
                                      !booking?.is_residential)
                                  }
                                >
                                  CONFIRM ORDER
                                  {spinner && (
                                    <LoadingIcon
                                      icon="puff"
                                      color="white"
                                      className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                    />
                                  )}
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="primary"
                                className="my-4 mr-1 bg-mustard border-none font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 hover:bg-opacity-90 hover:border-opacity-90 text-center disabled:opacity-70 disabled:cursor-not-allowed text-white"
                                onClick={() => {
                                  window.location.reload();
                                }}
                              >
                                REFRESH{" "}
                                <Lucide
                                  icon="RefreshCw"
                                  color="white"
                                  className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                />
                              </Button>
                            )}

                            {openPreview && (
                              <PreviewDetailsModal
                                open={openPreview}
                                onClose={() => setOpenPreview(false)}
                                booking={booking}
                                senderData={senderData}
                                receiverData={receiverData}
                                openSenderModal={setSenderModalPreview}
                                openReceiverModal={setReceiverModalPreview}
                                bookShipment={bookShipment}
                                increaseCounter={() =>
                                  setSkartCounter((prev) => prev + 1)
                                }
                                dimensionData={JSON.parse(
                                  booking?.shipment_dimensions,
                                )}
                                shipmentTypes={shipmentTypes}
                                currencyData={currencyData}
                                spinner={spinner}
                                shipmentResponse={shipmentResponse}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="flex justify-end gap-4">
                            {booking?.shipper_type == 1 &&
                              otpField == true &&
                              booking?.courier_code?.includes("dhl") && (
                                <div className="col-span-12 sm:col-span-6 my-4">
                                  <FormInput
                                    id="modal-form-5"
                                    type="text"
                                    placeholder="Enter OTP"
                                    className="w-32"
                                    maxLength={6}
                                    value={booking?.otp}
                                    onChange={(e) =>
                                      setBooking((prev) => ({
                                        ...prev,
                                        otp: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                              )}
                            {skartCounter <= 5 ? (
                              <Button
                                variant="primary"
                                className="my-4 mr-1 bg-mustard border-none font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 hover:bg-opacity-90 hover:border-opacity-90 text-center disabled:opacity-70 disabled:cursor-not-allowed text-white"
                                onClick={() => {
                                  setSkartCounter((prev) => prev + 1);
                                  bookShipment();
                                }}
                                disabled={
                                  !booking.consigner_mobile_number ||
                                  !booking.consigner_company_name ||
                                  !booking.consigner_first_name ||
                                  !booking.consigner_address_1 ||
                                  !booking.consigner_address_2 ||
                                  !booking.consigner_city ||
                                  !booking.consigner_state ||
                                  !booking.consigner_pincode ||
                                  !booking.pickup_required ||
                                  !booking.consignee_mobile_number ||
                                  !booking.consignee_company_name ||
                                  !booking.consignee_first_name ||
                                  !booking.consignee_address_1 ||
                                  !booking.consignee_address_2 ||
                                  !booking.consignee_city ||
                                  !booking.consignee_state ||
                                  !booking.consignee_pincode ||
                                  spinner ||
                                  shipmentResponse ||
                                  (booking?.courier_code?.includes("fedex") &&
                                    booking?.import_booking == "1" &&
                                    !booking?.kyc_details) ||
                                  (booking?.booking_type == "1" &&
                                    !booking.consigner_gst_number) ||
                                  (booking?.booking_type == "1" &&
                                    !booking.consignee_email_id) ||
                                  (booking?.booking_type == "1" &&
                                    !booking.consigner_email_id) ||
                                  (booking?.booking_type == "1" &&
                                    booking?.shipment_type !== "2" &&
                                    booking?.import_booking == "1" &&
                                    !booking?.kyc_details) ||
                                  (booking?.courier_code?.includes("aramex") &&
                                    !booking?.export_type) ||
                                  (booking?.courier_code?.includes("aramex") &&
                                    !booking?.tax_paid) ||
                                  (booking?.courier_code?.includes("aramex") &&
                                    !booking?.consignee_reference_no) ||
                                  (booking?.courier_code?.includes("aramex") &&
                                    !booking?.consignee_gst_number) ||
                                  (![4, 5, 7].includes(
                                    Number(booking?.shipment_type),
                                  ) &&
                                    booking?.courier_code?.includes("dhl") &&
                                    (!booking?.shipper_type ||
                                      !booking?.shipment_purpose)) ||
                                  (booking?.courier_code?.includes("dhl") &&
                                    booking?.shipment_type == "1" &&
                                    booking?.destination_country_code == "US" &&
                                    !booking?.commodity_code) ||
                                  (booking?.import_booking == "2" &&
                                    booking?.import_booking_type != "2" &&
                                    !booking?.kyc_details) ||
                                  (booking?.courier_code?.includes(
                                    "emirates",
                                  ) &&
                                    !booking?.is_residential)
                                }
                              >
                                CONFIRM ORDER
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
                                variant="primary"
                                className="my-4 mr-1 bg-mustard border-none font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 hover:bg-opacity-90 hover:border-opacity-90 text-center disabled:opacity-70 disabled:cursor-not-allowed text-white"
                                onClick={() => {
                                  window.location.reload();
                                }}
                              >
                                REFRESH{" "}
                                <Lucide
                                  icon="RefreshCw"
                                  color="white"
                                  className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                />
                              </Button>
                            )}
                          </div>
                        )}
                      </Disclosure.Panel>
                    )}
                  </div>
                )}
              </Disclosure>
            )}

            {isLoading ? (
              <div className="flex justify-center">
                <img src={LoadingGif} alt="loading-gif" />
                {/* <img src={Loader}  alt="loading-gif" /> */}
              </div>
            ) : isError ? (
              <div className="flex justify-center">
                <img src={ErrorGif} alt="error-gif" className="w-48 h-24" />
              </div>
            ) : (
              <></>
            )}

            {shipmentResponse && currentFaq >= 4 ? (
              <Disclosure as="div" className="mt-2" defaultOpen>
                {({ open }) => (
                  <div className="bg-white rounded-lg pb-8 md:pb-0">
                    <Disclosure.Button
                      onClick={() => setCurrentStep(4)}
                      className="flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium  focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                    >
                      <span>BOOKING DETAILS</span>
                      <Lucide
                        icon="ChevronUp"
                        onClick={() => setCurrentStep(4)}
                        className={`${currentStep == 4 ? "" : "rotate-180 transform"
                          } h-5 w-5 text-mustard`}
                      />
                    </Disclosure.Button>
                    {currentStep == 4 && (
                      <Disclosure.Panel
                        static={true}
                        className="px-4 pb-2 pt-4 text-sm text-gray-500 border-t"
                      >
                        <div className="flex justify-center ">
                          <Table className="border text-center max-w-lg">
                            <Table.Thead>
                              <Table.Tr className="border p-1 space-y-1">
                                <Table.Th className="border p-1">
                                  PARTICULAR
                                </Table.Th>
                                <Table.Th className="border p-1">
                                  VALUE
                                </Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody className="p-0">
                              <Table.Tr className="border p-1">
                                <Table.Td className="border p-1">
                                  {booking?.import_booking == 2 && isDraft == 1
                                    ? "DRAFT BOOKING NO"
                                    : "AWB NO"}
                                </Table.Td>
                                <Table.Td className="border p-1">
                                  {shipmentResponse?.airwaybilno}
                                </Table.Td>
                              </Table.Tr>
                              <Table.Tr className="border p-1">
                                <Table.Td className="border p-1">
                                  Courier Service
                                </Table.Td>
                                <Table.Td className="border p-1 uppercase">
                                  {productName}
                                </Table.Td>
                              </Table.Tr>
                              <Table.Tr className="border p-1">
                                <Table.Td className="border p-1">
                                  Grand Total
                                </Table.Td>
                                <Table.Td className="border p-1">
                                  {isOverseas && currencyId
                                    ? `${(
                                      currencyData?.find(
                                        (item) => item?.id == currencyId,
                                      ) ??
                                      currencyData?.find(
                                        (item) => item?.id == 24,
                                      )
                                    )?.symbol || " "
                                    }`
                                    : "₹"}{" "}
                                  {indianFormat(
                                    Number(
                                      booking?.shipment_charges
                                        ?.grand_total_with_gst_show,
                                    ),
                                  )}
                                  /-
                                </Table.Td>
                              </Table.Tr>
                              {pga && (
                                <Table.Tr className="border p-1 text-mustard font-bold ">
                                  <Table.Td className="border p-1">
                                    Additional Requirement
                                  </Table.Td>
                                  <Table.Td className="border p-1">
                                    Special Documents are required for this
                                    shipment
                                  </Table.Td>
                                </Table.Tr>
                              )}
                            </Table.Tbody>
                          </Table>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-around mt-4 gap-4">
                          <Button
                            elevated
                            rounded
                            className="w-full p-2  bg-mustard border-none text-white"
                            onClick={() => setOrderSummaryModalPreview(true)}
                          >
                            DETAILS
                          </Button>
                          {shipmentResponse?.invoice_url && (
                            <Button
                              elevated
                              rounded
                              disabled={!shipmentResponse?.invoice_url}
                              className="w-full p-2  bg-mustard border-none text-white"
                            >
                              <Link
                                to={shipmentResponse?.invoice_url}
                                target="_blank"
                              >
                                PROFORMA INVOICE
                              </Link>
                            </Button>
                          )}
                          {shipmentResponse?.proforma_url && (
                            <Button
                              elevated
                              rounded
                              disabled={!shipmentResponse?.proforma_url}
                              className="w-full p-2  bg-mustard border-none text-white"
                            >
                              <Link
                                to={shipmentResponse?.proforma_url}
                                target="_blank"
                              >
                                SHIPPER INVOICE
                              </Link>
                            </Button>
                          )}
                          {isDraft != 1 && shipmentResponse?.dispatch_url && (
                            <Button
                              elevated
                              rounded
                              className="w-full p-2  bg-mustard border-none text-white"
                            >
                              <Link
                                to={
                                  booking?.courier_code.includes("ups")
                                    ? shipmentResponse?.merge_url
                                    : shipmentResponse?.dispatch_url
                                }
                                target="_blank"
                                className="px-2"
                              >
                                DISPATCH LABEL
                              </Link>
                            </Button>
                          )}
                          {shipmentResponse?.authority_letter && (
                            <Button
                              elevated
                              rounded
                              className="w-full p-2  bg-mustard border-none text-white"
                            >
                              <Link
                                to={shipmentResponse?.authority_letter}
                                target="_blank"
                                className="px-2"
                              >
                                AUTHORITY LETTER
                              </Link>
                            </Button>
                          )}
                          {shipmentResponse?.house_url && (
                            <Button
                              elevated
                              rounded
                              className="w-full p-2  bg-mustard border-none text-white"
                            >
                              <Link
                                to={shipmentResponse?.house_url}
                                target="_blank"
                                className="px-2"
                              >
                                HOUSE TEMPLATE
                              </Link>
                            </Button>
                          )}
                          {isDraft != 1 && (
                            <Button
                              elevated
                              rounded
                              className="w-full p-2  bg-mustard border-none text-white"
                              onClick={() =>
                                generateAddressLabel(
                                  shipmentResponse?.airwaybilno,
                                )
                              }
                              disabled={labelSpinner}
                            >
                              ADDRESS LABEL{" "}
                              {labelSpinner && (
                                <LoadingIcon
                                  icon="puff"
                                  color="white"
                                  className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                />
                              )}
                            </Button>
                          )}
                        </div>
                        <OrderSummaryModal
                          open={orderSummaryModalPreview}
                          onClose={() => setOrderSummaryModalPreview(false)}
                          booking={booking}
                          currencySymbol={
                            isOverseas && currencyId
                              ? `(${(
                                currencyData?.find(
                                  (item) => item?.id == currencyId,
                                ) ??
                                currencyData?.find((item) => item?.id == 24)
                              )?.symbol || " "
                              })`
                              : "(₹)"
                          }
                        />
                      </Disclosure.Panel>
                    )}
                  </div>
                )}
              </Disclosure>
            ) : (
              <></>
            )}

            {/* {startPoint == "listing" && (
          <div className="box py-2 my-4">
            <div className="border-b pb-1">
              {" "}
              <p className="mx-4 font-bold">Buying Charges</p>
            </div>
            <div className="p-4 overflow-x-auto">
              {" "}
              <Table className="border text-center ">
                <Table.Thead className="bg-mustard text-white">
                  <Table.Tr className="border p-1 text-center space-y-1">
                    <Table.Th className="border p-1">S.No.</Table.Th>
                    <Table.Th className="border p-1">CHARGE NAME</Table.Th>
                    <Table.Th className="border p-1">CHARGE TYPE</Table.Th>
                    <Table.Th className="border p-1">
                      CHARGEABLE AMOUNT
                    </Table.Th>
                    <Table.Th className="border p-1">CGST</Table.Th>
                    <Table.Th className="border p-1">SGST</Table.Th>
                    <Table.Th className="border p-1">IGST</Table.Th>
                    <Table.Th className="border p-1">TOTAL</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="p-0">
                  {awbData?.pickup_buying?.map((elem, index) => (
                    <Table.Tr className="border p-1" key={index}>
                      <Table.Td className="border p-1">{index + 1}.</Table.Td>
                      <Table.Td className="border p-1">
                        {bookingCharges.find(
                          (item) => item.charge_id == elem?.charges_id
                        )?.charge_name || "-"}
                      </Table.Td>
                      <Table.Td className="border p-1">
                        {elem?.charge_type == 1
                          ? "Dr."
                          : elem?.charge_type == 2
                          ? "Cr."
                          : "-"}
                      </Table.Td>
                      <Table.Td className="border p-1">
                        {Number(
                          Number(elem?.taxable_amt).toFixed(2)
                        ).toLocaleString("en-IN") || 0}
                      </Table.Td>
                      <Table.Td className="border p-1">
                        {Number(
                          Number(elem?.cgst_amount).toFixed(2)
                        ).toLocaleString("en-IN") || 0}
                      </Table.Td>
                      <Table.Td className="border p-1">
                        {Number(
                          Number(elem?.sgst_amount).toFixed(2)
                        ).toLocaleString("en-IN") || 0}
                      </Table.Td>
                      <Table.Td className="border p-1">
                        {Number(
                          Number(elem?.igst_amount).toFixed(2)
                        ).toLocaleString("en-IN") || 0}
                      </Table.Td>
                      <Table.Td className="border p-1">
                        {Number(
                          Number(elem?.total_amount).toFixed(2)
                        ).toLocaleString("en-IN") || 0}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        )} */}
            {startPoint == "listing" && (
              <div className="box py-2 my-4">
                <div className="border-b pb-1">
                  {" "}
                  <p className="mx-4 font-bold">Selling Charges</p>
                </div>
                <div className="p-4 overflow-x-auto">
                  {" "}
                  <Table className="border text-center ">
                    <Table.Thead className="bg-mustard text-white">
                      <Table.Tr className="border p-1 text-center space-y-1">
                        <Table.Th className="border p-1">S.No.</Table.Th>
                        <Table.Th className="border p-1">CHARGE NAME</Table.Th>
                        <Table.Th className="border p-1">CHARGE TYPE</Table.Th>
                        <Table.Th className="border p-1">
                          CHARGEABLE AMOUNT{" "}
                          {isOverseas && currencyId
                            ? `(${(
                              currencyData?.find(
                                (item) => item?.id == currencyId,
                              ) ??
                              currencyData?.find((item) => item?.id == 24)
                            )?.symbol || " "
                            })`
                            : "(₹)"}
                        </Table.Th>
                        <Table.Th className="border p-1">
                          CGST{" "}
                          {isOverseas && currencyId
                            ? `(${(
                              currencyData?.find(
                                (item) => item?.id == currencyId,
                              ) ??
                              currencyData?.find((item) => item?.id == 24)
                            )?.symbol || " "
                            })`
                            : "(₹)"}
                        </Table.Th>
                        <Table.Th className="border p-1">
                          SGST{" "}
                          {isOverseas && currencyId
                            ? `(${(
                              currencyData?.find(
                                (item) => item?.id == currencyId,
                              ) ??
                              currencyData?.find((item) => item?.id == 24)
                            )?.symbol || " "
                            })`
                            : "(₹)"}
                        </Table.Th>
                        <Table.Th className="border p-1">
                          IGST{" "}
                          {isOverseas && currencyId
                            ? `(${(
                              currencyData?.find(
                                (item) => item?.id == currencyId,
                              ) ??
                              currencyData?.find((item) => item?.id == 24)
                            )?.symbol || " "
                            })`
                            : "(₹)"}
                        </Table.Th>
                        <Table.Th className="border p-1">
                          TOTAL{" "}
                          {isOverseas && currencyId
                            ? `(${(
                              currencyData?.find(
                                (item) => item?.id == currencyId,
                              ) ??
                              currencyData?.find((item) => item?.id == 24)
                            )?.symbol || " "
                            })`
                            : "(₹)"}
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody className="p-0">
                      {awbData?.pickup_selling_data?.map((elem, index) => (
                        <Table.Tr className="border p-1" key={index}>
                          <Table.Td className="border p-1">
                            {index + 1}.
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {bookingCharges.find(
                              (item) => item.charge_id == elem?.charges_id,
                            )?.charge_name || "-"}
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {elem?.charge_type == 1
                              ? "Dr."
                              : elem?.charge_type == 2
                                ? "Cr."
                                : "-"}
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {indianFormat(elem?.taxable_amt) || 0}
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {indianFormat(elem?.cgst_amount) || 0}
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {indianFormat(elem?.sgst_amount) || 0}
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {indianFormat(elem?.igst_amount) || 0}
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {indianFormat(
                              Number(elem?.taxable_amt || 0) +
                              Number(elem?.cgst_amount || 0) +
                              Number(elem?.sgst_amount || 0) +
                              Number(elem?.igst_amount || 0),
                            ) || 0}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </div>
              </div>
            )}
          </div>

          {startPoint == "listing" && (
            <div className="box rounded-lg w-full md:w-[35%] h-full relative md:bottom-[125px] mb-8">
              <p className="px-4 py-1 font-bold border-b-2">
                Booking Documents
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
                {/* <Button className="bg-mustard text-white w-full flex items-center justify-center space-x-2 py-2 rounded-md">
                  <Lucide
                    icon="ClipboardList"
                    className="h-5 stroke-2.5 text-white"
                  />
                  <span className="font-semibold">Order Summary</span>
                </Button> */}

                {awbData?.pickup_data?.proforma_url && (
                  <Link
                    to={awbData?.pickup_data?.proforma_url || "#"}
                    target="_blank"
                    className={`bg-mustard text-white w-full flex items-center justify-center space-x-2 py-2 rounded-md ${!awbData?.pickup_data?.proforma_url
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      }`}
                  >
                    <Lucide
                      icon="FileText"
                      className="h-5 stroke-2.5 text-white"
                    />
                    <span className="font-semibold">Proforma Invoice</span>
                  </Link>
                )}
                {awbData?.pickup_data?.shipper_invoice && (
                  <Link
                    to={awbData?.pickup_data?.shipper_invoice || "#"}
                    target="_blank"
                    className={`bg-mustard text-white w-full flex items-center justify-center space-x-2 py-2 rounded-md ${!awbData?.pickup_data?.shipper_invoice
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      }`}
                  >
                    <Lucide
                      icon="Truck"
                      className="h-5 stroke-2.5 text-white"
                    />
                    <span className="font-semibold">Shipper Invoice</span>
                  </Link>
                )}
                {awbData?.pickup_data?.dispatch_label && (
                  <Link
                    to={awbData?.pickup_data?.dispatch_label || "#"}
                    target="_blank"
                    className={`bg-mustard text-white w-full flex items-center justify-center space-x-2 py-2 rounded-md ${!awbData?.pickup_data?.dispatch_label
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      }`}
                  >
                    <Lucide icon="Box" className="h-5 stroke-2.5 text-white" />
                    <span className="font-semibold">Dispatch Label</span>
                  </Link>
                )}
                {awbData?.pickup_data?.authLetter && (
                  <Link
                    to={awbData?.pickup_data?.authLetter || "#"}
                    target="_blank"
                    className={`bg-mustard text-white w-full flex items-center justify-center space-x-2 py-2 rounded-md ${!awbData?.pickup_data?.authLetter
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      }`}
                  >
                    <Lucide
                      icon="UserCheck"
                      className="h-5 stroke-2.5 text-white"
                    />
                    <span className="font-semibold">Authority Letter</span>
                  </Link>
                )}

                {awbData?.pickup_data?.address_label ? (
                  <Link
                    to={awbData?.pickup_data?.address_label || "#"}
                    target="_blank"
                    className={`bg-mustard text-white w-full flex items-center justify-center space-x-2 py-2 rounded-md ${!awbData?.pickup_data?.address_label
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                      }`}
                  >
                    <Lucide
                      icon="MapPin"
                      className="h-5 stroke-2.5 text-white"
                    />
                    <span className="font-semibold">Address Label</span>
                  </Link>
                ) : (
                  <Button
                    className="bg-mustard text-white w-full flex items-center justify-center space-x-2 py-2 rounded-md"
                    onClick={() =>
                      generateAddressLabel(awbData?.pickup_data?.airwaybilno)
                    }
                    disabled={labelSpinner}
                  >
                    <Lucide
                      icon="MapPin"
                      className="h-5 stroke-2.5 text-white "
                    />
                    Address Label{" "}
                    {labelSpinner && (
                      <LoadingIcon
                        icon="puff"
                        color="white"
                        className="h-5 ml-2 stroke-2.5 text-white"
                      />
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {currentFaq >= 2 ? (
            isVendorLoading ? (
              <div className="w-full md:w-[35%] h-72 my-8 md:flex   hidden justify-center items-center">
                <LoadingIcon
                  icon="tail-spin"
                  className="block m-auto w-[35%] "
                />
              </div>
            ) : isVendorError ? (
              <div className="md:flex   hidden justify-center w-full md:w-[35%]">
                <img src={ErrorGif} alt="error-gif" className="w-48 h-24" />
              </div>
            ) : allVendorData.length > 0 ? (
              <Disclosure
                as="div"
                defaultOpen
                className="w-full md:w-[35%] hidden md:block"
              >
                {({ open }) => (
                  <div className="bg-white rounded-lg w-full">
                    <Disclosure.Button
                      onClick={() => {
                        setCurrentStep(2);
                        // setCurrentFaq(2);
                      }}
                      className="flex w-full justify-between rounded-lg bg-white px-4 py-2 text-left text-sm font-medium  focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75"
                    >
                      <span>PRICE COMPARISONS</span>
                      <Lucide
                        icon="ChevronUp"
                        onClick={() => {
                          setCurrentStep(2);
                          // setCurrentFaq(2);
                        }}
                        className={`${currentStep == 2 ? "" : "rotate-180 transform"
                          } h-5 w-5 text-mustard`}
                      />
                    </Disclosure.Button>
                    {currentStep == 2 && (
                      <Disclosure.Panel
                        static={true}
                        className=" pb-2 px-2 text-sm text-gray-500 border-t"
                      >
                        {isDirectCust && gstStatus == "2" ? (
                          <div className="overflow-x-auto">
                            <Table className="border text-center ">
                              <Table.Thead>
                                <Table.Tr className="border p-1 text-sm text-center space-y-1">
                                  <Table.Th className="border p-1 text-sm"></Table.Th>
                                  <Table.Th className="border p-1 text-sm whitespace-nowrap">
                                    PRODUCT
                                  </Table.Th>
                                  <Table.Th className="border p-1 text-sm ">
                                    PRODUCT TYPE
                                  </Table.Th>
                                  <Table.Th className="border p-1 text-sm whitespace-nowrap">
                                    COST{" "}
                                    {isOverseas && currencyId
                                      ? `(${(
                                        currencyData?.find(
                                          (item) => item?.id == currencyId,
                                        ) ??
                                        currencyData?.find(
                                          (item) => item?.id == 24,
                                        )
                                      )?.symbol || " "
                                      })`
                                      : "(₹)"}
                                  </Table.Th>
                                  <Table.Th className="border p-1 text-sm whitespace-nowrap">
                                    WEIGHT
                                  </Table.Th>
                                  <Table.Th className="border p-1 text-sm ">
                                    <p>
                                      ESTIMATED
                                      <span className="text-red-500 ml-1">
                                        **
                                      </span>
                                    </p>
                                    <p> DELIVERY</p>
                                  </Table.Th>
                                </Table.Tr>
                              </Table.Thead>
                              <Table.Tbody className="p-0 text-sm">
                                {vendorData.length > 0 &&
                                  vendorData.map((elem, index) => (
                                    <>
                                      <Table.Tr
                                        className="border p-1 text-sm"
                                        key={index}
                                      >
                                        <Table.Td className="border p-1 text-sm">
                                          <FormCheck.Input
                                            id="radio-switch-1"
                                            type="radio"
                                            name="radio_button"
                                            checked={
                                              booking?.courier_id ==
                                              elem?.courier_id
                                            }
                                            disabled={
                                              shipmentResponse || spinner
                                            }
                                            onChange={(e) => {
                                              setClicked(index);
                                              setCurrentStep(2);
                                              setCurrentFaq(2);

                                              e.target.value == "on"
                                                ? setSelectVendor(true)
                                                : "";
                                              setBooking((prev) => ({
                                                ...prev,
                                                courier_id: elem?.courier_id,
                                                courier_code: elem?.special_code
                                                  ? elem?.special_code.toLowerCase()
                                                  : elem?.special_code,
                                                courier_name:
                                                  elem?.product_name,
                                                courier_vendor_code:
                                                  elem?.product_code,
                                                shipment_charges: elem,
                                              }));

                                              if (currentFaq < 4) {
                                                setProductName(
                                                  elem?.product_name,
                                                );
                                              }
                                            }}
                                          />
                                        </Table.Td>
                                        <Table.Td className="border p-1 text-sm ">
                                          {elem?.parent_vendor}
                                        </Table.Td>
                                        <Table.Td className="border p-1 text-sm ">
                                          {elem?.product_name}
                                        </Table.Td>
                                        <Table.Td className="border p-1 text-sm whitespace-nowrap ">
                                          {indianFormat(
                                            Number(
                                              elem?.grand_total_with_gst_show,
                                            ),
                                          )}
                                          /-
                                        </Table.Td>
                                        <Table.Td className="border p-1 text-sm whitespace-nowrap">
                                          {Number(elem?.actual_weight).toFixed(
                                            2,
                                          )}
                                          kgs
                                        </Table.Td>
                                        <Table.Td className="border p-1 text-sm whitespace-nowrap">
                                          {elem?.tat_days} DAYS
                                        </Table.Td>
                                      </Table.Tr>
                                      {clicked === index && (
                                        <>
                                          <Table.Tr className="text-xs">
                                            <Table.Th className="whitespace-nowrap border">
                                              SR.No.
                                            </Table.Th>
                                            <Table.Th
                                              colSpan={3}
                                              className="whitespace-nowrap border"
                                            >
                                              PARTICULARS
                                            </Table.Th>
                                            <Table.Th
                                              colSpan={2}
                                              className="whitespace-nowrap border"
                                            >
                                              CHARGES
                                            </Table.Th>
                                          </Table.Tr>
                                          {elem?.selling_charges
                                            ?.filter(
                                              (item) =>
                                                item?.charge_amount_show != 0,
                                            )
                                            .map((item, index) => (
                                              <Table.Tr
                                                className="border p-1 text-xs"
                                                key={index}
                                              >
                                                <Table.Td className="border">
                                                  {index + 1}.
                                                </Table.Td>
                                                <Table.Td
                                                  colSpan={3}
                                                  className="border"
                                                >
                                                  {item?.charge_name}
                                                </Table.Td>
                                                <Table.Td
                                                  colSpan={2}
                                                  className="border"
                                                >
                                                  {Number(
                                                    Number(
                                                      item?.charge_amount_show,
                                                    ).toFixed(2),
                                                  ).toLocaleString("en-IN") ||
                                                    "-"}
                                                </Table.Td>
                                              </Table.Tr>
                                            ))}
                                          <Table.Tr className="border p-1 text-xs">
                                            <Table.Td className="border font-medium"></Table.Td>
                                            <Table.Td
                                              colSpan={3}
                                              className="border font-medium"
                                            >
                                              TOTAL
                                            </Table.Td>
                                            <Table.Td
                                              colSpan={2}
                                              className="border  font-medium"
                                            >
                                              {Number(
                                                Number(
                                                  elem?.grand_total_without_gst_show,
                                                ).toFixed(2),
                                              ).toLocaleString("en-IN") || "-"}
                                            </Table.Td>
                                          </Table.Tr>
                                        </>
                                      )}
                                    </>
                                  ))}
                              </Table.Tbody>
                            </Table>
                          </div>
                        ) : (
                          <>
                            <div className="py-3">
                              {isOverseas != "1" ? (
                                <p className="text-red-500 text-center  text-sm font-normal">
                                  * The prices shown here are exclusive of GST
                                </p>
                              ) : null}
                              <p className="text-red-500 text-center text-sm font-normal">
                                ** Estimated delivery is calculated from the
                                date of handover to vendor
                              </p>
                            </div>
                            {booking?.shipment_type != "4" &&
                              booking?.booking_type != "2" && (
                                <div className="py-3 flex justify-center">
                                  <FormSwitch>
                                    <FormSwitch.Label
                                      htmlFor="is_ddp"
                                      className={`${booking?.incoterm == 2
                                        ? "text-black"
                                        : "text-mustard font-bold text-base"
                                        } cursor-pointer hover:text-mustard mr-4`}
                                    >
                                      DDU
                                    </FormSwitch.Label>
                                    <FormSwitch.Input
                                      id="is_ddp"
                                      type="checkbox"
                                      checked={
                                        booking?.incoterm == 2 ? true : false
                                      }
                                      onChange={(e) => {
                                        setCurrentStep(2);
                                        setCurrentFaq(2);
                                        handleDataFilter(
                                          allVendorData,
                                          e.target.checked ? 2 : 1,
                                        );
                                        setBooking((prev) => ({
                                          ...prev,
                                          incoterm: e.target.checked ? 2 : 1,
                                          shipment_charges: {},
                                          courier_id: "",
                                          courier_code: "",
                                          courier_name: "",
                                          courier_vendor_code: "",
                                        }));
                                      }}
                                      disabled={
                                        shipmentResponse ||
                                          aclSpinner ||
                                          spinner
                                          ? true
                                          : false
                                      }
                                    />
                                    <FormSwitch.Label
                                      htmlFor="is_ddp"
                                      className={`${booking?.incoterm == 2
                                        ? "text-mustard font-bold text-base"
                                        : "text-black"
                                        }  cursor-pointer hover:text-mustard ml-4`}
                                    >
                                      DDP
                                    </FormSwitch.Label>
                                  </FormSwitch>
                                </div>
                              )}
                            <div className="overflow-x-auto">
                              <Table className="border text-center ">
                                <Table.Thead>
                                  <Table.Tr className="border p-1 text-sm text-center space-y-1">
                                    <Table.Th className="border p-1 text-sm"></Table.Th>
                                    <Table.Th className="border p-1 text-sm whitespace-nowrap">
                                      PRODUCT
                                    </Table.Th>
                                    <Table.Th className="border p-1 text-sm ">
                                      PRODUCT TYPE
                                    </Table.Th>
                                    <Table.Th className="border p-1 text-sm whitespace-nowrap">
                                      COST{" "}
                                      {isOverseas && currencyId
                                        ? `(${(
                                          currencyData?.find(
                                            (item) =>
                                              item?.id == currencyId,
                                          ) ??
                                          currencyData?.find(
                                            (item) => item?.id == 24,
                                          )
                                        )?.symbol || " "
                                        })`
                                        : "(₹)"}
                                    </Table.Th>
                                    <Table.Th className="border p-1 text-sm whitespace-nowrap">
                                      WEIGHT
                                    </Table.Th>
                                    <Table.Th className="border p-1 text-sm ">
                                      <p>
                                        ESTIMATED
                                        <span className="text-red-500 ml-1">
                                          **
                                        </span>
                                      </p>
                                      <p> DELIVERY</p>
                                    </Table.Th>
                                  </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody className="p-0 text-sm">
                                  {vendorData.length > 0 &&
                                    vendorData.map((elem, index) => (
                                      <Table.Tr
                                        className="border p-1 text-sm"
                                        key={index}
                                      >
                                        <Table.Td className="border p-1 text-sm">
                                          <FormCheck.Input
                                            id="radio-switch-1"
                                            type="radio"
                                            name="radio_button"
                                            checked={
                                              booking?.courier_id ==
                                              elem?.courier_id
                                            }
                                            disabled={
                                              shipmentResponse || spinner
                                            }
                                            onChange={(e) => {
                                              setCurrentStep(2);
                                              setCurrentFaq(2);

                                              e.target.value == "on"
                                                ? setSelectVendor(true)
                                                : "";

                                              setBooking((prev) => ({
                                                ...prev,
                                                courier_id: elem?.courier_id,
                                                courier_code: elem?.special_code
                                                  ? elem?.special_code.toLowerCase()
                                                  : elem?.special_code,
                                                courier_name:
                                                  elem?.product_name,
                                                courier_vendor_code:
                                                  elem?.product_code,
                                                shipment_charges: elem,
                                              }));
                                              if (currentFaq < 4) {
                                                setProductName(
                                                  elem?.product_name,
                                                );
                                              }
                                            }}
                                          />
                                        </Table.Td>
                                        <Table.Td className="border p-1 text-sm ">
                                          {elem?.parent_vendor}
                                        </Table.Td>
                                        <Table.Td className="border p-1 text-sm ">
                                          {elem?.product_name}
                                        </Table.Td>
                                        <Table.Td
                                          className="border p-1 text-sm whitespace-nowrap cursor-pointer text-blue-600"
                                          onClick={() => {
                                            setPriceDetailsData(elem);
                                            setPriceDetailsPreview(true);
                                          }}
                                        >
                                          {indianFormat(
                                            Number(
                                              elem?.grand_total_without_gst_show,
                                            ),
                                          )}
                                          /-
                                        </Table.Td>
                                        <Table.Td className="border p-1 text-sm whitespace-nowrap">
                                          {Number(elem?.actual_weight).toFixed(
                                            2,
                                          )}
                                          kgs
                                        </Table.Td>
                                        <Table.Td className="border p-1 text-sm whitespace-nowrap">
                                          {elem?.tat_days} DAYS
                                        </Table.Td>
                                      </Table.Tr>
                                    ))}
                                </Table.Tbody>
                              </Table>
                            </div>
                          </>
                        )}

                        <PriceDetailsModal
                          open={priceDetailsPreview}
                          priceDetailsData={priceDetailsData}
                          odcData={odcData}
                          onClose={() => setPriceDetailsPreview(false)}
                          currencySymbol={
                            isOverseas && currencyId
                              ? `(${(
                                currencyData?.find(
                                  (item) => item?.id == currencyId,
                                ) ??
                                currencyData?.find((item) => item?.id == 24)
                              )?.symbol || " "
                              })`
                              : "(₹)"
                          }
                        />

                        <div className="flex justify-end my-3">
                          <Button
                            elevated
                            rounded
                            disabled={
                              !selectVendor ||
                              shipmentResponse ||
                              spinner ||
                              aclSpinner
                            }
                            className="w-1/3 bg-mustard border-none text-white text-lg font-medium"
                            onClick={async (
                              e: React.MouseEvent<HTMLButtonElement>,
                            ) => {
                              if (booking?.courier_code.includes("skynet")) {
                                getSkynetCode();
                              } else if (
                                // booking?.courier_code.includes("dhl") ||
                                booking?.courier_code.includes("emirates") &&
                                (booking?.shipment_type == "1" ||
                                  booking?.shipment_type == "4" ||
                                  booking?.shipment_type == "7")
                              ) {
                                setCommodityPreview(true);
                              } else if (
                                booking?.courier_code.includes("widect")
                              ) {
                                if (
                                  booking?.destination_country_code == "GB" ||
                                  booking?.destination_country_code == "US"
                                ) {
                                  if (
                                    ![22, 48, 50].includes(
                                      Number(booking?.unit?.currency),
                                    )
                                  ) {
                                    setCurrentFaq(1);
                                    setCurrentStep(1);
                                    showAlert(
                                      "Only USD, EUR or GBP is allowed in currency",
                                      "warning",
                                    );
                                    return;
                                  }

                                  // if (
                                  //   booking?.destination_country_code ==
                                  //   "US"
                                  // ) {
                                  //   if (booking?.shipment_type == 2) {
                                  //     const isValid = validateDescription(
                                  //       booking?.description,
                                  //     );
                                  //     if (!isValid && !ignoreValidation) {
                                  //       setDescriptionError([
                                  //         {
                                  //           index: 0,
                                  //           description:
                                  //             booking?.description,
                                  //         },
                                  //       ]);
                                  //       setDescriptionModal(true);
                                  //       return;
                                  //     }
                                  //   } else {
                                  //     const invalidDescriptions =
                                  //       await dimensionData?.reduce(
                                  //         (
                                  //           acc: any,
                                  //           item: any,
                                  //           index: any,
                                  //         ) => {
                                  //           if (
                                  //             !validateDescription(
                                  //               item?.item_description,
                                  //             )
                                  //           ) {
                                  //             acc.push({
                                  //               index,
                                  //               description:
                                  //                 item?.item_description,
                                  //             });
                                  //           }
                                  //           return acc;
                                  //         },
                                  //         [],
                                  //       );

                                  //     if (
                                  //       invalidDescriptions.length > 0 &&
                                  //       !ignoreValidation
                                  //     ) {
                                  //       setDescriptionError(
                                  //         invalidDescriptions,
                                  //       );
                                  //       setDescriptionModal(true);
                                  //       return;
                                  //     }
                                  //   }
                                  // }
                                }
                                // if (
                                //   checkHsnLength(dimensionData || []) !=
                                //   true
                                // ) {
                                //   showAlert(
                                //     "Please provide a valid 10-digit HSN code for Widect",
                                //     "warning",
                                //   );
                                // }

                                if (!booking?.incoterm) {
                                  if (isRestricted) {
                                    setBooking({
                                      ...booking,
                                      incoterm: 1,
                                    });
                                    setShowField(true);
                                    showAlert(
                                      "DDU Incoterm is selected",
                                      "warning",
                                    );
                                    await checkProhibited();
                                    return;
                                  } else if (
                                    booking?.destination_country_code == "US"
                                  ) {
                                    setBooking({
                                      ...booking,
                                      incoterm: 2,
                                    });
                                    setShowField(true);
                                    showAlert(
                                      "DDP Incoterm is selected",
                                      "warning",
                                    );
                                    await checkProhibited();
                                    return;
                                  } else {
                                    setCurrentFaq(1);
                                    setCurrentStep(1);
                                    setShowField(true);
                                    showAlert(
                                      "Please select Incoterm",
                                      "warning",
                                    );
                                    return;
                                  }
                                } else {
                                  await checkProhibited();
                                }
                              } else if (
                                (booking?.courier_code.includes("heyword") ||
                                  booking?.courier_code.includes("ups") ||
                                  booking?.courier_code.includes("fedex")) &&
                                startPoint != "importlisting" &&
                                (booking?.shipment_type == "1" ||
                                  booking?.shipment_type == "6" ||
                                  booking?.shipment_type == "7")
                              ) {
                                setShipperPreview(!booking?.shipper_invoice);
                                if (booking?.shipper_invoice) {
                                  setShowField(false);
                                  checkAcl();
                                }
                              } else if (
                                booking?.courier_code.includes("dhl")
                              ) {
                                if (booking?.shipment_type == "2") {
                                  if (booking?.description.length > 90) {
                                    showAlert(
                                      "Description length should be less than 90 characters in Dhl",
                                      "warning",
                                    );
                                    setCurrentStep(1);
                                    setCurrentFaq(1);
                                  } else {
                                    delete booking?.invoiceData;
                                    setShowField(false);
                                    setShipperPreview(false);
                                    checkAcl();
                                  }
                                } else {
                                  const hasInvalid = dimensionData?.some((elem: any, index: any) => {
                                    if (elem?.item_description?.length > 90) {
                                      showAlert(
                                        "Description length should be less than 90 characters in Dhl",
                                        "warning",
                                      );
                                      setDimensionPreview(true);
                                      setIsEditDimension(true);
                                      setEditDimensionData(elem);
                                      setEditIndex(index);
                                      setCurrentStep(1);
                                      setCurrentFaq(1);

                                      return true; // 🚀 stops iteration immediately
                                    }
                                    return false;
                                  });

                                  if (!hasInvalid) {
                                    delete booking?.invoiceData;
                                    setShowField(false);
                                    setShipperPreview(false);
                                    checkAcl();
                                  }
                                }
                              } else {
                                delete booking?.invoiceData;
                                setShowField(false);
                                setShipperPreview(false);
                                checkAcl();
                              }
                            }}
                          >
                            {isDirectCust &&
                              availableCreditLimit <
                              booking?.shipment_charges
                                ?.grand_total_with_gst_show
                              ? "Add Money"
                              : "Next"}
                            {aclSpinner && (
                              <LoadingIcon
                                icon="puff"
                                color="white"
                                className="w-5 h-5 ml-2 stroke-2.5 text-white"
                              />
                            )}
                          </Button>

                          {paymentOpen && deviceType == "Desktop" && (
                            <PaymentModal
                              open={paymentOpen}
                              onClose={() => setPaymentOpen(false)}
                              amount={payableAmount}
                              setCurrentStep={setCurrentStep}
                              setCurrentFaq={setCurrentFaq}
                              handleFranchisee={handleFranchisee}
                            />
                          )}
                        </div>
                      </Disclosure.Panel>
                    )}
                  </div>
                )}
              </Disclosure>
            ) : (
              <div className="box text-red-500 font-medium text-lg w-[35%] h-36 md:flex  hidden items-center justify-center">
                Vendor Not Available for this region !!
              </div>
            )
          ) : null}
        </div>
      </div>
    </>
  );
}

export default main;
