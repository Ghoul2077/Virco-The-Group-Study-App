import React from "react";
import { useFormikContext } from "formik";
import ErrorMessage from "./ErrorMessage";

const AppFormField = ({
  name,
  multiline = false,
  hideErrorMessage = false,
  containerStyle,
  containerProps,
  errorProps,
  ...otherProps
}) => {
  const { setFieldTouched, handleChange, errors, touched, values } =
    useFormikContext();

  return (
    <div
      className={`relative ${hideErrorMessage ? "" : "pt-10"} ${
        containerStyle || ""
      }`}
      {...containerProps}
    >
      {!hideErrorMessage && (
        <ErrorMessage
          className="absolute top-0 left-1 text-red-600"
          error={errors[name]}
          visible={touched[name]}
          {...errorProps}
        />
      )}
      {!multiline && (
        <input
          name={name}
          value={values[name]}
          onChange={handleChange(name)}
          onBlur={() => setFieldTouched(name)}
          {...otherProps}
        />
      )}
      {multiline && (
        <textarea
          name={name}
          value={values[name]}
          onChange={handleChange(name)}
          onBlur={() => setFieldTouched(name)}
          {...otherProps}
        />
      )}
    </div>
  );
};

export default AppFormField;
