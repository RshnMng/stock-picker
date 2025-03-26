import React, {useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import { RiDeleteBinLine } from "react-icons/ri";




export default function WatchList(props){
    
      let [storage, setStorage] = useState(getFromLocal('savedReports'));
      storage === null ? storage = [] : null;
      const [popup, isPopup] = useState(false);
      const [entryId, setEntryId] = useState('');
      const setStocks = props.props;
      
    
        function saveToLocal(name, value){
        let dataJson = JSON.stringify(value);
        localStorage.setItem(name, dataJson);
    }
    
    function getFromLocal(name){
        let dataJson = localStorage.getItem(name);
        let data = JSON.parse(dataJson);
        return data;
    }
    
    function handleRemoval(){
        entryId === 'clear' ? clearWatchlist() : removeEntry();
    }
    
    function removeEntry(){
        let updatedStorage = storage.filter((entry) => {
            return entry.id !== entryId;
        })
        
        setStorage(updatedStorage);
        saveToLocal('savedReports', updatedStorage)
        isPopup(false);
        
    };
    
   
    
    function cancelDelete(){
        isPopup(false);
    }
    
    function showPopup(event){
        let entryId = event.target.id
        isPopup(true)
        setEntryId(entryId);
    } 
    
    function clearWatchlist(){
        isPopup(false);
        setStorage([]);
        saveToLocal('savedReports', [])
    }
    
    useEffect(() => {
        storage === null ? console.log('empty') : console.log('full')
    }, [storage])
    
  
    const watchList = storage.map((entry) => {
                return <div className='entry-div' key={entry.id}> 
                            <div className='entry-info'>
                                <section className='entry-header'>
                                     <div className='entry-date'>{entry.date}</div>
                                     <div className='delete-icon-div'>
                                             <RiDeleteBinLine className='delete-icon' onClick={(event) => showPopup(event)} id={entry.id}/>
                                     </div>
                                </section>
                              <ul className='stock-list'>
                                {entry.stocks.map((stock) => {
                                    return <li className='stock' key={stock}>{stock}</li>
                                })}
                               </ul>
                               <div className='entry-report'>{entry.aiResponse}</div>
                            </div>
                       </div>
    })
    
    let thisReport = 'this report?';
    let allReports = 'all reports?'
    
    const popupDisplay = <div className='popup-container'> 
                                    <div className='popup-title'> Are you sure you want to delete {entryId === 'clear' ? `${allReports}` : `${thisReport}`} Once deleted it can not be recovered.</div>
                                    <div className='popup-button-div'>
                                        <button onClick={handleRemoval} className='yes-button button' >Yes</button>
                                         <button className='no-button button' onClick={cancelDelete}>No</button>
                                    </div> 
            
                        </div>
                        
    const emptyList = <div className='empty-storage-div'>
                            <h1>Your watchlist is currently empty. Search for stocks to begin saving reports</h1>
                    </div>
        
        function clearStocks(){
            setStocks([])
        }
    
    return <>
            <div className='watch-main'>
                <section className='watch-header-section'>
                        <div className='watch-title'>WatchList</div>
                </section>
                <section className='watch-link-section'>
                        <Link to='/' className='watch-link' onClick={clearStocks}>return to stocks</Link>
                      {  storage.length !== 0 && <Link className='watch-clear-link' onClick={showPopup} id='clear'>clear watchlist</Link> }
                </section>
                {popup && popupDisplay}
                {storage.length === 0 && emptyList}
                <section className='watch-display'>
                         {watchList}
                </section>
            </div>
        </>
}
