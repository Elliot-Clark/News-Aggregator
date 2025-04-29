//React Frontend
import React, { Component } from "react";
import './App.css';
import abc_logo from './images/abcnews_logo.svg';
import apnews_logo from './images/apnews_logo.svg';
import cnn_logo from './images/cnn_logo.svg';
import foxnews_logo from './images/foxnews_logo.svg';
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
    newsData: [
      [
          "Donald Trump is facing criticism for stating that Ukrainian President Zelenskyy is prolonging the war by refusing to cede Crimea to Russia.",
          "cnn.com/2025/04/23/europe/rubio-russia-ukraine-ceasefire-talks-intl-hnk/index.html",
          "apnews.com/article/russia-ukraine-war-peace-talks-london-4f35dc70f521e2363218f4c40748caba",
          "npr.org/2025/04/23/nx-s1-5373407/ukraine-peace-talks-us-trump-russia-putin"
      ],
      [
          "A dozen states are suing the Trump administration over its tariff policy, claiming it is unlawful and disrupts the American economy.",
          "apnews.com/article/tariffs-lawsuit-what-states-sue-0d6531b7f60aaa2f7c6c35e0a944d4a9",
          "npr.org/2025/04/23/g-s1-62417/trump-tariff-lawsuits-states",
          "usatoday.com/story/news/nation/2025/04/23/democratic-states-sue-trump-tariffs/83238488007/"
      ],
      [
          "The body of Pope Francis is lying in state at St. Peter's Basilica, allowing the public to pay their respects.",
          "msnbc.com/chris-jansing-reports/watch/pope-francis-lying-in-state-for-three-days-at-st-peter-s-basilica-238177861669",
          "apnews.com/article/vatican-pope-francis-public-viewing-st-peters-732d413b0eba7695d8a931af393097f4",
          "npr.org/2025/04/23/nx-s1-5372537/pope-francis-body-lies-in-state-ahead-of-saturday-funeral",
          "usatoday.com/story/news/world/2025/04/23/pope-francis-death-funeral-vatican-live-updates/83211551007/",
          "washingtonpost.com/world/2025/04/23/pope-francis-viewing-st-peters/"
      ],
      [
          "Michelle Obama has shared another reason why she did not attend President Trump's inauguration.",
          "foxnews.com/media/michelle-obama-reveals-additional-reason-she-skipped-trumps-inauguration",
          "abcnews.go.com/GMA/Culture/michelle-obama-opens-skipping-president-trumps-2nd-inauguration/story?id=121099190",
          "usatoday.com/story/entertainment/celebrities/2025/04/23/michelle-obama-trump-inauguration-carter-funeral/83229973007/"
      ],
      [
          "Trump is facing scrutiny regarding potential influence or actions related to Elon Musk and his business ventures.",
          "cnn.com/2025/04/23/business/elon-musk-lasting-brand-damage-tesla-doge/index.html",
          "apnews.com/article/tesla-trump-musk-evs-doge-cybercab-brand-b9c9151c7852b8f1c10aaacb8fe6c8b8",
          "msnbc.com/opinion/msnbc-opinion/elon-musk-doge-trump-administration-tesla-earnings-rcna202574",
          "politico.com/news/2025/04/23/elon-musk-doge-trump-00306673"
      ],
      [
          "Pete Hegseth's tenure at the Pentagon is under scrutiny, with reports of turmoil and mismanagement.",
          "msnbc.com/top-stories/latest/pete-hegseth-chaotic-pentagon-mismanagement-rcna202602",
          "politico.com/news/2025/04/22/pentagon-infighting-hegseth-fired-officials-00302709",
          "washingtonpost.com/national-security/2025/04/23/hegseth-army-war-college/"
      ],
      [
          "A pastor is calling for a boycott of Target due to concerns about the company's diversity, equity, and inclusion (DEI) initiatives.",
          "apnews.com/article/target-boycott-diversity-equity-inclusion-dei-8d0b3367ff4585fcf069e286dbb601c1",
          "abcnews.go.com/US/wireStory/pastor-calls-full-target-boycott-concerns-diversity-equity-121103098"
      ],
      [
          "Trump administration looking at 'baby bonus' to incentivize public to have more children",
          "abcnews.go.com/Politics/trump-administration-5000-baby-bonus-incentivize-public-children/story?id=121094707",
          "foxnews.com/media/the-view-co-hosts-lose-over-trump-backing-idea-give-5000-baby-bonus-mothers"
      ]
  ]
  }

  arrangeData = (data) => {
    // News is sorted so headlines with the most news agencies reporting it are at the top
    let temp = this.state.newsData
    for (let x = 1; x < temp.length -1; x++) {
      if (x <= 0) {
        continue
      }
      if (temp[x - 1].length < temp[x].length) {
        let tmp = temp[x]
        temp[x] = temp[x - 1]
        temp[x - 1] = tmp
        x-= 2;
      }
    }
    // this.setState({newsData: data})
  }

  fetchData = async () => {
    fetch('http://localhost:5000/news')
      .then(response => response.json())
      .then(data => {
        // arrangeData(data);
        this.setState({ newsData: data });
        console.log(data);
      })
      .catch(error => {
         console.error("Error fetching data:", error);
      });
  }

  componentDidMount() {
    let date = new Date();
    document.getElementById("year").value = date.getYear() + 1900;
    const monthIndex = date.getMonth();
    document.getElementById("month").value = this.state.months[monthIndex];
    document.getElementById("day").value = date.getDate();
  }

  render() {
    this.arrangeData();
    const logoMap = {
      abcnews: abc_logo,
      apnews: apnews_logo,
      cnn: cnn_logo,
      foxnews: foxnews_logo,
      msnbc: msnbc_logo,
      npr: npr_logo,
      politico: politico_logo,
      usatoday: usatoday_logo,
      washingtonpost: washingtonpost_logo
    };

    let loadLogoLinks = (newsArray, index) => {
      if (index === 0) {
        return
      }
      const source = newsArray.split(".")[0];
      const logoSrc = logoMap[source];
      return <a 
      href={"https://www." + newsArray} 
      target="_blank" 
      rel="noopener noreferrer">
        <img 
          src={logoSrc} 
          alt={source + " Logo Image"}>
        </img>
      </a>
    }

    const adjustDate = (direction) => {
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
      // TODO: Query for given date;
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
      // TODO run date search
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
            {/* <span id="dividingLine"></span> */}
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
