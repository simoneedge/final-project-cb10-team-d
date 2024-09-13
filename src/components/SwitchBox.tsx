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
        <div className="flex flex-col">
            <h3 className="mb-1 text-gray-800">{label}</h3>
            <Switch active={value} setActive={setValue} />
        </div>
    );
};

export default SwitchBox;