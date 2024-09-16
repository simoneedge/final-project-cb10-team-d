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
        <div className="flex items-center gap-2">
            <h3 className="text-gray-800">{label}</h3>
            <Switch active={value} setActive={setValue} />
        </div>
    );
};

export default SwitchBox;