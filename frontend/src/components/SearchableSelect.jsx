import React from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

const SearchableSelect = ({ selectedSymbol, setSelectedSymbol, DummySymbolData,placeholder,text,onChange }) => {
  return (
    <Autocomplete
      options={DummySymbolData}
      getOptionLabel={(option) => option.symbol}
      value={selectedSymbol ? DummySymbolData.find((item) => item.symbol === selectedSymbol) : null}
      onChange={(event, newValue) => {
        setSelectedSymbol(newValue ? newValue.symbol : null);
      }}
      renderInput={(params) => (
        <TextField value={text} onChange={onChange}
          {...params}
          label={placeholder}
          fullWidth
        />
      )}
    />
  );
};

export default SearchableSelect;
