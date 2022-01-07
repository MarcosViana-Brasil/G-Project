import { useState, useEffect } from 'react'

import styles from './Message.module.css'

export default function Message({ msg, type }) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (!msg) {
            setVisible(false)
            return
        }
        setVisible(true)

        const timer = setTimeout(() => {
            setVisible(false)
        }, 1200)

        return () => clearTimeout(timer)
    }, [msg])

    return (
        <>
            {visible && (
                <div className={`${styles.message} ${styles[type]}`}>{msg}</div>
            )}
        </>
    )
}
