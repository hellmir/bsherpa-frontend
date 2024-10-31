import TextField from "@mui/material/TextField";

function TextFieldComponent({auto = true,id,name,type,label,value,handleChange,disabled=false}) {
  return (
      <TextField
          autoFocus={auto}
          required
          margin="dense"
          id={id}
          name={name}
          label={label}
          type={type}
          fullWidth
          variant="filled"
          value={value}
          onChange={handleChange}
          disabled={disabled}
      />
  );
}

export default TextFieldComponent;