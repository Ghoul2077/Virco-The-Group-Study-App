import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function Login() {
  const [mode, setMode] = useState("login");

  return (
    <>
      <div className="fixed top-0 left-0 h-full w-full min-h-full flex">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="relative h-10 w-10">
              <img
                className="absolute w-full h-full object-cover"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Logo"
              />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {mode === "login"
                ? "Sign in to your account"
                : "Sign up for new account"}
            </h2>
            {mode === "login" ? (
              <>
                <LoginForm />
                <button
                  type="submit"
                  onClick={() => setMode("signup")}
                  className="mt-5 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create new account
                </button>
              </>
            ) : (
              <>
                <SignupForm />
                <button
                  onClick={() => setMode("login")}
                  type="submit"
                  className="mt-5 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Go back
                </button>
              </>
            )}
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="relative inset-0 h-full w-full">
            <img
              className="absolute w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80"
              alt="background"
            />
          </div>
        </div>
      </div>
    </>
  );
}
