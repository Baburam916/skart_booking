import React, { useEffect, useState } from "react";
import { FormCheck } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";
import {
  getFranchiseeDetailsApi,
  updateFranchiseeAdditionalSettingsApi,
} from "../../../AllServices/config.service";
import { Send, User, Package, Mail } from "lucide-react";

const options = [
  {
    id: "send-shipper-mail",
    key: "sendShipperMail" as const,
    label: "Send mail to Shipper",
    sub: "Sender",
    icon: User,
    description: "An automated email will be sent to the shipper upon successful creation of an import booking.",
  },
  {
    id: "send-consignee-mail",
    key: "sendConsigneeMail" as const,
    label: "Send mail to Consignee",
    sub: "Receiver",
    icon: User,
    description: "An automated email will be sent to the consignee upon successful creation of an import booking.",
  },
];

const main = () => {
  const { showAlert } = useAlert();
  const { franchiseeId } = useFranchisee();
  const [values, setValues] = useState({ sendShipperMail: 0, sendConsigneeMail: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [updateSpinner, setUpdateSpinner] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await getFranchiseeDetailsApi(franchiseeId);
      if (res?.status === 200) {
        const d = res?.data?.data?.[0];
        setValues({
          sendShipperMail: d?.send_shipper_mail ?? 0,
          sendConsigneeMail: d?.send_consignee_mail ?? 0,
        });
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch {
      showAlert("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setUpdateSpinner(true);
    try {
      const res = await updateFranchiseeAdditionalSettingsApi({
        franchisee_id: franchiseeId,
        send_shipper_mail: values.sendShipperMail,
        send_consignee_mail: values.sendConsigneeMail,
      });
      if (res?.status === 200) {
        showAlert(res?.data?.message || "Updated successfully");
        fetchData();
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch {
      showAlert("Something went wrong", "error");
    } finally {
      setUpdateSpinner(false);
    }
  };

  const toggle = (key: keyof typeof values) => {
    setValues((prev) => ({ ...prev, [key]: prev[key] ? 0 : 1 }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-8xl mx-auto mt-8  p-3 px-2 lg:p-6 lg:px-10 mb-16 bg-white rounded-lg shadow-lg z-[0] relative">
      <div className="flex items-center gap-3 mb-1">
        <Mail className="w-6 h-6 text-mustard stroke-2" />
        <h1 className="text-2xl font-bold">Import Email khkhg</h1>
      </div>
      <p className="text-sm text-gray-400 mb-4 ml-9">
        Configure which parties receive email notifications for shipments.
      </p>

      <div className="flex justify-center w-full mb-6 border-t border-slate-200 dark:border-darkmode-400"></div>

      {isLoading ? (
        <LoadingIcon icon="tail-spin" className="block m-auto w-[4%]" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {options.map(({ id, key, label, sub, icon: Icon, description }) => {
              const checked = !!values[key];
              return (
                <label
                  key={id}
                  htmlFor={id}
                  className={`cursor-pointer rounded-xl border-2 p-2 lg:p-5 transition-all duration-200 flex gap-4 items-start ${
                    checked
                      ? "border-mustard bg-amber-50 shadow-md"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`mt-0.5 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      checked ? "bg-mustard text-white" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800 leading-tight">
                          {label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                      </div>
                      <FormCheck>
                        <FormCheck.Input
                          id={id}
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(key)}
                          className="w-4 h-4 accent-mustard cursor-pointer"
                        />
                      </FormCheck>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{description}</p>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button
              className="bg-mustard text-white px-6"
              onClick={handleUpdate}
              disabled={updateSpinner}
            >
              UPDATE
              {updateSpinner && (
                <LoadingIcon
                  icon="puff"
                  color="white"
                  className="w-5 h-5 ml-2 stroke-2.5 text-white"
                />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default main;
