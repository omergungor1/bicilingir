'use client';
import { MapsProvider } from './contexts/MapsContext';
import Providers from './providers';
import ToastProvider from '../components/ToastContext';
import Header from "../components/Header";
import Footer from "../components/Footer";
// import { LocationPermissionModal } from '../components/ui/location-permission-modal';

export default function ClientLayout({ children }) {
    return (<MapsProvider>
        <Providers>
            <ToastProvider>
                <Header />
                <div className="global-loading-container">
                    <div className="global-loader">
                    </div>
                </div>
                <div className="custom-notification-container">
                </div>{children}
                <Footer />
                {/* <LocationPermissionModal /> */}
            </ToastProvider>
        </Providers>
    </MapsProvider>);
}