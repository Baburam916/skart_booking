import React, { useState } from "react";
import AlertComponent from "../../base-components/Alert";
import Lucide from "../../base-components/Lucide";
import { AlertCircle, CheckCircle } from "lucide-react";

interface AlertProps {
  type: "success" | "error" | "warning";
  message: string;
}
const getIconByVariant = (variant: string) => {
  switch (variant) {
    case "success":
      return <CheckCircle />;
    case "error":
      return <AlertCircle />;
    case "warning":
      return <AlertCircle />;
    default:
      return null;
  }
};

const CommonAlert: React.FC<AlertProps> = ({ type, message }) => {
  const [isVisible, setIsVisible] = useState(true);
  const handleDismiss = () => {
    setIsVisible(false);
  };
  return (
    <>
      {isVisible && (
        <AlertComponent variant={type} className="flex items-center mb-2 px-8">
          {({ dismiss }) => (
            <>
              {getIconByVariant(type)}{" "}
              <div className="mx-4 text-white">{message}</div>
              <AlertComponent.DismissButton
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={dismiss}
              >
                <Lucide icon="X" className="ml-4 w-4 h-4" />
              </AlertComponent.DismissButton>
            </>
          )}
        </AlertComponent>
      )}
    </>
  );
};
export default CommonAlert;
