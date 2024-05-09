import {
    Tabs
} from '@consta/uikit/Tabs';
import React, { useState } from "react"
import './style.css'

type Item = {
    label: string;
};

const items: Item[] = [
    {
        label: 'Проверка'
    },
    {
        label: 'ВАХ',
    },
    {
        label: 'ВФХ',
    },
    {
        label: 'ВОВ',
    },
    {
        label: 'ТК',
    },
    {
        label: 'Параметры'
    }
]

interface NavBarProps {
    onChange?: (label: string) => void
}

const Navbar = ({ onChange }: NavBarProps) => {
    const [value, setValue] = useState<Item>()

    const handleChange = (item: Item) => {
        setValue(item)
        onChange && onChange(item.label)
    }

    return (
        <div>
            <Tabs
                value={value}
                onChange={handleChange}
                items={items}
                getItemLabel={(item) => item.label}
                view="bordered"
                linePosition="bottom"
                size='m'
            />
        </div>
    );
}

export default Navbar;
