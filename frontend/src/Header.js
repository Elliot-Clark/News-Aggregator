import React, { Component } from "react";
import './Header.css';

class Header extends Component {
    state = {
        months: [
          "january", "february", "march", "april", "may", "june",
          "july", "august", "september", "october", "november", "december"
        ],
    }

    componentDidMount() {
        let date = new Date();
        document.getElementById("year").value = date.getYear() + 1900;
        document.getElementById("month").value = this.state.months[date.getMonth()];
        document.getElementById("day").value = date.getDate();
        this.props.fetchCurrentNews();
        document.getElementById("specialMessage").innerText = "This project is currently hosted on free Render servers. Because of this please allow at least 20 seconds for the backend server to boot up."
    }

    render() {
        
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
            document.getElementById("specialMessage").innerText = "\n";
            const query = year + "-" + String(month + 1).padStart(2, '0') + "-" + String(day).padStart(2, '0')
            this.props.fetchPastNews(query);
        }

        return (
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
        )
    }
}

export default Header;