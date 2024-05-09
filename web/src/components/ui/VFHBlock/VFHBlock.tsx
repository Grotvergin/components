import { useEffect, useState } from 'react';
import { TextField } from '@consta/uikit/TextField';
import { Button } from '@consta/uikit/Button';
import './style.scss'
import ChartBox from '../../ChartBox';
import Api from '../../../api';
import { toNumber, update } from 'lodash';

const names = ['CJ0', 'VJ0', 'M']

const VFHBlock = (props: any) => {
    const api = new Api()
    const [name, setName] = useState('')
    const [x, setX] = useState<Array<number>>([-1, -1, -1, -1, -1])
    const [y, setY] = useState<Array<number>>([-1, -1, -1, -1, -1])
    const [values, setValues] = useState<Record<string, any>>({})
    const [model, setModel] = useState<string>('')
    const [series, setSeries] = useState(
        {
            series: [
                {
                    name: 'Входные',
                    data: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
                },
                {
                    name: 'Рассчитанные',
                    data: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
                },
            ]
        }
    )

    const getModel = (data: any) => {
        if (data?.data[0]?.result !== '') {
            // setModel(`.MODEL D (CJO=${response?.CJ0} VJ=${response.VJ} M=${response.M}`)
            let oldDataResult = data?.data[0]?.result

            let finalModel = Object.keys(oldDataResult).reduce((acc, curVal, index) => {
                if (!Array.isArray(oldDataResult[curVal])) {
                    if (index === 0) {
                        return acc += `(${curVal}=${oldDataResult[curVal]} `
                        // } else if (index === length - count) {
                        //     return acc += `${curVal}=${oldDataResult[curVal]})`
                    } else {
                        return acc += `${curVal}=${oldDataResult[curVal]} `
                    }
                } else {
                    return acc
                }
            }, " ")

            return finalModel += ')'
        } else {
            return ""
        }

    }

    const updateComponent = async (value: any) => {
        if (x.length > 0 && y.length > 0 && value?.C_opt) {
            const params_ = {
                "C": x,
                "Vr": y,
                "Vjmax": 1.5,
                "Vjmin": 0.1,
                "Mmax": 0.9,
                "Mmin": 0.01,
                "CJ0max": 20.0,
                "CJ0min": 0.01,
            }

            try {
                let oldData: any = await api.getComponents(name)
                console.log(oldData)
                if (oldData?.data.length !== 0) {
                    let finalModel = getModel(oldData)
                    setModel(`.MODEL D ${finalModel}`)

                    let newParams = {
                        ...oldData?.data[0]?.params,
                        ...params_
                    }

                    let newResult = {
                        ...oldData?.data[0]?.result,
                        ...value
                    }
                    let response: any = await api.addComponent(name, `${JSON.stringify(newParams)}`, `${JSON.stringify({
                        ...newResult
                    })}`)

                } else {
                    let response: any = await api.addComponent(name, `${JSON.stringify(params_)}`, `${JSON.stringify({
                        ...value
                    })}`)

                }

            } catch (err) {
                console.log(err)
            }
        }
    }

    const onClickHandler = async () => {
        for (let i = 0; i < x.length; i++) {
            if (x[i] === -1 || y[i] === -1 || name === '') return alert("Заполните все поля")
        }

        const newData = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
        const optData = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]

        try {
            let response: any = await api.calculateVoltCapacitance(x, y)
            console.log(response)

            setModel(`.MODEL D (CJO=${response?.CJ0} VJ=${response.VJ} M=${response.M}`)
            setValues({ ...response })
            setSeries({
                series: [
                    {
                        name: 'Входные',
                        data: newData.map((cell, index) => {
                            cell[0] = toNumber(x[index])
                            cell[1] = toNumber(y[index])
                            return cell
                        })
                    },
                    {
                        name: 'Рассчитанные',
                        data: optData.map((cell, index) => {
                            cell[0] = response.C_opt[index]
                            cell[1] = y[index]
                            return cell
                        })
                    },
                ]
            })

            updateComponent(response)
        } catch (err) {
            console.log(err)
        }

        // api.calculateVoltCapacitance(x, y).then((response: any) => {
        //     const newSeries = 

        //     const newValues = values.map((c, i) => {
        //         if (i === 0) {
        //             return response.CJ0
        //         } else if (i === 1) {
        //             return response.VJ
        //         } else {
        //             return response.M
        //         }
        //     })

        //     const newModel = )`

        //     setModel(newModel)
        //     setValues(newValues)
        //     setSeries(newSeries)
        // })
    }

    const onChangeHandlerX = (e: any, index: any) => {
        const newX = x.map((c, i) => {
            if (i === index) {
                return toNumber(e)
            } else {
                return toNumber(c)
            }
        })

        setX(newX)
    }

    const onChangeHandlerY = (e: any, index: any) => {
        const newY = y.map((c, i) => {
            if (i === index) {
                return toNumber(e)
            } else {
                return toNumber(c)
            }
        })

        setY(newY)
    }

    const getCalcValues = () => {
        return [values?.CJ0 ?? 0, values?.VJ ?? 0, values?.M ?? 0]
    }
    return (
        <div className="block">
            <div className="content">
                <div className={`graph ${props.isGraphHidden ? 'hide' : ''}`}>
                    <ChartBox series={series} />
                </div>
                <div className="VFH-block">
                    <div className='grid-container'>
                        <div className='name'>
                            <TextField
                                type="text"
                                placeholder="Название"
                                label="Название диода"
                                labelPosition='left'
                                value={name}
                                onChange={(e: any) => setName(e)}
                            />
                        </div>

                        <div className='left_col'>
                            <p>C, [Ф]</p>
                            {Array(5).fill(0).map((item, index) =>
                                <TextField
                                    key={index}
                                    className='field'
                                    type="number"
                                    incrementButtons={false}
                                    onChange={(e: any) => onChangeHandlerX(e, index)}
                                />
                            )}

                        </div>
                        <div className='right_col'>
                            <p>Vr, [В]</p>

                            {Array(5).fill(0).map((item, index) =>
                                <TextField
                                    key={index * 10}
                                    className='field'
                                    type="number"
                                    incrementButtons={false}
                                    onChange={(e: any) => onChangeHandlerY(e, index)}
                                />
                            )}

                        </div>
                        <div className='btn'>
                            <Button
                                label="Рассчитать"
                                onClick={() => onClickHandler()}
                            />
                        </div>

                        <div className='computed'>
                            <p>Рассчитанные параметры</p>
                            {Array(3).fill(0).map((item, index) =>
                                <TextField
                                    key={index * 6.17}
                                    className='field'
                                    type="number"
                                    incrementButtons={false}
                                    label={names[index]}
                                    value={getCalcValues()[index]}
                                    labelPosition='left'
                                />
                            )}

                        </div>
                    </div>
                </div>
            </div>
            <div className="model">
                <TextField
                    type="textarea"
                    label="Model"
                    value={model}
                    cols={100}
                    size="l"
                    labelPosition='left'
                />
            </div>
        </div>


    )
}

export default VFHBlock