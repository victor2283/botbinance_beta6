import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';


const ChartPlotly = ({
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
}) => {
    const [mainChartData, setMainChartData] = useState([]);
    const [rsiMfiChartData, setRsiMfiChartData] = useState([]);
    const [macdChartData, setMacdChartData] = useState([]);
    const [layout, setLayout] = useState({});

    useEffect(() => {
        let lineW = 1.3;
        let labels = [];
        let values_upperband = [];
        let values_middleband = [];
        let values_lowerband = [];
        let values_rsi = [];
        let values_mfi = [];
        let values_macd = [];
        let values_macdsignal = [];
        let values_macdhist = [];
        let values_candles = candles.map((candle, index) => {
            labels[index] = index + 1;
            values_upperband[index] = upperband[index] !== undefined ? upperband[index] : null;
            values_middleband[index] = middleband[index] !== undefined ? middleband[index] : null;
            values_lowerband[index] = lowerband[index] !== undefined ? lowerband[index] : null;
            values_rsi[index] = rsi[index] !== undefined ? rsi[index] : null;
            values_mfi[index] = mfi[index] !== undefined ? mfi[index] : null;
            values_macd[index] = macd[index] !== undefined ? macd[index] : null;
            values_macdsignal[index] = macdsignal[index] !== undefined ? macdsignal[index] : null;
            values_macdhist[index] = macdhist[index] !== undefined ? macdhist[index] : null;
            return {
                x: index,
                open: candle.Open_price,
                high: candle.High_price,
                low: candle.Low_price,
                close: candle.Close_price
            };
        });


        const candlestickTrace = {
            x: labels,
            open: values_candles.map(candle => candle.open),
            high: values_candles.map(candle => candle.high),
            low: values_candles.map(candle => candle.low),
            close: values_candles.map(candle => candle.close),
            type: 'candlestick',
            xaxis: 'x',
            yaxis: 'y',
            name: 'Candles',
            increasing: {
                line: {
                    color: '#1EAE04',
                    width: lineW * 2,

                }
            },
            decreasing: {
                line: {
                    color: '#EA1306',
                    width: lineW * 2,

                }
            },


        };

        const lineTraces = [
            {
                x: labels,
                y: closes,
                type: 'scatter',
                mode: 'lines',
                name: 'Close Prices',
                line: { color: '#2C3E50', width: lineW },
            },
            {
                x: labels,
                y: smaL,
                type: 'scatter',
                mode: 'lines',
                name: 'SMA Long',
                line: { color: '#B41887', width: lineW }
            },
            {
                x: labels,
                y: smaM,
                type: 'scatter',
                mode: 'lines',
                name: 'SMA Medium',
                line: { color: '#33A5FF', width: lineW }
            },
            {
                x: labels,
                y: smaS,
                type: 'scatter',
                mode: 'lines',
                name: 'SMA Short',
                line: { color: '#99E512', width: lineW }
            },
            {
                x: labels,
                y: values_upperband,
                type: 'scatter',
                mode: 'lines',
                name: 'Upper Band',
                line: { color: '#0B24F5', width: lineW }
            },
            {
                x: labels,
                y: values_middleband,
                type: 'scatter',
                mode: 'lines',
                name: 'Middle Band',
                line: { color: '#F5B041', width: lineW }
            },
            {
                x: labels,
                y: values_lowerband,
                type: 'scatter',
                mode: 'lines',
                name: 'Lower Band',
                line: { color: '#CB4335', width: lineW }
            }
        ];

        // Datos para el gráfico RSI/MFI
        const rsiMfiTraces = [
            {
                x: labels,
                y: values_rsi,
                type: 'scatter',
                mode: 'lines',
                name: 'RSI',
                line: { color: '#0B24F5', width: lineW }
            },
            {
                x: labels,
                y: values_mfi,
                type: 'scatter',
                mode: 'lines',
                name: 'MFI',
                line: { color: '#B41887', width: lineW }
            },
            {
                x: labels,
                y: Array(labels.length).fill(80),  // Línea en 80
                type: 'scatter',
                mode: 'lines',
                name: 'Upper Threshold',
                line: { color: 'red', width: lineW, dash: 'dash' }  // Línea discontinua
            },
            {
                x: labels,
                y: Array(labels.length).fill(20),  // Línea en 30
                type: 'scatter',
                mode: 'lines',
                name: 'Lower Threshold',
                line: { color: 'green', width: lineW, dash: 'dash' }  // Línea discontinua
            }
        ];

        // Datos para el gráfico MACD
        const macdTraces = [
            {
                x: labels,
                y: values_macd,
                type: 'scatter',
                mode: 'lines',
                name: 'MACD',
                line: { color: 'green', width: lineW }
            },
            {
                x: labels,
                y: values_macdhist,
                type: 'scatter',
                mode: 'lines',
                name: 'MACD HISTORIC',
                line: { color: 'blue', width: lineW }
            },
            {
                x: labels,
                y: values_macdsignal,
                type: 'scatter',
                mode: 'lines',
                name: 'MACD SIGNAL',
                line: { color: 'red', width: lineW }
            }
        ];

        setMainChartData([candlestickTrace, ...lineTraces]);
        setRsiMfiChartData(rsiMfiTraces);
        setMacdChartData(macdTraces);
        setLayout({
            xaxis: { showgrid: true, rangeslider: { visible: false } },
            yaxis: { showgrid: true },
            legend: {
                x: 0,
                y: 1,
                xanchor: 'left',
                traceorder: 'normal',
                font: {
                    family: 'sans-serif',
                    size: 12,
                    color: '#000'
                },
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                bordercolor: 'rgb(1,2,3)',
                borderwidth: 1,

            },
            margin: {
                r: 10,
                t: 20,
                b:20,
                pad: 4,
            }
        });
    }, [candles, closes, smaL, smaM, smaS, upperband, middleband, lowerband, rsi, mfi, macd, macdsignal, macdhist]);

    return (
        <>
            <div className="row">
                <div className="col border border-black">
                    <Plot
                        data={mainChartData}
                        layout={{
                            ...layout,
                            autosize: true,
                            height: 350, // Ajusta la altura según sea necesario
                            xaxis: {
                                rangeslider: { visible: false },
                                tickangle: 0,
                                dtick: 20,


                            },
                            
                        }}
                        config={{ displayModeBar: false }}
                    />
                
                    <Plot
                        data={rsiMfiChartData}
                        layout={{
                            ...layout,
                            height: 150, // Ajusta la altura según sea necesario
                            autosize: true,
                            xaxis: {
                                tickangle: 0,
                                dtick: 20,
                                
                            },
                            
                            
                        }}
                        config={{ displayModeBar: false }}
                    />

                    <Plot
                        data={macdChartData}
                        layout={{
                            ...layout,
                            height: 150, // Ajusta la altura según sea necesario          
                            autosize: true,
                            xaxis: {
                                tickangle: 0,
                                dtick: 20,
                            }
                        }}
                        config={{ displayModeBar: false }}
                    />

                </div>
            </div>
        </>


    );
};

export default ChartPlotly;
