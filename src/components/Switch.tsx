import { Dispatch, SetStateAction } from "react";

interface SwitchProps {
    active: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

const Switch = (props: SwitchProps) => {
    const { active, setActive } = props;

    return (
        <div
            className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${active ? "bg-green-500" : "bg-gray-300"
                }`}
            onClick={() => setActive(!active)}
        >
            <div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${active ? "bg-green-400" : "bg-gray-400"
                    }`}
            />
            <div
                className={`absolute top-[4px] left-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${active ? "translate-x-6" : ""
                    }`}
            />
        </div>
    );
};

export default Switch;