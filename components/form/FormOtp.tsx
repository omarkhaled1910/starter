import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";

type FormOtpProps = {
  value: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  error: boolean;
};
const FormOtp = ({ value, onBlur, onChange, error }: FormOtpProps) => {
  const [otp, setOtp] = useState(value);
  const handleChange = (value: string) => {
    setOtp(value);
    onChange(value);
  };
  return (
    <div className="flex items-center justify-center">
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={handleChange}
        onBlur={onBlur}
        onError={() => {
          console.log("error");
        }}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
};

export default FormOtp;
