import { TextField } from '@consta/uikit/TextField';
import { Button } from '@consta/uikit/Button';
import ChartBox from '../../ChartBox'
import './style.scss'
import { useEffect, useState } from 'react';
import Api from '../../../api';
import { toNumber } from 'lodash';


const names = ['IS', 'N', 'RS']

const VAHBlock = (props: any) => {
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
        if (x.length > 0 && y.length > 0 && value?.Vf_opt) {
            const params_ = {
                "Vf": x,
                "If": y,
                "Nmax": 3,
                "Nmin": 1,
                "ISmax": 0.0000001,
                "ISmin": 0.00000000000001,
                "RSmax": 4.5,
                "RSmin": 0.1
            }

            try {
                let oldData: any = await api.getComponents(name)
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
                    console.log(response)
                } else {
                    let response: any = await api.addComponent(name, `${JSON.stringify(params_)}`, `${JSON.stringify({
                        ...value
                    })}`)

                    console.log(response)
                }


            } catch (err) {
                console.log(err)
            }

            // .then((response: any) => {
            //     console.log("Added component")
            // }).catch((e: any) => {
            //     console.log("Error", e)
            // })
        }
    }

    // useEffect(() => {
    //     console.log(newParams, newResult)
    //     console.log("use effect", JSON.stringify(newParams) !== '{}' && JSON.stringify(newResult) !== '{}')
    //     if (JSON.stringify(newParams) !== '{}' && JSON.stringify(newResult) !== '{}') {
    //         api.addComponent("diode5", `${JSON.stringify(newParams)}`, `${JSON.stringify(newResult)}`)
    //             .catch((e: any) => {
    //                 console.log("Error", e)
    //             }).then((response: any) => {
    //                 console.log("Add comp if exists")
    //             })
    //     }
    // }, [newParams, newResult])

    const onClickHandler = async () => {
        for (let i = 0; i < x.length; i++) {
            if (x[i] === -1 || y[i] === -1 || name === '') return alert("Заполните все поля")
        }

        const newData = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
        const optData = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]

        try {
            let response: any = await api.calculateVoltAmpere(x, y)

            console.log(response)
            setModel(`.MODEL D (IS=${response?.IS} N=${response?.N} RS=${response.RS})`)
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
                            cell[0] = response.Vf_opt[index]
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




        // let response = await api.getComponents(name)
        // console.log(response)

        // .then((response: any) => {
        //     console.log('save to db response', response)
        //     const { data } = response;
        //     updateComponent()
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
        return [values?.IS ?? 0, values?.N ?? 0, values?.RS ?? 0]
    }

    return (
        <div className="block">
            <div className='content'>
                <div className={`graph ${props.isGraphHidden ? 'hide' : ''}`}>
                    <ChartBox series={series} />
                </div>
                <div className='vah-block'>
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
                            <p>Vf, [В]</p>
                            {Array(5).fill(0).map((item, index) =>
                                <TextField
                                    key={index * 8}
                                    className='field'
                                    type="number"
                                    incrementButtons={false}
                                    // value={x[index] as unknown as string}
                                    onChange={(e: any) => onChangeHandlerX(e, index)}
                                />
                            )}

                        </div>
                        <div className='right_col'>
                            <p>If, [мА]</p>

                            {Array(5).fill(0).map((item, index) =>
                                <TextField
                                    key={index * 9}
                                    className='field'
                                    type="number"
                                    incrementButtons={false}
                                    // value={y[index] as unknown as string}
                                    onChange={(e: any) => onChangeHandlerY(e, index)}
                                />
                            )}

                        </div>
                        <div className='btn'>
                            <Button
                                onClick={() => onClickHandler()}
                                label="Рассчитать"
                            />
                        </div>

                        <div className='computed'>
                            <p>Рассчитанные параметры</p>
                            {Array(3).fill(0).map((item, index) =>
                                <TextField
                                    key={index * 6.17}
                                    className='field'
                                    type="number"
                                    value={getCalcValues()[index]}
                                    incrementButtons={false}
                                    label={names[index]}
                                    labelPosition='left'
                                />
                            )}

                        </div>
                    </div>
                </div>
            </div>

            <div className='model'>
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

export default VAHBlock