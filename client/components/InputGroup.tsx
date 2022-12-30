import { ChangeEvent } from "react";
import classnames from "classnames";

type Props = {
  className?: string;
  type?: string;
  placeholder?: string;
  value: string;
  error: string | undefined;
  setValue: (str: string) => void;
};

const InputGroup = ({
  className = "mb-2",
  placeholder = "",
  type = "text",
  error,
  value,
  setValue,
}: Props) => {
  return (
    <div className={className}>
      <input
        type={type}
        value={value}
        style={{ minWidth: 300, padding: "10px" }}
        className={classnames(
          "w-full transition duration-200 border border-gray-400 rounded",
          {
            "border-red-500": !!error,
          }
        )}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setValue(e.target.value)
        }
      />
      {error && <small className="font-medium text-red-500">{error}</small>}
    </div>
  );
};

export default InputGroup;
