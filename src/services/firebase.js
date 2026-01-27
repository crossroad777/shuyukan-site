/**
 * Firebase Configuration
 * shuyukan.info@gmail.com がマスター管理者
 */
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Firebase設定（Firebaseコンソールから取得）
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 永続性の設定 (ブラウザを閉じても、再読み込みしてもログインを維持)
setPersistence(auth, browserLocalPersistence)
    .catch((err) => console.error('Persistence error:', err));

const googleProvider = new GoogleAuthProvider();
// 常にアカウント選択画面を表示させる設定
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// 管理者メールアドレスリスト (スプレッドシート管理へ移行中のため、バックアップ用)
const ADMIN_EMAILS = [
    'shuyukan.info@gmail.com',    // マスター管理者（常にアクセス可能）
];

export {
    auth,
    googleProvider,
    ADMIN_EMAILS
};
