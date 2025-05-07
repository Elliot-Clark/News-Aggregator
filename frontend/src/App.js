//React Frontend
import React, { Component } from "react";
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
    months: [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ],
    newsData: []
  }

  arrangeData = (data) => {
    // News is sorted so headlines with the most news agencies reporting it are at the top
    if (!data) {
      return
    }
    for (let x = 1; x < data.length -1; x++) {
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
    fetch('http://localhost:5000/currentNews')
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
    fetch(`http://localhost:5000/pastNews?date=${encodeURIComponent(date)}`)
    .then(response => response.json())
    .then(data => {
      this.arrangeData(data);
    })
    .catch(error => {
       console.error("Error fetching data for pastNews:", error);
    });
  }

  componentDidMount() {
    let date = new Date();
    document.getElementById("year").value = date.getYear() + 1900;
    document.getElementById("month").value = this.state.months[date.getMonth()];
    document.getElementById("day").value = date.getDate();
    this.fetchCurrentNews();
  }

  componentDidUpdate(prevProps, prevState) {
    //Displays a loading image only when there's no news
    if (prevState.newsData !== this.state.newsData && this.state.newsData.length === 0) {
      document.getElementById("news").style.textAlign = "center";
      document.getElementById("loadingImage").style.display = "inline"
    } else {
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

    const adjustDate = (direction) => {
      // Runs when the user clicks the yesterday or tomorrow buttons
      let dayCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      let month = this.state.months.indexOf(document.getElementById("month").value)
      let day = parseInt(document.getElementById("day").value)
      let year = document.getElementById("year").value
      if (year % 4 === 0) {
        dayCount[1] = 29;
      }
      day += direction;
      // If subtracted day turns over to the previous month
      if (day === 0) {
        month--;
        if (month === -1) {
          year--;
          month = 11;
        }
        day = dayCount[month]
      }
      // If added day turns over to the next month
      if (day > dayCount[month]) {
        month++;
        if (month === 12) {
          year++;
          month = 0;
        }
        day = 1;
      }
      document.getElementById("month").value = this.state.months[month]
      document.getElementById("day").value = day;
      document.getElementById("year").value = year;
    } 

    const queryYesterday = () => {
      adjustDate(-1);
    }

    const queryTomorrow = () => {
      adjustDate(1);
    }

    const submit = () => {
      let month = this.state.months.indexOf(document.getElementById("month").value)
      let day = parseInt(document.getElementById("day").value)
      let year = parseInt(document.getElementById("year").value)

      if (day > 31 || day < 1 || isNaN(day) || isNaN(year)) {
        document.getElementById("specialMessage").innerText = "Really? Come on. Be serious."
        return
      }
      if ((year === 2025 && month <= 3 && day <= 16) || (year === 2025 && month < 3) || (year < 2025) ) {
        document.getElementById("specialMessage").innerText = "Earliest data collection started on 4/17/2025"
        return 
      }
      const date = new Date();
      if (
        (year >= date.getFullYear() + 1) || 
        (year >= date.getFullYear() && month > date.getMonth()) ||
        (year >= date.getFullYear() && month >= date.getMonth() && day > date.getDate() + 1)
      ) {
        document.getElementById("specialMessage").innerText = "Clairvoyant news coming in future update!"
        return 
      }
      this.setState({newsData: []})
      document.getElementById("specialMessage").innerText = "";
      const query = year + "-" + String(month + 1).padStart(2, '0') + "-" + String(day).padStart(2, '0')
      this.fetchPastNews(query);
    }

    return (
      <div className="App">
        <header>
          <h1>Elliot's News Aggregator</h1>

          <div id="dateSelectionContainer">
            <button className="customDateSelectionButton" id="yesterday" onClick={queryYesterday}>⇽ Yesterday</button>
            
            <div id="calendarContainer">
              <select id="month" name="month">
                <option value="january">January</option>
                <option value="february">February</option>
                <option value="march">March</option>
                <option value="april">April</option>
                <option value="may">May</option>
                <option value="june">June</option>
                <option value="july">July</option>
                <option value="august">August</option>
                <option value="september">September</option>
                <option value="october">October</option>
                <option value="november">November</option>
                <option value="december">December</option>
              
              </select>
              <input id="day"></input>
              <input id="year"></input>
            </div>

            <button className="customDateSelectionButton" id="tomorrow" onClick={queryTomorrow}>Tomorrow ⇾</button>
            <button className="customDateSelectionButton" id="search" onClick={submit}>Search</button>
          </div>

        </header>

        <span id="specialMessage"></span>

        <div id="news">
          <img id="loadingImage" src={loading} alt="Gif for loading news in progress"></img>
          {this.state.newsData.map((newsArrayes, index) => (
            <div className="newsHeadlines" key={index}>
              <a href={"https://www." + newsArrayes[1]} target="_blank" rel="noopener noreferrer">
                <h3 className="newsTitle">{newsArrayes[0]}</h3>
              </a>
              <div className="linkSection">
                {/* <h4>Links:</h4> */}
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
