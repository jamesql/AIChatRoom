import Footer from '@/components/Footer';
import NavigationBar from '@/components/NavigationBar';
import React from 'react';

const PromptDev: React.FC = () => {
    return (
        <div>
            <NavigationBar authButtons={false} />
            <Footer />
        </div>
    );
};

export default PromptDev;