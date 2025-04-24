//React Frontend
import './App.css';
import React, { useEffect, useState } from 'react';

const App = () => {
  let [newsArray, setNewsArray] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/news')
      .then(response => response.json())
      .then(data => {
        setNewsArray(data);
        console.log(data);
      })
      .catch(error => {
         console.error("Error fetching data:", error);
      });
  }, []);

  // const fetchData = async () => {
  //   console.log("Running");
  
  //   try {
  //     const res = await fetch('http://localhost:5000/news')
  //     newsArray = await res.json();
  //     console.log('Response data:', newsArray);
  //   } catch (err) {
  //     console.error('Error fetching data:', err);
  //   }
  // };
    
  return (
    <div className="App">
      <header className="App-header">
        <h1>News Aggregator</h1>
        <span>Your daily dose of news from around the web</span>
        {/* <button id="loadBtn" onClick={fetchData}>Load Data</button> */}
      </header>
      <div id="news">
        {newsArray.map((ele, index) => (
          <div className="newsHeading" key={index}>
            <h1>{ele[0]}</h1>
            <p>{ele[1]}</p>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default App;
