
import React, { useState, useEffect } from 'react';
import api from '../Config/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSearch } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';



const Config = () => {

    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');
    const [assetPrimary, setAssetPrimary] = useState('');
    const [assetSecundary, setAssetSecundary] = useState('');
    const [percBinance, setPercBinance] = useState('');
    const [sPd, setSPd] = useState('');
    const [mPd, setMPd] = useState('');
    const [lPd, setLPd] = useState('');
    const [nbdevup, setNbdevup] = useState('');
    const [nbdevdn, setNbdevdn] = useState('');
    const [percStopSide, setPercStopSide] = useState('');
    const [percPriceSide, setPercPriceSide] = useState('');
    const [modeSoft, setModeSoft] = useState(true);  // Nuevo estado para mode_Soft
    const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
    const [isApiSecretVisible, setIsApiSecretVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('')
    const [symbols, setSymbols] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState();
    const [symbolFilter, setSymbolFilter] = useState();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            if (symbolFilter) {
                api.get(`/exchange_info/?symbol=${symbolFilter}`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                })
                    .then(response => {
                        setSymbols(response.data.symbols);
                        setSelectedSymbol(response.data.symbols[0])
                        api.get(`/exchange_assets/?symbol=${response.data.symbols[0]}`, {
                            headers: {
                                'Authorization': `Token ${token}`
                            }
                        }).then(response => {
                            setAssetPrimary(response.data.symbols[0]['baseAsset']);
                            setAssetSecundary(response.data.symbols[0]['quoteAsset']);
                            setError('');
                        })
                            .catch(error => {
                                console.error('Error al obtener los activos de Binance', error);
                                setError('No se encontraron activos de binance');

                            });

                        setError('');
                    })
                    .catch(error => {
                        console.error('Error al obtener los símbolos de Binance', error);
                        setError('No se encontraron símbolos');
                        setSymbols([]);
                    });
            }

            api.get('/get_config/', {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
                .then(response => {
                    const config = response.data;  // Suponiendo que hay un solo objeto en la respuesta
                    /* console.log(config) */
                    setApiKey(config.api_key);
                    setApiSecret(config.api_secret);
                    setSymbols([config.symbol]);
                    setSelectedSymbol(config.symbol);
                    setAssetPrimary(config.asset_primary);
                    setAssetSecundary(config.asset_secundary);
                    setPercBinance(config.perc_binance);
                    setSPd(config.sPd);
                    setMPd(config.mPd);
                    setLPd(config.lPd);
                    setNbdevup(config.nbdevup);
                    setNbdevdn(config.nbdevdn);
                    setPercStopSide(config.perc_stopSide);
                    setPercPriceSide(config.perc_priceSide);
                    setModeSoft(config.mode_Soft);
                })
                .catch(error => {
                    console.error('No se pudo obtener la configuración', error);
                });
        }
    }, [symbolFilter]);

    const handleSave = () => {
        const token = localStorage.getItem('token');
        api.put('/put_config/', {
            api_key: apiKey,
            api_secret: apiSecret,
            symbol: selectedSymbol,
            asset_primary: assetPrimary,
            asset_secundary: assetSecundary,
            perc_binance: percBinance,
            sPd: sPd,
            mPd: mPd,
            lPd: lPd,
            nbdevup: nbdevup,
            nbdevdn: nbdevdn,
            perc_stopSide: percStopSide,
            perc_priceSide: percPriceSide,
            mode_Soft: modeSoft  // Añadido aquí
        }, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(response => {
                setMessage('Configuración actualizada correctamente');
            })
            .catch(error => {
                console.error('No se pudo actualizar la configuración', error);
                setMessage('Error al actualizar la configuración');
            });
    };

    const handleDelete = () => {
        const token = localStorage.getItem('token');
        api.delete('/delete_config/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(response => {
                setApiKey('');
                setApiSecret('');
                setSymbols([]);
                setSelectedSymbol('');
                setAssetPrimary('');
                setAssetSecundary('');
                setPercBinance('');
                setSPd('');
                setMPd('');
                setLPd('');
                setNbdevup('');
                setNbdevdn('');
                setPercStopSide('');
                setPercPriceSide('');
                setModeSoft(true);  // Restablecer a True por defecto
                setMessage('Configuración eliminada correctamente');
            })
            .catch(error => {
                console.error('No se pudo eliminar la configuración', error);
                setMessage('Error al eliminar la configuración');
            });
    };

    const handleChangeSelect = (e) => {
        setSelectedSymbol(e.target.value)
        const token = localStorage.getItem('token');
        if (token) {
            api.get(`/exchange_assets/?symbol=${e.target.value}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            }).then(response => {
                setAssetPrimary(response.data.symbols[0]['baseAsset']);
                setAssetSecundary(response.data.symbols[0]['quoteAsset']);
                setError('');
            })
                .catch(error => {
                    console.error('Error al obtener los activos de Binance', error);
                    setError('No se encontraron activos de binance');

                });
        }

    }

    const showAlert = (title, message, icon) => {
        setError(null);
        setMessage(null);
        Swal.fire({
            title: title,
            text: message,
            icon: icon,
            confirmButtonText: 'Ok'
        });


    }

    return (
        <div className="container mt-5 border border-dark-subtle">
            <form className="shadow shadow-sm">
                <h3 className='text-center mb-3'>Trading setups</h3>
                <div className="row mb-3">
                    <div className="col-1"> <span> </span></div>
                </div>
                <div className="row">
                    <div className="col-5">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon-apiKey">API Key:</span>
                            <input
                                className="form-input"
                                type={isApiKeyVisible ? 'text' : 'password'}
                                value={apiKey}
                                id="apiKey"
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="apikeys...."
                                aria-label="Recipient's apikeys"
                                aria-describedby="basic-addon-apiKey"
                            />
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}>
                                {isApiKeyVisible ?
                                    <FontAwesomeIcon icon={faEye} />
                                    :
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                }
                            </button>

                        </div>

                    </div>
                    <div className="col-5">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon-apiSecret">API Secret:</span>
                            <input className="form-input" type={isApiSecretVisible ? 'text' : 'password'} value={apiSecret} id="apiSecret" onChange={(e) => setApiSecret(e.target.value)} placeholder="apisecrets...." aria-label="Recipient's apisecrets" aria-describedby="apiSecret" />
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setIsApiSecretVisible(!isApiSecretVisible)}>
                                {isApiSecretVisible ?
                                    <FontAwesomeIcon icon={faEye} />
                                    :
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                }
                            </button>
                         </div>       
                    </div>
                </div>
                <div className="row">
                    <div className="col-5">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">Filter By:</span>
                            <input
                                type="text"
                                value={symbolFilter}
                                onChange={(e) => setSymbolFilter(e.target.value)}
                                className="form-control"
                                id="symbolFilter"
                                placeholder="symbol...."
                                aria-label="Recipient's "
                                aria-describedby="basic-addon1"
                            />
                            <span className="input-group-text" id="basic-addon1"><FontAwesomeIcon icon={faSearch} /></span>
                        </div>
                    </div>
                    <div className="col-1"> <span></span></div>
                    <div className="col-5">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-symbol-list">Symbol:</span>
                            <select id="symbol"
                                aria-label="list symbol.."
                                aria-describedby="inputGroup-symbol-list"
                                className="form-select col-lg-5 col-sm-4"
                                value={selectedSymbol}
                                onChange={(e) => handleChangeSelect(e)} >
                                {symbols.map(symbol => (
                                    <option key={symbol} value={symbol}>
                                        {symbol}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-assetPrimary">Primary asset:</span>
                            <input
                                className="form-control"
                                type="text"
                                value={assetPrimary}
                                id="assetPrimary"
                                onChange={(e) => setAssetPrimary(e.target.value)}
                                placeholder="asset...."
                                aria-label="Recipient's assets"
                                aria-describedby="inputGroup-assetPrimary"
                            />
                        </div>
                    </div>
                    <div className="col-2">
                        <span></span>
                    </div>
                    <div className="col-4">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-assetSecundary">Secundary asset:</span>
                            <input
                                className="form-control"
                                type="text"
                                value={assetSecundary}
                                id="assetSecundary"
                                onChange={(e) => setAssetSecundary(e.target.value)}
                                placeholder="asset...."
                                aria-label="Recipient's assets"
                                aria-describedby="inputGroup-assetSecundary"
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-auto">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sPd">Short period:</span>
                            <input
                                className="form-control"
                                type="number"
                                value={sPd}
                                id="sPd"
                                onChange={(e) => setSPd(parseInt(e.target.value, 10))}
                                placeholder="periods...."
                                aria-label="Recipient's periods"
                                aria-describedby="inputGroup-sPd"
                            />
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-mPd">Middle period:</span>
                            <input
                                className="form-control"
                                type="number"
                                value={mPd}
                                id="mPd"
                                onChange={(e) => setMPd(parseInt(e.target.value, 10))}
                                placeholder="periods...."
                                aria-label="Recipient's periods"
                                aria-describedby="inputGroup-mPd"
                            />
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-lPd">Long period:</span>
                            <input
                                className="form-control"
                                type="number"
                                value={lPd}
                                id="lPd"
                                onChange={(e) => setLPd(parseInt(e.target.value, 10))}
                                placeholder="periods-lPd...."
                                aria-label="Recipient's periods"
                                aria-describedby="inputGroup-lPd"
                            />
                        </div>
                    </div>
                </div>

                <div className="row mb-3 border border-secondary">
                    <h3 className='text-center mb-3'>bollinger bands setups</h3>
                    <div className="col-auto">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-nbdevup">upper band deviations (nbdevup)</span>
                            <input
                                className="form-control"
                                type="number"
                                value={nbdevup}
                                id="nbdevup"
                                onChange={(e) => setNbdevup(parseInt(e.target.value, 10))}
                                placeholder="nbdevup...."
                                aria-label="Recipient's nbdevup"
                                aria-describedby="inputGroup-nbdevup"
                            />
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-nbdevdn">lower band deviations (nbdevdn)</span>
                            <input
                                className="form-control"
                                type="number"
                                value={nbdevdn}
                                id="nbdevdn"
                                onChange={(e) => setNbdevdn(parseInt(e.target.value, 10))}
                                placeholder="nbdevdn...."
                                aria-label="Recipient's nbdevdn"
                                aria-describedby="inputGroup-nbdevdn"
                            />
                        </div>
                    </div>
                </div>
                <div className="row mb-3 border border-secondary">
                    <h3 className='text-center mb-3'>Percentage settings</h3>
                    <div className="col-auto">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-percBinance">Commission:</span>
                            <input
                                className="form-control"
                                type="number"
                                step="0.001"
                                value={percBinance}
                                id="percBinance"
                                onChange={(e) => setPercBinance(parseFloat(e.target.value))}
                                placeholder="percBinance...."
                                aria-label="Recipient's percBinance"
                                aria-describedby="inputGroup-percBinance"
                            />
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-percStopSide">Stop:</span>
                            <input
                                className="form-control"
                                type="number"
                                step="0.001"
                                value={percStopSide}
                                id="percStopSide"
                                onChange={(e) => setPercStopSide(parseFloat(e.target.value))}
                                placeholder="percStopSide...."
                                aria-label="Recipient's percStopSide"
                                aria-describedby="inputGroup-percStopSide"
                            />
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-percPriceSide">Limit:</span>
                            <input
                                className="form-control"
                                type="number"
                                step="0.001"
                                value={percPriceSide}
                                id="percPriceSide"
                                onChange={(e) => setPercPriceSide(parseFloat(e.target.value))}
                                placeholder="percPriceSide...."
                                aria-label="Recipient's percPriceSide"
                                aria-describedby="inputGroup-percPriceSide"
                            />
                        </div>

                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-auto">
                        <div className="input-group mb-3">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    checked={modeSoft}
                                    onChange={() => setModeSoft(!modeSoft)}
                                    id="modeSoft"
                                />
                                <label className="form-check-label" for="modeSoft">Mode Soft:</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="input-group mb-3">
                            <button type="button" onClick={handleSave}>Guardar</button>
                        </div>
                    </div>
                    <div className="col-auto">
                        <div className="input-group mb-3">
                            <button type="button" onClick={handleDelete}>Eliminar</button>
                        </div>
                    </div>

                </div>

            </form>

            {message && showAlert('Success!', message, 'success')}
            {error && showAlert('Error!', error.message, 'error')}

        </div>
    );
};

export default Config;
