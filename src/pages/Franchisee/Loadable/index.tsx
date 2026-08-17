import { Suspense } from "react";
import LoadingIcon from "../../../base-components/LoadingIcon";
const Loadable = (Component) => (props) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[100vh]">
          <LoadingIcon icon="tail-spin" className="block w-[6%] " />
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  );
};
Loadable.displayName = "Loadable";
export default Loadable;
