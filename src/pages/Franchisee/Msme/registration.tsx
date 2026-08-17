import React, { useEffect, useRef, useState } from "react";
import {
  FormInput,
  FormLabel,
  FormSelect,
  InputGroup,
} from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import {
  getLocalPincodeApi,
  msmeRegister,
  taxPaymentOptionApi,
} from "../../../AllServices/config.service";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import LoadingIcon from "../../../base-components/LoadingIcon";

const main = ({ setShowReg, handleGetData }) => {
  const { showAlert } = useAlert();
  const { franchiseeId, hubId } = useFranchisee();
  const [taxPayOption, setTaxPayOption] = useState([]);
  const initialData = {
    franchisee_id: franchiseeId,
    hub_id: hubId,
    company_name: "",
    contact_person: "",
    mobile_number: "",
    address_1: "",
    address_2: "",
    pincode: "",
    city: "",
    state: "",
    customers_email: "",
    gstin_number: "",
    iec_code: "",
    pan_number: "",
    tax_payment_status: "",
    gstin_signed_stamped: null,
    iec_signed_stamped: null,
    company_pan: null,
    authorisation_letter: null,
  };
  const [registration, setRegistration] = useState(initialData);
  const [spinner, setSpinner] = useState(false);

  const gstin_signed_stamped = useRef<HTMLInputElement | null>(null);
  const iec_signed_stamped = useRef<HTMLInputElement | null>(null);
  const company_pan = useRef<HTMLInputElement | null>(null);
  const authorisation_letter = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setRegistration((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleCityState = async (pincode: any) => {
    if (!pincode) {
      return;
    }
    try {
      const response = await getLocalPincodeApi(pincode);
      if (response?.status == 200) {
        setRegistration((prev) => ({
          ...prev,
          city: response?.data?.data[0]?.city,
          state: response?.data?.data[0]?.state,
        }));
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
    } finally {
    }
  };

  const handleRegistration = async () => {
    for (const key in registration) {
      if (
        registration.hasOwnProperty(key) &&
        (registration[key] == "" || !registration[key])
      ) {
        showAlert(`${key.replaceAll("_", " ")} is required`, "error");
        return;
      }
    }

    const formData = new FormData();
    formData.append("country", "97");

    for (const key in registration) {
      if (registration.hasOwnProperty(key)) {
        if (key === "pincode") {
          formData.append("zipcode", registration[key]);
        } else {
          formData.append(key, registration[key]);
        }
      }
    }

    setSpinner(true);

    try {
      const res = await msmeRegister(formData);
      if (res?.status == 200) {
        showAlert(res?.data?.message);
        setRegistration(initialData);
        setShowReg(false);
        handleGetData();
      } else if (res?.response?.status == 500) {
        showAlert("Internal Server Error", "error");
      } else if (res?.response?.status == 400) {
        showAlert(res?.response?.message, "error");
      } else if (res?.response?.status == 401) {
        showAlert("Unauthorized", "error");
      } else if (res?.response?.status == 404) {
        showAlert("Not Found", "error");
      } else if (res?.response?.status == 502) {
        showAlert("Bad GateWay", "error");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
      showAlert(error?.message, "error");
    } finally {
      setSpinner(false);
    }
  };

  useEffect(() => {
    taxPaymentOptionApi()?.then((res) => setTaxPayOption(res?.data?.data));
  }, []);

  return (
    <div className="w-full max-w-8xl p-6 px-10 bg-white rounded-lg shadow-lg mt-8 mb-16 z-[0] relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 items-end gap-8 w-full">
        <div className="w-full flex items-end">
          <div
            className="p-2 cursor-pointer rounded-full shadow-lg mr-4 w-8 bg-white"
            onClick={() => {
              setShowReg(false);
              handleGetData();
            }}
          >
            <Lucide
              icon="ArrowLeft"
              className="w-4 h-4 stroke-2.5 text-mustard"
            />
          </div>
          <h1 className="text-2xl font-bold text-left whitespace-nowrap">
            MSME Registration
          </h1>
        </div>
      </div>

      <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-4">
          <div>
            <FormLabel htmlFor="company_name">
              Company Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="company_name"
              type="text"
              placeholder="Enter Company Name"
              value={registration.company_name}
              onChange={(e) =>
                setRegistration((prev) => ({
                  ...prev,
                  company_name: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <FormLabel htmlFor="contact_person">
              Contact Person <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="contact_person"
              type="text"
              placeholder="Enter Contact Person"
              value={registration.contact_person}
              onChange={(e) =>
                setRegistration((prev) => ({
                  ...prev,
                  contact_person: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <FormLabel htmlFor="mobile_number">
              Mobile Number <span className="text-red-500">*</span>
            </FormLabel>

            <InputGroup>
              <InputGroup.Text
                id="input-group-email"
                className="flex items-center justify-center"
              >
                <img
                  src="https://flagsapi.com/IN/flat/32.png"
                  alt="india-flag"
                  className="mr-1 w-6 h-5"
                />
                +91
              </InputGroup.Text>
              <FormInput
                id="mobile_number"
                type="text"
                maxLength={10}
                placeholder="Enter Mobile Number"
                value={registration.mobile_number}
                onChange={(e) =>
                  setRegistration((prev) => ({
                    ...prev,
                    mobile_number: e.target.value,
                  }))
                }
              />
            </InputGroup>
          </div>
          <div>
            <FormLabel htmlFor="address_1">
              Address 1 <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="address_1"
              type="text"
              placeholder="Enter Address 1"
              value={registration.address_1}
              onChange={(e) =>
                setRegistration((prev) => ({
                  ...prev,
                  address_1: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <FormLabel htmlFor="address_2">
              Address 2 <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="address_2"
              type="text"
              placeholder="Enter Address 2"
              value={registration.address_2}
              onChange={(e) =>
                setRegistration((prev) => ({
                  ...prev,
                  address_2: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <FormLabel htmlFor="pincode">
              Pincode <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="pincode"
              type="text"
              maxLength={6}
              placeholder="Enter Pincode"
              value={registration.pincode}
              onBlur={() => handleCityState(registration.pincode)}
              onChange={(e) =>
                setRegistration((prev) => ({
                  ...prev,
                  pincode: e.target.value,
                  city: "",
                  state: "",
                }))
              }
            />
          </div>
          <div>
            <FormLabel htmlFor="city">
              City <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="city"
              type="text"
              disabled
              // placeholder="Enter City"
              value={registration.city}
              // onChange={(e) =>
              //   setRegistration((prev) => ({
              //     ...prev,
              //     city: e.target.value,
              //   }))
              // }
            />
          </div>
          <div>
            <FormLabel htmlFor="state">
              State <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="state"
              type="text"
              disabled
              // placeholder="Enter State"
              value={registration.state}
              // onChange={(e) =>
              //   setRegistration((prev) => ({
              //     ...prev,
              //     state: e.target.value,
              //   }))
              // }
            />
          </div>
          <div>
            <FormLabel htmlFor="customers_email">Email</FormLabel>
            <FormInput
              id="customers_email"
              type="text"
              placeholder="Enter Email"
              value={registration.customers_email}
              onChange={(e) =>
                setRegistration((prev) => ({
                  ...prev,
                  customers_email: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <FormLabel htmlFor="gstin_number">
              GSTIN Number <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="gstin_number"
              type="text"
              placeholder="Enter GSTIN Number"
              maxLength={15}
              value={registration.gstin_number}
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) =>
                setRegistration((prev) => ({
                  ...prev,
                  gstin_number: e.target.value?.toUpperCase(),
                }))
              }
            />
          </div>
          <div>
            <FormLabel htmlFor="iec_code">
              IEC Code <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="iec_code"
              type="text"
              placeholder="Enter IEC Code"
              maxLength={10}
              value={registration.iec_code}
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) =>
                setRegistration((prev) => ({
                  ...prev,
                  iec_code: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <FormLabel htmlFor="pan_number">
              PAN Number <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="pan_number"
              type="text"
              placeholder="Enter PAN Number"
              maxLength={10}
              value={registration.pan_number}
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) =>
                setRegistration((prev) => ({
                  ...prev,
                  pan_number: e.target.value?.toUpperCase(),
                }))
              }
            />
          </div>

          <div>
            <FormLabel htmlFor="tax_payment_status">
              Tax Payment <span className="text-red-500">*</span>
            </FormLabel>

            <FormSelect
              className="mt-2 sm:mr-2"
              aria-label="tax_payment_status"
              id="tax_payment_status"
              value={registration.tax_payment_status}
              onChange={(e) =>
                setRegistration((prev) => ({
                  ...prev,
                  tax_payment_status: e.target.value,
                }))
              }
            >
              <option value="0"> Select Tax Payment</option>
              {taxPayOption &&
                taxPayOption?.map((elem, index) => (
                  <option value={elem?.id} key={index}>
                    {elem?.value}
                  </option>
                ))}
            </FormSelect>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          <div>
            <FormLabel htmlFor="gstin_signed_stamped">
              GSTIN (Signed & Stamped) <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="gstin_signed_stamped"
              type="file"
              ref={gstin_signed_stamped}
              onChange={(e) => handleFileChange(e, "gstin_signed_stamped")}
            />
          </div>
          <div>
            <FormLabel htmlFor="iec_signed_stamped">
              IEC (Signed & Stamped) <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="iec_signed_stamped"
              type="file"
              ref={iec_signed_stamped}
              onChange={(e) => handleFileChange(e, "iec_signed_stamped")}
            />
          </div>
          <div>
            <FormLabel htmlFor="company_pan">
              Company's PAN <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="company_pan"
              type="file"
              ref={company_pan}
              onChange={(e) => handleFileChange(e, "company_pan")}
            />
          </div>
          <div>
            <FormLabel htmlFor="authorisation_letter">
              Authorisation Letter <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="authorisation_letter"
              type="file"
              ref={authorisation_letter}
              onChange={(e) => handleFileChange(e, "authorisation_letter")}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <div>
            <Button
              className=" bg-mustard text-white"
              onClick={() => {
                setRegistration(initialData);
                gstin_signed_stamped.current.value = null;
                iec_signed_stamped.current.value = null;
                company_pan.current.value = null;
                authorisation_letter.current.value = null;
              }}
            >
              Reset
            </Button>
          </div>
          <div>
            <Button
              className=" bg-mustard text-white"
              onClick={handleRegistration}
              disabled={spinner}
            >
              Register
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
      </div>
    </div>
  );
};

export default main;
