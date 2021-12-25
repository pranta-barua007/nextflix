import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { magic } from "../lib/magic-client";

import styles from "../styles/Login.module.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [userMsg, setUserMsg] = useState("");

    const router = useRouter();

  const handleOnChangeEmail = (e) => {
    setUserMsg('');
    setEmail(e.target.value.toLowerCase());
  }

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();

    if(email) {
        if(email === 'prantabarua247@gmail.com') {
            // router.push("/");
            try {
                const DIDtoken = await magic.auth.loginWithMagicLink({
                    email: email
                });
                console.log({ DIDtoken })
            }catch(err) {
                console.error('something went wrong', err);
            }
        }else {
            setUserMsg("Something went wrong logging in");
        }
    }else {
        setUserMsg("Enter a valid email address");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Nextflix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <a className={styles.logoLink} href="/">
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix logo"
                width="128px"
                height="34px"
              />
            </div>
          </a>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="text"
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />
          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            Sign In
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
