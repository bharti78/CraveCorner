import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LockKeyholeIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const { token } = useParams();
  const { resetPassword, loading } = useUserStore();
  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await resetPassword(token as string, newPassword);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      <form
        onSubmit={submitHandler}
        className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-2xl mx-4 bg-orange-50/90 backdrop-blur-sm shadow-2xl border border-white/20"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            CraveCorner
          </h1>
          <h1 className="font-extrabold text-2xl mb-2 text-orange-600">
            Reset Password
          </h1>
          <p className="text-sm text-gray-600">
            Enter your new password to reset old one
          </p>
        </div>
        <div className="relative w-full">
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            className="pl-10 focus-visible:ring-1 focus-visible:ring-orange-500"
          />
          <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
        </div>
        {loading ? (
          <Button disabled className="bg-orange hover:bg-hoverOrange">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
          </Button>
        ) : (
          <Button className="bg-orange hover:bg-hoverOrange">
            Reset Password
          </Button>
        )}
        <span className="text-center">
          Back to{" "}
          <Link to="/login" className="text-orange-500 hover:underline">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default ResetPassword;
