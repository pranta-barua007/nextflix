import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { magic } from "../lib/magic-client";

import styles from "../styles/Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    };

    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

  const handleOnChangeEmail = (e) => {
    setUserMsg("");
    setEmail(e.target.value.toLowerCase());
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();

    if (email) {
      try {
        setIsLoading(true);
        const DIDtoken = await magic.auth.loginWithMagicLink({
          email: email,
        });
        console.log({ DIDtoken });
        if (DIDtoken) {
          const response = await fetch("api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${DIDtoken}`,
              "Content-type": "application/json",
            },
          });

          const loggedInResponse = await response.json();
          loggedInResponse && console.log({ loggedInResponse });
          if(loggedInResponse.done) {
            router.push("/");
          }else {
            setIsLoading(false);
            setUserMsg("Something went wrong logging in");
          }
        }
      } catch (err) {
        setIsLoading(false);
        console.error("something went wrong", err);
      }
    } else {
      setIsLoading(false);
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
          <form onSubmit={handleLoginWithEmail}>
            <input
              type="email"
              placeholder="Email address"
              className={styles.emailInput}
              required={true}
              onChange={handleOnChangeEmail}
            />
            <p className={styles.userMsg}>{userMsg}</p>
            <button
              disabled={isLoading}
              type="submit"
              className={styles.loginBtn}
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
