import React, { useState } from 'react';
import Force from './Force';

export default function Home() {
    const [twoDOpen, setTwoDOpen] = useState(false);
    const [threeDOpen, setThreeDOpen] = useState(false);

    const handleClose = () => {
        setThreeDOpen(false);
        setTwoDOpen(false);
    }

    return <>
        {twoDOpen && <Force graphType="2D" close={handleClose}/>}
        {threeDOpen && <Force graphType="3D" close={handleClose}/>}
        {!twoDOpen && !threeDOpen && <><div className="home-title">Escolha o modelo</div>
        <button className="home-2dbtn" onClick={() => setTwoDOpen(true)}>2D</button>
        <button className="home-3dbtn" onClick={() => setThreeDOpen(true)}>3D</button></>}
    </>
}