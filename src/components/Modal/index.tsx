import { Dialog } from "../../base-components/Headless";
import Lucide from "../../base-components/Lucide";

function Main(data: any) {
  const {
    open,
    title,
    size,
    overflow = false,
    setOpen,
    description,
    footer,
    staticBackdrop = true,
  } = data;

  return (
    <>
      <Dialog
        staticBackdrop={staticBackdrop}
        size={size ? size : null}
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        className="mt-0"
      >
        <Dialog.Panel className="px-2 py-1">
          <Dialog.Title className="flex justify-between">
            <h2 className="mr-auto text-base font-medium">{title}</h2>
            <Lucide
              icon="XCircle"
              className="w-5 h-5 cursor-pointer hover:text-red-500"
              onClick={() => {
                setOpen(false);
              }}
            />
          </Dialog.Title>
          <Dialog.Description
            className={`${overflow ? "overflow-y-auto h-[65vh]" : ""}`}
          >
            {description}
          </Dialog.Description>
          <Dialog.Footer>{footer}</Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

export default Main;
