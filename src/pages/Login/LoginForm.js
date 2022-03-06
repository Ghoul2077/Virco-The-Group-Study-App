import React from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { login } from "../../store/reducers/auth";
import AppForm from "../../components/Form/AppForm";
import AppFormField from "../../components/Form/AppFormField";
import SubmitButton from "../../components/Form/SubmitButton";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().label("Email").required(),
  password: Yup.string().label("Password").required(),
});

const LoginForm = () => {
  const dispatch = useDispatch();

  function handleOnSubmit(data) {
    dispatch(login(data));
  }

  return (
    <AppForm
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleOnSubmit}
    >
      <div className="mt-8">
        <AppFormField
          placeholder="Email"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <AppFormField
          placeholder="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />

        <div className="flex items-center justify-between mt-6 mb-8">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <button
              disabled
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        <SubmitButton
          title="Sign in"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        />
      </div>
    </AppForm>
  );
};

export default LoginForm;
