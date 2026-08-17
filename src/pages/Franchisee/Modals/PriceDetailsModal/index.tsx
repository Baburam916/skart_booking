import { Dialog } from "../../../../base-components/Headless";
import Table from "../../../../base-components/Table";
import Lucide from "../../../../base-components/Lucide";
import Tippy from "../../../../base-components/Tippy";
import { indianFormat } from "../../../../utils";
import { useFranchisee } from "../../../../ContextProvider/FranchiseeContext";

interface PriceDetailsModalProps {
  open: boolean;
  priceDetailsData?: any;
  odcData?: any;
  onClose: () => void;
  currencySymbol?: any;
}

const PriceDetailsModal: React.FC<PriceDetailsModalProps> = ({
  open,
  priceDetailsData,
  odcData,
  onClose,
  currencySymbol,
}) => {
  const { isOverseas } = useFranchisee();

  const filteredCharges =
    priceDetailsData?.selling_charges.length > 0
      ? priceDetailsData?.selling_charges?.filter(
          (elem: any) => ![1, 7, 28, 5].includes(elem.charge_id)
        )
      : [];

  const odcAmount =
    priceDetailsData?.selling_charges?.find((ele) => ele.charge_id == "5")
      ?.charge_amount_show || 0;

  return (
    <Dialog staticBackdrop open={open} onClose={onClose}>
      <Dialog.Panel>
        <Dialog.Title className="flex justify-between">
          <div>
            <h2 className=" text-base font-medium">Price in Detail</h2>
            {isOverseas != "1" ? (
              <p className="text-red-500 text-sm font-medium">
                * The prices shown here are exclusive of GST
              </p>
            ) : null}
          </div>
          <Lucide
            icon="XCircle"
            className="w-5 h-5 cursor-pointer"
            onClick={onClose}
          />
        </Dialog.Title>
        <Dialog.Description className="grid grid-cols-24 gap-4 gap-y-3">
          <Table bordered hover className="border">
            <Table.Thead className=" text-left">
              <Table.Tr className="border p-1 space-y-1">
                <Table.Th className="border p-1">PARTICULARS</Table.Th>
                <Table.Th className="border p-1">
                  CHARGES {currencySymbol}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody className=" text-left">
              <Table.Tr className="border cursor-pointer p-1">
                {" "}
                <Table.Td className={`border p-1 uppercase`}>FREIGHT</Table.Td>
                <Table.Td className="border p-1 text-right">
                  {priceDetailsData?.selling_charges?.length > 0 &&
                    indianFormat(
                      Number(
                        priceDetailsData.selling_charges.find(
                          (ele) => ele.charge_id == "1"
                        )?.charge_amount_show || 0
                      )
                    )}{" "}
                  /-
                </Table.Td>
              </Table.Tr>
              <Table.Tr className="border cursor-pointer p-1">
                <Table.Td className={`border p-1 uppercase`}>
                  EMERGENCY CHARGE
                </Table.Td>
                <Table.Td className="border p-1 text-right">
                  {priceDetailsData?.selling_charges?.length > 0 &&
                    indianFormat(
                      Number(
                        priceDetailsData.selling_charges.find(
                          (ele) => ele.charge_id == "7"
                        )?.charge_amount_show || 0
                      )
                    )}{" "}
                  /-
                </Table.Td>
              </Table.Tr>
              <Table.Tr className="border cursor-pointer p-1">
                {" "}
                <Table.Td className={`border p-1 uppercase`}>
                  FUEL SURCHARGE
                </Table.Td>
                <Table.Td className="border p-1 text-right">
                  {priceDetailsData?.selling_charges?.length > 0 &&
                    indianFormat(
                      Number(
                        priceDetailsData.selling_charges.find(
                          (ele) => ele.charge_id == "28"
                        )?.charge_amount_show || 0
                      )
                    )}{" "}
                  /-
                </Table.Td>
              </Table.Tr>
              {odcData && odcData?.length > 0 && Number(odcAmount) > 0 && (
                <Table.Tr className="border cursor-pointer p-1 text-left">
                  <Tippy
                    content={odcData
                      ?.filter(
                        (ele) => ele?.length >= priceDetailsData?.odc_limit
                      )
                      ?.map((ele) => `${ele?.item} `)
                      .join(", ")}
                    className="w-full"
                    options={{
                      placement: "top",
                    }}
                  >
                    <Table.Td
                      className={`border-none p-1 uppercase underline underline-offset-4 decoration-dashed`}
                    >
                      ODD DIMENSION CHARGES
                    </Table.Td>
                  </Tippy>
                  <Table.Td className="border p-1 text-right">
                    {priceDetailsData?.selling_charges?.length > 0 &&
                      indianFormat(
                        Number(
                          priceDetailsData.selling_charges.find(
                            (ele) => ele.charge_id == "5"
                          )?.charge_amount_show || 0
                        )
                      )}{" "}
                    /-
                  </Table.Td>
                </Table.Tr>
              )}
              {filteredCharges &&
                filteredCharges.length > 0 &&
                filteredCharges?.map(
                  (elem, index) =>
                    elem?.charge_amount_show != 0 &&
                    elem?.charge_id != 5 && (
                      <Table.Tr
                        className="border text-left cursor-pointer p-1"
                        key={index}
                      >
                        <Table.Td
                          className={`border p-1 uppercase ${
                            elem?.charge_name ? "" : "text-center"
                          }`}
                        >
                          {elem?.charge_name ? elem?.charge_name : "- - - - -"}
                        </Table.Td>
                        <Table.Td className="border p-1  text-right">
                          {indianFormat(Number(elem?.charge_amount_show || 0))}
                        </Table.Td>
                      </Table.Tr>
                    )
                )}

              <Table.Tr className="border p-1">
                <Table.Td className="border p-1 font-semibold">TOTAL</Table.Td>
                <Table.Td className="border p-1 font-semibold text-right">
                  {indianFormat(
                    Number(priceDetailsData?.grand_total_without_gst_show || 0)
                  )}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Dialog.Description>
      </Dialog.Panel>
    </Dialog>
  );
};

export default PriceDetailsModal;
