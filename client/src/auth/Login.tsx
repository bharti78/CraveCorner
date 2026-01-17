import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginInputState, userLoginSchema } from "@/schema/userSchema";
import { useUserStore } from "@/store/useUserStore";
import {
  Loader2,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  Truck,
  Clock,
  Zap,
} from "lucide-react";
import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

type GoogleCredentialResponse = {
  credential: string;
};

type GoogleIdConfig = {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  itp_support?: boolean;
};

type GoogleIdButtonOptions = {
  theme: "outline" | "filled_blue" | "filled_black";
  size: "large" | "medium" | "small";
  type: "standard" | "icon" | "text";
  text: "signin_with" | "signup_with" | "continue_with" | "signin";
  width: number;
  shape: "rectangular" | "pill" | "circle" | "square";
};

type GoogleAccounts = {
  id: {
    initialize(config: GoogleIdConfig): void;
    renderButton(parent: HTMLElement, options: GoogleIdButtonOptions): void;
  };
};

type GoogleGlobal = {
  accounts: GoogleAccounts;
};

type ExtendedWindow = Window & {
  google?: GoogleGlobal;
};

const Login = () => {
  const [input, setInput] = useState<LoginInputState>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginInputState>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const { login, loading, googleAuth } = useUserStore();
  const navigate = useNavigate();

  const initializeGoogleSignIn = React.useCallback(() => {
    try {
      const { isAuthenticated, user } = useUserStore.getState();
      if (isAuthenticated && user?.isVerified) {
        return;
      }

      const { google } = window as ExtendedWindow;
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID" || !google) {
        console.error(
          "Google Client ID is not configured or Google is not available"
        );
        return;
      }

      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: GoogleCredentialResponse) => {
          try {
            await googleAuth(response.credential);
            navigate("/");
          } catch (error) {
            console.error("Error handling Google response:", error);
            toast.error("Google authentication failed. Please try again.");
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        itp_support: true,
      });

      if (googleButtonRef.current) {
        while (googleButtonRef.current.firstChild) {
          googleButtonRef.current.removeChild(
            googleButtonRef.current.firstChild
          );
        }

        google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "medium",
          type: "standard",
          text: "signin_with",
          width: 280,
          shape: "rectangular",
        });
      }
    } catch (error) {
      console.error("Failed to initialize Google Sign-In:", error);
    }
  }, [googleAuth, navigate]);

  React.useEffect(() => {
    const { isCheckingAuth } = useUserStore.getState();
    if (isCheckingAuth) return;

    const checkGoogleLoaded = () => {
      const { google } = window as ExtendedWindow;
      if (google && google.accounts) {
        setGoogleLoaded(true);
        initializeGoogleSignIn();
      } else {
        setTimeout(checkGoogleLoaded, 1000);
      }
    };

    checkGoogleLoaded();
  }, [initializeGoogleSignIn]);

  const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const loginSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const result = userLoginSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<LoginInputState>);
      return;
    }
    try {
      await login(input);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gradientRotate {
          0% { background-position: 0% 0%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: 'linear-gradient(135deg, #fed7aa 0%, #fde68a 25%, #fed7aa 50%, #fbbf24 75%, #fed7aa 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite'
        }}
      ></div>
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: 'linear-gradient(45deg, #fce7f3 0%, transparent 50%, #fed7aa 100%)',
          backgroundSize: '300% 300%',
          animation: 'gradientRotate 12s ease infinite'
        }}
      ></div>
      <div className="relative z-10 w-full max-w-7xl flex items-center justify-center gap-8 px-4">
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative transform translate-y-2">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
              <img
                src="https://zeew.eu/wp-content/uploads/2024/06/Restaurant-Online-Food-Delivery-1.webp"
                alt="Food Delivery"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-full" />
              <div className="absolute bottom-2 right-2">
                <Truck className="w-6 h-6 text-white bg-orange-500 p-1 rounded-full shadow-lg animate-bounce" />
              </div>
            </div>
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full animate-pulse shadow-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-red-400 rounded-full animate-pulse delay-75 shadow-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div className="absolute top-1/2 -left-6 w-6 h-6 bg-orange-400 rounded-full animate-pulse delay-150 shadow-lg" />
          </div>

          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            CraveCorner
          </h1>

          <p className="text-lg text-gray-700 max-w-sm leading-relaxed">
            Your favorite food, delivered fast from the best restaurants near
            you.
          </p>

          <div className="space-y-3 w-full max-w-xs">
            <div className="bg-orange-50/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 text-sm">Fast Delivery</h3>
                  <p className="text-xs text-gray-600">30 minutes or less</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 text-sm">Best Quality</h3>
                  <p className="text-xs text-gray-600">Top-rated restaurants</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 text-sm">24/7 Service</h3>
                  <p className="text-xs text-gray-600">Always available</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>1000+ Orders</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <span>4.8★ Rating</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span>50+ Restaurants</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="bg-orange-200/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6" style={{backgroundColor: '#ffedd5'}}>
            <div className="lg:hidden text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-2 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop&crop=center"
                  alt="Food Delivery"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-full" />
                <div className="absolute bottom-1 right-1">
                  <Truck className="w-4 h-4 text-white bg-orange-500 p-0.5 rounded-full shadow-md animate-bounce" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                CraveCorner
              </h1>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-600">
                Sign in to your account to continue ordering
              </p>
            </div>

            <form onSubmit={loginSubmitHandler} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={input.email}
                    onChange={changeEventHandler}
                    className="pl-11 h-10 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                  />
                </div>
                {errors.email && (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
                    className="pl-11 pr-11 h-10 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full" />
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-600 hover:text-orange-700 hover:underline transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
              </div>

              <div className="pt-2">
                {loading ? (
                  <Button
                    disabled
                    className="w-full h-10 text-white font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                    style={{backgroundColor: '#D19254'}}
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full h-10 text-white font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                    style={{backgroundColor: '#D19254'}}
                  >
                    Log In
                  </Button>
                )}
              </div>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-orange-50 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {!googleLoaded && (
                <Button
                  disabled
                  className="w-full h-10 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow-sm flex items-center justify-center gap-3 opacity-50"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading Google Sign-In...
                </Button>
              )}
              <div ref={googleButtonRef} className="flex justify-center" />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-orange-50 text-gray-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors duration-200"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{" "}
              <a href="#" className="text-orange-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-orange-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
