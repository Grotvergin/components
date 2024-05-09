import { useEffect, useState } from 'react';
import { TextField } from '@consta/uikit/TextField';
import { Button } from '@consta/uikit/Button';
import './style.css'


// interface ParamFieldsProps  {
//     block?: string;

// }

const Params = () => {

    return (
        <div className='grid-container'>
            <div className='optim_param'>
                <p>Параметры остановки оптимизации</p>
                <table>
                    <tr>
                        <td>Изменение функции</td>
                        <td>ftol</td>
                        <td>
                            <TextField
                                value={'1e-8'}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Изменение параметра</td>
                        <td>xtol</td>
                        <td>
                            <TextField
                                value={'1e-8'}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Изменение градиента</td>
                        <td>gtol</td>
                        <td>
                            <TextField
                                value={'1e-8'}
                            />
                        </td>
                    </tr>
                </table>
            </div>
            <div className='model_param'>
                <p>Параметры модели</p>
                <table>
                    <tr>
                        <th>Параметр</th>
                        <th>Min</th>
                        <th>Init</th>
                        <th>Max</th>
                    </tr>
                    <tr>
                        <td>IS [A]</td>
                        <td>
                            <TextField 
                                value={'1e-15'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'1e-8'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'1e-6'}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>RS [Ом]</td>
                        <td>
                            <TextField
                                value={'0.001'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'1'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'10'}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>N</td>
                        <td>
                            <TextField
                                value={'1'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'1'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'3'}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>CJ0 [пФ]</td>
                        <td>
                            <TextField
                                value={'0.01'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'0.3'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'20'}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>VJ [В]</td>
                        <td>
                            <TextField
                                value={'0.1'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'1.2'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'1.5'}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>M</td>
                        <td>
                            <TextField
                                value={'0.01'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'0.01'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'1'}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>TT [нс]</td>
                        <td>
                            <TextField
                                value={'0.001'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'1'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'1000'}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>XTI</td>
                        <td>
                            <TextField
                                value={'1'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'3'}
                            />
                        </td>
                        <td>
                            <TextField
                                value={'5'}
                            />
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default Params