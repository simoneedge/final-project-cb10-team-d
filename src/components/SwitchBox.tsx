import { Dispatch, SetStateAction } from "react";
import Switch from "../components/Switch";

interface SwitchBoxProps {
  label: string;
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
}

const SwitchBox = (props: SwitchBoxProps) => {
  const { label, value, setValue } = props;

  return (
    <div className="flex items-center gap-3">
      <h3 className="text-gray-800 text-sm font-bold">{label}</h3>
      <div
        className={`relative inline-flex items-center h-6 w-12 cursor-pointer rounded-full transition-colors duration-300 ${
          value ? "bg-rosso" : "bg-gray-300"
        } ${value ? "hover:bg-rosso-dark" : "hover:bg-gray-400"}`} // Cambia leggermente il colore al passaggio del mouse
        onClick={() => setValue(!value)}
      >
        <span
          className={`inline-block w-6 h-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
            value ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
};

export default SwitchBox;
