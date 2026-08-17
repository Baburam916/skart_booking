import React, { useEffect, useState } from "react";

import cards from "../../../assets/images/icons/cards.png";
import phonepe from "../../../assets/images/icons/phone-pe.png";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import { getCurrentDate } from "../../../utils";
import {
  cashfreeRechargeInitiateApi,
  cashfreeRechargeVerifyApi,
  getCurrencyApi,
  phonePeRechargeApi,
  walletRechargeApi,
} from "../../../AllServices/config.service";
import { useAlert } from "../../../ContextProvider/AlertContext";
// @ts-ignore
import { load } from "@cashfreepayments/cashfree-js";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import { useLocation } from "react-router-dom";
import { commongetrequest } from "../../../AllServices/services";

interface WalletRechargeProps {
  onClose: () => void;
  amount: any;
  method: any;
  setCurrentStep: (step: number) => void;
  setCurrentFaq: (index: number) => void;
  handleFranchisee: () => void;
}

const WalletRecharge: React.FC<WalletRechargeProps> = ({
  onClose,
  amount,
  method,
  setCurrentStep,
  setCurrentFaq,
  handleFranchisee,
}) => {
  let cashfree;
  const { showAlert } = useAlert();
  const { isDirectCust, currencyId, isOverseas } = useFranchisee();
  const [spinner, setSpinner] = useState(false);
  const [paymentOption, setPaymentOption] = useState<any>(method || "");
  const [cashFreeAmount, setCashFreeAmount] = useState(
    isDirectCust ? amount : ""
  );
  const [fileName, setFileName] = useState("No file chosen");
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [bankInitial, setBankInitial] = useState({
    recharge_amount: "",
    utr_no: "",
    utrn_date: getCurrentDate(),
    bank_id: "",
    ...(isOverseas ? { transaction_id: "" } : {}),
  });
  const [bankTransfer, setBankTransfer] = useState(bankInitial);
  const [phonePeAmount, setPhonePeAmount] = useState<any>();
  const [currencyData, setCurrencyData] = useState([]);
  const [bName, setBName] = useState<any[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<number | "">("");
  const [error, setError] = useState<{ bank_id?: string }>({});
  const location = useLocation();

  let insitialzeSDK = async function () {
    const hostname = window.location.hostname;
    cashfree = await load({
      mode: hostname == "booking.skart-express.com" ? "production" : "sandbox",
    });
  };
  insitialzeSDK();

  const getSessionId = async () => {
    const currencyCode =
      currencyData?.find((item) => item?.id == currencyId)?.currency || "INR";

    try {
      let res = await cashfreeRechargeInitiateApi(cashFreeAmount, currencyCode);
      if (res?.data && res?.data?.data?.order_id) {
        return res?.data?.data;
      } else if (res?.request?.status == 401) {
        showAlert("Unauthorized person!", "error");
      } else if (res?.response?.status == 406) {
        showAlert(res?.response?.data?.errors[0]?.msg, "warning");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
    }
  };

  const bankName = async () => {
    try {
      const res = await commongetrequest("admin/skart-bank-details");
      if (res?.status === 200 && Array.isArray(res?.data?.data)) {
        setBName(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    bankName();
  }, []);

  const verifyPayment = async (orderId: string) => {
    try {
      let res = await cashfreeRechargeVerifyApi(orderId);
      if (res?.status == 200) {
        showAlert("Payment success");
        setSpinner(false);
        if (
          isDirectCust &&
          location.pathname != "/franchisee/franchisee_wallet_recharge"
        ) {
          setCurrentStep(3);
          setCurrentFaq(3);
          setPaymentOption();
          onClose();
          handleFranchisee();
        }
        // setSpinner(false);
      } else if (res?.status == 400) {
        showAlert(res?.response?.data?.error, "error");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert("Payment Verification Failed.", "error");
      setSpinner(false);
    }
  };

  const cashFreeRecharge = async () => {
    if (!cashFreeAmount || cashFreeAmount <= 0) {
      return showAlert("Please Enter Valid Recharge Amount", "error");
    }
    setSpinner(true);

    try {
      const response = await getSessionId();
      if (response) {
        let insitialzeSDK = async function () {
          cashfree = await load({
            mode:
              process.env.NODE_ENV == "development" ? "sandbox" : "production",
          });
        };
        insitialzeSDK();
        let checkoutOptions = {
          paymentSessionId: response?.payment_session_id,
          redirectTarget: "_modal",
        };

        cashfree?.checkout(checkoutOptions)?.then((paymentStatus: any) => {
          // console.log(paymentStatus);

          if (paymentStatus.paymentDetails) {
            verifyPayment(response?.order_id);
          } else if (paymentStatus.error) {
            verifyPayment(response?.order_id);
            showAlert("Payment Failed.", "error");
            setSpinner(false);
            // console.log("Payment failed. Not verifying.");
          }
          setCashFreeAmount("");
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSpinner(false);
    }
  };

  const phonepeRecharge = async () => {
    if (!phonePeAmount || phonePeAmount <= 0) {
      return showAlert("Please Enter Valid Recharge Amount", "error");
    }

    setSpinner(true);
    try {
      const response = await phonePeRechargeApi(phonePeAmount);
      if (response?.data?.data?.instrumentResponse?.redirectInfo?.url) {
        // window.location.href =
        //   response?.data?.data?.instrumentResponse?.redirectInfo?.url;

        window.open(
          response.data.data.instrumentResponse.redirectInfo.url,
          "_blank"
        );
      } else if (response?.request?.status == 401) {
        showAlert("Unauthorized person!", "error");
      } else if (response?.response?.status == 406) {
        showAlert(response?.response?.data?.errors[0]?.msg, "warning");
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
      setSpinner(false);
    }
  };

  const offlineRecharge = async () => {
    // console.log(bankTransfer);

    if (
      !bankTransfer ||
      !bankTransfer?.recharge_amount ||
      !bankTransfer?.utr_no ||
      !bankTransfer?.utrn_date ||
      !bankTransfer.bank_id
    ) {
      return showAlert("Please fill all the details", "error");
    }

    if (Number(bankTransfer.recharge_amount) <= 0) {
      return showAlert("Please Enter Valid Recharge Amount", "error");
    }
    if (bankTransfer?.utrn_date > getCurrentDate()) {
      return showAlert(
        "Future dates are not allowed. Please enter a valid date.",
        "error"
      );
    }

    const formData = new FormData();
    formData.append("recharge_amount", bankTransfer?.recharge_amount);
    formData.append("utr_no", bankTransfer?.utr_no);
    formData.append("utrn_date", bankTransfer?.utrn_date);
    formData.append("document", selectedFile);
    formData.append("bank_id", bankTransfer.bank_id);
    if (isOverseas && bankTransfer?.transaction_id) {
      formData.append("transaction_id", bankTransfer?.transaction_id);
    }

    setSpinner(true);

    try {
      const response = await walletRechargeApi(formData);
      if (response?.status === 200) {
        showAlert("Wallet Recharge Request Initiated ");
        setBankTransfer(bankInitial);
        setSelectedBankId("");
        setFileName("No file chosen");
        setSelectedFile(null);
      } else if (response?.response?.status == 406) {
        showAlert(response?.response?.data?.errors[0]?.msg, "warning");
      } else if (response?.status == 400) {
        showAlert(
          response?.response?.data?.error || "something went wrong",
          "error"
        );
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error"
        );
      }
    } catch (error) {
      // console.log(error);
      showAlert("something went wrong", "error");
    } finally {
      setSpinner(false);
    }
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("No file chosen");
    }
  };

  useEffect(() => {
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 pt-4 bg-white rounded-lg shadow-md">
      {!isDirectCust && (
        <>
          <h1 className="text-2xl font-semibold ">Recharge Wallet</h1>
          <div className="flex justify-center w-full my-2 border-t border-slate-200 dark:border-darkmode-400"></div>
        </>
      )}

      <div>
        <label className="text-lg text-slate-600 mb-6">
          Please select your preferred payment option.
        </label>

        {location.pathname == "/franchisee/franchisee_wallet_recharge" &&
          !isOverseas && (
            <div className="border rounded-lg mt-2  py-3">
              <FormCheck className="m-3 mt-4 h-10">
                <FormCheck.Input
                  id="radio-switch-1"
                  type="radio"
                  name="vertical_radio_button"
                  checked={paymentOption == 1}
                  onChange={() => setPaymentOption(1)}
                />
                <FormCheck.Label htmlFor="radio-switch-1">
                  Phone Pe
                </FormCheck.Label>
                <img src={phonepe} alt="cards" className="h-8 mx-2" />
              </FormCheck>
              {paymentOption == 1 && (
                <div className=" mx-8 py-2">
                  <div className="flex gap-4 item-center justify-between">
                    <FormLabel
                      htmlFor="regular-form-1"
                      className="mt-2 whitespace-nowrap"
                    >
                      Amount{" "}
                      {isOverseas && currencyId
                        ? `(${
                            (
                              currencyData?.find(
                                (item) => item?.id == currencyId
                              ) ?? currencyData?.find((item) => item?.id == 24)
                            )?.symbol || " "
                          })`
                        : "(₹)"}{" "}
                      : <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      id="regular-form-1"
                      type="number"
                      maxLength={14}
                      onChange={(e) => setPhonePeAmount(e.target.value)}
                    />

                    <Button
                      onClick={phonepeRecharge}
                      rounded
                      disabled={paymentOption == 1 && spinner}
                      className="w-24 font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed bg-mustard text-white"
                    >
                      PAY{" "}
                      {paymentOption == 2 && spinner && (
                        <LoadingIcon
                          icon="puff"
                          color="white"
                          className="w-5 h-5 ml-2 stroke-2.5 text-white"
                        />
                      )}
                    </Button>
                  </div>
                  <div className="text-red-500 mt-2 whitespace-wrap text-xs font-bold">
                    {" "}
                    <p>DISCLAIMER :</p>
                    <p>
                      * PLEASE COMPLETE YOUR PAYMENT WITH IN 15 MINUTES TIME
                      INTERVAL .
                    </p>
                    <p>
                      * PLEASE DO NOT REFRESH THE PAGE OR GO BACK WHILE THE
                      PAYMENT IS BEING PROCESSED.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        {
          <div className="border rounded-lg py-3">
            <FormCheck className="m-3 mt-4">
              <FormCheck.Input
                id="radio-switch-2"
                type="radio"
                name="vertical_radio_button"
                checked={paymentOption == 2}
                onChange={() => setPaymentOption(2)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                <FormCheck.Label htmlFor="radio-switch-2">
                  Pay Using Cashfree Gateway
                </FormCheck.Label>
                <img src={cards} alt="cards" className="h-10" />
              </div>
            </FormCheck>
            {paymentOption == 2 && (
              <div className=" mx-8 py-2">
                <div className="flex gap-4 item-center justify-between">
                  <FormLabel
                    htmlFor="regular-form-1"
                    className="mt-2 whitespace-nowrap"
                  >
                    Amount{" "}
                    {isOverseas && currencyId
                      ? `(${
                          (
                            currencyData?.find(
                              (item) => item?.id == currencyId
                            ) ?? currencyData?.find((item) => item?.id == 24)
                          )?.symbol || " "
                        })`
                      : "(₹)"}{" "}
                    : <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    id="regular-form-1"
                    type="number"
                    maxLength={14}
                    value={cashFreeAmount}
                    disabled={
                      isDirectCust &&
                      location.pathname !=
                        "/franchisee/franchisee_wallet_recharge"
                    }
                    onChange={(e) => setCashFreeAmount(e.target.value)}
                  />
                  <Button
                    onClick={cashFreeRecharge}
                    rounded
                    disabled={paymentOption == 2 && spinner}
                    className="w-24 font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed bg-mustard text-white"
                  >
                    PAY{" "}
                    {paymentOption == 2 && spinner && (
                      <LoadingIcon
                        icon="puff"
                        color="white"
                        className="w-5 h-5 ml-2 stroke-2.5 text-white"
                      />
                    )}
                  </Button>
                </div>
                <div className="text-red-500 mt-2 whitespace-wrap text-xs font-boldtext-xs font-bold">
                  {" "}
                  <p>DISCLAIMER :</p>
                  <p>
                    * PLEASE COMPLETE YOUR PAYMENT WITH IN 15 MINUTES TIME
                    INTERVAL .
                  </p>
                  <p>
                    * PLEASE DO NOT REFRESH THE PAGE OR GO BACK WHILE THE
                    PAYMENT IS BEING PROCESSED.
                  </p>
                  <p>
                    ** Convenience fee Applies on payment methods other than
                    UPI. ( No fee on UPI payments. )
                  </p>
                </div>
              </div>
            )}
          </div>
        }

        {(isOverseas || !isDirectCust) &&
          location.pathname == "/franchisee/franchisee_wallet_recharge" && (
            <div className="border rounded-lg py-3">
              <FormCheck className="m-3 mt-4 h-10">
                <FormCheck.Input
                  id="radio-switch-3"
                  type="radio"
                  name="vertical_radio_button"
                  checked={paymentOption == 3}
                  onChange={() => setPaymentOption(3)}
                />
                <FormCheck.Label htmlFor="radio-switch-3">
                  Direct Bank Transfer {!isOverseas ? "(NEFT/IMPS)" : ""}
                </FormCheck.Label>
              </FormCheck>
              {paymentOption == 3 && (
                <div className="space-y-4 my-4">
                  <div className="grid grid-cols-2  mx-8 item-center justify-between">
                    <FormLabel  htmlFor="regular-form-1" className="mt-2 whitespace-nowrap">
                      Bank Name{" "}:{" "}<span className="text-red-400">*</span>
                    </FormLabel>
                    <FormSelect
                      id="bank_id"
                      value={selectedBankId}
                      className={error?.bank_id ? "border-red-500" : ""}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const value = e.target.value;
                        setSelectedBankId(value ? Number(value) : "");
                        setBankTransfer((prev) => ({
                          ...prev,
                          bank_id: value,
                        }));
                        setError((pre) => ({ ...pre, bank_id: "" }));
                      }}
                    >
                      <option value="">Select Bank Name</option>
                      {bName.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.bank_name}
                        </option>
                      ))}
                    </FormSelect>
                  </div>

                  <div className="grid grid-cols-2 mx-8 item-center justify-between">
                    <FormLabel
                      htmlFor="regular-form-1"
                      className="mt-2 whitespace-nowrap"
                    >
                      Amount{" "}
                      {isOverseas && currencyId
                        ? `(${
                            (
                              currencyData?.find(
                                (item) => item?.id == currencyId
                              ) ?? currencyData?.find((item) => item?.id == 24)
                            )?.symbol || " "
                          })`
                        : "(₹)"}{" "}
                      : <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      id="regular-form-1"
                      type="number"
                      maxLength={14}
                      value={bankTransfer?.recharge_amount}
                      onChange={(e) =>
                        setBankTransfer((prev) => ({
                          ...prev,
                          recharge_amount: e.target.value,
                        }))
                      }
                    />
                  </div>
                  
                  <div className="grid grid-cols-2  mx-8 item-center justify-between">
                    <FormLabel
                      htmlFor="regular-form-1"
                      className="mt-2 whitespace-nowrap"
                    >
                      {isOverseas ? "Transaction Id " : "UTR No. "} :{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      id="regular-form-1"
                      type="text"
                      value={bankTransfer?.utr_no}
                      onChange={(e) =>
                        setBankTransfer((prev) => ({
                          ...prev,
                          utr_no: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {isOverseas ? (
                    <div className="grid grid-cols-2  mx-8 item-center justify-between">
                      <FormLabel
                        htmlFor="regular-form-1"
                        className="mt-2 whitespace-nowrap"
                      >
                        Swift Code :
                      </FormLabel>
                      <FormInput
                        id="regular-form-1"
                        type="text"
                        value={bankTransfer?.transaction_id}
                        onChange={(e) =>
                          setBankTransfer((prev) => ({
                            ...prev,
                            transaction_id: e.target.value,
                          }))
                        }
                      />
                    </div>
                  ) : null}
                  <div className="grid grid-cols-2  mx-8 item-center justify-between">
                    <FormLabel
                      htmlFor="regular-form-1"
                      className="mt-2 whitespace-nowrap"
                    >
                      {isOverseas ? "Transaction " : "UTRN "} Date{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      id="regular-form-1"
                      type="date"
                      value={bankTransfer?.utrn_date}
                      max={getCurrentDate()}
                      onChange={(e) =>
                        setBankTransfer((prev) => ({
                          ...prev,
                          utrn_date: e.target.value,
                        }))
                      }
                    />
                  </div>

                  {/* <div className="col-span-12 sm:col-span-12">
                <FormLabel htmlFor="modal-form-4">Upload CSV</FormLabel>
                <FormInput
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  // onChange={handleFileChange}
                />
              </div> */}
                  <div className="grid grid-cols-2 mx-8 item-center justify-between">
                    <FormLabel
                      htmlFor="regular-form-1"
                      className="mt-2 whitespace-nowrap"
                    >
                      Upload File
                    </FormLabel>
                    <div className=" flex border-2 border-l-none  rounded-lg">
                      <label
                        className="cursor-pointer bg-mustard text-white px-4 py-3 rounded-l-lg"
                        htmlFor="file-upload"
                      >
                        File
                        <input
                          className="sr-only"
                          id="file-upload"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>
                      <div className="p-2 pt-3 text-gray-500 whitespace-nowrap overflow-hidden overflow-ellipsis">
                        {fileName}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mx-8">
                    <Button
                      onClick={() => offlineRecharge()}
                      rounded
                      disabled={paymentOption == 3 && spinner}
                      className="w-24 font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed bg-mustard text-white"
                    >
                      PAY{" "}
                      {paymentOption == 3 && spinner && (
                        <LoadingIcon
                          icon="puff"
                          color="white"
                          className="w-5 h-5 ml-2 stroke-2.5 text-white"
                        />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default WalletRecharge;
