"use client";
import { useEffect, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";

const LogIn = () => {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  // const [student_id, setStudentId] = useState("");
  const [loginInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const [touched, setTouched] = useState({
    email: false,
    // student_id: false,
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
      debugger;
      if (res?.user) {
        // Login successful
        setErrorMessage("");
        console.log({ res });
        sessionStorage.setItem("user", "true");
        setStudentId("");
        setPassword("");
        router.push("/");
      } else {
        setErrorMessage("Somthing went wrong. Please try again.");
      }
    } catch (e: any) { 
      setErrorMessage("An unknown error occurred. Please try again.");

      // console.error('error: ',e.code.errors);
      // if (e.code === 'auth/user-not-found') {
      //   setErrorMessage("This email is not registered.");
      // } else if (e.code === 'auth/wrong-password') {
      //   setErrorMessage("The password is incorrect.");
      // } else if (e.code === 'auth/invalid-email') {
      //   setErrorMessage("The email format is invalid.");
      // } else {
      //   setErrorMessage("An unknown error occurred. Please try again.");
      // }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
                touched.email && studentId.trim() === "" ? "border-red-500" : ""
              }
                `}
            />
            {touched.email && studentId.trim() === "" && (
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
        </div>
        <button
          onClick={handleLogIn}
          disabled={!isFormValid}
          className={`w-full mt-4 px-4 py-2 rounded-lg transition ${
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
