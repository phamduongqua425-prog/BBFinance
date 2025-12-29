
import React from 'react';
import { Package } from 'lucide-react';

interface PlaceholderProps {
  title: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white rounded-3xl border border-gray-100 border-dashed">
      <div className="p-4 bg-blue-50 text-blue-500 rounded-full mb-4">
        <Package size={48} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md text-center">
        Tính năng này đang được phát triển bởi đội ngũ kỹ thuật BLUEBOLT. Vui lòng quay lại sau.
      </p>
      <button className="mt-8 px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors">
        Quay lại Trang chủ
      </button>
    </div>
  );
};

export default Placeholder;
