import React, { useState } from "react";
import './App.css';
import 'react-modern-drawer/dist/index.css'
import Navbar from './components/ui/navbar/Navbar';
import VAHBlock from './components/ui/VAHBlock/VAHBlock'
import VFHBlock from './components/ui/VFHBlock/VFHBlock';
import VOVBlock from './components/ui/VOVBlock/VOVBlock';
import TKBlock from './components/ui/TKBlock/TKBlock';


import {
    Theme,
    presetGpnDefault
} from '@consta/uikit/Theme';
import Params from './components/ui/params/Params';
import Check from './components/ui/check/Check';

function App() {

    const [value, setValue] = useState<string>('Проверка')
    const isGraphHidden = value === 'Параметры' || value === 'Проверка'
    return (
        <>
            <Theme preset={presetGpnDefault}>
                <Navbar onChange={(val) => setValue(val)} />
                <div className="data">
                    {value === 'ВАХ' && <VAHBlock isGraphHidden={isGraphHidden} />}
                    {value === 'ВФХ' && <VFHBlock />}
                    {value === 'ВОВ' && <VOVBlock />}
                    {value === 'ТК' && <TKBlock />}
                    {value === 'Параметры' && <Params />}
                    {value === 'Проверка' && <Check />}
                </div>
            </Theme>
        </>
    );
}

export default App;
