import React from "react";
import * as Yup from "yup";
import AppForm from "../../components/Form/AppForm";
import AppFormField from "../../components/Form/AppFormField";
import SubmitButton from "../../components/Form/SubmitButton";
import { useDispatch } from "react-redux";
import { createAccount } from "../../store/reducers/auth";

const validationSchema = Yup.object().shape({
  name: Yup.string().label("Name").required(),
  username: Yup.string().label("Username").required(),
  email: Yup.string().email().label("Email").required(),
  password: Yup.string()
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Choose a stronger password"
    )
    .label("Password")
    .required(),
  retypePassword: Yup.string()
    .required("Please retype your password.")
    .oneOf([Yup.ref("password")], "Your passwords do not match."),
});

const SignupForm = () => {
  const dispatch = useDispatch();

  function handleOnSubmit(data) {
    dispatch(createAccount(data));
  }

  return (
    <AppForm
      initialValues={{
        name: "",
        username: "",
        email: "",
        password: "",
        retypePassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleOnSubmit}
    >
      <div className="mb-8">
        <AppFormField
          placeholder="Name"
          id="name"
          name="name"
          type="name"
          autoComplete="name"
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <AppFormField
          placeholder="Username"
          id="username"
          name="username"
          type="username"
          autoComplete="username"
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
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
          autoComplete="password"
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <AppFormField
          placeholder="Retype Password"
          id="retypePassword"
          name="retypePassword"
          type="password"
          autoComplete="password"
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <SubmitButton
        title="Create account"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      />
    </AppForm>
  );
};

export default SignupForm;
