"use client";
import { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import Loader from '@/components/loader';
import toast from 'react-hot-toast';

const LogIn = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [loginInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const [touched, setTouched] = useState({
    student_id: false,
    password: false,
  });

  useEffect(() => {
    const isValid = studentId.trim() !== "" && password.trim() !== "";
    setIsFormValid(isValid);
  }, [studentId, password]);

  const handleFocus = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleLogIn = async () => {
    try {
      const email = `${studentId}.jnec@rub.edu.bt`;
      const res = await loginInWithEmailAndPassword(email, password);
      if (res?.user) {
        // Login successful logic
        setErrorMessage("");
        console.log({ res });
        sessionStorage.setItem("user", JSON.stringify(res?.user));
        toast.success('You have successfully logged In');
        router.push("/dashboard");
      } else {
        setStudentId("");
        setPassword("");
      }
    } catch (e: any) { 
      setErrorMessage("An unknown error occurred. Please try again.");
      console.error('error: ',e.code.errors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loading && <Loader />}
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center mb-6">
          <img className="w-22 h-20 mb-2" src="/logo.png" alt="Logo" />
          <h1 className="text-lg font-semibold text-gray-800">
            Library Seat Reservation System
          </h1>
          <p className="text-sm text-gray-600">Login to your account</p>
        </div>
        <div className="space-y-4">
          <div className="space-y-[8px]">
            <input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              onFocus={() => handleFocus("email")}
              className={`${
                touched.student_id && studentId.trim() === "" ? "border-red-500" : ""
              }
                `}
            />
            {touched.student_id && studentId.trim() === "" && (
              <p className="mr-2 text-red-500 text-sm ml-[14px]">
                This field is required
              </p>
            )}
          </div>
        
          <div className="space-y-[8px]">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus("password")}
              className={`${
                touched.password && password.trim() === ""
                  ? "border-red-500"
                  : ""
              }
                `}
            />
            {touched.password && password.trim() === "" && (
              <p className="text-red-500 text-sm ml-[14px]">
                This field is required
              </p>
            )}
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
          )}
           {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error.code === 'auth/invalid-credential' ? 'Invalid Credential! Please try again.' : ''}</p>
          )}
        </div>
        <button
          onClick={handleLogIn}
          disabled={!isFormValid}
          className={`w-full mt-4 px-4 py-2 rounded-full transition ${
            isFormValid
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Login
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            New to JNEC-LSRS?{" "}
            <a href="/auth/sign-up" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">
          © 2024 JNEC-LSRS. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default LogIn;
