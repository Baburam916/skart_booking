import { Dialog } from "../../../../base-components/Headless";
import Button from "../../../../base-components/Button";
import { FormInput, FormLabel } from "../../../../base-components/Form";
import Lucide from "../../../../base-components/Lucide";
import { useEffect, useState } from "react";
import { disableSymbols, isValidHsn } from "../../../../utils";
import { useAlert } from "../../../../ContextProvider/AlertContext";

interface ShipperDimensionModalProps {
  open: boolean;
  onClose: () => void;
  dimensionData: any;
  setDimensionData: () => void;
  isEditDimension?: boolean;
  editDimensionData?: any;
  editIndex?: number;
}

const ShipperDimensionModal: React.FC<ShipperDimensionModalProps> = ({
  open,
  onClose,
  dimensionData,
  setDimensionData,
  isEditDimension,
  editDimensionData,
  editIndex,
}) => {
  const initialData = {
    description_of_goods: "",
    hsn_code: "",
    quantity: "",
    rate: "",
    amount: "",
  };

  const [data, setData] = useState(initialData);
  const { showAlert } = useAlert();

  const handleSubmit = () => {
    if (
      data.description_of_goods &&
      data.rate &&
      data.quantity &&
      data.amount &&
      data.hsn_code
    ) {
      if (isValidHsn(data?.hsn_code)) {
        setDimensionData((prev) => [...prev, data]);
        setData(initialData);
        onClose();
      } else {
        showAlert("Please Enter Valid HSN Code", "error");
      }
    } else {
      showAlert("Please fill all the fields", "error");
    }
  };

  const handleEdit = () => {
    if (
      data.description_of_goods &&
      data.rate &&
      data.quantity &&
      data.amount &&
      data.hsn_code
    ) {
      if (isValidHsn(data.hsn_code)) {
        // console.log(data);

        const newData = dimensionData;

        newData[editIndex] = { ...data };

        setDimensionData(newData);
        onClose();
      } else {
        showAlert("Please Enter Valid HSN Code", "error");
      }
    } else {
      showAlert("Please fill all the fields", "error");
    }
  };

  useEffect(() => {
    if (isEditDimension && editDimensionData) {
      setData({
        description_of_goods: editDimensionData?.description_of_goods || "",
        amount: editDimensionData?.amount || "",
        quantity: editDimensionData?.quantity || "",
        rate: editDimensionData?.rate || "",
        hsn_code: editDimensionData?.hsn_code || "",
      });
    } else {
      setData(initialData);
    }
  }, [isEditDimension]);
  return (
    <Dialog staticBackdrop open={open} size={"lg"} onClose={onClose}>
      <Dialog.Panel className={"mt-32"}>
        <Dialog.Title className="flex justify-between">
          <h2 className="mr-auto text-base font-medium">Dimension </h2>
          <Lucide
            icon="XCircle"
            className="w-5 h-5 cursor-pointer hover:text-red-500"
            onClick={() => {
              onClose();
              setData(initialData);
            }}
          />
        </Dialog.Title>
        <Dialog.Description>
          <div className="w-full h-auto overflow-y-auto text-left ">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8   rounded-lg ">
              <div>
                <FormLabel htmlFor="regular-form-1">
                  Description of goods
                </FormLabel>
                <FormInput
                  type="text"
                  placeholder="Description"
                  id="description_of_goods"
                  value={data?.description_of_goods}
                  onKeyDown={(e) => disableSymbols(e)}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      description_of_goods: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <FormLabel htmlFor="regular-form-1">HSN Code</FormLabel>
                <FormInput
                  type="text"
                  placeholder="HSN Code"
                  minLength={6}
                  maxLength={8}
                  id="hsn_code"
                  value={data?.hsn_code}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      hsn_code: e.target.value.replaceAll(" ", ""),
                    }))
                  }
                />
              </div>
              <div>
                <FormLabel htmlFor="regular-form-1">Quantity</FormLabel>
                <FormInput
                  type="number"
                  placeholder="Quantity"
                  id="quantity"
                  step="1"
                  value={data?.quantity}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                      amount: Number(e.target.value) * Number(data?.rate),
                    }))
                  }
                  onKeyDown={(e) => disableSymbols(e)}
                />
              </div>
              <div>
                <FormLabel htmlFor="regular-form-1">Rate</FormLabel>
                <FormInput
                  type="number"
                  placeholder="rate"
                  id="rate"
                  step="1"
                  value={data?.rate}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      rate: e.target.value,
                      amount: Number(e.target.value) * Number(data?.quantity),
                    }))
                  }
                  onKeyDown={(e) => disableSymbols(e)}
                />
              </div>
              <div>
                <FormLabel htmlFor="regular-form-1">Amount</FormLabel>
                <FormInput
                  type="number"
                  placeholder="amount"
                  id="amount"
                  step="1"
                  value={data?.amount}
                  disabled
                  // onChange={(e) =>
                  //   setData((prev) => ({ ...prev, amount: e.target.value }))
                  // }
                  onKeyDown={(e) => disableSymbols(e)}
                />
              </div>
            </div>
          </div>
        </Dialog.Description>
        <Dialog.Footer>
          {isEditDimension ? (
            <Button
              type="button"
              className="text-white bg-mustard border-none"
              onClick={handleEdit}
            >
              SAVE
            </Button>
          ) : (
            <Button
              type="button"
              className="text-white bg-mustard border-none"
              onClick={handleSubmit}
            >
              ADD
            </Button>
          )}
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default ShipperDimensionModal;