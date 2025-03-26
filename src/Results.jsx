import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa6";


export default function Results(props){
    let loading = props.props.loading;
    const aiResponse = props.props.aiResponse;
    const stocks= props.props.stocks;
    const setStocks = props.props.setStocks;
    const [entry, setEntry] = useState([])
    const [saved, isSaved] = useState(false);
    const [firstLoad, isFirstLoad] = useState(true);
    
    function saveToLocal(name, value){
        let dataJson = JSON.stringify(value);
        localStorage.setItem(name, dataJson);
    }
    
    function getFromLocal(name){
        let dataJson = localStorage.getItem(name);
        let data = JSON.parse(dataJson);
        return data;
    }
    
    function createRandomId(){
        let randomNum = Math.floor(Math.random() * 500);
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        const randomLetter = alphabet.charAt(randomIndex);
        
        return randomLetter + randomNum;
    }
    
    function saveData(){
        const today = new Date();
        const dateString = today.toLocaleDateString(); 
        const randomId = createRandomId();
        
        let entry = {
            stocks,
            aiResponse,
            date : dateString,
            id: randomId
        }
        setEntry(entry)
        let storage = getFromLocal('savedReports');
        let updatedStorage; 
        storage === '[]' ? updatedStorage = [entry] : updatedStorage = [entry, ...storage];
        
        
        saveToLocal('savedReports', updatedStorage)
    }
    
    function removeData(){
        let entryId = entry.id;
        let storage = getFromLocal('savedReports');
        let updatedStorage;
        
        storage === '[]' ? null : updatedStorage = storage.filter(
            (entry) => { 
                return entry.id !== entryId
            });
        
 
       
        saveToLocal('savedReports', updatedStorage);
        
    }
    
    
    function flipSaved(){
        isSaved(!saved);
    }
    
    function handleLocalStorage(){
        let storage = getFromLocal('savedReports');
        storage === null ? saveToLocal('savedReports', '[]') : saveToLocal('savedReports', storage);
         saved ? saveData() : removeData();
    }
    
    function clearStocks(){
        setStocks([])
    }
    
   useEffect(() => {
    firstLoad === true ? null : handleLocalStorage();
    isFirstLoad(false)
   }, [saved])

    return <>
                <div className='generate-main'>
                      {loading ? <div className='generate-title'>Generating Stock Analysis....</div> : <section className='generate-box'>
                             <div className='generate-box-header'>
                                 <section className='header-section'>
                                    <Link className='back-stocks-link' to='/' onClick={clearStocks}>Go Back to Stocks</Link>
                                    
                                 </section>
                                 <section className='header-section'>
                                    <h3 className='generate-box-title'>Stock Report</h3>
                                 </section>
                                 <section className='header-section'>
                                    {saved ? <FaStar className='filled-star' onClick={flipSaved} /> : <CiStar className='star' onClick={flipSaved} />}
                                    <div className='hidden-text'>save to watchlist</div>
                                 </section>
                                  
                             </div>
                             <div className='generate-text'>{aiResponse}</div>
                             <Link to='/watchlist' className='watchlist-link results-watch-link'>WatchList</Link>
                        </section> }

                </div>
          </>
}

       
                                    