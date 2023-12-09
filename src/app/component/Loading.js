'use client'
import React from "react";
import styles from '@/app/component/loading.module.scss';

export function Loading(){
    return (
        <>
            <div className={styles.container}>
                <div className={styles.windows8}>
                    <div className={styles.wBall} id="wBall_1">
                        <div className={styles.wInnerBall}></div>
                    </div>
                    <div className={styles.wBall} id="wBall_2">
                        <div className={styles.wInnerBall}></div>
                    </div>
                    <div className={styles.wBall} id="wBall_3">
                        <div className={styles.wInnerBall}></div>
                    </div>
                    <div className={styles.wBall} id="wBall_4">
                        <div className={styles.wInnerBall}></div>
                    </div>
                    <div className={styles.wBall} id="wBall_5">
                        <div className={styles.wInnerBall}></div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function LoadingPage() {
    return (
        <>
            <div className={styles.page}>
                <div className={styles.windows8}>
                    <div className={styles.wBall} id="wBall_1">
                        <div className={styles.wInnerBall}></div>
                    </div>
                    <div className={styles.wBall} id="wBall_2">
                        <div className={styles.wInnerBall}></div>
                    </div>
                    <div className={styles.wBall} id="wBall_3">
                        <div className={styles.wInnerBall}></div>
                    </div>
                    <div className={styles.wBall} id="wBall_4">
                        <div className={styles.wInnerBall}></div>
                    </div>
                    <div className={styles.wBall} id="wBall_5">
                        <div className={styles.wInnerBall}></div>
                    </div>
                </div>
            </div>
        </>
    );
}