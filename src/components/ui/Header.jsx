import React from 'react';
import Notification from '../../assets/notifications.svg';
import Right from '../../assets/right.svg';

const Header = ({ title }) => {
  return (
    <div>
        <div className="flex flex-row items-center justify-between mb-[30px]">
            <h1 className="text-[36px] font-bold text-[#0A1629]">{title}</h1>
            <div className="flex flex-row items-center justify-between gap-[24px]">
                <img src={Notification} alt="Notification" className="p-[12px] rounded-[14px] bg-white"/>
                <div className='flex flex-row items-center justify-between gap-[12px] px-[12px] py-[9px] rounded-[14px] bg-white'>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnsjemrQJ1aY8GXzDH7zyW2PeSr0NoRlUL0Q&s" alt="Avatar" className="w-[30px] h-[30px] rounded-full"/>
                    <p className='text-[16px] font-bold text-[#0A1629]'>Evan Yates</p>
                    <img src={Right} alt="Right" className="w-[24px] h-[24px]"/>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Header;
