import React , { useState, useEffect } from 'react';
import api from '../Config/api';
import ChartPlotly from '../Components/ChartPlotly';

import { FaPlay, FaPause } from 'react-icons/fa'; // Importa los íconos
const Trading = () => {
    
    const [error, setError] = useState(null);
    const [ear, setEar] = useState("");
    const [alerts, setAlerts] = useState("");
    const [price_market, setPriceMarket] = useState(0);
    const [last_price_market, setLastPriceMarket] = useState(0);
    const [candles, setCandles] = useState([]);
    const [closes, setCloses] = useState([]);
    const [smaL, setSmaL] = useState([]);
    const [smaM, setSmaM] = useState([]);
    const [smaS, setSmaS] = useState([]);
    const [upperband, setUpperband] = useState([]);
    const [middleband, setMiddleband] = useState([]);
    const [lowerband, setLowerband] = useState([]);
    const [macd, setMacd] = useState([]);
    const [macdsignal, setMacdsignal] = useState([]);
    const [macdhist, setMacdhist] = useState([]);
    const [mfi, setMfi] = useState([]);
    const [rsi, setRsi] = useState([]);
    const [isPaused, setIsPaused] = useState(false); // Añadir el estado de pausa
    useEffect(() => {
      const token = localStorage.getItem('token');
      const fetchData = async () => {
        await api.get('/data', {
          headers: {
              'Authorization': `Token ${token}`
          }
      })
          .then(response => {
            const data = response.data;
            setEar(data.ear);
            setAlerts(data.alerts);
            setPriceMarket(data.price_market);
            setLastPriceMarket(data.last_price_market);
            setCandles(data.candles);
            setCloses(data.closes);
            setSmaL(data.smaL);
            setSmaM(data.smaM);
            setSmaS(data.smaS);
            setUpperband(data.upperband);
            setMiddleband(data.middleband);
            setLowerband(data.lowerband);
            setMacd(data.macd);
            setMacdsignal(data.macdsignal);
            setMacdhist(data.macdhist);
            setMfi(data.mfi);
            setRsi(data.rsi);
  
          })
          .catch(error => {
            console.error('Error al obtener los datos:', error);
            setError(error);
  
          });
  
      };
  
      if (!isPaused) { // Fetch data only if not paused
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
      }
    }, [isPaused]); // Re-run effect when isPaused changes
  
    const priceChangeStyle = {
      color: price_market > last_price_market ? 'green' : 'red',
    };
    const chartData = {
      candles,
      closes,
      smaL,
      smaM,
      smaS,
      upperband,
      middleband,
      lowerband,
      macd,
      macdsignal,
      macdhist,
      mfi,
      rsi,
    };
  
    const handleClose = () => {
      setError(null);
    };
  
    return (
      <div className="container">
        <div className="row">
          <h1 style={priceChangeStyle} className="text-center mb-4">Price Market: {price_market}</h1>
  
        </div>
        {error && (
          <div className="row alert alert-danger alert-dismissible fade show" role="alert">
            Error: {error.message}
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Cerrar"></button>
          </div>
        )}
  
  
        <div className="row mb-3">
          <div className="col-1">
            <button className="btn btn-light shadow border border-primary-subtle" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? <FaPlay /> : <FaPause />}
            </button>
          </div>
          <div className="col d-flex justify-content-center mb-3">
            <div className="text-dark lead">
              <div><h3>Ear: {ear}</h3> </div>
              <div><h4>Alerts: {alerts}</h4></div>
            </div>
          </div>
  
        </div>
        <div className="container">
          <ChartPlotly {...chartData} />
          
        </div>
      </div>
    );
}

export default Trading
