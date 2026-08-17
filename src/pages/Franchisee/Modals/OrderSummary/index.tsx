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
  getConsigneeDetailsApi,
  getCountryApi,
} from "../../../../AllServices/config.service";
import TomSelect from "../../../../base-components/TomSelect";
import { useEffect, useState } from "react";
import { indianFormat } from "../../../../utils";

interface OrderSummaryModalProps {
  open: boolean;
  onClose: () => void;
  booking: any;
  currencySymbol: any;
}

const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({
  open,
  onClose,
  booking,
  currencySymbol,
}) => {
  const [shipmentDimensions, setShipmentDimensions] = useState(
    JSON.parse(booking?.shipment_dimensions) || []
  );
  // console.log(booking, shipmentDimensions);

  return (
    <Dialog staticBackdrop open={open} onClose={onClose} size="lg">
      <Dialog.Panel>
        <Dialog.Title className="flex justify-between">
          <h2 className="mr-auto text-base font-medium">Order Summary</h2>
          <Lucide
            icon="XCircle"
            className="w-5 h-5 cursor-pointer"
            onClick={onClose}
          />
        </Dialog.Title>
        <Dialog.Description className="">
          <div className="space-y-4 text-black">
            <div>
              <h2 className="text-lg font-semibold mb-2 bg-gray-200 p-2 rounded grid grid-cols-2 gap-4 px-4 ">
                <div>FROM</div>
                <div>TO</div>
              </h2>
              <div className="grid grid-cols-2 gap-4 px-4 ">
                <p>
                  ORIGIN PINCODE :{" "}
                  <span className="font-medium">{booking?.origin_pincode}</span>
                </p>
                <p>
                  DESTINATION PINCODE :{" "}
                  <span className="font-medium">
                    {booking?.destination_pincode}
                  </span>
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2 bg-gray-200 p-2 rounded">
                SHIPMENT
              </h2>
              <div className="grid grid-cols-2 gap-4 px-4">
                <p>
                  SHIPMENT TYPE :{" "}
                  {booking?.shipment_type == "1"
                    ? "NON DOCUMENT"
                    : booking?.shipment_type == "2"
                    ? "DOCUMENT"
                    : booking?.shipment_type == "4"
                    ? "COMMERCIAL SHIPMENT"
                    : ""}
                </p>
                <p>WEIGHT : {booking?.shipment_charges?.actual_weight} KGS</p>
                <p className="uppercase">
                  DESCRIPTION : {shipmentDimensions[0]?.item_description}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2 bg-gray-200 p-2 rounded">
                SERVICE PROVIDER
              </h2>
              <div className="grid grid-cols-2 gap-4 px-4">
                <p className="uppercase">
                  SERVICE PROVIDER : {booking?.shipment_charges?.parent_vendor}
                </p>
                <p>
                  PRICE {currencySymbol} :{" "}
                  {indianFormat(
                    Number(booking?.shipment_charges?.grand_total_with_gst_show || 0)
                  )}
                  /-
                </p>

                <p className="uppercase">
                  SERVICE TYPE : {booking?.shipment_charges?.product_name}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2 bg-gray-200 p-2 rounded">
                CONSIGNOR/CONSIGNEE
              </h2>
              <div className="grid grid-cols-2 gap-4 px-4">
                <div>
                  <p>CONSIGNOR :</p>
                  <p>{booking?.consigner_first_name}</p>
                  <p>{booking?.consigner_address_1}</p>
                  <p>{booking?.consigner_city}</p>
                  <p>{booking?.consigner_pincode}</p>
                </div>
                <div>
                  <p>CONSIGNEE :</p>
                  <p>{booking?.consignee_first_name}</p>
                  <p>{booking?.consignee_address_1}</p>
                  <p>{booking?.consignee_city}</p>
                  <p>{booking?.consignee_pincode}</p>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            type="button"
            className="w-20 bg-mustard border-none text-white"
            onClick={onClose}
          >
            Close
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default OrderSummaryModal;
