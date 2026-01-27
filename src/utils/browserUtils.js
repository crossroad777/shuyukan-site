/**
 * Browser Utilities
 * 
 * LINEやInstagramなどのアプリ内ブラウザ（WebView）を検知します。
 */

export const isInAppBrowser = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;

    // LINE
    if (ua.indexOf('Line') > -1) return true;

    // Instagram / Facebook
    if (ua.indexOf('Instagram') > -1 || ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1) return true;

    // Android WebView (generic)
    if (ua.indexOf('wv') > -1 && ua.indexOf('Android') > -1) return true;

    // iOS WebView
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
    if (isIOS && !isSafari) return true;

    return false;
};

export const getBrowserType = () => {
    const ua = navigator.userAgent;
    if (ua.indexOf('Line') > -1) return 'LINE';
    if (ua.indexOf('Instagram') > -1) return 'Instagram';
    if (ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1) return 'Facebook';
    return 'Other WebView';
};
