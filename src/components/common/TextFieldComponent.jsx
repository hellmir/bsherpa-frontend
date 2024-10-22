import React from 'react';
import TextField from "@mui/material/TextField";

function TextFieldComponent({id,type,label,value,handleChange}) {
  return (
      <TextField
          autoFocus
          required
          margin="dense"
          id={id}
          name={id}
          label={label}
          type={type}
          fullWidth
          variant="filled"
          value={value}
          onChange={handleChange}
      />
  );
}

export default TextFieldComponent;