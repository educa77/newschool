import React from "react";
import styled from "styled-components";

export default function Home() {
    return (
        <>
            <ContainerBox>
                <Draw src="assets/hello.svg" alt="hello" />
            </ContainerBox>
        </>
    );
}

Home.renderData = {
    authRequired: true,
    currentView: "Dashboard",
};

const ContainerBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 4rem - 1px);
    height: 100%;
`;

const Draw = styled.img`
    width: 100%;
    max-width: calc(100vw - 10rem);
    max-height: 50vh;
`;
