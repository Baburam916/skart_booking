import { Dialog } from "../../../../base-components/Headless";
import Button from "../../../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
  InputGroup,
} from "../../../../base-components/Form";
import Lucide from "../../../../base-components/Lucide";
import {
  checkReferenceNumber,
  consignerDocumentTypesApi,
  generateRefNoApi,
  getConsigneeDetailsApi,
  getCountryApi,
  getShipnstockCountriesApi,
  getShipnstockStatesApi,
} from "../../../../AllServices/config.service";
import TomSelect from "../../../../base-components/TomSelect";
import { useEffect, useState } from "react";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import {
  downloadAttachment,
  getCourierMaxLength,
  getCurrentDate,
  handleConditionalPaste,
  handlePaste,
  onlyNumbers,
} from "../../../../utils";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import CommonSearchableAll from "../../../../components/CommonSearchableAll/CommonSearchableAll";
import KycModal from "../KycModal";

interface ReceiverModalProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  setBooking: any;
  setReceiverData: any;
}
const intselecteddata = {
  code: "",
  name: "",
};
const ReceiverModal: React.FC<ReceiverModalProps> = ({
  open,
  onClose,
  booking,
  setBooking,
  setReceiverData,
}) => {
  let selectedCountry = [];
  const [countryData, setCountryData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [selecteddata, setSelecteddata] = useState<any>(intselecteddata);
  const [docCheck, setDocCheck] = useState(null);
  const [consigneeDocTypes, setConsigneeDocTypes] = useState([]);
  const { showAlert } = useAlert();
  const [gstCheck, setGstCheck] = useState(null);
  const [contactEdit, setContactEdit] = useState(false);
  const [uniqueReferenceNo, setUniqueReferenceNo] = useState(null);
  const [kycModalPreview, setKycModalPreview] = useState<boolean>(false);
  const isShipnstock = booking?.courier_code?.includes("shipnstock") && booking?.import_booking == 1;
  const [shipnstockCountries, setShipnstockCountries] = useState([]);
  const [shipnstockStates, setShipnstockStates] = useState([]);
  const [stateSelecteddata, setStateSelecteddata] = useState<any>({
    name: "",
    id: "",
  });

  const getConsigneeData = async (consignee_number: any = "") => {
    if (!receiverDetails?.consignee_mobile_number && !booking?.is_ocr) {
      showAlert("Please enter mobile number", "error");
      return;
    }
    setSpinner(true);
    try {
      const response: any = await getConsigneeDetailsApi(
        booking?.is_ocr == 1 && consignee_number ? consignee_number : receiverDetails?.consignee_mobile_number,
        booking?.import_booking,
      );
      if (response?.data?.status == 200) {
        if (response?.data?.data?.kyc_details?.length == 0) {
          setContactEdit(true);
          // delete senderDetails?.kyc_details;
          setReceiverDetails((prev: any) => ({
            ...prev,
            ...response?.data?.data,
            kyc_details: null,
          }));
        } else if (response?.data?.data?.kyc_details == undefined) {
          if (booking?.import_booking == 2) {
            setContactEdit(true);
            setReceiverDetails((prev: any) => ({
              ...prev,
              ...response?.data?.data,
              kyc_details: null,
            }));
          } else {
            setContactEdit(true);
            setReceiverDetails((prev: any) => ({
              ...prev,
              ...response?.data?.data,
            }));
          }
        } else {
          setContactEdit(true);
          setBooking((prev: any) => ({
            ...prev,
            kyc_details: response?.data?.data?.kyc_details,
          }));
          setReceiverDetails((prev: any) => ({
            ...prev,
            ...response?.data?.data,
          }));
        }
        showAlert("Receiver Details Found");
      } else if (response?.data?.status == 400) {
        showAlert(response?.data?.data[0]?.message, "error");
        if (booking?.import_booking == 2) {
          setBooking((prev: any) => ({
            ...prev,
            kyc_details: null,
          }));
          setReceiverDetails((prev: any) => ({
            ...prev,
            kyc_details: null,
          }));
        }
      } else {
        showAlert("Something Went Wrong", "error");
      }
    } catch (err: any) {
      showAlert("Something Went Wrong", "error");
    } finally {
      setSpinner(false);
    }
  };

  const [receiverDetails, setReceiverDetails] = useState({
    consignee_mobile_number: booking?.consignee_mobile_number || "",
    consignee_email_id: booking?.consignee_email_id || "",
    consignee_first_name: booking?.consignee_first_name || "",
    consignee_company_name: booking?.consignee_company_name || "",
    consignee_address_1: booking?.consignee_address_1 || "",
    consignee_address_2: booking?.consignee_address_2 || "",
    consignee_pincode: booking?.destination_pincode,
    consignee_city: booking?.city,
    consignee_state: isShipnstock ? "" : booking?.state,
    consignee_country: booking?.destination_country,
    ...(isShipnstock ? { consignee_state_id: "" } : {}),
    consignee_reference_no: booking?.consignee_reference_no || "",
    booking_invoice_number: booking?.booking_invoice_number || "",
    booking_invoice_date: getCurrentDate(),
    ...(booking?.courier_code.includes("aramex") || booking?.courier_code.includes("sf_express")
      ? { consignee_gst_number: booking?.consignee_gst_number || "" }
      : {}),
    ...(booking?.courier_code.includes("skynet")
      ? {
        consignee_doc_type: booking?.consignee_doc_type || "1",
        consignee_gst_number: booking?.consignee_gst_number || "",
        delivery_instructions: booking?.delivery_instructions || "",
      }
      : {}),
    ...(booking?.courier_code.includes("dhl") &&
      (booking?.destination_country_code == "MX" ||
        booking?.destination_country_code == "ID")
      ? {
        consignee_tax_id: booking?.consignee_tax_id || "",
      }
      : {}),
    ...(booking?.import_booking == "2"
      ? {
        kyc_details: booking?.kyc_details || "",
      }
      : {}),
    ...(booking?.import_booking == "2" && booking?.import_booking_type == "2"
      ? {
        broker_address_1: booking?.broker_address_1 || "",
        broker_address_2: booking?.broker_address_2 || "",
        broker_city: booking?.broker_city || "",
        broker_state: booking?.broker_state || "",
        broker_pincode: booking?.broker_pincode || "",
        broker_country_code: booking?.broker_country_code || "IN",
        broker_name: booking?.broker_name || "",
        broker_email: booking?.broker_email || "",
        broker_phone_extension: booking?.broker_phone_extension || "+91",
        broker_phone: booking?.broker_phone || "",
        broker_company_name: booking?.broker_company_name || "",
      }
      : {}),
    ...(booking?.courier_code.includes("emirates")
      ? {
        is_residential: booking?.is_residential || "",
      }
      : {}),
    ...(booking?.import_booking == "2"
      ? {
        consignee_doc_type: booking?.consignee_doc_type || "1",
        consignee_gst_number: booking?.consignee_gst_number || "",
      }
      : {}),
  });

  const [commercialData, setCommercialData] = useState({
    to_airport_code: "",
    by_first_carrier: "",
    airport_destination: "",
    handling_information: "",
    quantity_of_goods: "",
    iec_no: "",
    hsn_code:
      JSON.parse(booking?.shipment_dimensions)
        ?.map((item) => item.hsn_code)
        ?.join(",") || "",
  });

  const handleClick = () => {
    for (const key in receiverDetails) {
      if (key == "consignee_address_3") {
        continue;
      }

      if (booking?.booking_type == "2" && key == "consignee_email_id") {
        continue;
      }

      if (booking?.import_booking == "1" && key == "kyc_details") {
        continue;
      }

      if (booking?.import_booking == "2" && booking?.import_booking_type && key == "kyc_details") {
        continue;
      }

      if (booking?.import_booking == "1" && key?.includes("broker")) {
        continue;
      }

      if (
        booking?.import_booking == "2" &&
        booking?.import_booking_type != "2" &&
        key?.includes("broker")
      ) {
        continue;
      }

      if (
        !booking?.courier_code.includes("emirates") &&
        key == "is_residential"
      ) {
        continue;
      }

      if (
        !booking?.courier_code.includes("dhl") &&
        (!booking?.destination_country_code == "MX" ||
          !booking?.destination_country_code == "ID") &&
        key == "consignee_tax_id"
      ) {
        continue;
      }
      if (
        receiverDetails.hasOwnProperty(key) &&
        !booking?.courier_code?.includes("aramex") &&
        !booking?.courier_code?.includes("sf_express") &&
        !booking?.courier_code?.includes("skynet") &&
        key == "consignee_gst_number"
      ) {
        continue;
      }
      if (
        receiverDetails.hasOwnProperty(key) &&
        !booking?.courier_code.includes("aramex") &&
        !booking?.courier_code.includes("sf_express") &&
        !booking?.courier_code.includes("fedex") &&
        (key == "consignee_reference_no" || key == "booking_invoice_number")
      ) {
        continue;
      }
      if (
        receiverDetails.hasOwnProperty(key) &&
        (receiverDetails[key] === "" || !receiverDetails[key])
      ) {
        if (key == "is_residential") {
          showAlert(`Location is residential is required`, "error");
          return;
        }
        showAlert(`${key.replaceAll("_", " ")} is required`, "error");
        return;
      }
    }
    if (booking?.shipment_type == "4") {
      for (const key in commercialData) {
        if (commercialData.hasOwnProperty(key) && commercialData[key] === "") {
          showAlert(`${key.replaceAll("_", " ")} is required`, "error");
          return;
        }
      }
      setBooking((prev) => ({
        ...prev,
        commercial_data: commercialData,
      }));
    }
    if (booking?.booking_type == "1" && !uniqueReferenceNo) {
      return showAlert("Please Enter Unique Reference No.", "error");
    }
    setReceiverData(receiverDetails);
    setBooking((prev) => ({ ...prev, ...receiverDetails }));
    onClose();
  };
  const fun1 = (a: any) => {
    setCommercialData((prev) => ({
      ...prev,
      to_airport_code: a?.code || "",
    }));
  };
  const funtoempty = () => {
    setCommercialData((prev) => ({
      ...prev,
      to_airport_code: "",
    }));
  };
  const funonChange = () => {
    setCommercialData((pre: any) => ({ ...pre, to_airport_code: "" }));
  };
  const handleValidate = (docNumber: string) => {
    if (docNumber == "") {
      setGstCheck(null);
      return;
    }
    if (docNumber) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
      const isValid = gstRegex.test(docNumber);
      isValid ? setGstCheck(true) : setGstCheck(false);
      return;
    } else {
      setGstCheck(null);
      return;
    }
  };

  const handleValidates = (docNumber: string) => {
    if (docNumber == "") {
      setDocCheck(null);
      return;
    }
    if (receiverDetails?.consignee_doc_type == 1 && docNumber) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
      const isValid = gstRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else if (receiverDetails?.consignee_doc_type == 2 && docNumber) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

      const isValid = panRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else if (receiverDetails?.consignee_doc_type == 3 && docNumber) {
      const passportRegex = /^[A-PR-WY-Z][1-9]\\d\\s?\\d{4}[1-9]$/;

      const isValid = passportRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else if (receiverDetails?.consignee_doc_type == 4 && docNumber) {
      const aadhaarRegex = /^\d{12}$/;

      const isValid = aadhaarRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else if (
      (receiverDetails?.consignee_doc_type == 5 ||
        receiverDetails?.consignee_doc_type == 6 ||
        receiverDetails?.consignee_doc_type == 7) &&
      docNumber
    ) {
      setDocCheck(true);
      return;
    } else if (receiverDetails?.consignee_doc_type == 8 && docNumber) {
      const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;
      const isValid = tanRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else {
      setDocCheck(null);
      return;
    }
  };

  const handleDataReset = () => {
    setReceiverData({});
    setReceiverDetails((prev) => ({
      ...prev,
      consignee_mobile_number: "",
      consignee_email_id: "",
      consignee_first_name: "",
      consignee_company_name: "",
      consignee_address_1: "",
      consignee_address_2: "",
      ...(booking?.courier_code.includes("dhl") ? { consignee_address_3: "", } : {}),
      consignee_reference_no: "",
      booking_invoice_number: "",
      booking_invoice_date: getCurrentDate(),
      ...(booking?.courier_code.includes("aramex") || booking?.courier_code.includes("sf_express")
        ? { consignee_gst_number: "" }
        : {}),
      ...(booking?.courier_code.includes("dhl") &&
        (booking?.destination_country_code == "MX" ||
          booking?.destination_country_code == "ID")
        ? {
          consignee_tax_id: "",
        }
        : {}),
      ...(booking?.courier_code.includes("emirates")
        ? {
          is_residential: "",
        }
        : {}),
    }));

    setBooking((prev) => ({
      ...prev,
      consignee_mobile_number: "",
      consignee_email_id: "",
      consignee_first_name: "",
      consignee_company_name: "",
      consignee_address_1: "",
      consignee_address_2: "",
      ...(booking?.courier_code.includes("dhl") ? { consignee_address_3: "", } : {}),
      consignee_pincode: "",
      consignee_city: "",
      consignee_state: "",
      consignee_country: "",
      consignee_reference_no: "",
      booking_invoice_number: "",
      booking_invoice_date: getCurrentDate(),
      ...(booking?.courier_code.includes("aramex") || booking?.courier_code.includes("sf_express")
        ? { consignee_gst_number: "" }
        : {}),
      ...(booking?.courier_code.includes("dhl") &&
        (booking?.destination_country_code == "MX" ||
          booking?.destination_country_code == "ID")
        ? {
          consignee_tax_id: "",
        }
        : {}),
      ...(booking?.courier_code.includes("emirates")
        ? {
          is_residential: "",
        }
        : {}),
    }));
    setUniqueReferenceNo(false);

    setContactEdit(false);
  };

  const handleCheckReference = async (reference_no) => {
    try {
      const response = await checkReferenceNumber(reference_no);
      if (response?.data?.status == 200) {
        setUniqueReferenceNo(true);
      } else if (response?.data?.status == 400) {
        showAlert(response?.data?.message, "error");
        setUniqueReferenceNo(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (booking?.is_ocr == 1) {
      setReceiverDetails((prev) => ({
        ...prev,
        ...booking?.receiverData
      }));
      setUniqueReferenceNo(true);
    }
  }, []);


  useEffect(() => {
    getCountryApi(booking?.consignee_country).then((res) => {
      setCountryData(res?.data?.data);
    });

    consignerDocumentTypesApi().then((res) => {
      setConsigneeDocTypes(res?.data?.data);
    });

    if (isShipnstock) {
      getShipnstockCountriesApi().then((res) => {
        setShipnstockCountries(res?.data?.countries || []);
      });
    }

    if (!booking?.is_ocr) {
      generateRefNoApi().then((res) => {
        if (res?.data?.status == 200 && res?.data?.data) {
          setReceiverDetails((prev) => ({
            ...prev,
            consignee_reference_no: res?.data?.data || "",
          }));
          handleCheckReference(res?.data?.data || "");
        }
      });
    }
  }, []);

  const matchedShipnstockCountryId = shipnstockCountries?.find(
    (country: any) =>
      country?.name?.toLowerCase() === booking?.destination_country?.toLowerCase(),
  )?.id;

  useEffect(() => {
    if (isShipnstock && matchedShipnstockCountryId) {
      getShipnstockStatesApi(matchedShipnstockCountryId).then((res) => {
        setShipnstockStates(res?.data?.states || []);
      });
    }
  }, [matchedShipnstockCountryId]);

  const funStateSelect = (item: any) => {
    setReceiverDetails((prev) => ({
      ...prev,
      consignee_state: item?.name || "",
      consignee_state_id: item?.id || "",
    }));
  };

  const funStateEmpty = () => {
    setReceiverDetails((prev) => ({
      ...prev,
      consignee_state: "",
      consignee_state_id: "",
    }));
  };

  const dimensions = JSON.parse(
    booking?.shipment_dimensions || "[]"
  );

  const shipment_value = dimensions?.reduce(
    (sum: number, item: any) => sum + (Number(item?.value) || 0),
    0
  );

  return (
    <Dialog staticBackdrop open={open} onClose={onClose} size="lg">
      <Dialog.Panel className={" mt-4"}>
        <Dialog.Title className="flex justify-between">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            <h2 className="mr-auto text-base font-medium whitespace-nowrap">
              Receiver Details
            </h2>

            {booking?.import_booking == 2 &&
              (booking?.kyc_details?.document_id_1 &&
                booking?.kyc_details?.document_id_2 ? (
                <>
                  {receiverDetails?.kyc_details?.document_path_1 && (
                    <Button
                      className="text-white bg-mustard p-[2px] md:p-2"
                      size="sm"
                      onClick={() =>
                        downloadAttachment(
                          receiverDetails?.kyc_details?.document_path_1,
                          "document_1",
                        )
                      }
                    >
                      KYC Document 1
                    </Button>
                  )}

                  {receiverDetails?.kyc_details?.document_path_2 && (
                    <Button
                      className="text-white bg-mustard p-[2px] md:p-2"
                      size="sm"
                      onClick={() =>
                        downloadAttachment(
                          receiverDetails?.kyc_details?.document_path_2,
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
                setSenderDetails={setReceiverDetails}
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
        <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3 overflow-y-auto h-[65vh]">
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-1">
              MOBILE NO <span className="text-red-500">*</span>
            </FormLabel>
            <InputGroup>
              <FormInput
                id="modal-form-1"
                type="text"
                placeholder="Mobile No."
                maxLength={15}
                disabled={contactEdit}
                value={receiverDetails?.consignee_mobile_number}
                onKeyDown={(e) => onlyNumbers(e)}
                onChange={(e) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    consignee_mobile_number: e.target.value,
                  }))
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
                  onClick={getConsigneeData}
                >
                  CHECK
                  {spinner && (
                    <LoadingIcon
                      icon="puff"
                      color="white"
                      className="w-5 h-5 ml-2 stroke-2.5 text-white "
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
              value={receiverDetails?.consignee_email_id}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_email_id: e.target.value,
                }))
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
              value={receiverDetails?.consignee_first_name}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_first_name: e.target.value,
                }))
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
              value={receiverDetails?.consignee_company_name}
              maxLength={booking?.courier_code.includes("fedex") && 35}
              onPaste={(e) => {
                if (booking?.courier_code.includes("fedex")) {
                  e.preventDefault();
                  const data = handlePaste(
                    receiverDetails?.consignee_company_name,
                    e,
                    35,
                  );
                  setReceiverDetails((prev) => ({
                    ...prev,
                    consignee_company_name: data,
                  }));
                }
              }}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_company_name: e.target.value,
                }))
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
              value={receiverDetails?.consignee_address_1}
              maxLength={getCourierMaxLength(booking?.courier_code?.toLowerCase())}
              onPaste={(e) =>
                handleConditionalPaste({
                  key: "consignee_address_1",
                  state: receiverDetails,
                  setState: setReceiverDetails,
                  event: e,
                  courierCode: booking?.courier_code?.toLowerCase(),
                })
              }
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_address_1: e.target.value,
                }))
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
              value={receiverDetails?.consignee_address_2}
              maxLength={getCourierMaxLength(booking?.courier_code?.toLowerCase())}
              onPaste={(e) =>
                handleConditionalPaste({
                  key: "consignee_address_2",
                  state: receiverDetails,
                  setState: setReceiverDetails,
                  event: e,
                  courierCode: booking?.courier_code?.toLowerCase(),
                })
              }
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_address_2: e.target.value,
                }))
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
                value={receiverDetails?.consignee_address_3}
                maxLength={getCourierMaxLength(booking?.courier_code?.toLowerCase())}
                onPaste={(e) =>
                  handleConditionalPaste({
                    key: "consignee_address_3",
                    state: receiverDetails,
                    setState: setReceiverDetails,
                    event: e,
                    courierCode: booking?.courier_code?.toLowerCase(),
                  })
                }
                onChange={(e) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    consignee_address_3: e.target.value,
                  }))
                }
              />
            </div>) : null}

          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-5">
              PINCODE <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              type="text"
              value={receiverDetails?.consignee_pincode}
              disabled
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-5">
              CITY <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              type="text"
              value={receiverDetails?.consignee_city}
              disabled
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-5">
              STATE CODE <span className="text-red-500">*</span>
            </FormLabel>
            {isShipnstock && matchedShipnstockCountryId ? (
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
                value={receiverDetails?.consignee_state}
                onChange={(e: any) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    consignee_state: e.target.value,
                  }))
                }
              />
            )}
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-5">
              Country <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              type="text"
              value={receiverDetails?.consignee_country?.toUpperCase()}
              disabled
            />
          </div>

          {(booking?.courier_code.includes("skynet") || booking?.import_booking == "2") && (
            <>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-6">
                  DOCUMENT TYPE <span className="text-red-500">*</span>{" "}
                </FormLabel>
                <FormSelect
                  id="modal-form-6"
                  value={receiverDetails?.consignee_doc_type}
                  onChange={(e) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      consignee_doc_type: e.target.value,
                    }))
                  }
                >
                  <option value="0">Select Document Type</option>
                  {consigneeDocTypes &&
                    consigneeDocTypes?.map((elem, index) => (
                      <option value={elem?.id} key={index}>
                        {elem?.value}
                      </option>
                    ))}
                </FormSelect>
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-5">
                  {(consigneeDocTypes &&
                    consigneeDocTypes?.find(
                      (elem) => elem.id == receiverDetails?.consignee_doc_type,
                    )?.value) ||
                    "Please select a document type"}
                  <span className="text-red-500"> *</span>
                </FormLabel>

                <InputGroup>
                  <FormInput
                    type="text"
                    value={receiverDetails?.consignee_gst_number}
                    maxLength={
                      receiverDetails?.consignee_doc_type == "1"
                        ? 15
                        : receiverDetails?.consignee_doc_type == "2"
                          ? 10
                          : receiverDetails?.consignee_doc_type == "3"
                            ? 9
                            : receiverDetails?.consignee_doc_type == "4"
                              ? 12
                              : receiverDetails?.consignee_doc_type == "8"
                                ? 10
                                : undefined
                    }
                    onChange={(e) =>
                      setReceiverDetails((prev) => ({
                        ...prev,
                        consignee_gst_number: e.target.value,
                      }))
                    }
                    onBlur={(e) => handleValidates(e.target.value)}
                    className="uppercase"
                  />
                  <InputGroup.Text
                    id="input-group-price"
                    className="py-2 px-3 w-14"
                  >
                    {" "}
                    {receiverDetails?.consigner_gst_number &&
                      docCheck == true && (
                        <Lucide
                          icon="Check"
                          className="text-green-500 stroke-2.5  h-5"
                        />
                      )}
                    {receiverDetails?.consigner_gst_number &&
                      docCheck == false && (
                        <Lucide
                          icon="X"
                          className="text-red-500 stroke-2.5  h-5"
                        />
                      )}
                  </InputGroup.Text>
                </InputGroup>
              </div>
              {booking?.courier_code.includes("skynet") &&
                (<div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-5">
                    DELIVERY INSTRUCTIONS <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    value={receiverDetails?.delivery_instructions}
                    onChange={(e: any) =>
                      setReceiverDetails((prev) => ({
                        ...prev,
                        delivery_instructions: e.target.value,
                      }))
                    }
                  />
                </div>)}
            </>
          )}
          {booking?.courier_code.includes("dhl") &&
            (booking?.destination_country_code == "MX" ||
              booking?.destination_country_code == "ID") && (
              <>
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="modal-form-5">
                    RECEIVER TAX ID <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    type="text"
                    value={receiverDetails?.consignee_tax_id}
                    onChange={(e: any) =>
                      setReceiverDetails((prev) => ({
                        ...prev,
                        consignee_tax_id: e.target.value,
                      }))
                    }
                  />
                </div>
              </>
            )}

          {booking?.booking_type == "1" && (
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">
                REFERENCE NUMBER <span className="text-red-500">*</span>
              </FormLabel>

              <InputGroup>
                <FormInput
                  type="text"
                  value={receiverDetails?.consignee_reference_no}
                  onChange={(e) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      consignee_reference_no: e.target.value,
                    }))
                  }
                  onBlur={(e) => handleCheckReference(e.target.value)}
                />
                <InputGroup.Text
                  id="input-group-price"
                  className="py-2 px-3 w-14"
                >
                  {receiverDetails?.consignee_reference_no &&
                    uniqueReferenceNo == true && (
                      <Lucide
                        icon="Check"
                        className="text-green-500 stroke-2.5  h-5"
                      />
                    )}
                  {receiverDetails?.consignee_reference_no &&
                    uniqueReferenceNo == false && (
                      <Lucide
                        icon="X"
                        className="text-red-500 stroke-2.5  h-5"
                      />
                    )}
                </InputGroup.Text>
              </InputGroup>
            </div>
          )}

          {booking?.courier_code.includes("emirates") && (
            <>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-is_residential">
                  LOCATION IS RESIDENTIAL{" "}
                  <span className="text-red-500">*</span>{" "}
                </FormLabel>
                <FormSelect
                  id="modal-form-is_residential"
                  value={receiverDetails?.is_residential}
                  onChange={(e) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      is_residential: e.target.value,
                    }))
                  }
                >
                  <option value="">Select </option>
                  <option value={1}>Yes </option>
                  <option value={2}>No </option>
                </FormSelect>
              </div>
            </>
          )}

          {shipment_value > 2500 && booking?.import_booking == "1" && booking?.courier_code.includes("fedex") && Number(booking?.unit?.currency) == 48 ? (
            <>
              {booking?.destination_country_code == "US" ?
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="ei_number">EI NUMBER</FormLabel>
                  <FormInput
                    id="ei_number"
                    type="text"
                    placeholder="Enter EI NUMBER"
                    value={receiverDetails?.ei_number}
                    onChange={(e) =>
                      setReceiverDetails((prev) => ({
                        ...prev,
                        ei_number: e.target.value,
                      }))
                    }
                  />
                </div> : null}
              {booking?.destination_country_code == "CA" ?
                <div className="col-span-12 sm:col-span-6">
                  <FormLabel htmlFor="cad_number">CAD NUMBER</FormLabel>
                  <FormInput
                    id="cad_number"
                    type="text"
                    placeholder="Enter CAD NUMBER"
                    value={receiverDetails?.cad_number}
                    onChange={(e) =>
                      setReceiverDetails((prev) => ({
                        ...prev,
                        cad_number: e.target.value,
                      }))
                    }
                  />
                </div> : null}
            </>
          ) : null}

          {booking?.shipment_type == "4" && (
            <>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-5">
                  TO (3 DIGIT AIRPORT CODE){" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                {commercialData?.to_airport_code ? (
                  <InputGroup>
                    <FormInput
                      type="text"
                      placeholder={"Airport Code"}
                      autoComplete="off"
                      disabled
                      value={commercialData?.to_airport_code}
                    />

                    <InputGroup.Text
                      id="input-group-price"
                      className="py-2 px-3 w-14"
                    >
                      <div
                        onClick={() => {
                          setCommercialData((pre: any) => ({
                            ...pre,
                            to_airport_code: "",
                          }));
                          setSelecteddata(intselecteddata);
                        }}
                      >
                        <Lucide
                          icon="Pencil"
                          className="text-green-500 stroke-2.5  h-5"
                        />
                      </div>
                    </InputGroup.Text>
                  </InputGroup>
                ) : (
                  <CommonSearchableAll
                    apiEndpoint="admin/airports"
                    zIndex="20"
                    selecteddata={selecteddata}
                    setSelecteddata={setSelecteddata}
                    fun1={fun1}
                    funtoempty={funtoempty}
                    key1={"key"}
                    //  border={`${interrors?.country_id ? "border border-red-400" : ""}`}
                    comingselectedname={"name"}
                    comingselectedid={"code"}
                    id={commercialData?.to_airport_code}
                    funonchange={funonChange}
                    addcomingname2={"code"}
                  />
                )}
                {/* <FormInput
                  id="modal-form-5"
                  type="text"
                  value={commercialData?.to_airport_code}
                  onChange={(e) =>
                    setCommercialData((prev) => ({
                      ...prev,
                      to_airport_code: e.target.value,
                    }))
                  }
                /> */}
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-5">
                  BY FIRST CARRIER <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  id="modal-form-5"
                  type="text"
                  value={commercialData?.by_first_carrier}
                  onChange={(e) =>
                    setCommercialData((prev) => ({
                      ...prev,
                      by_first_carrier: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-5">
                  AIRPORT DESTINATION <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  id="modal-form-5"
                  type="text"
                  value={commercialData?.airport_destination}
                  onChange={(e) =>
                    setCommercialData((prev) => ({
                      ...prev,
                      airport_destination: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-5">
                  HANDLING INFORMATION <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  id="modal-form-5"
                  type="text"
                  value={commercialData?.handling_information}
                  onChange={(e) =>
                    setCommercialData((prev) => ({
                      ...prev,
                      handling_information: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-5">
                  QUANTITY OF GOODS <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  id="modal-form-5"
                  type="text"
                  value={commercialData?.quantity_of_goods}
                  onChange={(e) =>
                    setCommercialData((prev) => ({
                      ...prev,
                      quantity_of_goods: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-5">
                  IEC NO. <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  id="modal-form-5"
                  type="text"
                  value={commercialData?.iec_no}
                  onChange={(e) =>
                    setCommercialData((prev) => ({
                      ...prev,
                      iec_no: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-5">
                  HSN CODE <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  id="modal-form-5"
                  type="text"
                  value={commercialData?.hsn_code}
                  onChange={(e) =>
                    setCommercialData((prev) => ({
                      ...prev,
                      hsn_code: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          )}

          {(booking?.courier_code.includes("aramex") || booking?.courier_code.includes("sf_express")) && (
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">
                GST Number <span className="text-red-500">*</span>
              </FormLabel>

              <InputGroup>
                <FormInput
                  type="text"
                  maxLength={15}
                  value={receiverDetails?.consignee_gst_number}
                  onChange={(e) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      consignee_gst_number: e.target.value,
                    }))
                  }
                  onBlur={(e) => handleValidate(e.target.value)}
                  className="uppercase"
                />
                <InputGroup.Text
                  id="input-group-price"
                  className="py-2 px-3 w-14"
                >
                  {receiverDetails?.consignee_gst_number &&
                    gstCheck == true && (
                      <Lucide
                        icon="Check"
                        className="text-green-500 stroke-2.5  h-5"
                      />
                    )}
                  {receiverDetails?.consignee_gst_number &&
                    gstCheck == false && (
                      <Lucide
                        icon="X"
                        className="text-red-500 stroke-2.5  h-5"
                      />
                    )}
                </InputGroup.Text>
              </InputGroup>
            </div>
          )}

          {booking?.booking_type == "1" && (
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="modal-form-5">
                INVOICE NUMBER{" "}
                {(booking?.courier_code.includes("aramex") ||
                  booking?.courier_code.includes("sf_express") ||
                  booking?.courier_code.includes("fedex")) && (
                    <span className="text-red-500">*</span>
                  )}
              </FormLabel>
              <FormInput
                id="modal-form-5"
                type="text"
                placeholder=""
                value={receiverDetails?.booking_invoice_number}
                onChange={(e) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    booking_invoice_number: e.target.value,
                  }))
                }
              />
            </div>
          )}
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-5">
              INVOICE DATE <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="modal-form-5"
              type="date"
              placeholder=""
              value={receiverDetails?.booking_invoice_date}
              max={getCurrentDate()}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  booking_invoice_date: e.target.value,
                }))
              }
            />
          </div>

          {booking?.import_booking == "2" &&
            booking?.import_booking_type == "2" ? (
            <>
              <div className="col-span-12 font-bold text-mustard underline underline-offset-2">
                BROKER DETAILS
              </div>

              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="broker_address_1">
                  BROKER ADDRESS 1<span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  type="text"
                  id="broker_address_1"
                  value={receiverDetails?.broker_address_1}
                  onChange={(e: any) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      broker_address_1: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="broker_address_2">
                  BROKER ADDRESS 2<span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  type="text"
                  id="broker_address_2"
                  value={receiverDetails?.broker_address_2}
                  onChange={(e: any) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      broker_address_2: e.target.value,
                    }))
                  }
                />
              </div>
              {/* BROKER CITY */}
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="broker_city">
                  BROKER CITY<span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  type="text"
                  id="broker_city"
                  value={receiverDetails?.broker_city}
                  onChange={(e: any) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      broker_city: e.target.value,
                    }))
                  }
                />
              </div>

              {/* BROKER STATE */}
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="broker_state">
                  BROKER STATE<span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  type="text"
                  id="broker_state"
                  value={receiverDetails?.broker_state}
                  onChange={(e: any) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      broker_state: e.target.value,
                    }))
                  }
                />
              </div>

              {/* BROKER PINCODE */}
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="broker_pincode">
                  BROKER PINCODE<span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  type="text"
                  id="broker_pincode"
                  value={receiverDetails?.broker_pincode}
                  onChange={(e: any) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      broker_pincode: e.target.value,
                    }))
                  }
                />
              </div>

              {/* BROKER COUNTRY CODE */}
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="broker_country_code">
                  BROKER COUNTRY CODE<span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  type="text"
                  id="broker_country_code"
                  value={receiverDetails?.broker_country_code}
                  onChange={(e: any) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      broker_country_code: e.target.value,
                    }))
                  }
                />
              </div>

              {/* BROKER NAME */}
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="broker_name">
                  BROKER NAME<span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  type="text"
                  id="broker_name"
                  value={receiverDetails?.broker_name}
                  onChange={(e: any) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      broker_name: e.target.value,
                    }))
                  }
                />
              </div>

              {/* BROKER EMAIL */}
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="broker_email">
                  BROKER EMAIL<span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  type="email"
                  id="broker_email"
                  value={receiverDetails?.broker_email}
                  onChange={(e: any) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      broker_email: e.target.value,
                    }))
                  }
                />
              </div>

              {/* BROKER PHONE WITH EXTENSION */}
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="broker_phone">
                  BROKER PHONE
                  <span className="text-red-500">*</span>
                </FormLabel>

                <InputGroup>
                  {/* EXTENSION DROPDOWN */}
                  <FormSelect
                    id="broker_phone_extension"
                    value={receiverDetails?.broker_phone_extension}
                    onChange={(e: any) =>
                      setReceiverDetails((prev) => ({
                        ...prev,
                        broker_phone_extension: e.target.value,
                      }))
                    }
                    className="w-1/3 rounded-none rounded-l"
                  >
                    <option value="">Select</option>
                    {countryData?.length &&
                      countryData?.map(
                        (data, index) =>
                          data?.is_active == 1 && (
                            <option value={`+${data?.isd_code}`} key={index}>
                              +{data?.isd_code}
                            </option>
                          ),
                      )}
                  </FormSelect>

                  {/* PHONE NUMBER INPUT */}
                  <FormInput
                    type="text"
                    placeholder="Phone Number"
                    id="broker_phone"
                    maxLength={15}
                    onKeyDown={(e) => onlyNumbers(e)}
                    aria-label="Phone Number"
                    value={receiverDetails?.broker_phone}
                    onChange={(e: any) =>
                      setReceiverDetails((prev) => ({
                        ...prev,
                        broker_phone: e.target.value,
                      }))
                    }
                    className="w-2/3"
                  />
                </InputGroup>
              </div>

              {/* BROKER COMPANY NAME */}
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="broker_company_name">
                  BROKER COMPANY NAME<span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  type="text"
                  id="broker_company_name"
                  value={receiverDetails?.broker_company_name}
                  onChange={(e: any) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      broker_company_name: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          ) : null}
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

export default ReceiverModal;
