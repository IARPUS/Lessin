import React from 'react';
import { InputBase, IconButton, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  return (
    <Paper
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch?.();
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: 3,
        px: 2,
        py: 0.25,
        bgcolor: '#f0f0f0',
        width: '100%',
        maxWidth: 500,
      }}
    >
      <InputBase
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ ml: 1, flex: 1, }}
        inputProps={{ 'aria-label': 'search' }}
      />
      <IconButton type="submit" sx={{ p: '7px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
