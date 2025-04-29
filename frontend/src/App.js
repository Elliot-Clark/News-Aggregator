//React Frontend
import React, { Component } from "react";
import './App.css';
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

class App extends Component {
  state = {
    months: [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ],
    newsData: [],
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
      console.log("here", data)
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
        washingtonpost: washingtonpost_logo
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
      console.log("Submitting")
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
      if ((year >= date.getFullYear() + 1) || (year >= date.getFullYear() && month > date.getMonth())) {
        document.getElementById("specialMessage").innerText = "Clairvoyant news coming in future update!"
        return 
      }
      document.getElementById("specialMessage").innerText = "";
      const query = year + "-" + String(month + 1).padStart(2, '0') + "-" + String(day).padStart(2, '0')
      this.fetchPastNews(query);
    }

    return (
      <div className="App">
        <div id="header">
          <h1>Elliot's News <br></br>Aggregator</h1>

          <div id="calender">
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

          <div id="yestermorrow">
            <span className="customButton" id="yesterday" onClick={queryYesterday}>⇽ Yesterday</span>
            <span className="customButton" id="tomorrow" onClick={queryTomorrow}>Tomorrow ⇾</span>
          </div>

          <div id="queryDate">
            <span className="customButton" onClick={submit}>Search</span>
          </div>

          <div id="specialMessage"></div>
        </div>

        <div id="news">
          {this.state.newsData.map((newsArrayes, index) => (
            <div className="newsHeading" key={index}>
              <h1 className="newsTitle">{newsArrayes[0]}</h1>

              <div className="logos">{newsArrayes.map((newsArray, index) => 
                <div className="logoLinks" key={index}>{loadLogoLinks(newsArray, index)}</div>
              )}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
