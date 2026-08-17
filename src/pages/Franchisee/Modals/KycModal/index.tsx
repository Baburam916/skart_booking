import { Dialog } from "../../../../base-components/Headless";
import Button from "../../../../base-components/Button";
import { FormLabel, FormSelect } from "../../../../base-components/Form";
import Lucide from "../../../../base-components/Lucide";
import { useEffect, useRef, useState } from "react";
import {
  getOrganizationDocumentsApi,
  getOrganizationTypesApi,
  uploadKycApi,
} from "../../../../AllServices/config.service";

import noPreview from "../../../../assets/images/no-preview.png";
import axios from "axios";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../../base-components/LoadingIcon";
axios.defaults.withCredentials = true;
interface KycModalProps {
  open: boolean;
  onClose: () => void;
  setBooking: () => void;
  setSenderDetails: () => void;
  booking: () => any;
}

const KycModal: React.FC<KycModalProps> = ({
  open,
  onClose,
  setBooking,
  setSenderDetails,
  booking,
}) => {
  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);
  const [spinner, setSpinner] = useState(false);
  const { showAlert } = useAlert();
  const [organizationTypes, setOrganizationTypes] = useState([]);
  const [organizationDocs, setOrganizationDocs] = useState([]);
  const [selectedOrganizationType, setSelectedOrganizationType] = useState("");
  const [selectedDocOne, setSelectedDocOne] = useState("");
  const [selectedDocTwo, setSelectedDocTwo] = useState("");
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [previewContent1, setPreviewContent1] = useState(
    <img
      src={noPreview}
      alt="No File Chosen"
      width="250px"
      height="150px!important"
    />
  );

  const [previewContent2, setPreviewContent2] = useState(
    <img
      src={noPreview}
      alt="No File Chosen"
      width="250px"
      height="150px!important"
    />
  );

  useEffect(() => {
    getOrganizationTypesApi().then((res) =>
      setOrganizationTypes(res?.data?.data)
    );
    getOrganizationDocumentsApi().then((res) => {
      setOrganizationDocs(res?.data?.data);
    });
  }, []);

  useEffect(() => {
    if (booking?.kyc_details) {
      setSelectedOrganizationType(booking?.kyc_details?.orgnization_id);
      setSelectedDocOne(booking?.kyc_details?.document_id_1);
      setSelectedDocTwo(booking?.kyc_details?.document_id_2);
      setPreviewContent1(
        <embed
          src={booking?.kyc_details?.document_path_1}
          type="application/pdf"
          width="100%"
          height="250px!important"
        />
      );
      setPreviewContent2(
        <embed
          src={booking?.kyc_details?.document_path_2}
          type="application/pdf"
          width="100%"
          height="250px!important"
        />
      );
    }
    if (!booking?.kyc_details?.document_path_1) {
      setPreviewContent1(
        <img
          src={noPreview}
          alt="No File Chosen"
          width="250px"
          height="150px!important"
        />
      );
    }
    if (!booking?.kyc_details?.document_path_2) {
      setPreviewContent2(
        <img
          src={noPreview}
          alt="No File Chosen"
          width="250px"
          height="150px!important"
        />
      );
    }
  }, [organizationTypes, organizationDocs, booking?.kyc_details]);

  // console.log(booking?.kyc_details, "kyc");

  const handleOrganizationTypeChange = () => {
    handleReset();
    setPreviewContent1(
      <img
        src={noPreview}
        alt="No File Chosen"
        width="250px"
        height="150px!important"
      />
    );
    setFile1(null);
    setPreviewContent2(
      <img
        src={noPreview}
        alt="No File Chosen"
        width="250px"
        height="150px!important"
      />
    );
    setFile2(null);

    setSelectedDocOne("");
    setSelectedDocTwo("");
  };

  const handleFileChange1 = (e) => {
    const selectedFile = e.target.files[0];
    setFile1(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        if (selectedFile.type.startsWith("image/")) {
          setPreviewContent1(
            <img
              src={fileContent}
              alt="Preview"
              width="250px"
              height="150px!important"
            />
          );
        } else if (selectedFile.type === "application/pdf") {
          setPreviewContent1(
            <embed
              src={fileContent}
              type="application/pdf"
              width="100%"
              height="250px!important"
            />
          );
        } else {
          showAlert("Unsupported file type", "error");
          // console.log("Unsupported file type");
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewContent1(
        <img
          src={noPreview}
          alt="Default"
          width="250px"
          height="150px!important"
        />
      );
    }
  };

  const handleFileChange2 = (e) => {
    const selectedFile = e.target.files[0];
    setFile2(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        if (selectedFile.type.startsWith("image/")) {
          setPreviewContent2(
            <img
              src={fileContent}
              alt="Preview"
              width="250px"
              height="150px!important"
            />
          );
        } else if (selectedFile.type === "application/pdf") {
          setPreviewContent2(
            <embed
              src={fileContent}
              type="application/pdf"
              width="100%"
              height="250px!important"
            />
          );
        } else {
          showAlert("Unsupported file type", "error");
          // console.log("Unsupported file type");
        }
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewContent2(
        <img
          src={noPreview}
          alt="Default"
          width="250px"
          height="150px!important"
        />
      );
    }
  };

  const handleUploadKyc = async () => {
    try {
      const formData = new FormData();

      if (selectedOrganizationType) {
        formData.append("organisation_type_id", selectedOrganizationType);
      } else {
        showAlert("Please select organisation type", "error");
        return;
      }
      if (selectedDocOne) {
        formData.append("document_1_id", selectedDocOne);
      } else {
        showAlert("Please select document one type", "error");
        return;
      }
      if (file1) {
        formData.append("document_1", file1);
      } else {
        showAlert("Please upload document one", "error");
        return;
      }
      if (selectedDocTwo) {
        formData.append("document_2_id", selectedDocTwo);
      } else {
        showAlert("Please  select document two type", "error");
        return;
      }

      if (file2) {
        formData.append("document_2", file2);
      } else {
        showAlert("Please upload document two", "error");
        return;
      }

      setSpinner(true);
      const response = await uploadKycApi(formData);
      if (response?.status === 200) {
        setSenderDetails((prev) => ({
          ...prev,
          kyc_details: {
            orgnization_id: selectedOrganizationType,
            document_id_1: selectedDocOne,
            document_id_2: selectedDocTwo,
            document_path_1: response?.data?.doc_1,
            document_path_2: response?.data?.doc_2,
          },
          ...(response?.data?.message_v1
            ? {
              kyc_message: response?.data?.message_v1 || true,
              kyc_ocr_data: response?.data?.kyc_ocr_data || [],
              }
            : {}),
        }));
        setBooking((prev) => ({
          ...prev,
          kyc_details: {
            orgnization_id: selectedOrganizationType,
            document_id_1: selectedDocOne,
            document_id_2: selectedDocTwo,
            document_path_1: response?.data?.doc_1,
            document_path_2: response?.data?.doc_2,
          },
          ...(response?.data?.message_v1
            ? {
              kyc_message: response?.data?.message_v1 || true,
              kyc_ocr_data: response?.data?.kyc_ocr_data || [],
              }
            : {}),
        }));

        // console.log(response?.data, "kycmodal");

        showAlert(
          response?.data?.message_v1
            ? response?.data?.message_v1
            : "KYC Uploaded successfully",
          response?.data?.message_v1 ? "warning" : "success"
        );
        setSelectedOrganizationType("");
        handleOrganizationTypeChange();

        onClose();
      } else if (response.status === 400) {
        showAlert(response?.response?.data?.errors, "error");
      } else if (response.status === 401) {
        showAlert("Unauthorized", "error");
      } else if (response.status === 404) {
        showAlert("Not Found", "error");
      } else if (
        response.status === 500 ||
        response.status === 502 ||
        response.status === 406
      ) {
        showAlert("Internal Server Error", "error");
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error"
        );
      }
    } catch (error) {
      showAlert("Error uploading KYC documents", "error");
      console.log("Error uploading KYC documents:", error);
    } finally {
      setSpinner(false);
    }
  };

  const handleReset = () => {
    fileInput1Ref.current.value = null;
    fileInput2Ref.current.value = null;
  };

  return (
    <Dialog staticBackdrop open={open} size={"lg"} onClose={onClose}>
      <Dialog.Panel>
        <Dialog.Title className="flex justify-between">
          <h2 className="mr-auto text-base font-medium">KYC Document</h2>
          <Lucide
            icon="XCircle"
            className="w-5 h-5 cursor-pointer hover:text-red-500"
            onClick={onClose}
          />
        </Dialog.Title>
        <Dialog.Description>
          <div>
            <FormLabel htmlFor="modal-form-6">
              Organization <span className="text-red-500">*</span>{" "}
            </FormLabel>
            <FormSelect
              id="modal-form-6"
              onChange={(e) => {
                setSelectedOrganizationType(e.target.value);
                handleOrganizationTypeChange();
              }}
              value={selectedOrganizationType}
            >
              <option value="">Select Organization Type</option>
              {organizationTypes &&
                organizationTypes?.map((elem, index) => (
                  <option key={index} value={elem?.id}>
                    {elem?.value}
                  </option>
                ))}
            </FormSelect>
          </div>

          <div className="flex justify-between items-center my-4 gap-4 pb-4 border-b">
            <div className="flex justify-between gap-2 ">
              <div className="w-[40%]">
                <FormLabel htmlFor="modal-form-6 ">
                  Document One <span className="text-red-500">*</span>{" "}
                </FormLabel>
                <FormSelect
                  id="modal-form-6"
                  onChange={(e) => setSelectedDocOne(e.target.value)}
                  value={selectedDocOne}
                >
                  <option value="">Select Document Type</option>
                  {selectedOrganizationType &&
                    organizationDocs
                      .find(
                        (elem) =>
                          elem.organisation_id == selectedOrganizationType
                      )
                      ?.value?.filter((item) => item.id != selectedDocTwo)
                      ?.map((document, index) => (
                        <option key={index} value={document.id}>
                          {document.value}
                        </option>
                      ))}
                </FormSelect>
                <input
                  type="file"
                  ref={fileInput1Ref}
                  className="mt-4 w-56"
                  onChange={handleFileChange1}
                />
              </div>
              <div className="w-[54%] h-[100%]">
                <div id="preview">
                  {/* Display preview content */}
                  {previewContent1}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center my-4 gap-4">
            <div className="flex justify-between gap-2 ">
              <div className="w-[40%]">
                <FormLabel htmlFor="modal-form-6 ">
                  Document Two <span className="text-red-500">*</span>{" "}
                </FormLabel>
                <FormSelect
                  id="modal-form-6"
                  onChange={(e) => setSelectedDocTwo(e.target.value)}
                  value={selectedDocTwo}
                >
                  <option value="">Select Document Type</option>
                  {selectedOrganizationType &&
                    organizationDocs
                      .find(
                        (elem) =>
                          elem.organisation_id == selectedOrganizationType
                      )
                      ?.value?.filter((item) => item.id != selectedDocOne)
                      ?.map((document, index) => (
                        <option key={index} value={document.id}>
                          {document.value}
                        </option>
                      ))}
                </FormSelect>
                <input
                  type="file"
                  ref={fileInput2Ref}
                  className="mt-4 w-56"
                  onChange={handleFileChange2}
                />
              </div>
              <div className="w-[54%] h-[100%]">
                <div id="preview">{previewContent2}</div>
              </div>
            </div>
          </div>
        </Dialog.Description>
        <Dialog.Footer>
          <Button
            type="button"
            className=" text-white bg-mustard border-none"
            onClick={handleUploadKyc}
            disabled={spinner}
          >
            UPLOAD{" "}
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

export default KycModal;
