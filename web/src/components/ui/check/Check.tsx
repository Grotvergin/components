import { Button } from '@consta/uikit/Button'
import { TextField } from '@consta/uikit/TextField'
import { List } from '@consta/uikit/ListCanary';
import { CollapseGroup } from '@consta/uikit/CollapseGroup';
import { useEffect, useState } from 'react';
import './style.scss'
import Api from '../../../api';

interface ItemProps {
    name: string
    params: JSON
    result: JSON
}



const Check = () => {
    const api = new Api()
    const [searchText, setSearchText] = useState<string>('')
    const [items, setItems] = useState<any[]>([])

    const getModel = (data: any) => {
        if (data?.result !== '') {
            // setModel(`.MODEL D (CJO=${response?.CJ0} VJ=${response.VJ} M=${response.M}`)
            let oldDataResult = data?.result

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

    const getItemLabel = (item: any) => item?.name
    const getItemContent = (item: any) => {
        console.log(item)
        let model = `.MODEL D ${getModel(item)}`
        return (
            <>
                <div className="model">
                    <TextField
                        type="textarea"
                        size="l"
                        form="round"
                        cols={100}
                        className='input'
                        defaultValue={model}
                        readOnly={true}
                    />
                </div>
                <div className="output">
                    <div>
                        <p className="title">Входные параметры</p>
                        <table>
                            <tr>
                                <th>Параметр</th>
                                <th>Min</th>
                                <th>Max</th>
                            </tr>
                            <tr>
                                <td>IS</td>
                                <td>{item?.params.ISmin ?? 0}</td>
                                <td>{item?.params.ISmax ?? 0}</td>
                            </tr>
                            <tr>
                                <td>N</td>
                                <td>{item?.params.Nmin ?? 0}</td>
                                <td>{item?.params.Nmax ?? 0}</td>
                            </tr>
                            <tr>
                                <td>RS</td>
                                <td>{item?.params.RSmin ?? 0}</td>
                                <td>{item?.params.RSmax ?? 0}</td>
                            </tr>
                            <tr>
                                <td>VJ</td>
                                <td>{item?.params.Vjmin ?? 0}</td>
                                <td>{item?.params.Vjmax ?? 0}</td>
                            </tr>
                            <tr>
                                <td>M</td>
                                <td>{item?.params.Mmin ?? 0}</td>
                                <td>{item?.params.Mmax ?? 0}</td>
                            </tr>
                            <tr>
                                <td>CJ0</td>
                                <td>{item?.params.CJ0min ?? 0}</td>
                                <td>{item?.params.CJ0max ?? 0}</td>
                            </tr>
                            <tr>
                                <td>TT</td>
                                <td>{item?.params.TTmin ?? 0}</td>
                                <td>{item?.params.TTmax ?? 0}</td>
                            </tr>
                        </table>
                        <div className="arrays">
                            {/* <div>
                                <p className="title">Массив I</p>
                                <div className="array">

                                    {(item?.params.If).map((i: any) => {
                                        return <p>{i} А</p>
                                    })}
                                </div>
                            </div> */}
                            {/* <div>
                                <p className='title'>Массив V</p>
                                <div className="array">

                                    {(item?.params.Vf).map((i: any) => {
                                        return <p>{i} В</p>
                                    })}
                                </div>
                            </div> */}
                        </div>
                    </div>
                    <div>
                        <p className='title'>Выходные параметры</p>
                        <table>
                            <tr>
                                <th>Параметр</th>
                                <th>Значение</th>
                            </tr>
                            <tr>
                                <td>IS</td>
                                <td>{item?.result.IS ?? 0}</td>
                            </tr>
                            <tr>
                                <td>N</td>
                                <td>{item?.result.N ?? 0}</td>
                            </tr>
                            <tr>
                                <td>RS</td>
                                <td>{item?.result.RS ?? 0}</td>
                            </tr>
                            <tr>
                                <td>VJ</td>
                                <td>{item?.result.VJ ?? 0}</td>
                            </tr>
                            <tr>
                                <td>M</td>
                                <td>{item?.result.M ?? 0}</td>
                            </tr>
                            <tr>
                                <td>CJ0</td>
                                <td>{item?.result.CJ0 ?? 0}</td>
                            </tr>
                            <tr>
                                <td>TT</td>
                                <td>{item?.result.TT ?? 0}</td>
                            </tr>
                            <tr>
                                <td>XTI</td>
                                <td>{item?.result.XTI ?? 0}</td>
                            </tr>
                        </table>
                        <div className="arrays">
                            <div>
                                {/* <p className='title'>Массив выходных I</p> */}
                                {/* <div className="array">

                                    {(item?.result.model_sat_f_2).map((i: any) => {
                                        return <p>{i} А</p>
                                    })}
                                </div> */}
                            </div>
                            <div>
                                {/* <p className='title'>Массив выходных V</p> */}
                                {/* <div className="array">

                                    {item?.result.Vf_opt && (item?.result.Vf_opt).map((i: any) => {
                                        return <p>{i} В</p>
                                    })}
                                    {item?.result.model_sat_f_1 && (item?.result.model_sat_f_1).map((i: any) => {
                                        return <p>{i} В</p>
                                    })}
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }

    useEffect(() => {
        api.getComponents(searchText).then((response: any) => {
            setItems(response.data)
        })


    }, [searchText])


    // const getItem = (item: any) => {
    //     console.log('get item')
    //     return (
    //         // <CollapseGroup
    //         //     label={
    //         //         <>
    //         //             {item?.name}
    //         //         </>
    //         //     }
    //         //     isOpen={isOpen}
    //         //     onClick={() => setIsOpen(!isOpen)}
    //         // >
    //         //     {
    //         //         // <div>{JSON.stringify(item?.params)}</div>
    //         //     }
    //         // </CollapseGroup>
    //         <></>
    //     )
    // }

    return (
        <div className="check">
            <div className='search'>
                <TextField
                    label='Название'
                    labelPosition='left'
                    onChange={(v) => setSearchText(v as string)}
                />
            </div>
            <div className='found_items'>

                {items && <CollapseGroup
                    items={items}
                    getItemLabel={getItemLabel}
                    getItemContent={getItemContent}
                    isAccordion={true}
                />}

            </div>
        </div>
    )
}

export default Check