import { Dialog } from "../../../../base-components/Headless";
import Button from "../../../../base-components/Button";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  InputGroup,
} from "../../../../base-components/Form";
import Lucide from "../../../../base-components/Lucide";
import { useEffect, useState } from "react";
import {
  consignerDocumentTypesApi,
  getConsignerDetailsApi,
  getCountryApi,
  getExportTypeApi,
  getInvoiceTermApi,
  getInvoiceTypeApi,
  getPUDaddressApi,
  getPickupTimeApi,
  getShipnstockStatesApi,
  gstApplicableApi,
  msmeData,
  purposeOfShipmentApi,
  taxPaymentOptionApi,
} from "../../../../AllServices/config.service";
import KycModal from "../KycModal";
import CommonModal from "../../../../components/CommonModal";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import {
  downloadAttachment,
  getCourierMaxLength,
  handleConditionalPaste,
  handlePaste,
  onlyNumbers,
} from "../../../../utils";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import { useFranchisee } from "../../../../ContextProvider/FranchiseeContext";
import CommonSearchableAll from "../../../../components/CommonSearchableAll/CommonSearchableAll";

interface SenderModalProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  setBooking: () => void;
  setSenderData: () => void;
}

const SenderModal: React.FC<SenderModalProps> = ({
  open,
  onClose,
  booking,
  setBooking,
  setSenderData,
}) => {
  const { branchId, isDirectCust, franchiseeId } = useFranchisee();
  const [spinner, setSpinner] = useState(false);
  const [docCheck, setDocCheck] = useState(null);
  const [gstApplicable, setGstApplicable] = useState([]);
  const [taxPaymentOption, setTaxPaymentOption] = useState([]);
  const [consignerDocTypes, setConsignerDocTypes] = useState([]);
  const [exportTypesData, setExportTypesData] = useState([]);
  const [kycModalPreview, setKycModalPreview] = useState<boolean>(false);
  const [pickupData, setPickupData] = useState([]);
  const [pudAddress, setPudAddress] = useState([]);
  const [flmEnable, setFlmEnable] = useState(0);
  const [contactEdit, setContactEdit] = useState(false);
  const [msmeId, setMsmeId] = useState("");
  const [msmeEdit, setMsmeEdit] = useState(false);
  const [msmeSpinner, setMsmeSpinner] = useState(false);
  const [shipperTypeConfirm, setShipperTypeConfirm] = useState(false);
  const [pendingShipperType, setPendingShipperType] = useState<any>(null);
  const [invoiceType, setInvoiceType] = useState([]);
  const [invoiceTerm, setInvoiceTerm] = useState([]);
  const { showAlert } = useAlert();
  const [region, setRegion] = useState("");
  const [shipmentPurpose, setShipmentPurpose] = useState([]);
  const restrictedCountries = ["BH", "IQ", "QA", "AE", "KW", "OM", "SA"];
  const isRestricted = restrictedCountries.includes(
    booking?.destination_country_code,
  );
  const isShipnstock = booking?.courier_code?.includes("shipnstock") && booking?.import_booking == 1;
  const [shipnstockStates, setShipnstockStates] = useState([]);
  const [stateSelecteddata, setStateSelecteddata] = useState<any>({
    name: "",
    id: "",
  });

  const getConsignerData = async (consigner_number: any = "") => {
    if (spinner) {
      return;
    }
    if (!senderDetails?.consigner_mobile_number && !booking?.is_ocr) {
      showAlert("Please enter mobile number", "error");
      return;
    }
    setSpinner(true);
    try {
      const response: any = await getConsignerDetailsApi(
        booking?.is_ocr == 1 && consigner_number ? consigner_number : senderDetails?.consigner_mobile_number,
        booking?.import_booking,
      );
      if (response?.data?.status == 200) {
        if (response?.data?.data?.kyc_details?.length == 0) {
          setContactEdit(true);
          // delete senderDetails?.kyc_details;
          setSenderDetails((prev) => ({
            ...prev,
            ...response?.data?.data,
            kyc_details: null,
          }));
        } else if (response?.data?.data?.kyc_details == undefined) {
          if (booking?.import_booking == 2) {
            setContactEdit(true);
            setSenderDetails((prev) => ({
              ...prev,
              ...response?.data?.data,
              kyc_details: null,
            }));
          } else {
            setContactEdit(true);
            setSenderDetails((prev) => ({
              ...prev,
              ...response?.data?.data,
            }));
          }
        } else {
          setContactEdit(true);
          setBooking((prev) => ({
            ...prev,
            kyc_details: response?.data?.data?.kyc_details,
          }));
          setSenderDetails((prev) => ({ ...prev, ...response?.data?.data }));
        }

        showAlert("Sender Details Found");
      } else if (response?.data?.status == 400) {
        showAlert(response?.data?.data[0]?.message, "error");
        // delete booking?.kyc_details;
        // delete senderDetails?.kyc_details;
        setBooking((prev) => ({
          ...prev,
          kyc_details: null,
        }));
        setSenderDetails((prev) => ({
          ...prev,
          kyc_details: null,
        }));
      } else {
        showAlert("Something Went Wrong 1", "error");
      }
    } catch (err: any) {
      showAlert("Something Went Wrong 2", "error");
    } finally {
      setSpinner(false);
    }
  };
  const getMsmeData = async () => {
    if (msmeSpinner) {
      return;
    }
    if (!msmeId) {
      showAlert("Please enter msme id", "error");
      return;
    }
    setMsmeSpinner(true);
    try {
      const response = await msmeData({
        franchisee_id: franchiseeId,
        msme_id: msmeId,
      });
      if (response?.status == 200) {
        if (response?.data?.data?.length > 0) {
          const msmeData = response?.data?.data[0];
          if (
            msmeData?.city == senderDetails?.consigner_city &&
            msmeData?.zipcode == senderDetails?.consigner_pincode
          ) {
            setSenderDetails((prev) => ({
              ...prev,
              consigner_mobile_number: msmeData?.mobile_number,
              consigner_email_id: msmeData?.customers_email,
              consigner_first_name: msmeData?.contact_person,
              consigner_company_name: msmeData?.company_name,
              consigner_address_1: msmeData?.address_1,
              consigner_address_2: msmeData?.address_2,
              consigner_doc_type: "1",
              consigner_gst_number: msmeData?.gstin_number,
            }));
            showAlert("Details Retrieved Successfully!!");
            setMsmeEdit(true);
          } else {
            showAlert(
              "The address field does not match the MSME registered data.",
              "warning",
            );
          }
        } else {
          showAlert(
            "MSME details not found. Please register the MSME.",
            "warning",
          );
        }
      } else if (response?.status == 202 || response?.status == 204) {
        showAlert(
          "MSME details not found. Please register the MSME.",
          "warning",
        );
      } else {
        showAlert(
          response?.data?.message ||
          response?.response?.data?.message ||
          response?.message,
          "error",
        );
      }
    } catch (err: any) {
      showAlert("Something Went Wrong", "error");
    } finally {
      setMsmeSpinner(false);
    }
  };
  const [senderDetails, setSenderDetails] = useState({
    consigner_mobile_number: booking?.consigner_mobile_number || "",
    consigner_email_id: booking?.consigner_email_id || "",
    consigner_first_name: booking?.consigner_first_name || "",
    consigner_company_name: booking?.consigner_company_name || "",
    consigner_address_1: booking?.consigner_address_1 || "",
    consigner_address_2: booking?.consigner_address_2 || "",
    consigner_pincode: booking?.origin_pincode || "",
    consigner_city: booking?.origin_city || "",
    consigner_state: isShipnstock
      ? ""
      : booking?.origin_state?.trim() ||
        booking?.origin_country_code?.trim() ||
        "",
    ...(isShipnstock ? { consigner_state_id: "" } : {}),
    consigner_doc_type: booking?.consigner_doc_type || "1",
    consigner_gst_applicable: booking?.consigner_gst_applicable || "",
    consigner_gst_number: booking?.consigner_gst_number || "",
    consigner_tax_payment: booking?.consigner_tax_payment || "",
    pickup_required: booking?.pickup_required || 2,
    pickup_location: booking?.pickup_location || "",
    pickup_name: booking?.pickup_name || "",
    pickup_address_1: booking?.pickup_address_1 || "",
    pickup_address_2: booking?.pickup_address_2 || "",
    pickup_pincode: booking?.origin_pincode,
    pickup_city: booking?.origin_city,
    pickup_state: booking?.origin_state,
    pickup_ready_start_time: booking?.pickup_ready_start_time || "",
    pickup_ready_end_time: "N.A.",
    kyc_details: booking?.kyc_details || "",
    kyc_message: booking?.kyc_message || true,
    ...(booking?.courier_code.includes("aramex") || booking?.courier_code.includes("sf_express")
      ? {
        tax_paid: booking?.tax_paid || "",
        tax_amount: booking?.tax_amount || "",
        ...(booking?.courier_code.includes("aramex") ? { export_type: booking?.export_type || "" } : {}),
        ...((booking?.courier_code.includes("sf_express") && booking?.import_booking == 2) ? { tax_id: booking?.tax_id || "" } : {}),
      }
      : {}),
    ...(booking?.courier_code.includes("dhl") &&
      (booking?.shipment_type == 1 || booking?.shipment_type == 2)
      ? {
        shipper_type: isDirectCust ? 1 : booking?.shipper_type || "",
        otp: "",
        shipment_purpose: booking?.shipment_purpose || "",
      }
      : {}),
    ...(booking?.booking_type == 1 && booking?.shipment_type == 7
      ? {
        ad_code: booking?.ad_code || "",
        iec_code: booking?.iec_code || "",
        invoice_type: booking?.invoice_type || "",
        invoice_term: booking?.invoice_term || "",
        iec_no: booking?.iec_no || "",
        iec_branch_code: booking?.iec_branch_code || "",
        export_using_ecommerce: booking?.export_using_ecommerce || "",
        meis_scheme: booking?.meis_scheme || "",
        export_is_payment: booking?.export_is_payment || "",
        bond_or_ut: booking?.bond_or_ut || "",
        total_igst: booking?.total_igst || "",
        total_cess: booking?.total_cess || "",
        uom: booking?.uom || "",
        bank_account_number: booking?.bank_account_number || "",
        nefi: booking?.nefi || "",
      }
      : {}),
    ...(booking?.courier_code.includes("widect")
      ? {
        business_number: booking?.business_number || "",
        rgr_number: booking?.rgr_number || "",
        ioss_number: booking?.ioss_number || "",
        vat_number: booking?.vat_number || "",
        eori_number: booking?.eori_number || "",
        market_place_vat_number: booking?.market_place_vat_number || "",
        sku: booking?.sku || "",
        ...(booking?.destination_country_code == "US"
          ? {
            manufacturer_id: booking?.manufacturer_id || "",
            iorr_number: booking?.iorr_number || "",
            poa: booking?.poa || "",
          }
          : {}),
      }
      : {}),
    ...(booking?.courier_code.includes("dhl") &&
      booking?.shipment_type == 1 &&
      booking?.destination_country_code == "US"
      ? { commodity_code: booking?.commodity_code || "" }
      : {}),
    ...(booking?.booking_type == 2
      ? {
        order_id: booking?.order_id || "",
        is_cod: booking?.is_cod || 0,
      }
      : {}),
  });

  const getData = () => {
    gstApplicableApi().then((res) => setGstApplicable(res?.data?.data));
    taxPaymentOptionApi().then((res) => setTaxPaymentOption(res?.data?.data));
    consignerDocumentTypesApi().then((res) => {
      setConsignerDocTypes(res?.data?.data);
    });

    getExportTypeApi().then((res) => setExportTypesData(res?.data?.data));
    getPickupTimeApi(booking?.origin_pincode).then((res) =>
      setPickupData(res?.data?.data),
    );
    {
      booking?.import_booking != 2 &&
        getPUDaddressApi(booking?.origin_pincode).then((res) => {
          if (res?.data?.data.length > 0) {
            setFlmEnable(res?.data?.data[0]?.flm_enable);
            setPudAddress(res?.data?.data[0]);
            if (res?.data?.data[0]?.flm_enable == 0) {
              setFlmEnable(0);
              setPudAddress([]);
              setSenderDetails((prev) => ({ ...prev, pickup_required: 2 }));
              setBooking((prev) => ({ ...prev, pickup_required: 2 }));
            }
          } else {
            setFlmEnable(0);
            setPudAddress([]);
            setSenderDetails((prev) => ({ ...prev, pickup_required: 2 }));
            setBooking((prev) => ({ ...prev, pickup_required: 2 }));
          }
        });
    }
    getInvoiceTermApi().then((res) => setInvoiceTerm(res?.data?.data || []));
    getInvoiceTypeApi().then((res) => setInvoiceType(res?.data?.data || []));
    getCountryApi(booking?.destination_country).then((res) => {
      setRegion(res?.data?.data[0]?.region?.toLowerCase() || "");
    });
    if (booking?.courier_code.includes("dhl")) {
      purposeOfShipmentApi().then((res) =>
        setShipmentPurpose(res?.data?.data || []),
      );
    }
  };

  const funStateSelect = (item: any) => {
    setSenderDetails((prev) => ({
      ...prev,
      consigner_state: item?.name || "",
      consigner_state_id: item?.id || "",
    }));
  };

  const funStateEmpty = () => {
    setSenderDetails((prev) => ({
      ...prev,
      consigner_state: "",
      consigner_state_id: "",
    }));
  };

  const handleValidate = (docNumber: string) => {
    if (docNumber == "") {
      setDocCheck(null);
      return;
    }
    if (senderDetails?.consigner_doc_type == 1 && docNumber) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
      const isValid = gstRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else if (senderDetails?.consigner_doc_type == 2 && docNumber) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

      const isValid = panRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else if (senderDetails?.consigner_doc_type == 3 && docNumber) {
      const passportRegex = /^[A-PR-WY-Z][1-9]\\d\\s?\\d{4}[1-9]$/;

      const isValid = passportRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else if (senderDetails?.consigner_doc_type == 4 && docNumber) {
      const aadhaarRegex = /^\d{12}$/;

      const isValid = aadhaarRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else if (
      (senderDetails?.consigner_doc_type == 5 ||
        senderDetails?.consigner_doc_type == 6 ||
        senderDetails?.consigner_doc_type == 7) &&
      docNumber
    ) {
      setDocCheck(true);
      return;
    } else if (senderDetails?.consigner_doc_type == 8 && docNumber) {
      const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;
      const isValid = tanRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else {
      setDocCheck(null);
      return;
    }
  };

  const handleClick = () => {
    if (booking?.courier_code.includes("dhl")) {
      const restrictedDocTypes = ["1", "6", "7", "8"];
      const docType = String(senderDetails?.consigner_doc_type);
      if (
        senderDetails?.shipper_type == 1 &&
        restrictedDocTypes.includes(docType)
      ) {
        showAlert(
          "consigner doc type is required",
          "error",
        );
        setSenderDetails((prev: any) => ({
          ...prev,
          consigner_doc_type: "",
        }));
        return;
      }
      if (
        senderDetails?.shipper_type == 2 &&
        !restrictedDocTypes.includes(docType)
      ) {
        showAlert(
          "consigner doc type is required",
          "error",
        );
        setSenderDetails((prev: any) => ({
          ...prev,
          consigner_doc_type: "",
        }));
        return;
      }
    }

    for (const key in senderDetails) {
      if (key == "otp" || key == "kyc_message" || key == "consigner_address_3") {
        continue;
      }

      if (
        booking?.booking_type == "2" &&
        (key == "consigner_tax_payment" ||
          key == "consigner_gst_applicable" ||
          key == "consigner_doc_type" ||
          key == "consigner_gst_number" ||
          key == "consigner_email_id" ||
          key == "kyc_details" ||
          key == "order_id" ||
          key == "is_cod")
      ) {
        continue;
      }
      if (booking?.import_booking == "2" && key == "kyc_details") {
        continue;
      }

      if (
        !booking?.courier_code.includes("dhl") &&
        !booking?.shipment_type == "1" &&
        !booking?.shipment_type == "2" &&
        (key == "shipper_type" || key == "shipment_purpose")
      ) {
        continue;
      }


      if (
        !booking?.courier_code.includes("dhl") &&
        !booking?.shipment_type == 1 &&
        !booking?.destination_country_code == "US" &&
        key == "commodity_code"
      ) {
        continue;
      }

      if (
        key == "business_number" ||
        key == "rgr_number" ||
        (key == "ioss_number" && booking?.destination_country_code == "GB") ||
        (key == "ioss_number" && isRestricted) ||
        (key == "ioss_number" &&
          (booking?.destination_country_code == "GB" ||
            booking?.destination_country_code == "US" ||
            region == "europe") &&
          booking?.incoterm == 2) ||
        (key == "vat_number" && isRestricted) ||
        (key == "vat_number" &&
          ((booking?.destination_country_code == "GB" &&
            booking?.incoterm == 2) ||
            booking?.destination_country_code == "US" ||
            (region == "europe" &&
              booking?.destination_country_code != "GB" &&
              (booking?.incoterm == 1 || booking?.incoterm == 2)))) ||
        (key == "ioss_number" &&
          region != "europe" &&
          booking?.incoterm != 1) ||
        (key == "vat_number" &&
          booking?.destination_country_code != "GB" &&
          booking?.incoterm != 1) ||
        key == "eori_number" ||
        key == "market_place_vat_number" ||
        key == "sku" ||
        key == "manufacturer_id" ||
        key == "iorr_number" ||
        key == "poa"
      ) {
        continue;
      }

      if (
        (key == "vat_number" || key == "ioss_number") &&
        booking?.destination_country_code == "US"
      ) {
        continue;
      }

      if (
        booking?.shipment_type == "2" &&
        !booking?.courier_code.includes("fedex") &&
        key == "kyc_details"
      ) {
        continue;
      }

      if (
        (flmEnable == 0 || senderDetails?.pickup_required == 2) &&
        key.includes("pickup_")
      ) {
        continue;
      }

      if (
        senderDetails?.pickup_required == 1 &&
        senderDetails?.pickup_location == 1
      ) {
        if (
          key == "pickup_name" ||
          key == "pickup_address_1" ||
          key == "pickup_address_2" ||
          key == "pickup_pincode" ||
          key == "pickup_city" ||
          key == "pickup_state"
        ) {
          continue;
        }
      }

      if (senderDetails?.tax_paid == 2 && key == "tax_amount") {
        continue;
      }
      if (
        (key == "ad_code" ||
          key == "iec_code" ||
          key == "invoice_type" ||
          key == "invoice_term" ||
          key == "iec_no" ||
          key == "iec_branch_code" ||
          key == "export_using_ecommerce" ||
          key == "meis_scheme" ||
          key == "export_is_payment" ||
          key == "bond_or_ut" ||
          key == "total_igst" ||
          key == "total_cess" ||
          key == "uom" ||
          key == "bank_account_number" ||
          key == "nefi") &&
        booking?.shipment_type != 7
      ) {
        continue;
      }
      if (
        senderDetails.hasOwnProperty(key) &&
        (senderDetails[key] === "" || !senderDetails[key])
      ) {
        showAlert(`${key.replaceAll("_", " ")} is required`, "error");
        return;
      }
    }
    if (
      shipment_value > 2500 &&
      booking?.import_booking == "2" &&
      booking?.courier_code.includes("fedex") &&
      Number(booking?.unit?.currency) == 48
    ) {
      if (booking?.origin_country_code == "US" && !senderDetails?.ei_number) {
        showAlert("ei number is required", "error");
        return;
      }
      if (booking?.origin_country_code == "CA" && !senderDetails?.cad_number) {
        showAlert("cad number is required", "error");
        return;
      }
    }
    setSenderData(senderDetails);
    setBooking((prev) => ({ ...prev, ...senderDetails }));
    onClose();
  };

  const applyShipperType = (newType: number) => {
    setSenderDetails((prev: any) => ({
      ...prev,
      shipper_type: newType,
      consigner_doc_type: "",
      ...(newType == 1 ? { otp: "" } : {}),
    }));
  };

  const handleShipperTypeSelect = (newType: number) => {
    const currentType = senderDetails?.shipper_type;
    if (currentType !== "" && currentType != null && Number(currentType) !== newType) {
      setPendingShipperType(newType);
      setShipperTypeConfirm(true);
    } else {
      applyShipperType(newType);
    }
  };

  const shipperTypeLabel: Record<number, string> = {
    1: "Individual",
    2: "MSME",
  };

  const shipperTypeRefersTo: Record<number, string> = {
    1: "a private person, not an organization",
    2: "an organization, not an individual person",
  };

  const ShipperTypeInfoText = ({ type }: { type: number }) => (
    <>
      By selecting{" "}
      <span className="font-bold text-blue-600">"{shipperTypeLabel[type]}"</span>
      , you confirm that the Shipper Name and Company Name refer to{" "}
      {shipperTypeRefersTo[type]}. If this cannot be verified and the
      information is found to be incorrect, a penalty may be applied for
      mis-declaration.
    </>
  );

  const closeShipperTypeConfirm = () => {
    setShipperTypeConfirm(false);
    setPendingShipperType(null);
  };

  const ShipperTypeConfirmTitle = (
    <span className="flex items-center gap-3">
      <span className="w-9 h-9 rounded-full bg-orange-100 inline-flex items-center justify-center flex-shrink-0">
        <Lucide icon="AlertTriangle" className="w-5 h-5 text-orange-500" />
      </span>
      <span className="text-gray-800">
        Change shipper type to{" "}
        <span className="text-blue-600">
          {shipperTypeLabel[pendingShipperType]}
        </span>
        ?
      </span>
    </span>
  );

  const ShipperTypeConfirmDescription = (
    <div>
      <p className="text-sm text-gray-600 mb-3">
        By selecting{" "}
        <span className="font-bold text-blue-600">
          {shipperTypeLabel[pendingShipperType]}
        </span>
        , you confirm that the Shipper Name and Company Name refer to{" "}
        {shipperTypeRefersTo[pendingShipperType]}.
      </p>
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <Lucide
          icon="AlertCircle"
          className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
        />
        <p className="text-xs text-amber-700">
          If this information cannot be verified or is found to be incorrect,
          a penalty may be applied for mis-declaration.
        </p>
      </div>
    </div>
  );

  const ShipperTypeConfirmFooter = (
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
        onClick={closeShipperTypeConfirm}
      >
        Cancel
      </Button>
      <Button
        type="button"
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 border-none"
        onClick={() => {
          applyShipperType(pendingShipperType);
          closeShipperTypeConfirm();
        }}
      >
        Confirm change
      </Button>
    </div>
  );

  const handleDataReset = () => {
    // delete senderDetails?.kyc_details;
    setMsmeId("");
    setMsmeEdit(false);
    setSenderData({});

    setSenderDetails((prev) => ({
      ...prev,
      consigner_mobile_number: "",
      consigner_email_id: "",
      consigner_first_name: "",
      consigner_company_name: "",
      consigner_address_1: "",
      consigner_address_2: "",
      ...(booking?.courier_code.includes("dhl") ? { consigner_address_3: "", } : {}),
      consigner_doc_type: "1",
      consigner_gst_applicable: "",
      consigner_gst_number: "",
      consigner_tax_payment: "",
      pickup_required: 2,
      pickup_location: "",
      pickup_name: "",
      pickup_address_1: "",
      pickup_address_2: "",
      pickup_pincode: "",
      pickup_city: "",
      pickup_state: "",
      pickup_ready_start_time: "",
      pickup_ready_end_time: "N.A.",
      kyc_details: "",
      kyc_message: booking?.kyc_message || true,
      ...(booking?.courier_code.includes("aramex") || booking?.courier_code.includes("sf_express")
        ? {
          tax_paid: "",
          tax_amount: "",
          ...(booking?.courier_code.includes("aramex") ? { export_type: booking?.export_type || "" } : {}),
          ...((booking?.courier_code.includes("sf_express") && booking?.import_booking == 2) ? { tax_id: booking?.tax_id || "" } : {}),
        }
        : {}),
      ...(booking?.courier_code.includes("dhl")
        ? {
          shipper_type: isDirectCust ? 1 : "",
          otp: "",
          shipment_purpose: "",
        }
        : {}),
      ...(booking?.booking_type == 1 && booking?.shipment_type == 7
        ? {
          ad_code: "",
          iec_code: "",
          invoice_type: "",
          invoice_term: "",
          iec_no: "",
          iec_branch_code: "",
          export_using_ecommerce: "",
          meis_scheme: "",
          export_is_payment: "",
          bond_or_ut: "",
          total_igst: "",
          total_cess: "",
          uom: "",
          bank_account_number: "",
          nefi: "",
        }
        : {}),
      ...(booking?.courier_code.includes("widect")
        ? {
          business_number: "",
          rgr_number: "",
          ioss_number: "",
          vat_number: "",
          eori_number: "",
          market_place_vat_number: "",
          sku: "",
          ...(booking?.destination_country_code == "US"
            ? {
              manufacturer_id: "",
              iorr_number: "",
              poa: "",
            }
            : {}),
        }
        : {}),
      ...(booking?.courier_code.includes("dhl") &&
        booking?.shipment_type == 1 &&
        booking?.destination_country_code == "US"
        ? { commodity_code: "" }
        : {}),
      ...(booking?.booking_type == 2
        ? {
          order_id: "",
          is_cod: 0,
        }
        : {}),
    }));

    // delete booking?.kyc_details;

    setBooking((prev) => ({
      ...prev,
      consigner_mobile_number: "",
      consigner_email_id: "",
      consigner_first_name: "",
      consigner_company_name: "",
      consigner_address_1: "",
      consigner_address_2: "",
      ...(booking?.courier_code.includes("dhl") ? { consigner_address_3: "", } : {}),
      consigner_pincode: "",
      consigner_city: "",
      consigner_state: "",
      consigner_doc_type: "1",
      consigner_gst_applicable: "",
      consigner_gst_number: "",
      consigner_tax_payment: "",
      pickup_required: "",
      pickup_location: "",
      pickup_name: "",
      pickup_address_1: "",
      pickup_address_2: "",
      pickup_pincode: "",
      pickup_city: "",
      pickup_state: "",
      pickup_ready_start_time: "",
      pickup_ready_end_time: "N.A.",
      kyc_details: {
        document_id_1: "",
        document_id_2: "",
        document_path_1: "",
        document_path_2: "",
        orgnization_id: "",
      },
      kyc_message: booking?.kyc_message || true,
      ...(booking?.courier_code.includes("aramex") || booking?.courier_code.includes("sf_express")
        ? {
          tax_paid: "",
          tax_amount: "",
          ...(booking?.courier_code.includes("aramex") ? { export_type: "" } : {}),
          ...((booking?.courier_code.includes("sf_express") && booking?.import_booking == 2) ? { tax_id: "" } : {}),
        }
        : {}),
      ...(booking?.courier_code.includes("dhl")
        ? {
          shipper_type: isDirectCust ? 1 : "",
          otp: "",
          shipment_purpose: "",
        }
        : {}),
      ...(booking?.booking_type == 1 && booking?.shipment_type == 7
        ? {
          ad_code: "",
          iec_code: "",
          invoice_type: "",
          invoice_term: "",
          iec_no: "",
          iec_branch_code: "",
          export_using_ecommerce: "",
          meis_scheme: "",
          export_is_payment: "",
          bond_or_ut: "",
          total_igst: "",
          total_cess: "",
          uom: "",
          bank_account_number: "",
          nefi: "",
        }
        : {}),
      ...(booking?.courier_code.includes("widect")
        ? {
          business_number: "",
          rgr_number: "",
          ioss_number: "",
          vat_number: "",
          eori_number: "",
          market_place_vat_number: "",
          sku: "",
          ...(booking?.destination_country_code == "US"
            ? {
              consignor_id: "",
              manufacturer_id: "",
            }
            : {}),
        }
        : {}),
      ...(booking?.courier_code.includes("dhl") &&
        booking?.shipment_type == 1 &&
        booking?.destination_country_code == "US"
        ? { commodity_code: "" }
        : {}),
    }));

    setContactEdit(false);
  };

  const dimensions = JSON.parse(
    booking?.shipment_dimensions || "[]"
  );

  const shipment_value = dimensions?.reduce(
    (sum: number, item: any) => sum + (Number(item?.value) || 0),
    0
  );

  useEffect(() => {
    if (booking?.is_ocr == 1) {
      setSenderDetails((prev) => ({
        ...prev,
        ...booking?.senderData
      }));
    }
  }, []);


  useEffect(() => {
    getData();

    if (isShipnstock) {
      getShipnstockStatesApi(101).then((res) => {
        setShipnstockStates(res?.data?.states || []);
      });
    }
  }, []);

  return (
    <Dialog staticBackdrop open={open} onClose={onClose} size="lg">
      <Dialog.Panel className={"mt-4"}>
        <Dialog.Title className="flex justify-between">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            <h2 className="mr-auto text-base font-medium whitespace-nowrap">
              Sender Details
            </h2>

            {booking?.import_booking == 1 &&
              (booking?.kyc_details?.document_id_1 &&
                booking?.kyc_details?.document_id_2 ? (
                <>
                  {senderDetails?.kyc_details?.document_path_1 && (
                    <Button
                      className="text-white bg-mustard p-[2px] md:p-2"
                      size="sm"
                      onClick={() =>
                        downloadAttachment(
                          senderDetails?.kyc_details?.document_path_1,
                          "document_1",
                        )
                      }
                    >
                      KYC Document 1
                    </Button>
                  )}

                  {senderDetails?.kyc_details?.document_path_2 && (
                    <Button
                      className="text-white bg-mustard p-[2px] md:p-2"
                      size="sm"
                      onClick={() =>
                        downloadAttachment(
                          senderDetails?.kyc_details?.document_path_2,
                          "document_2",
                        )
                      }
                    >
                      KYC Document 2
                    </Button>
                  )}

                  <Button
                    className="text-white bg-blue-500 p-[2px] md:p-2"
                    size="sm"
                    onClick={() => {
                      setKycModalPreview(true);
                    }}
                  >
                    <Lucide icon="Edit" className="w-4 h-4 mx-1 stroke-2.5" />
                    Edit KYC
                  </Button>
                </>
              ) : (
                <Button
                  className="text-white bg-blue-500 "
                  size="sm"
                  onClick={() => {
                    setKycModalPreview(true);
                  }}
                >
                  <Lucide icon="Upload" className="w-4 h-4 mr-2 stroke-2.5" />
                  UPLOAD KYC
                </Button>
              ))}

            {kycModalPreview && (
              <KycModal
                open={kycModalPreview}
                setSenderDetails={setSenderDetails}
                setBooking={setBooking}
                onClose={() => setKycModalPreview(false)}
                booking={booking}
              />
            )}
          </div>
          <Lucide
            icon="XCircle"
            className="w-5 h-5 cursor-pointer"
            onClick={onClose}
          />
        </Dialog.Title>
        <Dialog.Description className="overflow-y-auto h-[65vh]">
          <div className="grid grid-cols-12 gap-6 gap-y-3 ">
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-1">
                MOBILE NO <span className="text-red-500">*</span>
              </FormLabel>
              <InputGroup>
                <FormInput
                  id="modal-form-1"
                  type="text"
                  placeholder="Mobile No."
                  maxLength={booking?.import_booking == 2 ? 15 : 10}
                  disabled={contactEdit}
                  value={senderDetails?.consigner_mobile_number}
                  onKeyDown={(e) => onlyNumbers(e)}
                  onChange={(e) =>
                    setSenderDetails({
                      ...senderDetails,
                      consigner_mobile_number: e.target.value,
                    })
                  }
                />
                {booking?.is_ocr != 1 && (contactEdit ? (
                  <InputGroup.Text
                    id="input-group-price"
                    className="bg-red-500 text-white  cursor-pointer border-red-500 rounded-r-xl"
                    onClick={handleDataReset}
                  >
                    RESET
                  </InputGroup.Text>
                ) : (
                  <InputGroup.Text
                    id="input-group-price"
                    className="bg-blue-500 text-white  cursor-pointer border-blue-500 rounded-r-xl flex "
                    onClick={getConsignerData}
                  >
                    CHECK{" "}
                    {spinner && (
                      <LoadingIcon
                        icon="puff"
                        color="white"
                        className="w-5 h-5 ml-2 stroke-2.5 text-white"
                      />
                    )}
                  </InputGroup.Text>
                ))}
              </InputGroup>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-4">
                EMAIL
                {booking?.booking_type == "1" && (
                  <span className="text-red-500">*</span>
                )}
              </FormLabel>
              <FormInput
                id="modal-form-4"
                type="email"
                placeholder="Email"
                value={senderDetails?.consigner_email_id}
                onChange={(e) =>
                  setSenderDetails({
                    ...senderDetails,
                    consigner_email_id: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-3">
                FULL NAME <span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                id="modal-form-3"
                type="text"
                placeholder="Full Name"
                value={senderDetails?.consigner_first_name}
                onChange={(e) =>
                  setSenderDetails({
                    ...senderDetails,
                    consigner_first_name: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-2">
                COMPANY NAME <span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                id="modal-form-2"
                type="text"
                placeholder="Company Name"
                value={senderDetails?.consigner_company_name}
                maxLength={booking?.courier_code?.includes("fedex") && 35}
                onPaste={(e) => {
                  if (booking?.courier_code?.includes("fedex")) {
                    e.preventDefault();
                    const data = handlePaste(
                      senderDetails?.consigner_company_name,
                      e,
                      35,
                    );
                    setSenderDetails((prev) => ({
                      ...prev,
                      consigner_company_name: data,
                    }));
                  }
                }}
                onChange={(e) =>
                  setSenderDetails({
                    ...senderDetails,
                    consigner_company_name: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">
                FLAT/HOUSE NO. <span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                id="modal-form-5"
                type="text"
                placeholder="Flat/House No."
                value={senderDetails?.consigner_address_1}
                maxLength={getCourierMaxLength(booking?.courier_code?.toLowerCase())}
                onPaste={(e) =>
                  handleConditionalPaste({
                    key: "consigner_address_1",
                    state: senderDetails,
                    setState: setSenderDetails,
                    event: e,
                    courierCode: booking?.courier_code?.toLowerCase(),
                  })
                }
                onChange={(e) =>
                  setSenderDetails({
                    ...senderDetails,
                    consigner_address_1: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">
                STREET/LOCALITY <span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                id="modal-form-5"
                type="text"
                placeholder="Street/Locality"
                value={senderDetails?.consigner_address_2}
                maxLength={getCourierMaxLength(booking?.courier_code?.toLowerCase())}
                onPaste={(e) =>
                  handleConditionalPaste({
                    key: "consigner_address_2",
                    state: senderDetails,
                    setState: setSenderDetails,
                    event: e,
                    courierCode: booking?.courier_code?.toLowerCase(),
                  })
                }
                onChange={(e) =>
                  setSenderDetails({
                    ...senderDetails,
                    consigner_address_2: e.target.value,
                  })
                }
              />
            </div>
            {booking?.courier_code.includes("dhl") ?
              (<div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-add-3">
                  ADDRESS 3
                </FormLabel>
                <FormInput
                  id="modal-form-add-3"
                  type="text"
                  placeholder="Address 3"
                  value={senderDetails?.consigner_address_3}
                  maxLength={getCourierMaxLength(booking?.courier_code?.toLowerCase())}
                  onPaste={(e) =>
                    handleConditionalPaste({
                      key: "consigner_address_3",
                      state: senderDetails,
                      setState: setSenderDetails,
                      event: e,
                      courierCode: booking?.courier_code?.toLowerCase(),
                    })
                  }
                  onChange={(e) =>
                    setSenderDetails({
                      ...senderDetails,
                      consigner_address_3: e.target.value,
                    })
                  }
                />
              </div>) : null}

            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">
                PINCODE <span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="text"
                value={senderDetails?.consigner_pincode}
                disabled
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">
                CITY <span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="text"
                value={senderDetails?.consigner_city}
                disabled
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">
                STATE <span className="text-red-500">*</span>
              </FormLabel>
              {isShipnstock ? (
                <CommonSearchableAll
                  localData={shipnstockStates}
                  zIndex="20"
                  selecteddata={stateSelecteddata}
                  setSelecteddata={setStateSelecteddata}
                  fun1={funStateSelect}
                  funtoempty={funStateEmpty}
                  comingselectedname={"name"}
                  comingselectedid={"id"}
                />
              ) : (
                <FormInput
                  type="text"
                  value={senderDetails?.consigner_state}
                  disabled
                />
              )}
            </div>

            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-6">
                DOCUMENT TYPE{" "}
                {booking?.booking_type == "1" && (
                  <span className="text-red-500">*</span>
                )}
              </FormLabel>
              <FormSelect
                id="modal-form-6"
                value={senderDetails?.consigner_doc_type}
                onChange={(e) =>
                  setSenderDetails((prev) => ({
                    ...prev,
                    consigner_doc_type: e.target.value,
                  }))
                }
              >
                <option value="">Select Document Type</option>
                {consignerDocTypes &&
                  consignerDocTypes
                    ?.filter((elem) => {
                      if (booking?.courier_code.includes("dhl")) {
                        if (senderDetails?.shipper_type == 1) {
                          return !["1", "6", "7", "8"].includes(
                            String(elem?.id),
                          );
                        } else if (senderDetails?.shipper_type == 2) {
                          return ["1", "6", "7", "8"].includes(
                            String(elem?.id),
                          );
                        }
                      }
                      return true;
                    })
                    ?.map((elem, index) => (
                      <option value={elem?.id} key={index}>
                        {elem?.value}
                      </option>
                    ))}
              </FormSelect>
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">
                {(consignerDocTypes &&
                  consignerDocTypes?.find(
                    (elem) => elem.id == senderDetails?.consigner_doc_type,
                  )?.value) ||
                  "Please select a document type"}
                {booking?.booking_type == "1" && (
                  <span className="text-red-500">*</span>
                )}
              </FormLabel>

              <InputGroup>
                <FormInput
                  type="text"
                  value={senderDetails?.consigner_gst_number}
                  maxLength={
                    senderDetails?.consigner_doc_type == "1"
                      ? 15
                      : senderDetails?.consigner_doc_type == "2"
                        ? 10
                        : senderDetails?.consigner_doc_type == "3"
                          ? 9
                          : senderDetails?.consigner_doc_type == "4"
                            ? 12
                            : senderDetails?.consigner_doc_type == "8"
                              ? 10
                              : undefined
                  }
                  onChange={(e) =>
                    setSenderDetails((prev) => ({
                      ...prev,
                      consigner_gst_number: e.target.value,
                    }))
                  }
                  onBlur={(e) => handleValidate(e.target.value)}
                  className="uppercase"
                />
                <InputGroup.Text
                  id="input-group-price"
                  className="py-2 px-3 w-14"
                >
                  {" "}
                  {senderDetails?.consigner_gst_number && docCheck == true && (
                    <Lucide
                      icon="Check"
                      className="text-green-500 stroke-2.5  h-5"
                    />
                  )}
                  {senderDetails?.consigner_gst_number && docCheck == false && (
                    <Lucide icon="X" className="text-red-500 stroke-2.5  h-5" />
                  )}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {booking?.booking_type == 1 && booking?.shipment_type == 7 && (
              <>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="ad_code">
                    AD CODE <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="ad_code"
                    value={senderDetails?.ad_code}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        ad_code: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="iec_code">
                    IEC CODE (Import Export Code){" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    name="iec_code"
                    value={senderDetails?.iec_code}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        iec_code: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-6">
                    Invoice Type <span className="text-red-500">*</span>{" "}
                  </FormLabel>
                  <FormSelect
                    id="modal-form-6"
                    value={senderDetails?.invoice_type}
                    onChange={(e) =>
                      setSenderDetails((prev) => ({
                        ...prev,
                        invoice_type: e.target.value,
                      }))
                    }
                  >
                    <option value={""}>Select Invoice Type</option>
                    {invoiceType?.map((elem, index) => (
                      <option value={elem?.id} key={index}>
                        {elem?.invoice_type}
                      </option>
                    ))}
                  </FormSelect>
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-6">
                    Invoice Term <span className="text-red-500">*</span>{" "}
                  </FormLabel>
                  <FormSelect
                    id="modal-form-6"
                    value={senderDetails?.invoice_term}
                    onChange={(e) =>
                      setSenderDetails((prev) => ({
                        ...prev,
                        invoice_term: e.target.value,
                      }))
                    }
                  >
                    <option value={""}>Select Invoice Term</option>
                    {invoiceTerm?.map((elem, index) => (
                      <option value={elem?.id} key={index}>
                        {elem?.invoice_term}
                      </option>
                    ))}
                  </FormSelect>
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-5">
                    IEC No of the Exporter{" "}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    value={senderDetails?.iec_no}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        iec_no: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-5">
                    IEC Branch code <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    value={senderDetails?.iec_branch_code}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        iec_branch_code: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="export_using_ecommerce_radio_button">
                    {" "}
                    Whether export using ecommerce{" "}
                    <span className="text-red-400">*</span>
                  </FormLabel>
                  <div className="flex flex-row gap-10">
                    <FormCheck className="m-2">
                      <FormCheck.Input
                        id="radio-switch-1"
                        type="radio"
                        name="export_using_ecommerce_radio_button"
                        checked={senderDetails?.export_using_ecommerce == 1}
                        onClick={() =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            export_using_ecommerce: 1,
                          }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-1">
                        Yes
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="mr-2 ">
                      <FormCheck.Input
                        id="radio-switch-2"
                        type="radio"
                        name="export_using_ecommerce_radio_button"
                        checked={senderDetails?.export_using_ecommerce == 2}
                        onClick={() =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            export_using_ecommerce: 2,
                          }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-2">
                        No
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="meis_scheme_radio_button">
                    {" "}
                    Whether under MEIS scheme{" "}
                    <span className="text-red-400">*</span>
                  </FormLabel>
                  <div className="flex flex-row gap-10">
                    <FormCheck className="m-2">
                      <FormCheck.Input
                        id="radio-switch-1"
                        type="radio"
                        name="meis_scheme_radio_button"
                        checked={senderDetails?.meis_scheme == 1}
                        onClick={() =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            meis_scheme: 1,
                          }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-1">
                        Yes
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="mr-2 ">
                      <FormCheck.Input
                        id="radio-switch-2"
                        type="radio"
                        name="meis_scheme_radio_button"
                        checked={senderDetails?.meis_scheme == 2}
                        onClick={() =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            meis_scheme: 2,
                          }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-2">
                        No
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="export_is_payment_radio_button">
                    {" "}
                    Whether Supply for export is on payment of IGST{" "}
                    <span className="text-red-400">*</span>
                  </FormLabel>
                  <div className="flex flex-row gap-10">
                    <FormCheck className="m-2">
                      <FormCheck.Input
                        id="radio-switch-1"
                        type="radio"
                        name="export_is_payment_radio_button"
                        checked={senderDetails?.export_is_payment == 1}
                        onClick={() =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            export_is_payment: 1,
                          }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-1">
                        Yes
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="mr-2 ">
                      <FormCheck.Input
                        id="radio-switch-2"
                        type="radio"
                        name="export_is_payment_radio_button"
                        checked={senderDetails?.export_is_payment == 2}
                        onClick={() =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            export_is_payment: 2,
                          }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-2">
                        No
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="bond_or_ut_radio_button">
                    {" "}
                    Whether against Bond or UT{" "}
                    <span className="text-red-400">*</span>
                  </FormLabel>
                  <div className="flex flex-row gap-10">
                    <FormCheck className="m-2">
                      <FormCheck.Input
                        id="radio-switch-1"
                        type="radio"
                        name="bond_or_ut_radio_button"
                        checked={senderDetails?.bond_or_ut == 1}
                        onClick={() =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            bond_or_ut: 1,
                          }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-1">
                        Yes
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="mr-2 ">
                      <FormCheck.Input
                        id="radio-switch-2"
                        type="radio"
                        name="bond_or_ut_radio_button"
                        checked={senderDetails?.bond_or_ut == 2}
                        onClick={() =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            bond_or_ut: 2,
                          }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-2">
                        No
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-5">
                    Total IGST paid <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    value={senderDetails?.total_igst}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        total_igst: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-5">
                    Total Cess Paid <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    value={senderDetails?.total_cess}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        total_cess: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-5">
                    UOM <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    value={senderDetails?.uom}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        uom: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-5">
                    Bank A/C Number <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    value={senderDetails?.bank_account_number}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        bank_account_number: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-5">
                    NFEI <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    value={senderDetails?.nefi}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        nefi: e.target.value,
                      })
                    }
                  />
                </div>
              </>
            )}
            {booking?.booking_type == "1" && (
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-6">
                  GST APPLICABLE ON INVOICE{" "}
                  <span className="text-red-500">*</span>{" "}
                </FormLabel>
                <FormSelect
                  id="modal-form-6"
                  value={senderDetails?.consigner_gst_applicable}
                  onChange={(e) =>
                    setSenderDetails((prev) => ({
                      ...prev,
                      consigner_gst_applicable: e.target.value,
                    }))
                  }
                >
                  <option value=""> Select</option>
                  {gstApplicable &&
                    gstApplicable.map((elem, index) => (
                      <option value={elem?.id} key={index}>
                        {elem?.value}
                      </option>
                    ))}
                </FormSelect>
              </div>
            )}

            {booking?.booking_type == "1" && (
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-6">
                  TAX PAYMENT OPTION{" "}
                  <span className="text-red-500">*</span>{" "}
                </FormLabel>
                <FormSelect
                  id="modal-form-6"
                  value={senderDetails?.consigner_tax_payment}
                  onChange={(e) =>
                    setSenderDetails((prev) => ({
                      ...prev,
                      consigner_tax_payment: e.target.value,
                    }))
                  }
                >
                  <option value=""> Select</option>
                  {taxPaymentOption &&
                    taxPaymentOption.map((elem, index) => (
                      <option value={elem?.id} key={index}>
                        {elem?.value}
                      </option>
                    ))}
                </FormSelect>
              </div>
            )}
            {(booking?.courier_code.includes("aramex") || booking?.courier_code.includes("sf_express")) && (
              <>

                {booking?.courier_code.includes("aramex") ? (<div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-6">
                    EXPORT TYPE <span className="text-red-500">*</span>{" "}
                  </FormLabel>
                  <FormSelect
                    id="modal-form-6"
                    value={senderDetails?.export_type}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        export_type: e.target.value,
                      })
                    }
                  >
                    <option value=""> Select</option>
                    {exportTypesData &&
                      exportTypesData.map((elem, index) => (
                        <option value={elem?.id} key={index}>
                          {elem?.value}
                        </option>
                      ))}
                  </FormSelect>
                </div>) : null}

                {(booking?.courier_code.includes("sf_express") && booking?.import_booking == 2) ? (<div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-5-tax_id">
                    TAX ID <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    id="modal-form-5-tax_id"
                    type="text"
                    placeholder="Enter TAX ID"
                    value={senderDetails?.tax_id}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        tax_id: e.target.value,
                      })
                    }
                  />
                </div>) : null}

                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-1">
                    {" "}
                    TAX PAID <span className="text-red-400">*</span>
                  </FormLabel>
                  <div className="flex flex-row gap-10">
                    <FormCheck className="m-2">
                      <FormCheck.Input
                        id="radio-switch-1"
                        type="radio"
                        name="tax_paid_radio_button"
                        checked={senderDetails?.tax_paid == 1}
                        onClick={() =>
                          setSenderDetails((prev) => ({ ...prev, tax_paid: 1 }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-1">
                        Yes
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="mr-2 ">
                      <FormCheck.Input
                        id="radio-switch-2"
                        type="radio"
                        name="tax_paid_radio_button"
                        checked={senderDetails?.tax_paid == 2}
                        onClick={() =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            tax_paid: 2,
                          }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-2">
                        No
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                </div>
                {senderDetails?.tax_paid == 1 && (
                  <div className="col-span-12 sm:col-span-6">
                    <FormLabel htmlFor="modal-form-5">
                      TAX AMOUNT <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      id="modal-form-5"
                      type="number"
                      placeholder=""
                      value={senderDetails?.tax_amount}
                      onChange={(e) =>
                        setSenderDetails({
                          ...senderDetails,
                          tax_amount: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </>
            )}

            {shipment_value > 2500 && booking?.import_booking == "2" && booking?.courier_code.includes("fedex") && Number(booking?.unit?.currency) == 48 ? (
              <>
                {booking?.origin_country_code == "US" ?
                  <div className="col-span-12 sm:col-span-6">
                    <FormLabel htmlFor="ei_number">EI NUMBER{" "}
                      <span className="text-red-500">*</span>{" "}</FormLabel>
                    <FormInput
                      id="ei_number"
                      type="text"
                      placeholder="Enter EI NUMBER"
                      value={senderDetails?.ei_number}
                      onChange={(e) =>
                        setSenderDetails((prev) => ({
                          ...prev,
                          ei_number: e.target.value,
                        }))
                      }
                    />
                  </div> : null}
                {booking?.origin_country_code == "CA" ?
                  <div className="col-span-12 sm:col-span-6">
                    <FormLabel htmlFor="cad_number">CAD NUMBER{" "}
                      <span className="text-red-500">*</span>{" "}</FormLabel>
                    <FormInput
                      id="cad_number"
                      type="text"
                      placeholder="Enter CAD NUMBER"
                      value={senderDetails?.cad_number}
                      onChange={(e) =>
                        setSenderDetails((prev) => ({
                          ...prev,
                          cad_number: e.target.value,
                        }))
                      }
                    />
                  </div> : null}
              </>
            ) : null}


            {flmEnable == 1 && (
              <>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-1">
                    {" "}
                    PICKUP REQUIRED <span className="text-red-400">*</span>
                  </FormLabel>
                  <div className="flex flex-row gap-10">
                    <FormCheck className="m-2">
                      <FormCheck.Input
                        id="radio-switch-1"
                        type="radio"
                        name="pickup_required_radio_button"
                        checked={senderDetails?.pickup_required == 1}
                        onClick={() =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            pickup_required: 1,
                          }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-1">
                        Yes
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="mr-2">
                      <FormCheck.Input
                        id="radio-switch-2"
                        type="radio"
                        name="pickup_required_radio_button"
                        checked={senderDetails?.pickup_required == 2}
                        onClick={() =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            pickup_required: 2,
                          }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-2">
                        No
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                </div>

                {senderDetails?.pickup_required == 1 && (
                  <>
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="modal-form-2">
                        {" "}
                        PICKUP LOCATION <span className="text-red-400">*</span>
                      </FormLabel>
                      <div className="flex flex-col sm:flex-row gap-10 whitespace-nowrap">
                        <FormCheck className="m-2">
                          <FormCheck.Input
                            id="radio-switch-a"
                            type="radio"
                            name="pickup_location_radio_button"
                            checked={senderDetails?.pickup_location == 1}
                            onClick={() =>
                              setSenderDetails((prev) => ({
                                ...prev,
                                pickup_location: 1,
                              }))
                            }
                          />
                          <FormCheck.Label htmlFor="radio-switch-a">
                            Same as Origin
                          </FormCheck.Label>
                        </FormCheck>
                        <FormCheck className="mt-2 mr-2 sm:mt-0">
                          <FormCheck.Input
                            id="radio-switch-b"
                            type="radio"
                            name="pickup_location_radio_button"
                            checked={senderDetails?.pickup_location == 2}
                            onClick={() =>
                              setSenderDetails((prev) => ({
                                ...prev,
                                pickup_location: 2,
                              }))
                            }
                          />
                          <FormCheck.Label htmlFor="radio-switch-b">
                            Different
                          </FormCheck.Label>
                        </FormCheck>
                      </div>
                    </div>

                    {senderDetails.pickup_location == 2 && (
                      <>
                        <div className="col-span-12 sm:col-span-6">
                          <FormLabel htmlFor="modal-form-5">
                            PICKUP PINCODE{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormInput
                            id="modal-form-5"
                            type="text"
                            value={senderDetails?.pickup_pincode}
                            disabled
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                          <FormLabel htmlFor="modal-form-5">
                            PICKUP CITY <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormInput
                            id="modal-form-5"
                            type="text"
                            value={senderDetails?.pickup_city}
                            disabled
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                          <FormLabel htmlFor="modal-form-5">
                            PICKUP STATE <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormInput
                            id="modal-form-5"
                            type="text"
                            value={senderDetails?.pickup_state}
                            disabled
                          />
                        </div>

                        <div className="col-span-12 sm:col-span-6">
                          <FormLabel htmlFor="modal-form-5">
                            NAME <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormInput
                            id="modal-form-5"
                            type="text"
                            value={senderDetails?.pickup_name}
                            onChange={(e) =>
                              setSenderDetails((prev) => ({
                                ...prev,
                                pickup_name: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                          <FormLabel htmlFor="modal-form-5">
                            STREET LINE 1{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormInput
                            id="modal-form-5"
                            type="text"
                            value={senderDetails?.pickup_address_1}
                            onChange={(e) =>
                              setSenderDetails((prev) => ({
                                ...prev,
                                pickup_address_1: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                          <FormLabel htmlFor="modal-form-5">
                            STREET LINE 2{" "}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormInput
                            id="modal-form-5"
                            type="text"
                            value={senderDetails?.pickup_address_2}
                            onChange={(e) =>
                              setSenderDetails((prev) => ({
                                ...prev,
                                pickup_address_2: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </>
                    )}
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="modal-form-6">
                        PICKUP READY START & END TIME{" "}
                        <span className="text-red-500">*</span>{" "}
                      </FormLabel>
                      <FormSelect
                        id="modal-form-6"
                        value={senderDetails?.pickup_ready_start_time}
                        onChange={(e) =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            pickup_ready_start_time: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Time</option>
                        {pickupData &&
                          pickupData?.map((ele, index) => (
                            <option key={index} value={ele?.value}>
                              {ele?.value}
                            </option>
                          ))}
                      </FormSelect>
                    </div>

                    {/* <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="modal-form-6">
                        PICKUP READY END TIME{" "}
                        <span className="text-red-500">*</span>{" "}
                      </FormLabel>
                      <FormSelect
                        id="modal-form-6"
                        value={senderDetails?.pickup_ready_end_time}
                        disabled={senderDetails?.pickup_ready_start_time == ""}
                        onChange={(e) =>
                          setSenderDetails((prev) => ({
                            ...prev,
                            pickup_ready_end_time: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select Time</option>
                        {pickupData &&
                          pickupData.map(
                            (ele, index) =>
                              ele?.value >
                                senderDetails?.pickup_ready_start_time && (
                                <option key={index} value={ele?.value}>
                                  {ele?.value}
                                </option>
                              )
                          )}
                      </FormSelect>
                    </div> */}
                  </>
                )}
              </>
            )}

            {booking?.booking_type == "2" && (
              <>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="order_id">ORDER ID</FormLabel>
                  <FormInput
                    id="order_id"
                    type="text"
                    placeholder="Enter Order ID"
                    value={senderDetails?.order_id}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        order_id: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="is_cod">PAYMENT MODE</FormLabel>
                  <FormSelect
                    value={senderDetails?.is_cod}
                    onChange={(e) =>
                      setSenderDetails((prev) => ({
                        ...prev,
                        is_cod: e.target.value,
                      }))
                    }
                  >
                    <option value={0}>Not Applicable</option>
                    <option value={1}>Cash on Delivery</option>
                    <option value={2}>Prepaid</option>
                  </FormSelect>
                </div>
              </>
            )}

            {booking?.courier_code.includes("dhl") &&
              (booking?.shipment_type == 1 || booking?.shipment_type == 2) && (
                <>
                  <div className="col-span-12 sm:col-span-6">
                    <FormLabel>
                      {" "}
                      SHIPPER TYPE <span className="text-red-400">*</span>
                    </FormLabel>
                    <div className="flex flex-row gap-10">
                      <FormCheck className="m-2">
                        <FormCheck.Input
                          id="radio-switch"
                          type="radio"
                          name="shipper_type_radio_button"
                          disabled={isDirectCust}
                          checked={senderDetails?.shipper_type == 1}
                          onClick={() => handleShipperTypeSelect(1)}
                        />
                        <FormCheck.Label className="flex items-center gap-1">
                          Individual
                          <div className="relative group">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center cursor-pointer">
                              <Lucide
                                icon="Info"
                                className="w-2.5 h-2.5 text-white stroke-[2.5]"
                              />
                            </div>
                            <div className="absolute bottom-6 right-0 z-50 hidden group-hover:block w-72 pointer-events-none">
                              <div className="bg-white text-gray-700 text-xs rounded-xl px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-blue-100">
                                <ShipperTypeInfoText type={1} />
                              </div>
                            </div>
                          </div>
                        </FormCheck.Label>
                      </FormCheck>
                      <FormCheck className="mr-2">
                        <FormCheck.Input
                          id="radio-switch"
                          type="radio"
                          name="shipper_type_radio_button"
                          disabled={isDirectCust}
                          checked={senderDetails?.shipper_type == 2}
                          onClick={() => handleShipperTypeSelect(2)}
                        />
                        <FormCheck.Label className="flex items-center gap-1">
                          MSME
                          <div className="relative group">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center cursor-pointer">
                              <Lucide
                                icon="Info"
                                className="w-2.5 h-2.5 text-white stroke-[2.5]"
                              />
                            </div>
                            <div className="absolute bottom-6 right-0 z-50 hidden group-hover:block w-72 pointer-events-none">
                              <div className="bg-white text-gray-700 text-xs rounded-xl px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-blue-100">
                                <ShipperTypeInfoText type={2} />
                              </div>
                            </div>
                          </div>
                        </FormCheck.Label>
                      </FormCheck>
                    </div>
                    {shipperTypeConfirm && (
                      <CommonModal
                        open={shipperTypeConfirm}
                        setOpen={setShipperTypeConfirm}
                        title={ShipperTypeConfirmTitle}
                        description={ShipperTypeConfirmDescription}
                        footer={ShipperTypeConfirmFooter}
                        sticky={true}
                        size="md"
                        handlecancel={() => setPendingShipperType(null)}
                      />
                    )}
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <FormLabel htmlFor="shipment_purpose">
                      PURPOSE OF SHIPMENT
                      <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormSelect
                      id="shipment_purpose"
                      value={senderDetails?.shipment_purpose}
                      onChange={(e) =>
                        setSenderDetails((prev) => ({
                          ...prev,
                          shipment_purpose: e.target.value,
                        }))
                      }
                    >
                      <option value={""}>Select Purpose</option>
                      {shipmentPurpose &&
                        shipmentPurpose?.map((ele, index) => (
                          <option key={index} value={ele?.id}>
                            {ele?.purpose_name}
                          </option>
                        ))}
                    </FormSelect>
                  </div>
                  {!isDirectCust && senderDetails?.shipper_type == "2" && (
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel>MSME ID</FormLabel>
                      <InputGroup>
                        <FormInput
                          type="text"
                          placeholder="MSME ID"
                          disabled={msmeEdit}
                          value={msmeId}
                          maxLength={7}
                          onChange={(e) =>
                            setMsmeId(e.target.value?.replace(/[^0-9.]/g, ""))
                          }
                        />
                        {msmeEdit ? (
                          <InputGroup.Text
                            className="bg-red-500 text-white  cursor-pointer border-red-500 rounded-r-xl"
                            onClick={handleDataReset}
                          >
                            RESET
                          </InputGroup.Text>
                        ) : (
                          <InputGroup.Text
                            className="bg-blue-500 text-white  cursor-pointer border-blue-500 rounded-r-xl flex "
                            onClick={getMsmeData}
                          >
                            FETCH{" "}
                            {msmeSpinner && (
                              <LoadingIcon
                                icon="puff"
                                color="white"
                                className="w-5 h-5 ml-2 stroke-2.5 text-white"
                              />
                            )}
                          </InputGroup.Text>
                        )}
                      </InputGroup>
                    </div>
                  )}
                </>
              )}

            {booking?.courier_code.includes("dhl") &&
              booking?.shipment_type == 1 &&
              booking?.destination_country_code == "US" && (
                <>
                  <div className="col-span-12 sm:col-span-6">
                    <FormLabel>
                      10 DIGIT COMMODITY CODE{" "}
                      <span className="text-red-400">*</span>
                    </FormLabel>
                    <div className="flex flex-col gap-2">
                      <FormInput
                        type="text"
                        placeholder="Commodity Code"
                        id="commodity_code"
                        value={senderDetails?.commodity_code}
                        onChange={(e) => {
                          setSenderDetails((prev) => ({
                            ...prev,
                            commodity_code: e.target.value.replaceAll(" ", ""),
                          }));
                        }}
                      />
                      <div className="text-mustard text-xs font-bold">
                        Example : Box1Code, Box2Code, Box3Code
                      </div>
                    </div>
                  </div>
                </>
              )}
          </div>

          {booking?.courier_code.includes("widect") &&
            booking?.booking_type == 1 && (
              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-3">BUSINESS NUMBER</FormLabel>
                  <FormInput
                    id="modal-form-3"
                    type="text"
                    placeholder="Business Number"
                    value={senderDetails?.business_number}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        business_number: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-3">RGR NUMBER</FormLabel>
                  <FormInput
                    id="modal-form-3"
                    type="text"
                    placeholder="RGR Number"
                    value={senderDetails?.rgr_number}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        rgr_number: e.target.value,
                      })
                    }
                  />
                </div>
                {booking?.destination_country_code != "GB" &&
                  region == "europe" &&
                  booking?.incoterm == "1" &&
                  !isRestricted && (
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="modal-form-3">
                        IOSS NUMBER
                        <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormInput
                        id="modal-form-3"
                        type="text"
                        placeholder="IOSS Number"
                        value={senderDetails?.ioss_number}
                        onChange={(e) =>
                          setSenderDetails({
                            ...senderDetails,
                            ioss_number: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                {!isRestricted &&
                  booking?.incoterm == "1" &&
                  booking?.destination_country_code != "US" &&
                  (region != "europe" ||
                    booking?.destination_country_code == "GB") && (
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="vat_number">
                        VAT NUMBER
                        <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormInput
                        id="vat_number"
                        type="text"
                        placeholder="VAT Number"
                        value={senderDetails?.vat_number}
                        onChange={(e) =>
                          setSenderDetails({
                            ...senderDetails,
                            vat_number: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-3">EORI NUMBER</FormLabel>
                  <FormInput
                    id="modal-form-3"
                    type="text"
                    placeholder="EORI Number"
                    value={senderDetails?.eori_number}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        eori_number: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-3">
                    MARKET PLACE VAT NUMBER
                  </FormLabel>
                  <FormInput
                    id="modal-form-3"
                    type="text"
                    placeholder="Market Place VAT Number"
                    value={senderDetails?.market_place_vat_number}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        market_place_vat_number: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-3">SKU</FormLabel>
                  <FormInput
                    id="modal-form-3"
                    type="text"
                    placeholder="SKU"
                    value={senderDetails?.sku}
                    onChange={(e) =>
                      setSenderDetails({
                        ...senderDetails,
                        sku: e.target.value,
                      })
                    }
                  />
                </div>
                {booking?.destination_country_code == "US" && (
                  <>
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="modal-form-3">
                        MANUFACTURER ID
                      </FormLabel>
                      <FormInput
                        id="modal-form-3"
                        type="text"
                        placeholder="manufacturer id "
                        value={senderDetails?.manufacturer_id}
                        onChange={(e) =>
                          setSenderDetails({
                            ...senderDetails,
                            manufacturer_id: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="iorr_number">IORR NUMBER</FormLabel>
                      <FormInput
                        id="iorr_number"
                        type="text"
                        placeholder="IORR Number"
                        value={senderDetails?.iorr_number}
                        onChange={(e) =>
                          setSenderDetails({
                            ...senderDetails,
                            iorr_number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <FormLabel htmlFor="poa">POA</FormLabel>
                      <FormInput
                        id="poa"
                        type="text"
                        placeholder="POA"
                        value={senderDetails?.poa}
                        onChange={(e) =>
                          setSenderDetails({
                            ...senderDetails,
                            poa: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            )}

          <div>
            {flmEnable == 1 && senderDetails?.pickup_required == 2 ? (
              <div className="mt-4">
                <p>
                  Since you have not choosen for Pickup, please drop your
                  shipment at below address
                </p>
                <address className="font-medium  text-black mt-1 ">
                  Address :{" "}
                  {`${pudAddress?.branch_name} ${pudAddress?.branch_address}`}
                </address>
              </div>
            ) : flmEnable == 0 &&
              senderDetails?.pickup_required == 2 &&
              booking?.import_booking == 1 ? (
              <div className="mt-4">
                <p className="px-1 font-normal text-center text-base text-red-500">
                  Pickup is not available at this pincode, please contact
                  customer support
                </p>
              </div>
            ) : null}
          </div>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            type="button"
            className="w-20 bg-mustard border-none text-white"
            onClick={handleClick}
          >
            Save
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default SenderModal;
