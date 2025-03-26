import React,{useState, useEffect } from 'react';
import {Link} from 'react-router-dom';



export default function Home(props){
    const updateInput = props.props.updateInput;
    const userInput = props.props.userInput;
    const stocks = props.props.stocks;
    const handleStocks = props.props.handleStocks;
    const addToStockList = props.props.addToStockList;
    const removeStock = props.props.removeStock;
    
    return <>
        <div className='main-div'>
         <Link to='/watchlist' className='watchlist-link'>WatchList</Link>
            <section className='title-section'>
                <h1 className='title'>Enter Up To 3 Stock Tickers</h1>
            </section>
            <section className='input-section'>
                    <div className='ticker-input-div'>
                        <input type='text' onChange={updateInput} value={userInput} maxLength='4' id='stock-input' className='ticker-input' autoComplete="off"/>
                    </div>
                    <div className='ticker-add-button-div'>
                        {userInput.length < 2 ? <button className='ticker-add-button' disabled onClick={() =>{ stocks.length < 3 && addToStockList(stocks, userInput)}}>+</button> : <button className='ticker-add-button' onClick={() =>{ stocks.length < 3 && addToStockList(stocks, userInput)}}>+</button>}
                    </div>
            </section>
            <section className='ticker-search-section'>
                         {stocks.length > 0 && <Link to='/results'><button className='ticker-search-button' type='submit' onClick={handleStocks}>generate</button></Link>}
            </section>
            
           <section className='saved-stock-section'>
                        { stocks.map((stock) => {
                        return <div className='stock-display' key={stock} id={stock}>{stock}<button className='stock-delete-button' id={stock} onClick={removeStock}>x</button></div>
        })}
            </section>
        </div>
        </>
}