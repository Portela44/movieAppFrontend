import axios from "axios";
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Checkbox from "../../components/Checkbox";

export default function Preferences() {
  const { user } = useContext(AuthContext);
  const storedToken = localStorage.getItem('authToken');
  const navigate = useNavigate();
  const [genres, setGenres] = useState({
    action: false,
    drama: false,
    fantasy: false,
    comedy: false,
    mystery: false,
    adventure: false,
    war: false,
    scify: false,
    romance: false,
    history: false,
    documentary: false,
    crime: false
  });
  useEffect(() => {
    const getPreferences = async () => {
      try {
        const currentUser = await axios.get(`${process.env.REACT_APP_API_URL}/user/loggedInUser`, { headers: { Authorization: `Bearer ${storedToken}` } });
        setGenres({
          action: currentUser.data.data.preferences.includes("1"),
          drama: currentUser.data.data.preferences.includes("12"),
          fantasy: currentUser.data.data.preferences.includes("14"),
          comedy: currentUser.data.data.preferences.includes("8"),
          mystery: currentUser.data.data.preferences.includes("22"),
          adventure: currentUser.data.data.preferences.includes("3"),
          war: currentUser.data.data.preferences.includes("34"),
          scify: currentUser.data.data.preferences.includes("27"),
          romance: currentUser.data.data.preferences.includes("26"),
          history: currentUser.data.data.preferences.includes("20"),
          documentary: currentUser.data.data.preferences.includes("11"),
          crime: currentUser.data.data.preferences.includes("10"),
        });
      } catch (error) {
        console.log(error);
      }
    };
    getPreferences();
  },[storedToken]);
  const handleCheck = (e) => {
    setGenres(prev => {
      return{
        ...prev,
        [e.target.name]:e.target.checked
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPreferences = [];
    if(genres.action) {
        newPreferences.push("1");
    };
    if(genres.drama) {
        newPreferences.push("12");
    };
    if(genres.fantasy) {
        newPreferences.push("14");
    };
    if(genres.comedy) {
        newPreferences.push("8");
    };
    if(genres.mystery) {
        newPreferences.push("22");
    };
    if(genres.adventure) {
        newPreferences.push("3");
    };
    if(genres.war) {
        newPreferences.push("34");
    };
    if(genres.scify) {
        newPreferences.push("27");
    };
    if(genres.romance) {
        newPreferences.push("26");
    };
    if(genres.history) {
        newPreferences.push("20");
    };
    if(genres.documentary) {
        newPreferences.push("11");
    };
    if(genres.crime) {
        newPreferences.push("10");
    };
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/user/preferences`, newPreferences, { headers: { Authorization: `Bearer ${storedToken}` } });
      toast.success('Your preferences have been udpated.');
      navigate('/');
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <div className="h-screen">
      <h1 className='text-2xl font-bold ml-10 pt-10'>How do you <span className='text-[#65B3AD]'>feel</span> today?</h1>
      {user && <div>
        <form onSubmit={handleSubmit} action="">
          <Checkbox label="action" genres={genres} handleCheck={handleCheck} />
          {/* <label>Action</label>
          <input type="checkbox" className="checkbox" id="action" name="action" checked={genres.action} onChange={(e) => handleCheck(e)} /> */}
          <label>Drama</label>
          <input type="checkbox" className="checkbox" id="drama" name="drama" checked={genres.drama} onChange={(e) => handleCheck(e)} />
          <label>Fantasy</label>
          <input type="checkbox" className="checkbox" id="fantasy" name="fantasy" checked={genres.fantasy} onChange={(e) => handleCheck(e)} />
          <label>Comedy</label>
          <input type="checkbox" className="checkbox" id="comedy" name="comedy" checked={genres.comedy} onChange={(e) => handleCheck(e)} />
          <label>Mystery</label>
          <input type="checkbox" className="checkbox" id="mystery" name="mystery" checked={genres.mystery} onChange={(e) => handleCheck(e)} />
          <label>Adventure</label>
          <input type="checkbox" className="checkbox" id="adventure" name="adventure" checked={genres.adventure} onChange={(e) => handleCheck(e)} />
          <label>War</label>
          <input type="checkbox" className="checkbox" id="war" name="war" checked={genres.war} onChange={(e) => handleCheck(e)} />
          <label>Scify</label>
          <input type="checkbox" className="checkbox" id="scify" name="scify" checked={genres.scify} onChange={(e) => handleCheck(e)} />
          <label>Romance</label>
          <input type="checkbox" className="checkbox" id="romance" name="romance" checked={genres.romance} onChange={(e) => handleCheck(e)} />
          <label>History</label>
          <input type="checkbox" className="checkbox" id="history" name="history" checked={genres.history} onChange={(e) => handleCheck(e)} />
          <label>Documentary</label>
          <input type="checkbox" className="checkbox" id="documentary" name="documentary" checked={genres.documentary} onChange={(e) => handleCheck(e)} />
          <label>Crime</label>
          <input type="checkbox" className="checkbox" id="crime" name="crime" checked={genres.crime} onChange={(e) => handleCheck(e)} />
          <div className="flex justify-center">
            <button type="submit" className="mb-36 mt-8 flex-shrink-0 bg-[#65B3AD] hover:bg-teal-700 border-[#65B3AD] hover:border-teal-700 text-xl border-4 text-white py-1 px-2 rounded w-28">Save</button>
          </div>
        </form>
      </div>}
    </div>
  );
}
