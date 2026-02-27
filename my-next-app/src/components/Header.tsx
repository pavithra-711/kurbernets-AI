import React from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <h1>My Next App</h1>
            <nav>
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/about">About</Link>
                    </li>
                    <li>
                        <Link href="/contact">Contact</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;