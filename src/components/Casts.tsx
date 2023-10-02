import React, { useEffect, useState } from 'react';
import styles from "@/styles/Casts.module.css"
import CreateSession from './CreateSession';
import ERC20Transfer from './ERC20Transfer';

const Casts = ({ address, provider, smartAccount, setIsSessionActive, isSessionActive}) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data.json");
      const jsonData = await response.json();
      console.log({ jsonData })
      setData(jsonData)
    }
    fetchData()
  },[])
  return (
    <div className={styles.container}>
      <CreateSession isSessionActive={isSessionActive} setIsSessionActive={setIsSessionActive} address={address} smartAccount={smartAccount} provider={provider} />
        {data.map((tweet, index) => (
            <div key={index} className={styles.tweet}>
                <div className={styles.header}>
                    <span className={styles.name}>{tweet.name}</span>
                </div>
                <div className={styles.content}>
                    {tweet.cast_text && <p className={styles.text}>{tweet.cast_text}</p>}
                    {tweet.cast_image.map((image, imgIndex) => (
                        <img key={imgIndex} src={image.url} alt="tweet image" className={styles.image} />
                    ))}
                </div>
                {isSessionActive && <ERC20Transfer smartAccount={smartAccount} provider={provider} address={address} />}
            </div>
        ))}
    </div>
);
}

export default Casts;
