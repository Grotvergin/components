import { useEffect, useState } from 'react';
import { TextField } from '@consta/uikit/TextField';
import { Button } from '@consta/uikit/Button';
import './style.scss'
import Api from '../../../api';
import { toNumber } from 'lodash';
import ChartBox from '../../ChartBox';


// interface ParamFieldsProps  {
//     block?: string;

// }

const TKBlock = (props: any) => {
    const api = new Api()
    const [name, setName] = useState('')
    const [x, setX] = useState<Array<number>>([-1, -1])
    const [y, setY] = useState<Array<number>>([-1, -1])
    const [values, setValues] = useState<Record<string, any>>({})
    const [model, setModel] = useState<string>('')
    const [series, setSeries] = useState(
        {
            series: [
                {
                    name: 'Входные',
                    data: [[0, 0], [0, 0]]
                },

            ]
        }
    )

    const getModel = (data: any, values: any) => {
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

            return finalModel += ")"
        } else {
            return ""
        }

    }

    const updateComponent = async (value: any) => {
        if (x.length > 0 && y.length > 0 && value?.XTI) {
            const params_ = {
                "Temp": x,
                "Ir": y
            }

            try {
                let oldData: any = await api.getComponents(name)
                console.log("oldData ", oldData)
                if (oldData?.data.length !== 0) {
                    let finalModel = getModel(oldData, values)
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
                    console.log("Find", response)
                } else {
                    console.log(value)
                    let response: any = await api.addComponent(name, `${JSON.stringify(params_)}`, `${JSON.stringify(value)}`)
                    console.log("Not find", response)
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

        const newData = [[0, 0], [0, 0]]

        try {
            let response: any = await api.calculateTempratureСoefficient(x, y)
            console.log(response)

            setModel(`.MODEL D (XTI=${response?.XTI})`)
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
                    }
                ]
            })

            updateComponent(response)

        } catch (err) {
            console.log(err)
        }

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
        return [values?.XTI ?? 0]
    }

    return (
        <div className="block">
            <div className="content">
                <div className={`graph ${props.isGraphHidden ? 'hide' : ''}`}>
                    <ChartBox series={series} />
                </div>
                <div className='tk-block'>
                    <div className='grid-container'>
                        <div className='name'>
                            <TextField
                                type="text"
                                placeholder="Название"
                                label="Название диода"
                                labelPosition='left'
                                onChange={(e: any) => setName(e)}
                            />
                        </div>

                        <div className='left_col'>
                            <p>Temp, [K]</p>
                            {Array(2).fill(0).map((item, index) =>
                                <TextField
                                    key={index * 14}
                                    className='field'
                                    type="number"
                                    incrementButtons={false}
                                    onChange={(e: any) => onChangeHandlerX(e, index)}
                                />
                            )}

                        </div>
                        <div className='right_col'>
                            <p>Ir, [мА]</p>

                            {Array(2).fill(0).map((item, index) =>
                                <TextField
                                    key={index * 13}
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
                            <TextField
                                className='field'
                                type="number"
                                incrementButtons={false}
                                label={'XTI'}
                                labelPosition='left'
                                value={getCalcValues()[0]}
                            />

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
                    size='l'
                    labelPosition='left'
                />
            </div>
        </div>


    )
}

export default TKBlock