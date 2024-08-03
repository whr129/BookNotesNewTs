import React, { useEffect, useState } from 'react';
import { Calendar, theme, Badge } from 'antd';
import type { CalendarProps, BadgeProps,} from 'antd';
import type { Dayjs } from 'dayjs';
import { CheckOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getSignIn } from '../../../../service/signIn/signIn';

const SignIn = () => {
    const { token } = theme.useToken();
    const [listOfSign, setListOfSign] = useState<Array<string>>([]);
    const [theMonthSelected, setTheMonthSelected] = useState<string>('');

    const getMonthData = (value: Dayjs) => {
        if (value.month() === 8) {
        return 1394;
        }
    };
    
    const getListData = (value: Dayjs) => {
        const currentDate = value.format('YYYY-MM-DD');
        const isChecked = listOfSign.find((item: string, index: number) => item === currentDate);
        if(isChecked) {
            return <CheckOutlined />
        }
        if(theMonthSelected !== value.format('YYYY-MM')) {
            return null;
        }
        return <div style={{height: 50}}>-</div>;
    };

    const getSignInData = async (month: string) => {
        setTheMonthSelected(month);
        console.log(month);
        const res = await getSignIn({monthSelected: month});
        setListOfSign(res.data);
    }

    const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
        getSignInData(value.format('YYYY-MM'));
        console.log(value.format('YYYY-MM-DD'), mode);
    };

    useEffect(() => {
        const currentMonth = moment().format("YYYY-MM");
        console.log(currentMonth);
        getSignInData(currentMonth);
    }, []);

  const wrapperStyle: React.CSSProperties = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    console.log(num);
    return null;
  };

  const dateCellRender = (value: Dayjs) => {
    const isChecked = getListData(value);
    // console.log(value);
    return (
    <div>
        {isChecked !== null ? isChecked: '~'}
    </div>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} onPanelChange={onPanelChange} cellRender={cellRender}/>
    </div>
  );
}

export default SignIn;