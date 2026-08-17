import React, { useState } from "react";
import { Disclosure } from "../../../base-components/Headless";
import Lucide from "../../../base-components/Lucide";
import { Link } from "react-router-dom";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";

const main = () => {
  const { gstStatus, isDirectCust } = useFranchisee();
  const [currentStep, setCurrentStep] = useState(2);

  const handleStep = (step: any) => {
    if (currentStep == step) {
      setCurrentStep("");
    } else {
      setCurrentStep(step);
    }
  };

  const stopPropagation = (e: any) => {
    e.stopPropagation();
    e.isPropagationStopped();
  };

  return (
    <>
      <div className="w-full max-w-6xl p-2 lg:px-10 bg-white rounded-xl shadow-lg  mt-8 mb-4 lg:mb-16 z-[0] relative m-auto">
        <Disclosure.Group variant="boxed" className="mb-8">
          <Disclosure className="border-none cursor-none my-8">
            <Disclosure.Button className="text-center text-mustard font-bold text-[21px] lg:text-4xl ">
              Knowledge Base
            </Disclosure.Button>
          </Disclosure>
          <Disclosure
            className="rounded-xl shadow-md"
            onClick={() => handleStep(1)}
          >
            <Disclosure.Button className="text-mustard text-base flex justify-between">
              <span> How to Book an International Shipment ? </span>
              <Lucide
                icon="ChevronUp"
                onClick={() => setCurrentStep(1)}
                className={`${
                  currentStep == 1 ? "" : "rotate-180 transform"
                } h-5 w-5 stroke-2.5 text-mustard`}
              />
            </Disclosure.Button>
            <Disclosure.Panel
              className="leading-relaxed text-slate-600 dark:text-slate-500"
              onClick={(e: any) => stopPropagation(e)}
            >
              {" "}
              To know how to book an international shipment.{" "}
              <Link
                to="https://scribehow.com/shared/How_to_Book_an_International_Shipment_Online__VnFfE8gxQA2IZiBB9XSxPg"
                target="_blank"
                className="text-mustard font-bold text-base"
              >
                Click here
              </Link>
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure
            className="rounded-xl shadow-md"
            onClick={() => handleStep(2)}
          >
            <Disclosure.Button className="text-mustard text-base  flex justify-between">
              <span>
                {" "}
                How to Recharge Your Account Using Cashfree Payment ?{" "}
              </span>
              <Lucide
                icon="ChevronUp"
                onClick={() => setCurrentStep(2)}
                className={`${
                  currentStep == 2 ? "" : "rotate-180 transform"
                } h-5 w-5 stroke-2.5 text-mustard`}
              />
            </Disclosure.Button>
            <Disclosure.Panel
              className="leading-relaxed text-slate-600 dark:text-slate-500"
              onClick={(e: any) => stopPropagation(e)}
            >
              To know how to recharge your account using Cashfree Payment.{" "}
              <Link
                to="https://scribehow.com/shared/How_to_Recharge_Your_Account_Using_Cashfree_Payment__03fM4_71S7-JZvlopDeejA"
                target="_blank"
                className="text-mustard font-bold text-base"
              >
                Click here
              </Link>
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure
            className="rounded-xl shadow-md"
            onClick={() => handleStep(3)}
          >
            <Disclosure.Button className="text-mustard text-base flex justify-between">
              <span>How to Track Shipment Using Airwaybill Number ?</span>
              <Lucide
                icon="ChevronUp"
                onClick={() => setCurrentStep(3)}
                className={`${
                  currentStep == 3 ? "" : "rotate-180 transform"
                } h-5 w-5 stroke-2.5 text-mustard`}
              />
            </Disclosure.Button>
            <Disclosure.Panel
              className="leading-relaxed text-slate-600 dark:text-slate-500"
              onClick={(e: any) => stopPropagation(e)}
            >
              {" "}
              To know how to Track shipment using Airwaybill Number.{" "}
              <Link
                to="https://scribehow.com/shared/Track_Shipment_Using_Airwaybill_Number__WZEzJZc1Ra6hip1h3flUNA"
                target="_blank"
                className="text-mustard font-bold text-base"
              >
                Click here
              </Link>
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure
            className="rounded-xl shadow-md"
            onClick={() => handleStep(4)}
          >
            <Disclosure.Button className="text-mustard text-base  flex justify-between">
              <span>How to Create and Download B2C Shipper Invoice ?</span>
              <Lucide
                icon="ChevronUp"
                onClick={() => setCurrentStep(4)}
                className={`${
                  currentStep == 4 ? "" : "rotate-180 transform"
                } h-5 w-5 stroke-2.5 text-mustard`}
              />
            </Disclosure.Button>
            <Disclosure.Panel
              className="leading-relaxed text-slate-600 dark:text-slate-500"
              onClick={(e: any) => stopPropagation(e)}
            >
              To know how to create and download B2C shipper invoice.{" "}
              <Link
                to="https://scribehow.com/shared/Create_and_Download_B2C_Shipper_Invoice__WMDiMpWOTh2uDgV_XRiE-A"
                target="_blank"
                className="text-mustard font-bold text-base"
              >
                Click here
              </Link>
            </Disclosure.Panel>
          </Disclosure>
          <Disclosure
            className="rounded-xl shadow-md"
            onClick={() => handleStep(5)}
          >
            <Disclosure.Button className="text-mustard text-base  flex justify-between">
              <span>How To Contact sKart Express Support ?</span>
              <Lucide
                icon="ChevronUp"
                onClick={() => setCurrentStep(5)}
                className={`${
                  currentStep == 5 ? "" : "rotate-180 transform"
                } h-5 w-5 stroke-2.5 text-mustard`}
              />
            </Disclosure.Button>
            <Disclosure.Panel
              className="leading-relaxed text-slate-600 dark:text-slate-500"
              onClick={(e: any) => stopPropagation(e)}
            >
              To know how to contact sKart Express Support.{" "}
              <Link
                to="https://scribehow.com/shared/How_To_Contact_Skart_Express_Support__E_ae7_sDS8K4mKiK1BiuMw"
                target="_blank"
                className="text-mustard font-bold text-base"
              >
                Click here
              </Link>
            </Disclosure.Panel>
          </Disclosure>
          {isDirectCust && gstStatus == "2" ? (
            <></>
          ) : (
            <Disclosure
              className="rounded-xl shadow-md"
              onClick={() => handleStep(6)}
            >
              <Disclosure.Button className="text-mustard text-base  flex justify-between">
                <span>How To Access the Invoice Dashboard on sKart ?</span>
                <Lucide
                  icon="ChevronUp"
                  onClick={() => setCurrentStep(6)}
                  className={`${
                    currentStep == 6 ? "" : "rotate-180 transform"
                  } h-5 w-5 stroke-2.5 text-mustard`}
                />
              </Disclosure.Button>
              <Disclosure.Panel
                className="leading-relaxed text-slate-600 dark:text-slate-500"
                onClick={(e: any) => stopPropagation(e)}
              >
                To know how to access the Invoice Dashboard on sKart.{" "}
                <Link
                  to="https://scribehow.com/shared/Accessing_the_Invoice_Dashboard_on_sKart__6afCLzJHTYedIMAAHjV5Tg"
                  target="_blank"
                  className="text-mustard font-bold text-base"
                >
                  Click here
                </Link>
              </Disclosure.Panel>
            </Disclosure>
          )}
        </Disclosure.Group>
      </div>
    </>
  );
};

export default main;
