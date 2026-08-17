import { Dialog } from "../../../../base-components/Headless";
import Button from "../../../../base-components/Button";
import Lucide from "../../../../base-components/Lucide";
import Recharge from "../../WalletRecharge";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: any;
  setCurrentStep: (step: number) => void;
  setCurrentFaq: (index: number) => void;
  handleFranchisee: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  amount,
  setCurrentStep,
  setCurrentFaq,
  handleFranchisee,
}) => {
  return (
    <Dialog staticBackdrop open={open} onClose={onClose} size="lg">
      <Dialog.Panel className="mt-2">
        <Dialog.Title className="flex justify-between">
          <h2 className="mr-auto text-base font-medium">Payment</h2>
          <Lucide
            icon="XCircle"
            className="w-5 h-5 cursor-pointer hover:text-red-500"
            onClick={onClose}
          />
        </Dialog.Title>
        <Dialog.Description className="pt-0">
          <Recharge
            onClose={onClose}
            amount={amount}
            method={2}
            setCurrentStep={setCurrentStep}
            setCurrentFaq={setCurrentFaq}
            handleFranchisee={handleFranchisee}
          />
        </Dialog.Description>
        {/* <Dialog.Footer>
          <Button type="button" className="text-white bg-mustard border-none">
            PAY
          </Button>
        </Dialog.Footer> */}
      </Dialog.Panel>
    </Dialog>
  );
};

export default PaymentModal;
