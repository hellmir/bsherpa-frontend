import TextField from "@mui/material/TextField";

function TextFieldComponent({auto = true,id,name,type,label,value,handleChange,disabled=false,onKeyPress}) {
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
          onKeyDown={onKeyPress}
      />
  );
}

export default TextFieldComponent;