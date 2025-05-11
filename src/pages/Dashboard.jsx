import React from 'react';
import { Button, Header } from '../components/ui';
import MainLayout from '../layouts/MainLayout';

const Dashboard = () => {


  return (
    <MainLayout>
      <Header title="Dashboard" />
      <div className="flex gap-[30px]">
        {/* Bên trái chiếm 70% */}
        <div className="w-[70%] bg-blue-100 p-4">
          {/* Nội dung bên trái */}
          Phần bên trái (70%)
        </div>

        {/* Bên phải chiếm 30% */}
        <div className="w-[30%] bg-yellow-100 p-4">
          {/* Nội dung bên phải */}
          Phần bên phải (30%)
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;