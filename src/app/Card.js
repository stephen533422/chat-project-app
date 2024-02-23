import styles from '@/app/introducePage.module.scss';
import classNames from 'classnames'
import {  easeInOut, motion } from "framer-motion";

export default function Card({img, text}) {


    return (
        <>
            <div className={styles.window}>
                <motion.div 
                    className={styles.card}
                    initial={{
                        opacity: 0,
                        scale: 1,
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: [1, 1.05,1, 0.95, 1]
                    }}
                    // animate={{
                    //     opacity: 1,
                    // }}
                    transition={{
                        repeat: 0,
                        duration: 1,
                        type: easeInOut,
                    }}

                >
                    <div className={styles.text}><span>{text}</span></div>
                    <img src={img}></img>
                </motion.div>
            </div>
        </>
    );
}