import { Button } from "@mui/material"
import SearchBar from "../Searchbar/Searchbar";
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Adjust path as needed
import SurveyModal from "../SurveyModal/SurveyModal";
const Navbar: React.FC = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('Search for:', query);
    // Add logic for filtering or API call
  };
  return (
    <div className="flex flex-row justify-between w-full p-5 items-center">
      {/* Left section: buttons */}
      <div className="flex-[1] flex flex-row gap-5">
        {!userId ? (<>
          <Button
            onClick={() => navigate("/register")}
            variant="contained"
            color="primary"
            sx={{ mr: 2, textTransform: 'none', px: 3, borderRadius: 5 }}
          >
            Sign Up
          </Button>

          <Button
            onClick={() => navigate("/login")}
            variant="outlined"
            color="inherit"
            sx={{ textTransform: 'none', px: 3, borderRadius: 5 }}
          >
            Login
          </Button>
        </>) :
          (<>
            <SurveyModal></SurveyModal>
          </>)}
      </div>

      {/* Center section */}
      <div className="flex-[2] flex justify-center">
        <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
      </div>

      {/* Right section (optional, can be empty) */}
      <div className="flex-[1] flex justify-end">
        {userId ? (<>
          <Button
            onClick={() => navigate("/profile")}
            variant="contained"
            color="primary"
            sx={{ mr: 2, textTransform: 'none', px: 3, borderRadius: 5 }}
          >
            Profile
          </Button>
        </>) : null}
      </div>
    </div>
  );
};

export default Navbar;
