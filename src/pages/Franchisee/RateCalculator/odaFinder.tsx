import { Disclosure } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import {
  getCurrencyApi,
  odaFinderApi,
} from "../../../AllServices/config.service";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { FormCheck, FormInput, FormLabel } from "../../../base-components/Form";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { indianFormat } from "../../../utils";
import { MapPin, Box, Wallet, Globe, Scale } from "lucide-react";
import CommonSearchableAll from "../../../components/CommonSearchableAll/CommonSearchableAll";
import Disclaimer from "../../../assets/images/disclaimer.png";
import NoFound from "../../../assets/images/no_found.png";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";

const intSelectedData = {
  country_name: "",
  country_id: "",
};

const intSelectedData2 = {
  zipcode: "",
};

const intSelectedData3 = {
  city: "",
};

const main = ({ setToggleUI, setActiveTab }) => {
  const { currencyId, isOverseas } = useFranchisee();
  const [odaWise, setOdaWise] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentFaq, setCurrentFaq] = useState(1);
  const [initial, setInitial] = useState({
    country_id: "",
    country_code: "",
    pincode: "",
    city: "",
    weight: "",
  });
  const [odaData, setOdaData] = useState(initial);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [odaFinderData, setOdaFinderData] = useState([]);
  const [selectedData, setSelectedData] = useState<any>(intSelectedData);
  const [selectedData2, setSelectedData2] = useState<any>(intSelectedData2);
  const [selectedData3, setSelectedData3] = useState<any>(intSelectedData3);
  const { showAlert } = useAlert();
  const [currencyData, setCurrencyData] = useState([]);

  const fun1 = (a: any) => {
    setOdaData((prev) => ({
      ...prev,
      country_code: a?.country_code || "",
      country_id: a?.country_id || "",
    }));
    delete error?.country_id;
  };

  const funtoempty1 = () => {
    setOdaData(initial);
    setSelectedData(intSelectedData);
    setSelectedData2(intSelectedData2);
    setSelectedData3(intSelectedData3);
  };
  const fun2 = (a: any) => {
    setSelectedData2({
      zipcode: a?.zipcode || "",
    });

    setOdaData((prev) => ({
      ...prev,
      pincode: a?.zipcode || "",
    }));

    delete error?.pincode;
  };

  const funtoempty2 = () => {
    setSelectedData2(intSelectedData2);
  };
  const fun3 = (a: any) => {
    setSelectedData3({
      city: a?.city_area || "",
    });

    setOdaData((prev) => ({
      ...prev,
      city: a?.city_area || "",
    }));

    delete error?.city;
  };

  const funtoempty3 = () => {
    setSelectedData2(intSelectedData2);
  };

  const handleOdaFinder = async () => {
    const errors = {};
    let tempData = { ...odaData };

    if (odaWise == 1) {
      if (!tempData.pincode) {
        tempData.pincode = selectedData2?.zipcode;
      }
    } else {
      if (!tempData.city) {
        tempData.city = selectedData3?.city;
      }
    }

    // finally update state once
    setOdaData(tempData);

    // VALIDATION WILL NOW WORK CORRECTLY
    if (!tempData.country_id) {
      errors["country_id"] = "This field is required";
    }
    if (odaWise == 1) {
      if (!tempData.pincode) {
        errors["pincode"] = "This field is required";
      }
    } else {
      if (!tempData.city) {
        errors["city"] = "This field is required";
      }
    }
    if (!tempData.weight) {
      errors["weight"] = "This field is required";
    }
    setError(errors);

    if (Object.keys(errors).length > 0) {
      return showAlert("Please fill all the required fields", "warning");
    }

    setIsLoading(true);

    try {
      const response = await odaFinderApi(tempData);
      if (response?.status == 200) {
        setOdaFinderData(response?.data?.data || []);
        setCurrentStep(2);
        setCurrentFaq(2);
      } else if (response?.status == 406) {
        showAlert(response?.response?.data?.errors[0]?.msg, "error");
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data || []));
  }, []);

  return (
    <>
      <div className="h-auto grid grid-cols-12 gap-4 pb-8 mb-8 mt-8">
        <Disclosure as="div" className=" col-span-12 md:col-span-6 mb-2">
          {({ open }) => (
            <div className="bg-white rounded-lg border border-[#fff]">
              <Disclosure.Button className="flex items-center   w-full justify-between rounded-t-lg bg-[#FFF2D4] px-[15px] py-[8px] text-left text-sm font-medium">
                <div className="w-full flex items-center justify-between">
                  <div className="flex">
                    <div
                      className="p-0 cursor-pointer text-black mr-2"
                      onClick={() => {
                        (setToggleUI(false), setActiveTab(1));
                      }}
                    >
                      <Lucide
                        icon="ArrowLeft"
                        className="w-[22px] h-[24px] text-black"
                      />
                    </div>
                    <h1 className="text-xl font-bold mr-8">ODA / OPA Finder</h1>
                  </div>
                  <div className="flex flex-col mt-2  sm:flex-row">
                    <FormCheck className="mr-2">
                      <FormCheck.Input
                        id="radio-switch-1"
                        type="radio"
                        name="oda_radio_button"
                        checked={odaWise == 1}
                        onClick={() => {
                          setOdaWise(1);
                          setOdaData(initial);
                          setSelectedData(intSelectedData);
                          setSelectedData2(intSelectedData2);
                          setSelectedData3(intSelectedData3);
                          setCurrentStep(1);
                          setCurrentFaq(1);
                        }}
                      />
                      <FormCheck.Label
                        htmlFor="radio-switch-1"
                        className="mb-0"
                      >
                        Zipcode
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck className="mt-2 mr-2 sm:mt-0">
                      <FormCheck.Input
                        id="radio-switch-2"
                        type="radio"
                        name="oda_radio_button"
                        checked={odaWise == 2}
                        onClick={() => {
                          setOdaWise(2);
                          setOdaData(initial);
                          setSelectedData(intSelectedData);
                          setSelectedData2(intSelectedData2);
                          setSelectedData3(intSelectedData3);
                          setCurrentStep(1);
                          setCurrentFaq(1);
                        }}
                      />
                      <FormCheck.Label htmlFor="radio-switch-2">
                        City
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                </div>

                <i className="hidden">
                  {" "}
                  <Lucide
                    icon="ChevronUp"
                    className={` stroke-2.5 h-8 w-8 text-mustard`}
                  />
                </i>
              </Disclosure.Button>
              {currentStep >= 1 && (
                <Disclosure.Panel
                  static={true}
                  className="px-[10px] py-[14px] text-sm text-gray-500  RCalcuatorMain w-full"
                >
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-12 md:col-span-6">
                      <div className="rateCaluotBox ">
                        <FormLabel htmlFor="country-select" className="mb-0">
                          Country <span className="text-red-500">*</span>{" "}
                        </FormLabel>
                        <div className="rateCalculatorInn relative">
                          <i className="absolute z-[1] top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                            <Globe className="w-[18px] stroke-2.5" />
                          </i>
                          <CommonSearchableAll
                            id="country-select"
                            apiEndpoint={"admin/country"}
                            placeholder={"Search Country"}
                            selecteddata={selectedData}
                            setSelecteddata={setSelectedData}
                            fun1={fun1}
                            key1={"country"}
                            comingselectedname={"country_name"}
                            comingselectedid={"country_id"}
                            funtoempty={funtoempty1}
                            zIndex={20}
                            border={error?.country_id ? true : false}
                            className="rateinput"
                          />
                        </div>
                      </div>
                    </div>
                    {odaWise == 1 && (
                      <div className="col-span-12 md:col-span-6">
                        <div className="rateCaluotBox ">
                          <FormLabel htmlFor="zipcode-select" className="mb-0">
                            Zipcode
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="rateCalculatorInn relative">
                            <i className="absolute z-[1] top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                              <MapPin className="w-[18px] stroke-2.5" />
                            </i>
                            <CommonSearchableAll
                              id="zipcode-select"
                              apiEndpoint={`admin/international-pincode?country_code=${
                                selectedData?.country_code || ""
                              }`}
                              placeholder={"Search Zipcode"}
                              selecteddata={selectedData2}
                              setSelecteddata={setSelectedData2}
                              fun1={fun2}
                              key1={"zipcode"}
                              comingselectedname={"zipcode"}
                              questionmark={true}
                              funtoempty={funtoempty2}
                              zIndex={20}
                              border={error?.pincode ? true : false}
                              className="rateinput"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {odaWise == 2 && (
                      <div className="col-span-12 md:col-span-6">
                        <div className="rateCaluotBox ">
                          <FormLabel htmlFor="city-select" className="mb-0">
                            City <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="rateCalculatorInn relative">
                            <i className="absolute z-[1] top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                              <MapPin className="w-[18px] stroke-2.5" />
                            </i>
                            <CommonSearchableAll
                              id="city-select"
                              apiEndpoint={`admin/international-pincode?country_code=${
                                selectedData?.country_code || ""
                              }`}
                              placeholder={"Search City"}
                              selecteddata={selectedData3}
                              setSelecteddata={setSelectedData3}
                              fun1={fun3}
                              key1={"city"}
                              comingselectedname={"city_area"}
                              questionmark={true}
                              funtoempty={funtoempty3}
                              zIndex={20}
                              border={error?.city ? true : false}
                              className="rateinput"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-span-12 md:col-span-6">
                      <div className="rateCaluotBox ">
                        <FormLabel htmlFor="weight" className="mb-0">
                          Weight (in Kgs){" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>

                        <div className="rateCalculatorInn relative">
                          <i className="absolute top-[2px] left-[2px] bg-[#FFFDFD] border-r border-[#EAEAEA] bottom-[0px] w-[30px] h-[91%] flex items-center justify-center rounded-l-[4px]">
                            <Scale className="w-[18px] stroke-2.5" />
                          </i>
                          <FormInput
                            className={`rateinput ${
                              error?.weight ? "border-red-500" : ""
                            }`}
                            id="weight"
                            type="text"
                            maxLength={10}
                            value={odaData?.weight}
                            onChange={(e: any) => {
                              setOdaData((pre) => ({
                                ...pre,
                                weight: e.target.value
                                  .replace(/[^0-9.]/g, "")
                                  .replace(/(\..*)\./g, "$1"),
                              }));
                              delete error?.weight;
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                      <div className="w-full md:w-auto">
                        <Button
                          rounded
                          className="px-2 w-full md:w-24 mr-1 text-white bg-[#8F8F8F]  text-base font-bold hover:bg-mustard"
                          onClick={() => {
                            setOdaData(initial);
                            setOdaWise(1);
                            setCurrentStep(1);
                            setCurrentFaq(1);
                            setSelectedData(intSelectedData);
                            setSelectedData2(intSelectedData2);
                            setSelectedData3(intSelectedData3);
                            setOdaData(initial);
                          }}
                          disabled={isLoading}
                        >
                          Reset
                        </Button>
                      </div>
                      <div className="flex justify-end w-full md:w-auto">
                        <Button
                          rounded
                          className="px-3 w-full md:w-auto  mr-1 text-white bg-mustard  text-base font-bold hover:bg-[#303030]"
                          onClick={handleOdaFinder}
                          disabled={isLoading}
                        >
                          Find
                          {isLoading ? (
                            <LoadingIcon
                              icon="puff"
                              color="white"
                              className="w-5 h-5 ml-2 stroke-2.5 text-white"
                            />
                          ) : (
                            <Lucide
                              icon="Search"
                              className="ml-2 stroke-2.5 h-4 w-4"
                            />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Disclosure.Panel>
              )}
            </div>
          )}
        </Disclosure>
        {currentFaq >= 2 ? (
          odaFinderData?.length > 0 ? (
            <Disclosure as="div" className="  col-span-12 md:col-span-6 mb-2">
              {({ open }) => (
                <div className="bg-white rounded-lg">
                  <Disclosure.Button
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center   w-full justify-between rounded-t-lg bg-[#FFF2D4] px-[15px] py-[6px] text-left text-sm font-medium "
                  >
                    <div>
                      <h1 className="text-xl font-bold">ODA</h1>
                    </div>

                    <i className="hidden">
                      {" "}
                      <Lucide
                        icon="ChevronUp"
                        onClick={() => setCurrentStep(2)}
                        className={`${
                          currentStep == 2
                            ? ""
                            : "rotate-180 transform stroke-2.5"
                        } h-8 w-8 text-mustard`}
                      />
                    </i>
                  </Disclosure.Button>
                  {currentStep == 2 && (
                    <Disclosure.Panel
                      static={true}
                      className="px-[10px] py-[14px] text-sm text-gray-500  RCalcuatorMain w-full "
                    >
                      <div className="w-full">
                        <h3 className="text-lg font-bold text-red-500 flex items-center  mb-1  ">
                          <i>
                            {" "}
                            <img
                              src={Disclaimer}
                              className="w-[18px] animate-bounce transition delay-300 duration-300 ease-in-out"
                            />
                          </i>
                          <small className="font-bold text-red-500 text-lg ml-2 leadinbg-[16px]">
                            {" "}
                            DISCLAIMER :
                          </small>
                        </h3>
                        <h3 className="text-sm text-red-500">
                          * These are indicative only.
                        </h3>
                        <h3 className="text-sm  text-red-500">
                          * The ODA list can be changed by service provider
                          without any prior information.
                        </h3>
                        <h3 className="text-sm text-red-500">
                          * GST and FSC will be applicable additional.
                        </h3>
                      </div>

                      <div className="w-full mt-3">
                        <div className="w-full">
                          <div>
                            {odaFinderData?.map((elem, index) => (
                              <div
                                key={index}
                                className={`text-left cursor-pointer  ${
                                  index % 2 === 1 ? "bg-yellow-50" : ""
                                } hover:bg-yellow-100`}
                              >
                                <div className=" rounded-[9px]   bg-gradient-to-r from-[#EAEAEA] via-[#EAEAEA] to-[#FFD470] p-[1px] mb-2  hover:bg-gradient-to-r hover:from-[#FFD470] hover:via-[#FFD470] hover:to-[#FFD470]">
                                  <div className="hover:bg-[#000] rounded-[8px] px-[12px] py-[10px]  bg-gradient-to-r from-[#FDFDFD] via-[#FDFDFD] to-[#FFF9EB]  hover:bg-gradient-to-r hover:from-[#fffaef] hover:via-[#fffaef] hover:to-[#fffaef] ">
                                    <div className="md:flex block md:justify-between md:items-center w-full">
                                      <div className="  flex      relative mb-[12px] md:mb-0 ">
                                        <figure className="bg-[#E3E3E3] rounded-full p-2 w-[35px] h-[35px]">
                                          <Box className="w-[20px] h-[20px] text-gray-500" />
                                        </figure>
                                        <aside className="ml-3">
                                          <h2 className=" text-sm font-[500] uppercase text-[#585858]">
                                            PRODUCT NAME
                                          </h2>
                                          <p className="text-base font-bold leading-[15px] text-[#262525]">
                                            {elem?.product_name}
                                          </p>
                                        </aside>
                                      </div>

                                      <div className="  flex     relative ">
                                        <figure className="bg-[#FFEEC5] rounded-full p-2 w-[35px] h-[35px]">
                                          <Wallet className="w-[20px] h-[20px] text-[#DBA628]" />
                                        </figure>
                                        <aside className="ml-3">
                                          <h2 className=" text-sm font-[500] uppercase text-[#585858]">
                                            CHARGES{" "}
                                            {isOverseas && currencyId
                                              ? `(${
                                                  (
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
                                          </h2>
                                          <p className="text-base font-bold leading-[15px] text-[#AA7E15]">
                                            {" "}
                                            {indianFormat(elem?.charge) || "-"}
                                          </p>
                                        </aside>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Disclosure.Panel>
                  )}
                </div>
              )}
            </Disclosure>
          ) : isLoading ? (
            <LoadingIcon
              icon="tail-spin"
              className="block m-auto mt-8  w-[4%] "
            />
          ) : (
            <div className="box col-span-12 lg:col-span-6">
              <div className=" w-full  flex items-center justify-center h-full p-5">
                <div className=" w-full text-center ">
                  <img
                    src={NoFound}
                    alt="not Available"
                    className="m-auto w-[85px] animate-bounce"
                  />
                  <h2 className=" w-full text-red-500 font-bold text-xl text-center mt-4">
                    No Data Found!
                  </h2>
                </div>
              </div>
            </div>
          )
        ) : null}
      </div>
    </>
  );
};

export default main;
