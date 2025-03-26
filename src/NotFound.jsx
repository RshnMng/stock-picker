import React from 'react';
import {Link} from 'react-router-dom';


export default function NotFound(){
    return <>
            <div className='not-found-container'>
                <div className='not-found-text'>404: The page you are looking for was not found.</div>
                <Link to='/' className='not-found-home-link'>go home</Link>
            </div>
    
          </>
}