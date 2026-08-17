import { Dialog } from "../../../../base-components/Headless";
import Button from "../../../../base-components/Button";
import Lucide from "../../../../base-components/Lucide";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Table from "../../../../base-components/Table";

interface BulkCSVModalProps {
  open: boolean;
  onClose: () => void;
  uploadedFile: any;
  errors: any;
  shipmentType: any;
}

const BulkCSVModal: React.FC<BulkCSVModalProps> = ({
  open,
  onClose,
  uploadedFile,
  errors,
  shipmentType,
}) => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [error, setError] = useState(errors || []);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const newFields = [];

      for (const key in errors) {
        const fieldErrors = errors[key];
        for (const field in fieldErrors) {
          if (!headers.includes(field) && !newFields?.includes(field)) {
            newFields.push(field);
          }
        }
      }

      if (newFields.length > 0) {
        const updatedHeaders = [...headers, ...newFields];
        setHeaders(updatedHeaders);
      }
    }
  }, [errors, headers]);

  useEffect(() => {
    if (uploadedFile) {
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => {
          setHeaders(Object.keys(results.data[0] || {}));
          setCsvData(results.data);
        },
      });
    }
  }, []);

  return (
    <Dialog staticBackdrop open={open} onClose={onClose} size="xl">
      <Dialog.Panel className="mt-2">
        <Dialog.Title className="flex justify-between">
          <h2 className="mr-auto text-base font-medium">Bulk Booking</h2>
          <Lucide
            icon="XCircle"
            className="w-5 h-5 cursor-pointer hover:text-red-500"
            onClick={onClose}
          />
        </Dialog.Title>
        <Dialog.Description className="pt-0">
          <div className="overflow-auto h-[70vh] pt-4">
            {csvData?.length > 0 && (
              <Table sm>
                <Table.Thead className="bg-mustard text-white border">
                  <Table.Tr>
                    <Table.Th className="text-center border">Sr.No.</Table.Th>
                    {headers?.map((header, index) => (
                      <Table.Th
                        className="text-center border whitespace-nowrap"
                        key={index}
                      >
                        {header}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {csvData?.map((row, rowIndex) => (
                    <Table.Tr key={rowIndex}>
                      <Table.Td className="text-center border">
                        {rowIndex + 1}.
                      </Table.Td>
                      {headers?.map((header, colIndex) => (
                        <Table.Td
                          key={colIndex}
                          className={`relative p-2 border whitespace-nowrap ${
                            row?.pickup_required == 2 &&
                            [
                              "pickup_location",
                              "pickup_name",
                              "pickup_address_1",
                              "pickup_address_2",
                            ].includes(header)
                              ? "bg-white text-black"
                              : row?.pickup_location == 1 &&
                                  [
                                    "pickup_name",
                                    "pickup_address_1",
                                    "pickup_address_2",
                                  ].includes(header)
                                ? "bg-white text-black"
                                : row?.pickup_location == 2 &&
                                    [
                                      "pickup_name",
                                      "pickup_address_2",
                                    ].includes(header)
                                  ? "bg-white text-black"
                                  : (shipmentType == 2 &&
                                        (header == "length" ||
                                          header == "width" ||
                                          header == "height" ||
                                          header == "e_way_bill")) ||
                                      header == "consignee_email" ||
                                      header == "shipper_email"
                                    ? "bg-white text-black"
                                    : shipmentType == 1 &&
                                        !row?.e_way_bill &&
                                        header == "e_way_bill" &&
                                        Number(row?.invoice_value) < 50000
                                      ? "bg-white text-black"
                                      : errors[rowIndex]?.[header] ||
                                          !row[header]
                                        ? "bg-red-200 text-red-600"
                                        : "bg-white text-black"
                          }`}
                        >
                          {row[header] ||
                            ((shipmentType == 2 &&
                              (header == "length" ||
                                header == "width" ||
                                header == "height")) ||
                            header == "consignee_email" ||
                            header == "shipper_email"
                              ? ""
                              : "-")}
                          <p>{errors[rowIndex]?.[header]}</p>
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </div>
        </Dialog.Description>
        {/* <Dialog.Footer>
          <Button type="button" className="text-white bg-mustard border-none">
            Close
          </Button>
        </Dialog.Footer> */}
      </Dialog.Panel>
    </Dialog>
  );
};

export default BulkCSVModal;
