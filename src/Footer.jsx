import React from 'react';
import { TbCopyright } from "react-icons/tb";

export default function Footer(){
    return <>
            <footer className='footer'>
                <section className='copyright-section'>
                    <TbCopyright className='copyright'/>
                </section>
                <section className='warning-section'>
                    <div className='warning-text'>This is not real financial advice!</div>
                </section>
            </footer>
    </>
}