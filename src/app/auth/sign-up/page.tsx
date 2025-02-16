"use client";
import { useEffect, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase/config";
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Loader from '@/components/loader';
import toast from 'react-hot-toast';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [student_id, setStudentId] = useState('');
  const [name, setName] = useState('')
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [isFormValid, setIsFormValid] = useState(false);
  const [err, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    student_id: false,
    name: false,
    password: false,
  });

  const emailPattern = new RegExp(
    `^${student_id ? `${student_id}\\.` : ""}[a-zA-Z]+@rub\\.edu\\.bt$`
  );

  const router = useRouter();

  const validateForm = () => {
    const isValid =
      emailPattern.test(email) &&
      email.trim() !== "" &&
      student_id.trim() !== "" &&
      name.trim() !== "" &&
      password.trim() !== "";
    setIsFormValid(isValid);
  };
  
  useEffect(() => {
    validateForm();
  }, [email, student_id, name, password]);

  const handleSignUp = async () => {
    if (!isFormValid) {
      setError("Please fill all fields correctly");
      return;
    }
    try {
      setLoader(true);
      const userCredential = await createUserWithEmailAndPassword(email, password); 
      const role = 'student'; // Default role for a new user
      const userDocRef = doc(db, 'user', userCredential?.user?.uid as any);
      await setDoc(userDocRef, { student_id, email, name, role });
      sessionStorage.setItem("user", JSON.stringify(userCredential?.user));
      toast.success('Signup has been successful!');
      userCredential?.user && router.push('/auth/login');
    } catch (e) { 
      setEmail('');
      setStudentId('');
      setPassword('');
    } finally {
      setLoader(false);
    }
  };

  const handleFocus = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(""); // Clear error on input
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {loader && <Loader />}
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
              type="number"
              placeholder="Student ID"
              value={student_id}
              onChange={(e) => setStudentId(e.target.value)}
              onFocus={() => handleFocus("student_id")}
              className={`${touched.student_id && student_id.trim() === "" ? "border-red-500" : ""}`}
            />
            {touched.student_id && student_id.trim() === "" && (
              <p className="mr-2 text-red-500 text-sm ml-[14px]">
                This field is required
              </p>
            )}
          </div>
          <div className='space-y-[8px]'>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => handleFocus("name")}
                className={`${touched.name && name.trim() === "" ? "border-red-500" : ""}`}
              />
              {touched.name && name.trim() === "" && (
                <p className="mr-2 text-red-500 text-sm ml-[14px]">
                  This field is required
                </p>
              )}
          </div>
          <div className="space-y-[8px]">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleFocus("email")}
              className={` ${touched.email && !emailPattern.test(email) ? "border-red-500" : ""}
                  `}
            />
            {touched.email && !emailPattern.test(email) && (
              <p className="text-red-500 text-sm ml-[14px]">
                  Please enter a valid email in the format: <br />
                  <code>{`${student_id}` || '05230140'}.jnec@rub.edu.bt</code>
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
              className={` ${touched.password && password.trim() === "" ? "border-red-500" : ""}`}
            />
            {touched.password && password.trim() === "" && (
              <p className="text-red-500 text-sm ml-[14px]">
                This field is required
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleSignUp}
          disabled={!isFormValid}
          className={`w-full mt-4 px-4 py-2 rounded-full transition ${
            isFormValid
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Register
        </button>
        {(error || err) && <p className="text-red-500 text-sm mt-4 text-center">{error?.code === 'auth/email-already-in-use' ? 'The email is already in use' : err}</p>}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-600 hover:underline">
              Login
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

export default SignUp;
