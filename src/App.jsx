import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import WatchList from "./WatchList";
import Layout from "./Layout";
import Results from "./Results";
import OpenAI from "openai";
import NotFound from "./NotFound";

function App() {
  const openKey = import.meta.env.VITE_OPEN_KEY;
  const openai = new OpenAI({
    apiKey: openKey,
    dangerouslyAllowBrowser: true,
  });

  const stockAPI = import.meta.env.VITE_STOCK_KEY;

  console.log(openKey, "open key");
  console.log(stockAPI, "stock key");
  const [firstLoad, isFirstLoad] = useState(true);
  const [stocks, setStocks] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, isLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [stockData, setStockData] = useState("");

  function updateInput(event) {
    let input = event.target.value.toUpperCase();
    setUserInput(input);
  }

  function addToStockList(array, input) {
    array.push(input);
    setStocks(array);
    setUserInput("");
  }

  function removeStock(event) {
    let stockID = event.target.id;

    let newArray = stocks.filter((stock) => {
      return stock !== stockID;
    });
    setStocks(newArray);
    isLoading(false);
    setAiResponse("");
  }

  function getDates() {
    let currentDate = new Date();
    let day = currentDate.getDate() - 1;
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let todaysDate;

    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }

    todaysDate = `${year}-${month}-${day}`;

    let today = new Date();
    let fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 5);

    let nday = fiveDaysAgo.getDate();
    let nmonth = fiveDaysAgo.getMonth() + 1;
    let nyear = fiveDaysAgo.getFullYear();

    let nDate;

    if (nday < 10) {
      nday = "0" + nday;
    }
    if (nmonth < 10) {
      nmonth = "0" + nmonth;
    }

    nDate = `${nyear}-${nmonth}-${nday}`;
    console.log(todaysDate, "today", nDate, "ndate");
    return [nDate, todaysDate];
  }

  function getData(dates) {
    let dataArr = [];
    stocks.map((stock) => {
      console.log(dates);
      fetch(`https://api.polygon.io/v2/aggs/ticker/${stock}/range/5/day/${dates[0]}/${dates[1]}?apiKey=${stockAPI}`)
        .then((data) => data.json())
        .then((data) => {
          console.log(data, "this is data");
          dataArr.push(data);
          dataArr.length === stocks.length && setStockData(dataArr);
        });
    });
  }

  async function callAI(data) {
    isLoading(true);
    const messages = [
      {
        role: "system",
        content: "You are a trading guru. Analyze the stock information of the 5 days for the given stocks and decide whether an investor should buy, sell or hold this stock. Summarize and give a reccomendation in 75 words or less",
      },
      {
        role: "user",
        content: data,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });

    let responseAi = response.choices[0].message.content;
    setAiResponse(responseAi);
    isLoading(false);
  }

  function handleStocks() {
    isLoading(true);
    let dateRange = getDates();
    getData(dateRange);
  }

  useEffect(() => {
    let stringData = JSON.stringify(stockData);
    !firstLoad && callAI(stringData);
    isFirstLoad(false);
  }, [stockData]);

  let props = { updateInput, userInput, stocks, handleStocks, addToStockList, removeStock };
  let data = { loading, aiResponse, stocks, setStocks };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home props={props} />} />
            <Route path="watchlist" element={<WatchList props={setStocks} />} />
            <Route path="results" element={<Results props={data} />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
