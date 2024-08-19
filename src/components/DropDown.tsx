import { ChangeEvent } from "react";

const DropDown = ({ options, callback }: any) => {
  return (
    <select
      className="new-customer-input"
      onChange={(e: ChangeEvent<HTMLSelectElement>) => callback(e.target.value)}
      required
    >
      {options.map((option: any, index: number) => {
        return (
          <option key={index} value={option.displayValue}>
            {option.value}
          </option>
        );
      })}
    </select>
  );
};

export default DropDown;
