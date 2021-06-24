import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Header from "../components/header";

let mounted = false;

export default function Layout({ children, currentView, headerVisibility }) {
    const [show, setShow] = useState(false);
    const user = useSelector((state) => state.auth);

    useEffect(() => {
        mounted = true;
    }, []);

    return (
        <div id="root">
            {mounted && user?.authenticated && (
                <div id="header">
                    <Header
                        handleShowMenu={() => setShow(!show)}
                        display={headerVisibility}
                        currentView={currentView}
                        show={show}
                    />
                </div>
            )}
            <section>{children}</section>
            <footer></footer>
        </div>
    );
}
