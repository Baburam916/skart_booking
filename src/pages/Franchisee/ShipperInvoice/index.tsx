import React, { useEffect, useState } from "react";
import {
  FormInput,
  FormLabel,
  InputGroup,
} from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import { Link } from "react-router-dom";
import {
  downloadShipperInvoice,
  getCurrencyApi,
  postShipperDimension,
  shipperDimensionDetails,
  shipperDimensionInputs,
  shipperExtraData,
} from "../../../AllServices/config.service";
import { downloadAttachment, indianFormat } from "../../../utils";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Table from "../../../base-components/Table";
import Tippy from "../../../base-components/Tippy";
import ShipperDimensionModal from "../Modals/ShipperDimensionModal";
import { useFranchisee } from "../../../ContextProvider/FranchiseeContext";

const main = () => {
  const [spinner2, setSpinner2] = useState(false);
  const [awbNo, setAwbNo] = useState("");
  const { showAlert } = useAlert();
  const [spinner, setSpinner] = useState(false);
  const [productDimension, setProductDimension] = useState([]);
  const [open, setOpen] = useState(false);
  const [bookingDimension, setBookingDimension] = useState([]);
  const [dimensionData, setDimensionData] = useState([]);
  const [isEditDimension, setIsEditDimension] = useState(false);
  const [editDimensionData, setEditDimensionData] = useState([]);
  const [editIndex, setEditIndex] = useState();
  const [airwaybillno, setAirwaybillno] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [noOfCarton, setNoOfCarton] = useState("");
  const [loader, setLoader] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const { currencyId, isOverseas } = useFranchisee();

  const handleCheck = async () => {
    setProductDimension([]);
    setSpinner(true);
    try {
      const response = await shipperDimensionDetails(awbNo);
      const res = await shipperDimensionInputs(awbNo);
      if (res?.data?.status == 200) {
        setProductDimension((prev) => [...prev, ...res?.data?.data?.items]);
      }
      if (response?.data?.status == 200) {
        if (response?.data?.data?.length > 0) {
          setProductDimension((prev) => [...prev, ...response?.data?.data]);
          setAwbNo("");
        }
      } else if (response?.response?.data?.status == 404) {
        showAlert(response?.response?.data?.error, "warning");
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert("Something Went Wrong", "error");
    } finally {
      setSpinner(false);
    }
  };

  const handleDelete = (e, index) => {
    e.stopPropagation();
    e.isPropagationStopped();
    const newData = [...dimensionData];
    newData.splice(index, 1);

    if (newData.length === 0) {
      setDimensionData([]);
    } else {
      setDimensionData(newData);
    }
  };

  const getDimensionData = async () => {
    if (airwaybillno) {
      setLoader(true);
      try {
        setInvoiceNo("");
        setDimensionData("");
        setBookingDimension("");
        setNoOfCarton("");
        const response = await shipperDimensionInputs(airwaybillno);
        const res = await shipperExtraData(airwaybillno);

        if (response?.data?.status == 200) {
          setInvoiceNo(response?.data?.data?.booking_invoice_no);
          setBookingDimension(response?.data?.data?.items);
          setNoOfCarton(response?.data?.data?.no_of_carton);
        } else if (response?.response?.data?.status == 404) {
          showAlert(response?.response?.data?.error, "warning");
        } else {
          showAlert(
            response?.data?.message ||
              response?.response?.data?.message ||
              response?.message,
            "error"
          );
        }
        if (res?.data?.status == 200) {
          setDimensionData(res?.data?.Data);
        }
      } catch (error) {
        showAlert("Something Went Wrong", "error");
        console.log(error);
      } finally {
        setLoader(false);
      }
    } else {
      showAlert("Please Enter Airwaybill Number", "warning");
    }
  };

  const submitData = async () => {
    if (airwaybillno == "") {
      showAlert("Please Enter Airwaybill Number", "error");
      return;
    } else if (invoiceNo == "") {
      showAlert("Please Enter Invoice Number", "error");
      return;
    } else if (noOfCarton == "") {
      showAlert("Please Enter No Of Carton", "error");
      return;
    } else if (dimensionData.length == 0) {
      showAlert("Please Enter Dimension Data", "error");
      return;
    }

    const data = {
      airwaybill: airwaybillno,
      invoice: invoiceNo,
      lut_no: noOfCarton,
      no_of_carton: noOfCarton,
      items: dimensionData,
    };

    try {
      const response = await postShipperDimension(data);
      // console.log(response);
      if (response?.data?.status == 200) {
        showAlert(response?.data?.message);
        setAirwaybillno("");
        setInvoiceNo("");
        setNoOfCarton("");
        setDimensionData([]);
        setProductDimension([]);
        setBookingDimension([]);
      } else if (response?.response?.data?.status == 404) {
        showAlert(response?.response?.data?.error, "error");
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error"
        );
      }
    } catch (error) {}
  };

  const handleDownload = async () => {
    setSpinner2(true);
    try {
      const response = await downloadShipperInvoice(awbNo);

      // console.log(response);

      if (response?.data?.status == 200) {
        setAwbNo("");
        downloadAttachment(response?.data?.pdf_path, "Invoice");
      } else if (response?.response?.data?.status == 404) {
        showAlert(response?.response?.data?.error, "error");
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert("Something Went Wrong", "error");
      console.log(error);
    } finally {
      setSpinner2(false);
    }
  };

  useEffect(() => {
    getCurrencyApi().then((res) => setCurrencyData(res?.data?.data));
  }, []);

  return (
    <>
      <div className="w-full max-w-8xl mx-auto mt-8  bg-white rounded-lg shadow-lg ">
        <div className="py-2 px-4">
          <h1 className="text-2xl font-bold ">Generate Invoice</h1>
        </div>
        <div className="flex justify-center w-full border-t border-slate-200 dark:border-darkmode-400"></div>

        <div className="grid items-end grid-cols-1 md:grid-cols-3 w-full  p-4 gap-4">
          <div className="w-full">
            <FormLabel htmlFor="airwaybill" className="text-base">
              AIRWAYBILL NO <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="airwaybill"
              placeholder="Enter Airwaybill No."
              required
              value={awbNo}
              onChange={(e) => setAwbNo(e.target.value)}
            />
          </div>
          <div className="w-full block md:flex md:justify-end">
            <Button
              elevated
              rounded
              className="px-4 mr-1 w-full md:w-auto bg-mustard text-white whitespace-nowrap"
              disabled={!awbNo || spinner}
              onClick={handleCheck}
            >
              CHECK DIMENSION
              {spinner && (
                <LoadingIcon
                  icon="puff"
                  color="white"
                  className="w-5 h-5 ml-2 stroke-2.5 text-white"
                />
              )}
            </Button>
          </div>
          <div className="w-full ">
            <Button
              elevated
              rounded
              className="mr-1 w-full md:w-auto bg-mustard text-white whitespace-nowrap"
              disabled={!awbNo || spinner2}
              onClick={handleDownload}
            >
              <Lucide icon="Download" className="w-5 h-5 mr-2 stroke-2.5" />
              DOWNLOAD INVOICE
              {spinner2 && (
                <LoadingIcon
                  icon="puff"
                  color="white"
                  className="w-5 h-5 ml-2 stroke-2.5 text-white"
                />
              )}
            </Button>
          </div>
        </div>

        {productDimension?.length > 0 && (
          <div className="py-2">
            <h1 className="text-2xl ml-4 font-bold ">Product Dimension</h1>

            <div className="p-4 gap-4 overflow-x-auto">
              <Table className="table table-text-small mb-0 border">
                <Table.Thead
                  variant="dark"
                  className="thead-primary table-sorting bg-mustard"
                >
                  <Table.Tr className="text-center ">
                    <Table.Th className="whitespace-nowrap border">
                      AIRWAYBILL
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      DESCRIPTION OF GOODS
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      HSN CODE
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      QUANTITY (in Number)
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      RATE{" "}
                      {isOverseas && currencyId
                        ? `(${
                            (
                              currencyData?.find(
                                (item) => item?.id == currencyId
                              ) ?? currencyData?.find((item) => item?.id == 24)
                            )?.symbol || " "
                          })`
                        : "(₹)"}
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border">
                      AMOUNT{" "}
                      {isOverseas && currencyId
                        ? `(${
                            (
                              currencyData?.find(
                                (item) => item?.id == currencyId
                              ) ?? currencyData?.find((item) => item?.id == 24)
                            )?.symbol || " "
                          })`
                        : "(₹)"}
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {productDimension &&
                    productDimension?.map((elem, index) => (
                      <Table.Tr
                        key={index}
                        className={`text-left intro-x ${
                          index % 2 === 1 ? "bg-yellow-50" : ""
                        } hover:bg-yellow-100`}
                      >
                        <Table.Td className="border whitespace-nowrap  capitalize">
                          {elem?.airwaybillno}
                        </Table.Td>
                        <Table.Td className="border whitespace-nowrap  capitalize">
                          {elem?.description_of_goods}
                        </Table.Td>
                        <Table.Td className="border whitespace-nowrap  capitalize">
                          {elem?.hsn_code}
                        </Table.Td>
                        <Table.Td className="border whitespace-nowrap text-right capitalize">
                          {elem?.quantity}
                        </Table.Td>
                        <Table.Td className="border whitespace-nowrap text-right capitalize">
                          {indianFormat(elem?.rate)}
                        </Table.Td>
                        <Table.Td className="border whitespace-nowrap text-right capitalize">
                          {indianFormat(elem?.amount)}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
              </Table>
            </div>
          </div>
        )}
      </div>
      <div className="w-full max-w-8xl mx-auto my-8  bg-white rounded-lg shadow-lg ">
        <div className="py-2 px-4">
          <h1 className="text-2xl font-bold ">Add Invoice</h1>
        </div>
        <div className="flex justify-center w-full border-t border-slate-200 dark:border-darkmode-400"></div>

        <div className="p-4 gap-8 grid grid-cols-1 md:grid-cols-3 ">
          <div>
            <FormLabel htmlFor="airwaybill" className="text-base">
              Airwaybill No. : <span className="text-red-500">*</span>
            </FormLabel>
            <InputGroup>
              <FormInput
                type="text"
                id="airwaybill"
                placeholder="Enter Airwaybill No."
                required
                value={airwaybillno}
                onChange={(e) => setAirwaybillno(e.target.value)}
              />
              <InputGroup.Text
                id="input-group-price"
                className="bg-blue-500 text-white  cursor-pointer border-blue-500 rounded-r-xl flex "
                onClick={getDimensionData}
              >
                CHECK{" "}
                {loader && (
                  <LoadingIcon
                    icon="puff"
                    color="white"
                    className="w-5 h-5 ml-2 stroke-2.5 text-white"
                  />
                )}
              </InputGroup.Text>
            </InputGroup>
          </div>
          <div>
            <FormLabel htmlFor="invoice" className="text-base">
              Invoice No. : <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="invoice"
              placeholder="Enter Invoice No."
              required
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </div>
          <div>
            <FormLabel htmlFor="no_of_carton" className="text-base">
              No. of Carton(s) : <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="no_of_carton"
              placeholder="Enter No. of Cartons"
              type="number"
              required
              value={noOfCarton}
              onChange={(e) => setNoOfCarton(e.target.value)}
            />
          </div>
        </div>

        <div>
          {bookingDimension?.length > 0 && (
            <div className="py-2">
              <h1 className="text-2xl ml-4 font-bold ">Booking Dimension</h1>

              <div className="p-4 gap-4 overflow-x-auto">
                <Table className="table table-text-small mb-0 border">
                  <Table.Thead
                    variant="dark"
                    className="thead-primary table-sorting bg-mustard"
                  >
                    <Table.Tr className="text-center ">
                      <Table.Th className="whitespace-nowrap border">
                        AIRWAYBILL
                      </Table.Th>
                      <Table.Th className="whitespace-nowrap border">
                        DESCRIPTION OF GOODS
                      </Table.Th>
                      <Table.Th className="whitespace-nowrap border">
                        HSN CODE
                      </Table.Th>
                      <Table.Th className="whitespace-nowrap border">
                        QUANTITY (in Number)
                      </Table.Th>
                      <Table.Th className="whitespace-nowrap border">
                        RATE{" "}
                        {isOverseas && currencyId
                          ? `(${
                              (
                                currencyData?.find(
                                  (item) => item?.id == currencyId
                                ) ??
                                currencyData?.find((item) => item?.id == 24)
                              )?.symbol || " "
                            })`
                          : "(₹)"}
                      </Table.Th>
                      <Table.Th className="whitespace-nowrap border">
                        AMOUNT{" "}
                        {isOverseas && currencyId
                          ? `(${
                              (
                                currencyData?.find(
                                  (item) => item?.id == currencyId
                                ) ??
                                currencyData?.find((item) => item?.id == 24)
                              )?.symbol || " "
                            })`
                          : "(₹)"}
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {bookingDimension &&
                      bookingDimension?.map((elem, index) => (
                        <Table.Tr
                          key={index}
                          className={`text-left intro-x ${
                            index % 2 === 1 ? "bg-yellow-50" : ""
                          } hover:bg-yellow-100`}
                        >
                          <Table.Td className="border whitespace-nowrap  capitalize">
                            {elem?.airwaybillno}
                          </Table.Td>
                          <Table.Td className="border whitespace-nowrap  capitalize">
                            {elem?.description_of_goods}
                          </Table.Td>
                          <Table.Td className="border whitespace-nowrap  capitalize">
                            {elem?.hsn_code}
                          </Table.Td>
                          <Table.Td className="border whitespace-nowrap text-right capitalize">
                            {elem?.quantity}
                          </Table.Td>
                          <Table.Td className="border whitespace-nowrap text-right  capitalize">
                            {indianFormat(elem?.rate)}
                          </Table.Td>
                          <Table.Td className="border whitespace-nowrap text-right  capitalize">
                            {indianFormat(elem?.amount)}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          {dimensionData.length > 0 ? (
            <>
              <div>
                <FormLabel
                  htmlFor="regular-form-1"
                  className="text-base font-medium text-gray-900"
                >
                  {" "}
                  Dimensions
                </FormLabel>

                <div className=" p-2 w-full box cursor-pointer  border border-gray-400 flex justify-between items-end">
                  <div className=" flex flex-wrap gap-2 ">
                    {dimensionData &&
                      dimensionData?.map(
                        (elem, index) =>
                          elem?.description_of_goods && (
                            <div
                              key={index}
                              className=" flex  px-2 py-1 gap-4 mr-2 bg-slate-300 items-center justify-between  rounded-lg"
                            >
                              <span
                                className=" text-lg flex capitalize "
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.isPropagationStopped();
                                  setOpen(true);
                                  setIsEditDimension(true);
                                  setEditDimensionData(elem);
                                  setEditIndex(index);
                                }}
                              >
                                {" "}
                                {elem?.description_of_goods}
                              </span>
                              <Tippy
                                content="Delete Dimension"
                                options={{ placement: "top" }}
                              >
                                <Lucide
                                  icon="XCircle"
                                  className="    text-red-500 stroke-2.5 "
                                  onClick={(e) => handleDelete(e, index)}
                                />
                              </Tippy>
                            </div>
                          )
                      )}
                  </div>

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
                        setOpen(true);
                      }}
                    />
                  </Tippy>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button className="bg-mustard text-white" onClick={submitData}>
                  Submit
                </Button>
              </div>
            </>
          ) : (
            <div>
              <Button
                className="bg-mustard text-white"
                onClick={() => {
                  if (airwaybillno) {
                    setOpen(true);
                    setIsEditDimension(false);
                  } else {
                    showAlert("Please Enter Airwaybill No.", "error");
                  }
                }}
              >
                Add Dimension
              </Button>
            </div>
          )}
          <ShipperDimensionModal
            open={open}
            onClose={() => {
              setOpen(false);
              setIsEditDimension(false);
            }}
            dimensionData={dimensionData}
            setDimensionData={setDimensionData}
            isEditDimension={isEditDimension}
            editDimensionData={isEditDimension ? editDimensionData : undefined}
            editIndex={editIndex}
          />
        </div>
      </div>
    </>
  );
};

export default main;
