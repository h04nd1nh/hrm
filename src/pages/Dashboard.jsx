import React from 'react';
import { Button, Header } from '../components/ui';
import MainLayout from '../layouts/MainLayout';
import showToast from '../utils/toast';

const Dashboard = () => {
  const handleShowSuccessToast = () => {
    showToast.success('Thao tác thành công!');
  };

  const handleShowErrorToast = () => {
    showToast.error('Đã xảy ra lỗi!');
  };

  const handleShowInfoToast = () => {
    showToast.info('Đây là thông tin!');
  };

  const handleShowWarningToast = () => {
    showToast.warning('Cảnh báo!');
  };

  return (
    <MainLayout>
      <Header title="Dashboard" />
      <div className="flex gap-[30px]">
        {/* Bên trái chiếm 70% */}
        <div className="w-[70%] bg-blue-100 p-4">
          {/* Nội dung bên trái */}
          <div className="mb-4">Phần bên trái (70%)</div>
          
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Demo Toast Messages:</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" onClick={handleShowSuccessToast}>
                Thông báo thành công
              </Button>
              <Button variant="danger" onClick={handleShowErrorToast}>
                Thông báo lỗi
              </Button>
              <Button variant="info" onClick={handleShowInfoToast}>
                Thông báo thông tin
              </Button>
              <Button variant="warning" onClick={handleShowWarningToast}>
                Thông báo cảnh báo
              </Button>
            </div>
          </div>
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