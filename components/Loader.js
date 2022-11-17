export default function Loader({ fgColor = '#fff' }) {
    return (  
        <div className="loader">
            <div></div><div></div><div></div><div></div>
            <style jsx>{`              
                           
                .loader {
                    display: block;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    margin-left: -28px;
                    margin-top: -4px;
                    width: 56px;
                    height: 8px;
                }
                .loader div {
                    position: absolute;
                    top: 0px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: ${fgColor};
                    animation-timing-function: cubic-bezier(0, 1, 1, 0);
                }
                .loader div:nth-child(1) {
                    left: 8px;
                    animation: loader1 0.6s infinite;
                }
                .loader div:nth-child(2) {
                    left: 8px;
                    animation: loader2 0.6s infinite;
                }
                .loader div:nth-child(3) {
                    left: 24px;
                    animation: loader2 0.6s infinite;
                }
                .loader div:nth-child(4) {
                    left: 40px;
                    animation: loader3 0.6s infinite;
                }
                @keyframes loader1 {
                    0% {
                        transform: scale(0);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                @keyframes loader3 {
                    0% {
                        transform: scale(1);
                    }
                    100% {
                        transform: scale(0);
                    }
                }
                @keyframes loader2 {
                    0% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(16px, 0);
                    }
                }
                                                              
            `}</style>
        </div>     
    )
}