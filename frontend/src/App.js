//React Frontend
import React, { Component } from "react";
import Header from "./Header.js"
import './App.css';
import loading from './images/loading_icon.gif';
import link_logo from './images/link_logo.png';
import abc_logo from './images/abcnews_logo.svg';
import apnews_logo from './images/apnews_logo.svg';
import cnn_logo from './images/cnn_logo.svg';
import foxnews_logo from './images/foxnews_logo.svg';
import foxbusiness_logo from './images/foxbusiness_logo.svg';
import msnbc_logo from './images/msnbc_logo.svg';
import npr_logo from './images/npr_logo.svg';
import politico_logo from './images/politico_logo.svg';
import usatoday_logo from './images/usatoday_logo.svg';
import washingtonpost_logo from './images/washingtonpost_logo.svg';
import yahoo_logo from './images/yahoo_logo.svg'

class App extends Component {
  state = {
    newsData: []
  }

  arrangeData = (data) => {
    // News is sorted so headlines with the most news agencies reporting it are at the top
    if (!data) {
      return
    }
    for (let x = 1; x < data.length; x++) {
      if (x <= 0) {
        continue
      }
      if (data[x - 1].length < data[x].length) {
        let tmp = data[x]
        data[x] = data[x - 1]
        data[x - 1] = tmp
        x-= 2;
      }
    }
    this.setState({newsData: data})
  }

  fetchCurrentNews = async () => {
    // On page load, gets the most recently saved news from the backend.
    fetch('https://news-aggregator-0z5i.onrender.com/currentNews')
      .then(response => response.json())
      .then(data => {
        this.arrangeData(data);
      })
      .catch(error => {
         console.error("Error fetching data:", error);
      });
  }

  fetchPastNews = async (date) => {
    // Upon user searching a valid date, sends a request to the backend to get news on that day from the database.
    fetch(`https://news-aggregator-0z5i.onrender.com/pastNews?date=${encodeURIComponent(date)}`)
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) {
        this.setState({ newsData: [["Not Valid Request"]]})
        return
      } else {
        this.arrangeData(data);
      }  
    })
    .catch(error => {
       console.error("Error fetching data for pastNews:", error);
    });
  }


  componentDidUpdate(prevProps, prevState) {
    // Displays a loading image only when there's no news
    if (prevState.newsData !== this.state.newsData && this.state.newsData.length === 0) {
      document.getElementById("news").style.textAlign = "center";
      document.getElementById("loadingImage").style.display = "inline"
    } else {
      document.getElementById("specialMessage").innerText = "\n";
      document.getElementById("news").style.textAlign = "left";
      document.getElementById("loadingImage").style.display = "none"
    }
  }

  render() {
    const loadLogoLinks = (newsArray, index) => {
      // Attachs a news logo image and URL link under each headline who have reported that specific event
      if (index === 0) {
        return
      }
      const logoMap = {
        abcnews: abc_logo,
        apnews: apnews_logo,
        cnn: cnn_logo,
        foxnews: foxnews_logo,
        foxbusiness: foxbusiness_logo,
        msnbc: msnbc_logo,
        npr: npr_logo,
        politico: politico_logo,
        usatoday: usatoday_logo,
        washingtonpost: washingtonpost_logo,
        yahoo: yahoo_logo
      };
      const source = newsArray.split(".")[0];
      const logoSrc = logoMap[source];
      return <a 
      href={"https://www." + newsArray} 
      target="_blank" 
      rel="noopener noreferrer">
        <img 
          src={logoSrc ? logoSrc : link_logo} 
          alt={source + " Logo Image"}>
        </img>
      </a>
    }

    return (
      <div className="App">

        < Header fetchCurrentNews={this.fetchCurrentNews} fetchPastNews={this.fetchPastNews}/>

        <span id="specialMessage"></span>

        <div id="news">
          <img id="loadingImage" src={loading} alt="Gif for loading news in progress"></img>
          {this.state.newsData.map((newsArrayes, index) => (
            <div className="newsHeadlines" key={index}>
              <a href={"https://www." + newsArrayes[1]} target="_blank" rel="noopener noreferrer">
                <h3 className="newsTitle">{newsArrayes[0]}</h3>
              </a>
              <div className="linkSection">
                <div className="logos">{newsArrayes.map((newsArray, index) => 
                  <div className="logoLinks" key={index}>{loadLogoLinks(newsArray, index)}</div>
                )}</div>
              </div>
            </div>
          ))}
        </div>

        <footer>
          <span>Copyright ©2025.</span>
          <span>Made by Elliot Clark.</span>
          <a href="https://github.com/Elliot-Clark/News-Aggregator" target="_blank" rel="noopener noreferrer"> Github Link for this Project</a>
        </footer>

      </div>
    );
  }
}

export default App;
