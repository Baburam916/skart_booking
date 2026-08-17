import { Dialog } from "../../../../base-components/Headless";
import Button from "../../../../base-components/Button";
import Lucide from "../../../../base-components/Lucide";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import { useState } from "react";
import Table from "../../../../base-components/Table";
import { useFranchisee } from "../../../../ContextProvider/FranchiseeContext";
import { indianFormat } from "../../../../utils";
import CommonModal from "../../../../components/CommonModal";

const validate = (c: any) => {
  const e = {};
  if (!c.description?.trim()) e.description = "Required";
  const qty = Number(c.quantity);
  if (
    c?.quantity === "" ||
    isNaN(qty) ||
    qty <= 0 ||
    !Number.isInteger(Number(qty))
  )
    e.quantity = "Invalid";
  const v = Number(c?.invoice_value);
  if (c?.invoice_value === "" || isNaN(v) || v <= 0)
    e.invoice_value = "Invalid";
  if (!/^\d{8,10}$/.test(c?.hsn_code?.trim())) e.hsn_code = "8-10 digits";
  return e;
};

const initializeItems = (data: any) => {
  return data?.map((item: any) => ({
    ...item,
    commodity: item?.commodity || [
      {
        description: item?.item_description || "",
        invoice_value: Number(item?.invoice_value / item?.quantity).toFixed(2),
        hsn_code: item?.hsn_code || "",
        quantity: 1,
      },
    ],
  }));
};

interface CommodityModalProps {
  open: boolean;
  onClose: () => void;
  dimensionData: any;
  setDimensionData: (data: any) => void;
  setBooking: (data: any) => void;
  currencyData: any;
  checkAcl: () => void;
}

const CommodityModal: React.FC<CommodityModalProps> = ({
  open,
  onClose,
  dimensionData,
  setDimensionData,
  setBooking,
  currencyData,
  checkAcl,
}) => {
  const { showAlert } = useAlert();
  const { isOverseas, currencyId } = useFranchisee();
  const [items, setItems] = useState(initializeItems(dimensionData));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [difference, setDifference] = useState(0);

  const handleChange = (itemIdx: any, commIdx: any, field: any, value: any) => {
    const updated = items?.map((item: any, i: any) =>
      i !== itemIdx
        ? item
        : {
            ...item,
            commodity: item?.commodity?.map((c: any, j: any) =>
              j !== commIdx ? c : { ...c, [field]: value },
            ),
          },
    );
    setItems(updated);
    if (submitted) {
      const errs = { ...errors };
      if (!errs[itemIdx]) errs[itemIdx] = {};
      errs[itemIdx][commIdx] = validate(updated[itemIdx]?.commodity[commIdx]);
      setErrors(errs);
    }
  };

  const handleSubmit = () => {
    setBooking((prev: any) => ({
      ...prev,
      shipment_dimensions: JSON.stringify(items),
    }));
    const errs = {};
    let valid = true;
    items?.forEach((item: any, i: any) => {
      item?.commodity?.forEach((c: any, j: any) => {
        const e = validate(c);
        if (Object.keys(e).length) {
          if (!errs[i]) errs[i] = {};
          errs[i][j] = e;
          valid = false;
        }
      });
    });
    setErrors(errs);
    setSubmitted(true);
    if (valid) {
      // Compare total commodity value vs box invoice value
      items?.forEach((item: any) => {
        const totalRate = item?.commodity?.reduce(
          (sum: any, c: any) =>
            Number(sum) +
            Number(
              (Number(c?.invoice_value) || 1) * (Number(c?.quantity) || 1),
            ),
          0,
        );
        const itemInvoiceValue = items?.reduce(
          (sum: any, c: any) => Number(sum) + (Number(c?.value) || 1),
          0,
        );
        const difference = Math.abs(totalRate - itemInvoiceValue);
        setDifference(difference);
        if (difference > 0) {
          setConfirm(true);
        } else {
          onClose();
          checkAcl();
        }
      });
      setDimensionData(items);
    }
  };

  const addCommodityRow = (itemIdx: any) => {
    const updated = items?.map((item: any, i: any) =>
      i !== itemIdx
        ? item
        : {
            ...item,
            commodity: [
              ...item?.commodity,
              {
                description: item?.item_description || "",
                invoice_value: "",
                hsn_code: item?.hsn_code || "",
                quantity: 1,
              },
            ],
          },
    );
    setItems(updated);
    setErrors({});
  };

  const removeCommodityRow = (itemIdx: any, commIdx: any) => {
    const updated = items?.map((item: any, i: any) =>
      i !== itemIdx
        ? item
        : {
            ...item,
            commodity: item?.commodity?.filter((_, j) => j !== commIdx),
          },
    );
    setItems(updated);
    setErrors({});
  };

  const hasErr = (i: any, j: any, f: any) => errors?.[i]?.[j]?.[f];

  const inputClass = (i: any, j: any, f: any) =>
    `w-full border rounded px-2 py-1 text-sm ${
      hasErr(i, j, f)
        ? "border-red-400 focus:ring-red-300"
        : "border-gray-300 focus:ring-blue-300"
    } focus:outline-none focus:ring-1`;

  const Description = (
    <p className="text-center">
      Are you sure you want to proceed further, as invoice value has a
      difference of{" "}
      {isOverseas && currencyId
        ? `${
            (
              currencyData?.find((item: any) => item?.id == currencyId) ??
              currencyData?.find((item: any) => item?.id == 24)
            )?.symbol || " "
          }`
        : "₹"}
      {indianFormat(Number(difference))} ?
    </p>
  );

  const Footer = (
    <div className="flex justify-end gap-4">
      <Button
        className="px-4 py-1 rounded-lg bg-green-400 text-white hover:bg-green-500 ml-2"
        onClick={() => {
          setConfirm(false);
          onClose();
          checkAcl();
        }}
      >
        Yes
      </Button>
      <Button
        className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 ml-2"
        onClick={() => setConfirm(false)}
      >
        No
      </Button>
    </div>
  );

  return (
    <Dialog staticBackdrop open={open} size={"xl"} onClose={onClose}>
      <Dialog.Panel className={"mt-32"}>
        <Dialog.Title className="flex justify-between">
          <h2 className="mr-auto text-base font-medium">Commodity Details </h2>
          <Lucide
            icon="XCircle"
            className="w-5 h-5 cursor-pointer hover:text-red-500"
            onClick={() => {
              onClose();
            }}
          />
        </Dialog.Title>
        <Dialog.Description className="overflow-y-auto max-h-[65vh]">
          <div className="overflow-x-auto">
            <Table className="table table-text-small mb-0 border">
              <Table.Thead className="thead-primary table-sorting bg-mustard">
                <Table.Tr className="text-center text-white">
                  <Table.Th className="whitespace-nowrap border">Box</Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Sr No.
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Description
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Hsn Code
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Unit Value{" "}
                    {isOverseas && currencyId
                      ? `(${
                          (
                            currencyData?.find(
                              (item: any) => item?.id == currencyId,
                            ) ??
                            currencyData?.find((item: any) => item?.id == 24)
                          )?.symbol || " "
                        })`
                      : "(₹)"}
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Quantity
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Rate{" "}
                    {isOverseas && currencyId
                      ? `(${
                          (
                            currencyData?.find(
                              (item: any) => item?.id == currencyId,
                            ) ??
                            currencyData?.find((item: any) => item?.id == 24)
                          )?.symbol || " "
                        })`
                      : "(₹)"}
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    Actions
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items?.map((item: any, itemIdx: any) => {
                  const totalRate = item?.commodity?.reduce(
                    (sum: any, c: any) =>
                      sum +
                      (Number(c?.invoice_value) || 0) *
                        (Number(c?.quantity) || 0),
                    0,
                  );

                  const itemInvoiceValue = Number(item?.value) || 0;
                  const isValueMismatch =
                    totalRate !== itemInvoiceValue && totalRate > 0;

                  return (
                    <>
                      {/* Commodity rows */}
                      {item?.commodity?.map((comm: any, commIdx: any) => {
                        const qty = Number(comm?.quantity) || 0;
                        const unitVal = Number(comm?.invoice_value) || 0;
                        const rate = qty * unitVal;

                        return (
                          <Table.Tr
                            key={`${itemIdx}-${commIdx}`}
                            className="text-left intro-x"
                          >
                            {/* Box name - only on first row */}
                            <Table.Td className="whitespace-nowrap align-top border-none">
                              {commIdx === 0 && (
                                <span className="font-semibold">
                                  {item?.item_description}
                                </span>
                              )}
                            </Table.Td>

                            {/* Sr No */}
                            <Table.Td className="border whitespace-nowrap text-center align-top">
                              {commIdx + 1}.
                            </Table.Td>

                            {/* Description */}
                            <Table.Td className="border whitespace-nowrap align-top">
                              <input
                                type="text"
                                className={inputClass(
                                  itemIdx,
                                  commIdx,
                                  "description",
                                )}
                                value={comm?.description}
                                onChange={(e) =>
                                  handleChange(
                                    itemIdx,
                                    commIdx,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Description"
                              />
                              {hasErr(itemIdx, commIdx, "description") && (
                                <div className="text-red-500 text-xs mt-1">
                                  {errors[itemIdx][commIdx]?.description}
                                </div>
                              )}
                            </Table.Td>

                            {/* HSN Code */}
                            <Table.Td className="border whitespace-nowrap align-top">
                              <input
                                type="text"
                                className={inputClass(
                                  itemIdx,
                                  commIdx,
                                  "hsn_code",
                                )}
                                value={comm?.hsn_code}
                                onChange={(e) =>
                                  handleChange(
                                    itemIdx,
                                    commIdx,
                                    "hsn_code",
                                    e.target.value,
                                  )
                                }
                                placeholder="HSN Code"
                              />
                              {hasErr(itemIdx, commIdx, "hsn_code") && (
                                <div className="text-red-500 text-xs mt-1">
                                  {errors[itemIdx][commIdx]?.hsn_code}
                                </div>
                              )}
                            </Table.Td>

                            {/* Unit Value */}
                            <Table.Td className="border whitespace-nowrap align-top">
                              <input
                                type="number"
                                className={inputClass(
                                  itemIdx,
                                  commIdx,
                                  "invoice_value",
                                )}
                                value={comm?.invoice_value}
                                onChange={(e) =>
                                  handleChange(
                                    itemIdx,
                                    commIdx,
                                    "invoice_value",
                                    e.target.value,
                                  )
                                }
                                placeholder="0.00"
                              />
                              {hasErr(itemIdx, commIdx, "invoice_value") && (
                                <div className="text-red-500 text-xs mt-1">
                                  {errors[itemIdx][commIdx]?.invoice_value}
                                </div>
                              )}
                            </Table.Td>

                            {/* Quantity */}
                            <Table.Td className="border whitespace-nowrap align-top">
                              <input
                                type="number"
                                className={inputClass(
                                  itemIdx,
                                  commIdx,
                                  "quantity",
                                )}
                                value={comm?.quantity}
                                onChange={(e) =>
                                  handleChange(
                                    itemIdx,
                                    commIdx,
                                    "quantity",
                                    e.target.value,
                                  )
                                }
                                placeholder="0"
                                min="1"
                              />
                              {hasErr(itemIdx, commIdx, "quantity") && (
                                <div className="text-red-500 text-xs mt-1">
                                  {errors[itemIdx][commIdx]?.quantity}
                                </div>
                              )}
                            </Table.Td>

                            {/* Rate (calculated) */}
                            <Table.Td className="border whitespace-nowrap text-right font-semibold">
                              {rate > 0
                                ? `${
                                    isOverseas && currencyId
                                      ? `${
                                          (
                                            currencyData?.find(
                                              (item: any) =>
                                                item?.id == currencyId,
                                            ) ??
                                            currencyData?.find(
                                              (item: any) => item?.id == 24,
                                            )
                                          )?.symbol || " "
                                        }`
                                      : "₹"
                                  } ${rate ? indianFormat(Number(rate)) : "0.00"}`
                                : "₹ 0.00"}
                            </Table.Td>

                            {/* Actions */}
                            <Table.Td className="border whitespace-nowrap  text-center">
                              {commIdx === 0 ? (
                                <button
                                  onClick={() => addCommodityRow(itemIdx)}
                                  className="text-green-600 hover:text-green-700 font-semibold text-sm px-2 py-1"
                                  title="Add commodity"
                                >
                                  + Add
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    removeCommodityRow(itemIdx, commIdx)
                                  }
                                  className="text-red-600 hover:text-red-700 font-semibold text-sm px-2 py-1"
                                  title="Remove commodity"
                                >
                                  × Remove
                                </button>
                              )}
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}

                      {/* Total row */}
                      <Table.Tr
                        key={`${itemIdx}-total`}
                        className={`font-bold ${isValueMismatch ? "bg-red-50" : "bg-gray-50"}`}
                      >
                        <Table.Td className="border" colSpan={5}>
                          {isValueMismatch && (
                            <div className="text-red-600 text-xs">
                              ⚠️ Total (
                              {isOverseas && currencyId
                                ? `${
                                    (
                                      currencyData?.find(
                                        (item) => item?.id == currencyId,
                                      ) ??
                                      currencyData?.find(
                                        (item) => item?.id == 24,
                                      )
                                    )?.symbol || " "
                                  }`
                                : "₹"}
                              {indianFormat(Number(totalRate))}) doesn't match
                              Box Invoice Value (
                              {isOverseas && currencyId
                                ? `${
                                    (
                                      currencyData?.find(
                                        (item) => item?.id == currencyId,
                                      ) ??
                                      currencyData?.find(
                                        (item) => item?.id == 24,
                                      )
                                    )?.symbol || " "
                                  }`
                                : "₹"}
                              {indianFormat(Number(itemInvoiceValue))})
                            </div>
                          )}
                        </Table.Td>
                        <Table.Td className="border text-right">Total</Table.Td>
                        <Table.Td
                          className={`border text-right ${isValueMismatch ? "text-red-600" : "text-blue-600"}`}
                        >
                          {isOverseas && currencyId
                            ? `${
                                (
                                  currencyData?.find(
                                    (item) => item?.id == currencyId,
                                  ) ??
                                  currencyData?.find((item) => item?.id == 24)
                                )?.symbol || " "
                              }`
                            : "₹"}{" "}
                          {totalRate ? indianFormat(Number(totalRate)) : "0.00"}
                        </Table.Td>
                        <Table.Td className="border text-right"></Table.Td>
                      </Table.Tr>
                    </>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
          {confirm && (
            <CommonModal
              open={confirm}
              setOpen={setConfirm}
              title={"Confirmation"}
              description={Description}
              footer={Footer}
              sticky={true}
              size="md"
            />
          )}
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            type="button"
            className="text-white bg-mustard border-none"
            onClick={handleSubmit}
          >
            Validate & Submit
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default CommodityModal;
