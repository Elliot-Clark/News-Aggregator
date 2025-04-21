import './App.css';

const App = () => {
  let testArr = [
    ["Test", "www.google.com", "www.yahoo.com"],
    ["Test2", "www.amazon.com", "www.cnn.com"]
  ]
    
  return (
    <div className="App">
      <header className="App-header">
        <h1>News Aggregator</h1>
        <span>Your daily dose of news from around the web</span>

        <div id="news">

          {testArr.map((ele, index) => (
            <div className="newsHeading" key={index}>
              <h1>{ele[0]}</h1>
              <p>{ele[1]}</p>
            </div>
          ))}

        </div>
      </header>
    </div>
  );
}

export default App;
