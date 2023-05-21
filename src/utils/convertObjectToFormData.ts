const convertObjectToFormData = (object: any, formData = new FormData(), parentKey = "") => {
  for (const key in object) {
    // eslint-disable-next-line no-prototype-builtins
    if (object.hasOwnProperty(key)) {
      const value = object[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${formKey}[${index}]`;

          if (item instanceof FileList) {
            for (let i = 0; i < item.length; i++) {
              const fileKey = `${arrayKey}[${i}]`;
              formData.append(fileKey, item[i]);
            }
          } else {
            formData.append(arrayKey, item);
          }
        });
      } else if (typeof value === "object" && value !== null && !(value instanceof File)) {
        convertObjectToFormData(value, formData, formKey);
      } else {
        formData.append(formKey, value);
      }
    }
  }

  return formData;
};

export default convertObjectToFormData;
