import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRef = useRef<Array<HTMLInputElement | null>>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (index: number, value: string) => {
    if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
    }
    if (value !== "" && index < 5) {
      const next = inputRef.current[index + 1];
      if (next) next.focus();
    }
  };
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prev = inputRef.current[index - 1];
      if (prev) prev.focus();
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const verificationCode = otp.join("");
    try {
      setLoading(true);
      navigate(`/reset-password/${verificationCode}`);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <div className="p-8 rounded-2xl w-full max-w-md flex flex-col gap-10 bg-orange-50/90 backdrop-blur-sm shadow-2xl border border-white/20">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            CraveCorner
          </h1>
          <h1 className="font-extrabold text-2xl text-orange-600">Enter OTP</h1>
          <p className="text-sm text-gray-600">
            Enter the 6 digit code sent to your email address
          </p>
        </div>
        <form onSubmit={submitHandler}>
          <div className="flex justify-between">
            {otp.map((letter: string, idx: number) => (
              <Input
                key={idx}
                ref={(element) => (inputRef.current[idx] = element)}
                type="text"
                maxLength={1}
                value={letter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(idx, e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(idx, e)
                }
                className="md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            ))}
          </div>
          {loading ? (
            <Button
              disabled
              className="bg-orange hover:bg-hoverOrange mt-6 w-full"
            >
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button className="bg-orange hover:bg-hoverOrange mt-6 w-full">
              Continue
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};
export default VerifyEmail;
