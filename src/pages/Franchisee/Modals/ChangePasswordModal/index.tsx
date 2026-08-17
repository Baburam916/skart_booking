import { Dialog } from "../../../../base-components/Headless";
import Button from "../../../../base-components/Button";
import Lucide from "../../../../base-components/Lucide";
import {
  FormInput,
  FormLabel,
  InputGroup,
} from "../../../../base-components/Form";
import { useState } from "react";
import { changePassApi } from "../../../../AllServices/config.service";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../../base-components/LoadingIcon";

interface ChangePassModalProps {
  open: boolean;
  onClose: () => void;
}

const initialData = {
  current_password: "",
  new_password: "",
};

const ChangePassModal: React.FC<ChangePassModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState(initialData);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const handleChangePass = async () => {
    setSpinner(true);
    try {
      const response: any = await changePassApi(formData);
      if (response?.status == 200) {
        showAlert(response?.data?.message);
        navigate("/", { replace: true });
        onClose();
      } else if (response?.status == 201) {
        showAlert("Password Changed ");
        setFormData(initialData);
        navigate("/", { replace: true });
        onClose();
      } else if (response?.message == "Network Error") {
        showAlert(response?.message);
      } else if (response?.response.status == 500) {
        showAlert("Internal Server Error", "error");
      } else if (response?.response.status == 400) {
        showAlert("Bad Request", "error");
      } else if (response?.response.status == 401) {
        showAlert("Unauthorized", "error");
      } else if (response?.response.status == 404) {
        showAlert("Not Found", "error");
      } else if (response?.response?.data?.status == 406) {
        showAlert(response?.response?.data?.errors[0]?.message, "error");
      } else if (response?.response.status == 502) {
        showAlert("Bad GateWay", "error");
      }
    } catch (err: any) {
      showAlert("Something went wrong", "error");
    } finally {
      setSpinner(false);
    }
  };

  return (
    <Dialog staticBackdrop open={open} onClose={onClose}>
      <Dialog.Panel>
        <Dialog.Title className="flex justify-between">
          <h2 className="mr-auto text-base font-medium">Change Password</h2>
          <Lucide
            icon="XCircle"
            className="w-5 h-5 cursor-pointer hover:text-red-500"
            onClick={onClose}
          />
        </Dialog.Title>
        <Dialog.Description>
          <div>
            <FormLabel htmlFor="regular-form-4">
              Current Password <span className="text-red-500">*</span>
            </FormLabel>

            <InputGroup>
              <FormInput
                type={`${showOldPass ? "text" : "password"}`}
                placeholder="Current Password"
                autoComplete="off"
                value={formData.current_password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    current_password: e.target.value,
                  }))
                }
              />

              <InputGroup.Text id="input-group-price" className="bg-white ">
                <Lucide
                  icon={`${showOldPass ? "Eye" : "EyeOff"}`}
                  className="text-mustard stroke-2.5  mt-1  h-5 cursor-pointer"
                  onClick={() => setShowOldPass(!showOldPass)}
                />
              </InputGroup.Text>
            </InputGroup>
          </div>
          <div className="mt-3">
            <FormLabel htmlFor="regular-form-4">
              New Password <span className="text-red-500">*</span>
            </FormLabel>

            <InputGroup>
              <FormInput
                type={`${showNewPass ? "text" : "password"}`}
                placeholder="New Password"
                autoComplete="off"
                value={formData.new_password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    new_password: e.target.value,
                  }))
                }
              />

              <InputGroup.Text id="input-group-price" className="bg-white ">
                <Lucide
                  icon={`${showNewPass ? "Eye" : "EyeOff"}`}
                  className="text-mustard stroke-2.5  mt-1  h-5 cursor-pointer"
                  onClick={() => setShowNewPass(!showNewPass)}
                />
              </InputGroup.Text>
            </InputGroup>
          </div>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            type="button"
            className="text-white bg-mustard border-none"
            disabled={
              !formData.current_password || !formData.new_password || spinner
            }
            onClick={handleChangePass}
          >
            Change{" "}
            {spinner && (
              <LoadingIcon
                icon="puff"
                color="white"
                className="w-5 h-5 ml-2 stroke-2.5 text-white"
              />
            )}
          </Button>
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default ChangePassModal;
