import { RotatingLines } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="loader">
      <RotatingLines
        visible={true}
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
};

export default Loader;
