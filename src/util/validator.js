import Ajv from "ajv";
import join from "../join.json"

const ajv = new Ajv()
ajv.addSchema(join,'join')

export const validator = (schemaName,data) => {
  const validate = ajv.getSchema(schemaName)
  const isValid = validate(data)
  console.log(data)
  console.log(validate)
  console.log(validate.schema)
  console.log(isValid)
  return {
    isValid,
    errors: isValid? null : validate.errors.map(error => {
      const {message, instancePath} = error
      console.log(error)
      console.log(instancePath)
      const property = instancePath.substring(1)
      console.log(property)
      const propertySchema = validate.schema.properties[property]
      if (!propertySchema){
        return message
      }
      return propertySchema.description
    })
  }
}

export const validObjToFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    console.log(key)
    console.log(value)
    formData.append(key, value);
  });
  return formData;
}
